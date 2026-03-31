import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { productAPI } from "../utils/api";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getById(id);
        setProduct(response.data.product);
        setRecommendations(response.data.recommendations);
        setError(null);
      } catch (err) {
        setError("Failed to load product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          ...product,
          quantity,
        }),
      );
      alert("Product added to cart!");
      setQuantity(1);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productAPI.delete(id);
        alert("Product deleted successfully!");
        navigate("/admin/dashboard");
      } catch (err) {
        alert("Failed to delete product");
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!product)
    return <div className="text-center py-10">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="flex items-center justify-center bg-gray-100 rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.category}</p>
            <p className="text-2xl font-bold text-green-600 mb-4">
              ${product.price.toFixed(2)}
            </p>

            <div className="mb-4">
              <p className="text-gray-700 mb-2">Description:</p>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-700 mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                Rating: {product.rating}/5 ({product.numReviews} reviews)
              </p>
              <p
                className={`text-lg font-semibold ${product.countInStock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.countInStock > 0
                  ? `In Stock (${product.countInStock})`
                  : "Out of Stock"}
              </p>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100">
                  -
                </button>
                <span className="px-6 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100">
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className={`flex-1 py-3 rounded-lg font-semibold text-white ${
                  product.countInStock > 0
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}>
                Add to Cart
              </button>
            </div>

            {/* Admin Controls */}
            {user && user.role === "admin" && (
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <Link
                  to={`/admin/edit-product/${product._id}`}
                  className="flex-1 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 text-center">
                  Edit Product
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700">
                  Delete Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations && recommendations.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Recommended For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec._id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                <img
                  src={rec.image}
                  alt={rec.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {rec.name}
                </h3>
                <p className="text-green-600 font-bold">
                  ${rec.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
