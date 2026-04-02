import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../utils/api";

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    tags: "",
    countInStock: "",
  });

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload and convert to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          image: event.target.result,
        }));
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation - only name, price, and countInStock are required
    if (!formData.name || !formData.price || formData.countInStock === "") {
      setError("Please fill in required fields: Name, Price, Stock");
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image:
          formData.image ||
          "https://via.placeholder.com/300?text=Product+Image",
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        countInStock: parseInt(formData.countInStock),
      };

      await productAPI.create(productData);

      setSuccess(true);
      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        tags: "",
        countInStock: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
      console.error("Error adding product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Add New Product</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Product added successfully! Redirecting...
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg border border-gray-200 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description (optional)"
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Price (in ₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="999.99"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Stock Count <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                placeholder="10"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Product Image (Optional)
            </label>
            <input
              type="file"
              name="imageFile"
              onChange={handleImageUpload}
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPG, PNG, GIF (Max 5MB). If not provided, a
              placeholder will be used.
            </p>
            {formData.image && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200";
                  }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="smartphone, 5G, camera, premium"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Tags help with search and recommendations
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 rounded-lg font-semibold text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}>
              {loading ? "Adding Product..." : "Add Product"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="flex-1 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Tips for Adding Products
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>
              • Upload high-quality product images (recommended: 500x500px or
              larger)
            </li>
            <li>• Supported formats: JPG, PNG, GIF (Max 5MB)</li>
            <li>• Add descriptive product names and descriptions</li>
            <li>
              • Include relevant tags for better search and recommendations
            </li>
            <li>• Set accurate stock counts to reflect inventory</li>
            <li>• Prices should be in Indian Rupees (₹)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
