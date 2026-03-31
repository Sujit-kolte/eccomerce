import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductRecommendations,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../controllers/productController.js";
import { authenticateToken, authorizeAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);
router.get("/:productId/recommendations", getProductRecommendations);

// Admin routes
router.post("/", authenticateToken, authorizeAdmin, createProduct);
router.put("/:id", authenticateToken, authorizeAdmin, updateProduct);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteProduct);

export default router;
