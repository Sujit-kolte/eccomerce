import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory FIRST
const envPath = path.join(__dirname, ".env");
console.log("📁 Loading .env from:", envPath);
dotenv.config({ path: envPath });
console.log("✅ Environment variables loaded");
console.log(
  "  RAZORPAY_KEY_ID:",
  process.env.RAZORPAY_KEY_ID ? "✓ Set" : "✗ Missing",
);
console.log(
  "  RAZORPAY_KEY_SECRET:",
  process.env.RAZORPAY_KEY_SECRET ? "✓ Set" : "✗ Missing",
);

import express from "express";
import cors from "cors";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to capture raw body for webhook verification
app.use((req, res, next) => {
  if (req.path === "/api/payments/webhook") {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});

// Middleware
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://eccomerce-4fsp.vercel.app"
        : "http://localhost:3000",
    credentials: true,
  }),
);

// Connect to database
connectDB().catch((err) => {
  console.warn(
    "Running without database connection. MongoDB connection failed:",
    err.message,
  );
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
