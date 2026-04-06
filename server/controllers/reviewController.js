import Review from "../models/Review.js";
import Product from "../models/Product.js";

// Add a review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.userId;

    if (!productId || !rating) {
      return res
        .status(400)
        .json({ message: "Product ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment || "";
      await existingReview.save();
    } else {
      // Create new review
      const review = new Review({
        product: productId,
        user: userId,
        rating,
        comment: comment || "",
      });
      await review.save();
    }

    // Recalculate product rating
    const reviews = await Review.find({ product: productId });
    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    product.rating = avgRating;
    product.numReviews = reviews.length;
    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      review:
        existingReview ||
        new Review({
          product: productId,
          user: userId,
          rating,
          comment,
        }),
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
      averageRating:
        reviews.length > 0
          ? (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            ).toFixed(1)
          : 0,
      totalReviews: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's review for a product
export const getUserProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const review = await Review.findOne({
      product: productId,
      user: userId,
    }).populate("user", "name email");

    if (!review) {
      return res.status(200).json({ review: null });
    }

    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
