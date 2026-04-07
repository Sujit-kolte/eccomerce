import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env.production") });

// Debug: Log if env vars are loaded
const logEnvStatus = () => {
  console.log("📝 Environment Status:");
  console.log(
    "  MONGODB_URI:",
    process.env.MONGODB_URI ? "✓ Set" : "✗ Missing",
  );
  console.log("  JWT_SECRET:", process.env.JWT_SECRET ? "✓ Set" : "✗ Missing");
  console.log(
    "  RAZORPAY_KEY_ID:",
    process.env.RAZORPAY_KEY_ID ? "✓ Set" : "✗ Missing",
  );
};

logEnvStatus();

import express from "express";
import cors from "cors";
import { connectDB } from "../server/config/database.js";
import authRoutes from "../server/routes/authRoutes.js";
import productRoutes from "../server/routes/productRoutes.js";
import paymentRoutes from "../server/routes/paymentRoutes.js";
import reviewRoutes from "../server/routes/reviewRoutes.js";

const app = express();

// Middleware to capture raw body for webhook verification
app.use((req, res, next) => {
  if (req.path === "/api/payments/webhook") {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:3000",
];

// Add Vercel deployments dynamically
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Connect to database before each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB Connection failed:", error.message);
    res.status(503).json({
      message: "Database connection failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Service unavailable",
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Server is running on Vercel",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
