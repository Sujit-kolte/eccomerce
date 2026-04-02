import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: null,
  },
  tags: {
    type: [String],
    default: [],
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search optimization
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  tags: "text",
});

export default mongoose.model("Product", productSchema);
