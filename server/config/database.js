import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    isConnected = false;
    throw error; // Re-throw for Vercel to handle
  }
};

export const disconnectDB = async () => {
  try {
    if (isConnected) {
      await mongoose.disconnect();
      isConnected = false;
      console.log("MongoDB disconnected");
    }
  } catch (error) {
    console.error("MongoDB disconnection error:", error.message);
  }
};

export const getDB = () => {
  if (!isConnected) {
    throw new Error("Database not connected");
  }
  return mongoose.connection;
};
