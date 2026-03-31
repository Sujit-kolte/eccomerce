import Product from "./models/Product.js";
import { connectDB, disconnectDB } from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const sampleProducts = [
  // Smartphones
  {
    name: "iPhone 15 Pro Max",
    description:
      "Latest Apple flagship with A17 Pro chip, 6.7-inch display, 48MP camera, titanium design",
    price: 1199.99,
    image: "https://via.placeholder.com/400x300?text=iPhone+15+Pro+Max",
    category: "Smartphones",
    tags: ["iphone", "smartphone", "apple", "premium", "camera"],
    countInStock: 12,
    rating: 4.9,
    numReviews: 234,
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description:
      "Flagship Android with AI features, 108MP camera, 6.9-inch display, 120Hz refresh rate",
    price: 1299.99,
    image: "https://via.placeholder.com/400x300?text=Galaxy+S24+Ultra",
    category: "Smartphones",
    tags: ["samsung", "smartphone", "android", "ai", "flagship"],
    countInStock: 15,
    rating: 4.8,
    numReviews: 189,
  },
  {
    name: "OnePlus 12 Pro",
    description:
      "5G smartphone with 240W charging, Snapdragon 8 Gen 3, 120Hz AMOLED, 50MP camera",
    price: 749.99,
    image: "https://via.placeholder.com/400x300?text=OnePlus+12+Pro",
    category: "Smartphones",
    tags: ["oneplus", "smartphone", "5g", "fast", "performance"],
    countInStock: 20,
    rating: 4.7,
    numReviews: 156,
  },
  {
    name: "Google Pixel 8 Pro",
    description:
      "Google's premium phone with Tensor 3, advanced AI, 50MP main camera, 6.7-inch display",
    price: 999.99,
    image: "https://via.placeholder.com/400x300?text=Pixel+8+Pro",
    category: "Smartphones",
    tags: ["google", "pixel", "ai", "camera", "android"],
    countInStock: 18,
    rating: 4.8,
    numReviews: 167,
  },

  // Laptops
  {
    name: "MacBook Pro 16-inch M3 Max",
    description:
      "Professional laptop with Apple M3 Max chip, 16GB unified memory, 512GB SSD, excellent for developers",
    price: 2499.99,
    image: "https://via.placeholder.com/400x300?text=MacBook+Pro",
    category: "Laptops",
    tags: ["macbook", "laptop", "pro", "m3", "developer"],
    countInStock: 8,
    rating: 4.9,
    numReviews: 198,
  },
  {
    name: "Dell XPS 15",
    description:
      "High-performance ultrabook with Intel Core i9, RTX 4070, 16-inch OLED display, aluminum design",
    price: 1799.99,
    image: "https://via.placeholder.com/400x300?text=Dell+XPS+15",
    category: "Laptops",
    tags: ["dell", "laptop", "xps", "gaming", "professional"],
    countInStock: 10,
    rating: 4.8,
    numReviews: 145,
  },
  {
    name: "ASUS ROG Gaming Laptop",
    description:
      "Gaming powerhouse with RTX 4090, Intel i9-13900HX, 16-inch 240Hz display, advanced cooling",
    price: 2199.99,
    image: "https://via.placeholder.com/400x300?text=ASUS+ROG",
    category: "Laptops",
    tags: ["asus", "rog", "gaming", "laptop", "powerful"],
    countInStock: 6,
    rating: 4.7,
    numReviews: 132,
  },

  // Headphones & Audio
  {
    name: "Sony WH-1000XM5",
    description:
      "Premium wireless headphones with best-in-class noise cancellation, 30-hour battery, Hi-Res audio",
    price: 399.99,
    image: "https://via.placeholder.com/400x300?text=Sony+WH-1000XM5",
    category: "Audio",
    tags: ["headphones", "wireless", "noise-cancelling", "sony", "premium"],
    countInStock: 20,
    rating: 4.8,
    numReviews: 287,
  },
  {
    name: "Apple AirPods Pro Max",
    description:
      "Apple's flagship over-ear headphones with spatial audio, active noise cancellation, premium build",
    price: 549.99,
    image: "https://via.placeholder.com/400x300?text=AirPods+Pro+Max",
    category: "Audio",
    tags: ["airpods", "headphones", "apple", "premium", "audio"],
    countInStock: 15,
    rating: 4.7,
    numReviews: 156,
  },
  {
    name: "JBL PartyBox 720",
    description:
      "Portable Bluetooth speaker system with dual woofers, 2000W power, built-in DJ effects, lights",
    price: 799.99,
    image: "https://via.placeholder.com/400x300?text=JBL+PartyBox",
    category: "Audio",
    tags: ["speaker", "bluetooth", "party", "jbl", "powerful"],
    countInStock: 12,
    rating: 4.6,
    numReviews: 98,
  },

  // Fashion
  {
    name: "Nike Air Max 270",
    description:
      "Classic running shoe with Air cushioning, breathable mesh, available in multiple colors",
    price: 129.99,
    image: "https://via.placeholder.com/400x300?text=Nike+Air+Max+270",
    category: "Fashion",
    tags: ["shoes", "nike", "running", "casual", "comfortable"],
    countInStock: 45,
    rating: 4.7,
    numReviews: 312,
  },
  {
    name: "Adidas Ultraboost 22",
    description:
      "High-performance running shoe with Boost technology, comfortable for all-day wear",
    price: 179.99,
    image: "https://via.placeholder.com/400x300?text=Adidas+Ultraboost",
    category: "Fashion",
    tags: ["shoes", "adidas", "running", "sport", "performance"],
    countInStock: 38,
    rating: 4.6,
    numReviews: 267,
  },
  {
    name: "Levi's 501 Jeans",
    description:
      "Classic blue denim jeans, 100% cotton, perfect fit for everyday wear, timeless design",
    price: 79.99,
    image: "https://via.placeholder.com/400x300?text=Levis+501",
    category: "Fashion",
    tags: ["jeans", "clothing", "casual", "levis", "durable"],
    countInStock: 60,
    rating: 4.5,
    numReviews: 289,
  },
  {
    name: "Tommy Hilfiger Polo Shirt",
    description:
      "Classic polo shirt in multiple colors, breathable cotton, embroidered logo, premium quality",
    price: 59.99,
    image: "https://via.placeholder.com/400x300?text=Tommy+Hilfiger",
    category: "Fashion",
    tags: ["shirt", "polo", "clothing", "casual", "brand"],
    countInStock: 55,
    rating: 4.6,
    numReviews: 178,
  },

  // Home & Kitchen
  {
    name: "KitchenAid Stand Mixer",
    description:
      "Professional 5-quart stand mixer, 10 speeds, stainless steel bowl, perfect for baking",
    price: 329.99,
    image: "https://via.placeholder.com/400x300?text=KitchenAid+Mixer",
    category: "Home & Kitchen",
    tags: ["kitchen", "mixer", "appliance", "baking", "professional"],
    countInStock: 14,
    rating: 4.8,
    numReviews: 234,
  },
  {
    name: "Dyson V15 Vacuum",
    description:
      "Cordless vacuum cleaner with laser detection, 60-minute battery, lightyear design",
    price: 749.99,
    image: "https://via.placeholder.com/400x300?text=Dyson+V15",
    category: "Home & Kitchen",
    tags: ["vacuum", "dyson", "home", "cleaning", "cordless"],
    countInStock: 10,
    rating: 4.7,
    numReviews: 198,
  },
  {
    name: "Instant Pot Duo Plus",
    description:
      "Multi-cooker with 15 functions, 6-quart capacity, stainless steel, whisper-quiet design",
    price: 119.99,
    image: "https://via.placeholder.com/400x300?text=Instant+Pot",
    category: "Home & Kitchen",
    tags: ["kitchen", "cooker", "instant", "pot", "appliance"],
    countInStock: 28,
    rating: 4.6,
    numReviews: 567,
  },
  {
    name: "Ninja Blender",
    description:
      "High-power blender with 1500W motor, multiple speeds, dishwasher-safe pitcher",
    price: 99.99,
    image: "https://via.placeholder.com/400x300?text=Ninja+Blender",
    category: "Home & Kitchen",
    tags: ["blender", "ninja", "kitchen", "smoothie", "powerful"],
    countInStock: 32,
    rating: 4.5,
    numReviews: 289,
  },

  // Electronics & Accessories
  {
    name: "Apple Watch Series 9",
    description:
      "Smartwatch with always-on display, health monitoring, fitness tracking, water-resistant",
    price: 399.99,
    image: "https://via.placeholder.com/400x300?text=Apple+Watch+9",
    category: "Electronics",
    tags: ["watch", "smartwatch", "apple", "fitness", "health"],
    countInStock: 22,
    rating: 4.7,
    numReviews: 345,
  },
  {
    name: "iPad Pro 12.9-inch",
    description:
      "Premium tablet with M2 chip, 12.9-inch Liquid Retina display, Apple Pencil support",
    price: 1099.99,
    image: "https://via.placeholder.com/400x300?text=iPad+Pro",
    category: "Electronics",
    tags: ["ipad", "tablet", "apple", "pro", "premium"],
    countInStock: 16,
    rating: 4.8,
    numReviews: 287,
  },
  {
    name: "GoPro Hero 12",
    description:
      "Action camera with 4K video, waterproof design, hypersmooth stabilization, rugged build",
    price: 449.99,
    image: "https://via.placeholder.com/400x300?text=GoPro+Hero+12",
    category: "Electronics",
    tags: ["camera", "gopro", "action", "video", "adventure"],
    countInStock: 18,
    rating: 4.6,
    numReviews: 167,
  },
  {
    name: "Canon EOS R6 Mark II",
    description:
      "Professional mirrorless camera with full-frame sensor, 6K video, autofocus, weather-sealed",
    price: 2499.99,
    image: "https://via.placeholder.com/400x300?text=Canon+EOS+R6",
    category: "Electronics",
    tags: ["camera", "canon", "professional", "mirrorless", "video"],
    countInStock: 8,
    rating: 4.9,
    numReviews: 89,
  },

  // Gaming
  {
    name: "PlayStation 5 Console",
    description:
      "Latest gaming console with 825GB SSD, 4K support, exclusive games, wireless controller",
    price: 499.99,
    image: "https://via.placeholder.com/400x300?text=PS5",
    category: "Gaming",
    tags: ["gaming", "console", "playstation", "ps5", "entertainment"],
    countInStock: 5,
    rating: 4.8,
    numReviews: 456,
  },
  {
    name: "Xbox Series X",
    description:
      "Microsoft's next-gen console with 1TB storage, 4K/120fps gaming, Game Pass included",
    price: 499.99,
    image: "https://via.placeholder.com/400x300?text=Xbox+Series+X",
    category: "Gaming",
    tags: ["gaming", "console", "xbox", "microsoft", "entertainment"],
    countInStock: 6,
    rating: 4.7,
    numReviews: 389,
  },
  {
    name: "Nintendo Switch Pro",
    description:
      "Handheld gaming console with hybrid design, detachable controllers, 128GB storage",
    price: 349.99,
    image: "https://via.placeholder.com/400x300?text=Nintendo+Switch",
    category: "Gaming",
    tags: ["gaming", "console", "nintendo", "switch", "portable"],
    countInStock: 22,
    rating: 4.6,
    numReviews: 267,
  },

  // Books
  {
    name: "Atomic Habits by James Clear",
    description:
      "Bestselling self-help book about building good habits and breaking bad ones, practical tips",
    price: 16.99,
    image: "https://via.placeholder.com/400x300?text=Atomic+Habits",
    category: "Books",
    tags: ["book", "self-help", "habits", "psychology", "bestseller"],
    countInStock: 120,
    rating: 4.8,
    numReviews: 1245,
  },
  {
    name: "The Midnight Library by Matt Haig",
    description:
      "Fiction novel about exploring different life choices, philosophical and uplifting",
    price: 14.99,
    image: "https://via.placeholder.com/400x300?text=Midnight+Library",
    category: "Books",
    tags: ["book", "fiction", "novel", "bestseller", "inspiring"],
    countInStock: 95,
    rating: 4.7,
    numReviews: 987,
  },
  {
    name: "Educated by Tara Westover",
    description:
      "Memoir about growing up in a survivalist family and pursuing education, powerful story",
    price: 18.99,
    image: "https://via.placeholder.com/400x300?text=Educated",
    category: "Books",
    tags: ["book", "memoir", "biography", "education", "inspiring"],
    countInStock: 78,
    rating: 4.9,
    numReviews: 1567,
  },

  // Sports & Fitness
  {
    name: "Fitbit Charge 6",
    description:
      "Fitness tracker with heart rate monitor, sleep tracking, 7-day battery, waterproof",
    price: 159.99,
    image: "https://via.placeholder.com/400x300?text=Fitbit+Charge+6",
    category: "Sports & Fitness",
    tags: ["fitness", "tracker", "wearable", "health", "sports"],
    countInStock: 35,
    rating: 4.6,
    numReviews: 456,
  },
  {
    name: "Treadmill ProForm",
    description:
      "Electric treadmill with 20x55 running surface, folding design, connected training programs",
    price: 599.99,
    image: "https://via.placeholder.com/400x300?text=Treadmill+ProForm",
    category: "Sports & Fitness",
    tags: ["treadmill", "fitness", "gym", "home", "exercise"],
    countInStock: 12,
    rating: 4.5,
    numReviews: 234,
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Non-slip yoga mat with cushioning, extra thick 6mm, durable material, multiple colors",
    price: 45.99,
    image: "https://via.placeholder.com/400x300?text=Yoga+Mat",
    category: "Sports & Fitness",
    tags: ["yoga", "mat", "fitness", "sport", "exercise"],
    countInStock: 78,
    rating: 4.4,
    numReviews: 189,
  },

  // Smart Home
  {
    name: "Amazon Echo Show 15",
    description:
      "Smart display with 15.6-inch screen, hands-free Alexa, video calling, household command hub",
    price: 249.99,
    image: "https://via.placeholder.com/400x300?text=Echo+Show+15",
    category: "Smart Home",
    tags: ["smart", "home", "echo", "alexa", "display"],
    countInStock: 24,
    rating: 4.6,
    numReviews: 345,
  },
  {
    name: "Google Nest Hub Max",
    description:
      "Smart display with 10-inch screen, video calling, Google Assistant, smart home control",
    price: 229.99,
    image: "https://via.placeholder.com/400x300?text=Nest+Hub+Max",
    category: "Smart Home",
    tags: ["smart", "home", "google", "nest", "assistant"],
    countInStock: 19,
    rating: 4.7,
    numReviews: 298,
  },
  {
    name: "Philips Hue Smart Bulbs",
    description:
      "Smart LED bulbs with 16 million colors, voice control, energy efficient, App controlled",
    price: 19.99,
    image: "https://via.placeholder.com/400x300?text=Philips+Hue",
    category: "Smart Home",
    tags: ["smart", "lights", "bulb", "philips", "automation"],
    countInStock: 150,
    rating: 4.8,
    numReviews: 567,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(
      `Successfully inserted ${insertedProducts.length} sample products`,
    );

    console.log("\nSample products:");
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price}`);
    });

    await disconnectDB();
    console.log("\nDatabase seeding completed!");
  } catch (error) {
    console.error("Database seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
