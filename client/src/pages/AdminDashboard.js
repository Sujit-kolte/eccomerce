import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { productAPI } from "../utils/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll({ limit: 100 });
        setProducts(response.data.products);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await productAPI.delete(id);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        setError("Failed to delete product");
        console.error(err);
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Link
          to="/admin/add-product"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-center">
          + Add New Product
        </Link>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No products found</p>
          <Link
            to="/admin/add-product"
            className="text-blue-600 hover:underline font-semibold">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/products/${product._id}`}
                      className="text-blue-600 hover:underline font-semibold">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 font-semibold">
                    ₹{product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.countInStock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {product.countInStock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 font-semibold">
                        {product.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        ({product.numReviews})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/edit-product/${product._id}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-600 font-semibold">Total Products</p>
          <p className="text-3xl font-bold text-blue-900">{products.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-600 font-semibold">In Stock</p>
          <p className="text-3xl font-bold text-green-900">
            {products.filter((p) => p.countInStock > 0).length}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 font-semibold">Out of Stock</p>
          <p className="text-3xl font-bold text-red-900">
            {products.filter((p) => p.countInStock === 0).length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <p className="text-purple-600 font-semibold">Avg Rating</p>
          <p className="text-3xl font-bold text-purple-900">
            {(
              products.reduce((sum, p) => sum + p.rating, 0) / products.length
            ).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
