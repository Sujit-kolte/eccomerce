import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { loginSuccess, loginFailure, loginStart } from "../redux/authSlice";
import { authAPI } from "../utils/api";
import { showSuccessToast, showErrorToast } from "../utils/toastNotifications";
import { pageVariants, pageTransition } from "../utils/animations";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      const errMsg = "All fields are required";
      setError(errMsg);
      showErrorToast(errMsg);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const errMsg = "Passwords do not match";
      setError(errMsg);
      showErrorToast(errMsg);
      return;
    }

    if (formData.password.length < 6) {
      const errMsg = "Password must be at least 6 characters";
      setError(errMsg);
      showErrorToast(errMsg);
      return;
    }

    try {
      setLoading(true);
      dispatch(loginStart());

      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      dispatch(
        loginSuccess({
          user: response.data.user,
          token: response.data.token,
        }),
      );

      showSuccessToast("Registration successful! Welcome! 🎉");
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      showErrorToast(errorMessage);
      dispatch(loginFailure(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}>
      <motion.div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6">
          <div className="text-5xl mb-3">📝</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Register
          </h1>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-l-4 border-red-600 text-red-700 px-4 py-3 rounded-lg mb-4">
            ⚠️ {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}>
          {[
            { name: "name", label: "Full Name", type: "text", delay: 0.3 },
            { name: "email", label: "Email", type: "email", delay: 0.35 },
            {
              name: "password",
              label: "Password",
              type: "password",
              delay: 0.4,
            },
            {
              name: "confirmPassword",
              label: "Confirm Password",
              type: "password",
              delay: 0.45,
            },
          ].map((field) => (
            <motion.div
              key={field.name}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: field.delay }}>
              <label className="block text-gray-700 font-semibold mb-2">
                {field.label}
              </label>
              <motion.input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                whileFocus={{ scale: 1.02 }}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              />
            </motion.div>
          ))}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            className={`w-full py-3 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 mt-6 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg"
            }`}>
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </motion.button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:text-emerald-600 font-semibold transition">
            Login here
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Register;
