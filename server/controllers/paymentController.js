import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";

let razorpay;

// Lazy initialize Razorpay (only when first needed)
function initializeRazorpay() {
  if (razorpay) {
    return razorpay; // Already initialized
  }

  try {
    console.log("🔧 Razorpay Lazy Initialization:");
    console.log(
      "  KEY_ID:",
      process.env.RAZORPAY_KEY_ID ? "✓ Set" : "✗ Missing",
    );
    console.log(
      "  KEY_SECRET:",
      process.env.RAZORPAY_KEY_SECRET ? "✓ Set" : "✗ Missing",
    );

    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("✅ Razorpay initialized successfully!");
    return razorpay;
  } catch (error) {
    console.error("❌ Razorpay initialization error:", error.message);
    console.warn(
      "⚠️  Payment features may not work without Razorpay credentials",
    );
    return null;
  }
}

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, orderId, email } = req.body;

    if (!amount || !orderId || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Initialize Razorpay on demand
    const razorpayInstance = initializeRazorpay();
    if (!razorpayInstance) {
      return res.status(500).json({
        message:
          "Razorpay is not initialized. Please check your API keys in .env file",
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100), // Convert to paise (1 rupee = 100 paise)
      currency: "INR",
      receipt: orderId,
      notes: {
        orderId,
        email,
      },
    });

    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, orderId } =
      req.body;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify payment signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpaySignature;

    if (!isSignatureValid) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update order in database
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          id: razorpayPaymentId,
          orderId: razorpayOrderId,
          status: "succeeded",
          update_time: new Date().toISOString(),
        },
      },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Payment confirmed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Razorpay Webhook Handler
export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];

    // Get raw body for signature verification
    let body;
    if (Buffer.isBuffer(req.body)) {
      body = req.body;
    } else if (typeof req.body === "string") {
      body = Buffer.from(req.body);
    } else {
      body = Buffer.from(JSON.stringify(req.body));
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (webhookSignature !== expectedSignature) {
      console.error("Webhook signature verification failed");
      return res
        .status(400)
        .json({ message: "Webhook signature verification failed" });
    }

    // Parse body if it's a buffer
    let data;
    if (Buffer.isBuffer(req.body)) {
      data = JSON.parse(req.body.toString());
    } else {
      data = req.body;
    }

    const event = data.event;
    const payload = data.payload;

    console.log(`Webhook received: ${event}`);

    // Handle different webhook events
    if (event === "payment.authorized" || event === "payment.captured") {
      const paymentId = payload.payment.entity.id;
      const orderId = payload.payment.entity.notes?.orderId;

      if (!orderId) {
        console.warn("Order ID not found in payment notes");
        return res.status(200).json({ received: true });
      }

      // Update order status
      await Order.findByIdAndUpdate(
        orderId,
        {
          isPaid: true,
          paidAt: new Date(),
          paymentResult: {
            id: paymentId,
            status: event === "payment.authorized" ? "authorized" : "captured",
            update_time: new Date().toISOString(),
          },
        },
        { new: true },
      );

      console.log(
        `Payment ${event === "payment.authorized" ? "authorized" : "captured"} for order ${orderId}`,
      );
    } else if (event === "payment.failed") {
      const orderId = payload.payment.entity.notes?.orderId;
      const failureReason = payload.payment.entity.error_reason;

      if (!orderId) {
        console.warn("Order ID not found in payment notes");
        return res.status(200).json({ received: true });
      }

      // Update order status
      await Order.findByIdAndUpdate(
        orderId,
        {
          isPaid: false,
          paymentResult: {
            status: "failed",
            reason: failureReason,
            update_time: new Date().toISOString(),
          },
        },
        { new: true },
      );

      console.log(`Payment failed for order ${orderId}: ${failureReason}`);
    }

    // Return success response to Razorpay
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate("orderItems.product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    const order = new Order({
      user: req.user.userId,
      orderItems,
      shippingAddress,
      totalPrice,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update order delivery status
export const updateOrderDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isDelivered: true,
        deliveredAt: new Date(),
      },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order marked as delivered",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
