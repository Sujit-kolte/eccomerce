import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { reviewAPI } from "../utils/api";
import { showSuccessToast, showErrorToast } from "../utils/toastNotifications";
import { motion } from "framer-motion";

const Rating = ({ productId, onRatingSubmitted }) => {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (user) {
      fetchUserReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getProductReviews(productId);
      setReviews(response.data.reviews);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await reviewAPI.getUserProductReview(productId);
      if (response.data.review) {
        setUserReview(response.data.review);
        setRating(response.data.review.rating);
        setComment(response.data.review.comment);
      }
    } catch (err) {
      console.error("Failed to load user review:", err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      showErrorToast("Please log in to submit a review");
      return;
    }

    if (rating === 0) {
      showErrorToast("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      await reviewAPI.addReview({
        productId,
        rating,
        comment,
      });

      showSuccessToast(
        userReview
          ? "Review updated successfully!"
          : "Review submitted successfully!",
      );
      setComment("");
      setRating(0);
      fetchReviews();
      fetchUserReview();
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="mt-8 space-y-8">
      {/* Average Rating Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600">
              {averageRating}
            </div>
            <div className="text-gray-600 text-sm">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-3xl ${
                  star <= Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}>
                ★
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Submit Review Form */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-bold mb-4">
            {userReview ? "Update Your Review" : "Write a Review"}
          </h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Star Rating Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-4xl transition ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}>
                    ★
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"></textarea>
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-2 rounded-lg font-semibold text-white ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}>
              {submitting ? "Submitting..." : "Submit Review"}
            </motion.button>
          </form>
        </motion.div>
      )}

      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          Please log in to submit a review
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h4 className="text-lg font-bold mb-4">All Reviews</h4>
        {loading ? (
          <div className="text-center py-8 text-gray-600">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {review.user?.name || "Anonymous"}
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rating;
