import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/User.js";
import bcryptjs from "bcryptjs";

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Admin credentials
    const adminEmail = "admin@ecommerce.com";
    const adminPassword = "sujit21";
    const adminName = "Admin User";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("⚠️  Admin account already exists:", adminEmail);
      if (existingAdmin.role === "admin") {
        console.log("✅ User is already an admin");
      } else {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("✅ User promoted to admin");
      }
      process.exit(0);
    }

    // Create admin account
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin account created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔐 Password:", adminPassword);
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
