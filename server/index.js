import dotenv from "dotenv";
dotenv.config(); // Load .env BEFORE other imports

import express from "express";
import cors from "cors";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to capture raw body for webhook verification
app.use((req, res, next) => {
  if (req.path === "/api/payments/webhook") {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://yourdomain.com"
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
