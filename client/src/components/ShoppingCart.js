import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import { showSuccessToast } from "../utils/toastNotifications";
import {
  containerVariants,
  itemVariants,
  pageVariants,
  pageTransition,
} from "../utils/animations";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, totalQuantity } = useSelector(
    (state) => state.cart,
  );

  const handleRemove = (productId, productName) => {
    dispatch(removeFromCart(productId));
    showSuccessToast(`${productName} removed from cart ✓`);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      showSuccessToast("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <motion.div
        className="container mx-auto px-4 py-16 text-center min-h-screen flex items-center justify-center flex-col"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}>
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-gray-600 text-lg mb-8">Your cart is empty</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold inline-block">
            Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}>
      <motion.h1
        className="text-4xl font-bold mb-8 flex items-center gap-3"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}>
        🛒 Shopping Cart
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="ml-auto bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold">
          {totalQuantity}
        </motion.span>
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <motion.div
          className="lg:col-span-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          <div className="bg-white rounded-lg border border-gray-200 shadow-md">
            {items.map((item, index) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                className="flex gap-4 p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition"
                layout>
                {/* Product Image */}
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                  whileHover={{ scale: 1.05 }}
                />

                {/* Product Info */}
                <div className="flex-1">
                  <Link
                    to={`/product/${item._id}`}
                    className="font-semibold text-lg hover:text-blue-600 transition">
                    {item.name}
                  </Link>
                  <p className="text-gray-600 text-sm">{item.category}</p>
                  <p className="text-green-600 font-bold mt-2">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity */}
                <motion.div className="flex items-center border border-gray-300 rounded-lg">
                  <motion.button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity - 1)
                    }
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.9 }}
                    className="px-3 py-1 text-gray-600">
                    −
                  </motion.button>
                  <span className="px-4 py-1 font-semibold">
                    {item.quantity}
                  </span>
                  <motion.button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.9 }}
                    className="px-3 py-1 text-gray-600">
                    +
                  </motion.button>
                </motion.div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="font-bold mb-4">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <motion.button
                    onClick={() => handleRemove(item._id, item.name)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold">
                    ✕ Remove
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4">
            <motion.button
              onClick={() => {
                dispatch(clearCart());
                showSuccessToast("Cart cleared! 🗑️");
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-red-600 hover:text-red-800 font-semibold">
              Clear Cart
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1">
          <motion.div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 sticky top-20 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">
              📋 Order Summary
            </h2>

            <motion.div className="space-y-3 mb-4 pb-4 border-b border-blue-300">
              <motion.div
                className="flex justify-between text-gray-700"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.4 }}>
                <span>Subtotal:</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </motion.div>
              <motion.div
                className="flex justify-between text-gray-700"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.45 }}>
                <span>Shipping:</span>
                <span className="font-semibold text-green-600">Free 🚚</span>
              </motion.div>
              <motion.div
                className="flex justify-between text-gray-700"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.5 }}>
                <span>Tax (10%):</span>
                <span className="font-semibold">
                  ${(totalPrice * 0.1).toFixed(2)}
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-between text-xl font-bold mb-6 text-blue-900"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}>
              <span>Total:</span>
              <span className="text-green-600">
                ${(totalPrice * 1.1).toFixed(2)}
              </span>
            </motion.div>

            <motion.button
              onClick={handleProceedToCheckout}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(59,130,246,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:shadow-lg font-semibold mb-2 transition">
              Proceed to Checkout
            </motion.button>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/products"
                className="block w-full bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 font-semibold text-center transition">
                Continue Shopping
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ShoppingCart;
