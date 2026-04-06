import express from "express";
import {
  addReview,
  getProductReviews,
  getUserProductReview,
} from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Protected routes (more specific, should come first)
router.post("/", authenticateToken, addReview);
router.get("/user/:productId", authenticateToken, getUserProductReview);

// Public routes (less specific, should come after)
router.get("/:productId", getProductReviews);

export default router;
