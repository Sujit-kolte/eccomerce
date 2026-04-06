import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { productAPI } from "../utils/api";
import LoadingSpinner from "./LoadingSpinner";
import { containerVariants, itemVariants } from "../utils/animations";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    sortBy: "newest",
    minPrice: "",
    maxPrice: "",
    page: 1,
    limit: 20,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
  });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(filters);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePagination = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Filters</h3>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Min Price
              </label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Max Price
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Sort By
              </label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading && (
            <div className="flex justify-center items-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-500 text-center py-10 bg-red-50 border border-red-300 rounded-lg">
              {error}
            </motion.div>
          )}

          {products.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-gray-600">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-lg">No products found</p>
            </motion.div>
          )}

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            {products.map((product) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: "0 20px 25px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}>
                <Link to={`/product/${product._id}`} className="block h-full">
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                    <motion.div
                      className="w-full h-48 overflow-hidden bg-gray-200"
                      whileHover={{ scale: 1.05 }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2 hover:text-blue-600 transition">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {product.category}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-bold text-lg">
                          ${product.price.toFixed(2)}
                        </span>
                        <div className="flex items-center">
                          <motion.span
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-yellow-400 text-lg">
                            ★
                          </motion.span>
                          <span className="text-sm ml-1 font-medium">
                            {product.rating > 0
                              ? product.rating.toFixed(1)
                              : "0.0"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-2 mt-8 flex-wrap">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    onClick={() => handlePagination(page)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      pagination.currentPage === page
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}>
                    {page}
                  </motion.button>
                ),
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
