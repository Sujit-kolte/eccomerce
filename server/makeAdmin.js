import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function makeAdmin(email) {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log(`🔍 Looking for user: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log("ℹ️  User is already an admin");
      process.exit(0);
    }

    user.role = "admin";
    await user.save();

    console.log(`✅ ${email} has been promoted to admin`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🔐 Role: ${user.role}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.log("Usage: node makeAdmin.js your-email@example.com");
  console.log("\nExample: node makeAdmin.js admin@example.com");
  process.exit(1);
}

makeAdmin(email);
