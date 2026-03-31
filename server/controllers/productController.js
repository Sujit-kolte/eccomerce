import Product from "../models/Product.js";
import { getRecommendations } from "../utils/recommendations.js";
import mockData from "../utils/mockData.js";

// Get all products with search and filtering
export const getAllProducts = async (req, res) => {
  try {
    const { search, category, sortBy, limit = 20, page = 1 } = req.query;

    let products;
    let total;

    // Try to use MongoDB first, fallback to mock data if unavailable
    try {
      let filter = {};

      // Text search
      if (search) {
        filter.$text = { $search: search };
      }

      // Category filter
      if (category) {
        filter.category = category;
      }

      // Price range filter (optional)
      if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
      }

      // Sorting
      let sortOptions = {};
      switch (sortBy) {
        case "price-asc":
          sortOptions.price = 1;
          break;
        case "price-desc":
          sortOptions.price = -1;
          break;
        case "newest":
          sortOptions.createdAt = -1;
          break;
        case "rating":
          sortOptions.rating = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }

      // Pagination
      const skip = (page - 1) * limit;

      products = await Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

      total = await Product.countDocuments(filter);
    } catch (dbError) {
      // Fallback to mock data
      console.warn("MongoDB unavailable, using mock data:", dbError.message);

      let filteredProducts = mockData;

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
        );
      }

      // Apply category filter
      if (category) {
        filteredProducts = filteredProducts.filter(
          (p) => p.category === category,
        );
      }

      // Apply price range filter
      if (req.query.minPrice) {
        filteredProducts = filteredProducts.filter(
          (p) => p.price >= Number(req.query.minPrice),
        );
      }
      if (req.query.maxPrice) {
        filteredProducts = filteredProducts.filter(
          (p) => p.price <= Number(req.query.maxPrice),
        );
      }

      // Apply sorting
      switch (sortBy) {
        case "price-asc":
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
        default:
          break;
      }

      // Apply pagination
      const skip = (Number(page) - 1) * Number(limit);
      total = filteredProducts.length;
      products = filteredProducts.slice(skip, skip + Number(limit));
    }

    res.status(200).json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product details
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    let allProducts;

    // Try to use MongoDB first, fallback to mock data
    try {
      product = await Product.findById(id);
      allProducts = await Product.find();
    } catch (dbError) {
      console.warn("MongoDB unavailable, using mock data:", dbError.message);
      product = mockData.find((p) => p._id === id);
      allProducts = mockData;
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get recommendations
    const recommendations = getRecommendations(product, allProducts, 5);

    res.status(200).json({
      product,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product recommendations (AI-powered)
export const getProductRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 5 } = req.query;
    let product;
    let allProducts;

    // Try to use MongoDB first, fallback to mock data
    try {
      product = await Product.findById(productId);
      allProducts = await Product.find();
    } catch (dbError) {
      console.warn("MongoDB unavailable, using mock data:", dbError.message);
      product = mockData.find((p) => p._id === productId);
      allProducts = mockData;
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const recommendations = getRecommendations(
      product,
      allProducts,
      Number(limit),
    );

    res.status(200).json({
      recommendations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Create product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, tags, countInStock } =
      req.body;

    // Validation
    if (!name || !price || !image || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      tags: tags || [],
      countInStock: countInStock || 0,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    let categories;

    // Try to use MongoDB first, fallback to mock data
    try {
      categories = await Product.distinct("category");
    } catch (dbError) {
      console.warn("MongoDB unavailable, using mock data:", dbError.message);
      categories = [...new Set(mockData.map((p) => p.category))];
    }

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
