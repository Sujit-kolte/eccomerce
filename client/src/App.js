import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./redux/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import ShoppingCart from "./components/ShoppingCart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import { pageVariants, pageTransition } from "./utils/animations";

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
        <ToastContainer />

        {/* Header */}
        <motion.header
          className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🛍️ EcommStore
              </Link>
            </motion.div>

            <nav className="flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}>
                <Link
                  to="/products"
                  className="text-gray-600 hover:text-blue-600 font-medium transition">
                  Products
                </Link>
              </motion.div>

              {token && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/orders"
                    className="text-gray-600 hover:text-blue-600 font-medium transition">
                    My Orders
                  </Link>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative">
                <Link to="/cart" className="relative">
                  <span className="text-gray-600 hover:text-blue-600 text-2xl transition">
                    🛒
                  </span>
                  {totalQuantity > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalQuantity}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              {token ? (
                <div className="flex items-center gap-4">
                  <motion.span className="text-gray-600 text-sm">
                    Welcome,{" "}
                    <span className="font-semibold text-blue-600">
                      {user?.name}
                    </span>
                  </motion.span>
                  {user?.role === "admin" && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/admin/dashboard"
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium">
                        Admin
                      </Link>
                    </motion.div>
                  )}
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium">
                    Logout
                  </motion.button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/login"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                      Login
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium">
                      Register
                    </Link>
                  </motion.div>
                </div>
              )}
            </nav>
          </div>
        </motion.header>

        {/* Main Content */}
        <main>
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/add-product" element={<AddProduct />} />
              <Route path="/admin/edit-product/:id" element={<EditProduct />} />
              <Route
                path="*"
                element={
                  <div className="text-center py-16">Page not found</div>
                }
              />
            </Routes>
          </motion.div>
        </main>

        {/* Footer */}
        <motion.footer
          className="bg-gray-800 text-gray-300 mt-16 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}>
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 EcommStore. All rights reserved.</p>
          </div>
        </motion.footer>
      </div>
    </Router>
  );
};

export default App;
