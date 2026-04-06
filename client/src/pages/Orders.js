import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { paymentAPI } from "../utils/api";

const Orders = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!token || !user) {
      navigate("/login");
      return;
    }

    // Fetch user's orders
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await paymentAPI.getUserOrders();
        setOrders(response.data.orders || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, user, navigate]);

  if (!token) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600 mb-8">View your order history and status</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </motion.div>
      )}

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-2xl font-semibold text-gray-600 mb-4">
            No orders yet
          </p>
          <p className="text-gray-500 mb-6">
            You haven't placed any orders. Start shopping now!
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Continue Shopping
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Order ID */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order ID</p>
                  <p className="font-mono text-sm font-semibold">
                    {order._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                {/* Order Date */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Total Price */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Price</p>
                  <p className="font-semibold text-green-600">
                    ₹{order.totalPrice.toFixed(2)}
                  </p>
                </div>

                {/* Payment Status */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {order.isPaid ? "✓ Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-600 mb-3">
                  Items ({order.orderItems.length})
                </p>
                <div className="space-y-2">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="text-gray-500">
                          Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold text-right">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Shipping Address
                  </p>
                  <p className="text-sm text-gray-700">
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
