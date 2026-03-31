import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, totalQuantity } = useSelector(
    (state) => state.cart,
  );

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-gray-600 text-lg mb-8">Your cart is empty</p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        Shopping Cart ({totalQuantity})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 p-6 border-b border-gray-200 last:border-b-0">
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />

                {/* Product Info */}
                <div className="flex-1">
                  <Link
                    to={`/product/${item._id}`}
                    className="font-semibold text-lg hover:text-blue-600">
                    {item.name}
                  </Link>
                  <p className="text-gray-600 text-sm">{item.category}</p>
                  <p className="text-green-600 font-bold mt-2">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity - 1)
                    }
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                    -
                  </button>
                  <span className="px-4 py-1">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="font-bold mb-4">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-600 hover:text-red-800 text-sm">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={() => dispatch(clearCart())}
              className="text-red-600 hover:text-red-800 font-semibold">
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total:</span>
              <span>${(totalPrice * 1.1).toFixed(2)}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold mb-2">
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="block w-full bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 font-semibold text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
