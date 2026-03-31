import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  razorpayWebhook,
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderDelivery,
} from "../controllers/paymentController.js";
import { authenticateToken, authorizeAdmin } from "../middleware/auth.js";

const router = express.Router();

// Payment routes
router.post("/create-payment-intent", authenticateToken, createPaymentIntent);
router.post("/confirm-payment", authenticateToken, confirmPayment);
router.post("/webhook", razorpayWebhook); // Webhook - no authentication needed

// Order routes
router.post("/orders", authenticateToken, createOrder);
router.get("/orders/user", authenticateToken, getUserOrders);
router.get("/orders", authenticateToken, authorizeAdmin, getAllOrders);
router.put(
  "/orders/:orderId/deliver",
  authenticateToken,
  authorizeAdmin,
  updateOrderDelivery,
);

export default router;
