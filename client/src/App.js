import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./redux/authSlice";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import ShoppingCart from "./components/ShoppingCart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

const App = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              EcommStore
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                to="/products"
                className="text-gray-600 hover:text-gray-900">
                Products
              </Link>

              <Link to="/cart" className="relative">
                <span className="text-gray-600 hover:text-gray-900">
                  🛒 Cart
                </span>
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>

              {token ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Welcome, {user?.name}</span>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/edit-product/:id" element={<EditProduct />} />
            <Route
              path="*"
              element={<div className="text-center py-16">Page not found</div>}
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-300 mt-16 py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 EcommStore. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
