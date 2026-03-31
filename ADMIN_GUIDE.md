# Admin Dashboard Guide

## Overview

The Admin Dashboard is a powerful tool for managing your e-commerce store. Only users with the **admin** role can access these features.

## Getting Admin Access

### Option 1: Create Admin User from MongoDB (Development)

Use MongoDB Compass or mongo shell to update an existing user:

```javascript
// Using mongo shell
use ecommerce

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Option 2: Create Admin User via Script

Create a file `server/scripts/makeAdmin.js`:

```javascript
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

async function makeAdmin(email) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true },
    );

    if (user) {
      console.log(`✅ ${email} is now an admin`);
    } else {
      console.log("❌ User not found");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.log("Usage: node scripts/makeAdmin.js your-email@example.com");
  process.exit(1);
}

makeAdmin(email);
```

Run with:

```bash
cd server
node scripts/makeAdmin.js your-email@example.com
```

## Admin Dashboard Features

### 1. View All Products

- See complete list of all products with:
  - Product image (thumbnail)
  - Name and category
  - Price in INR (₹)
  - Stock quantity (with color coding - green for in stock, red for out)
  - Rating and review count
  - Quick edit/delete buttons

### 2. Add New Product

Navigate to: **Admin** → **+ Add New Product**

**Required Fields:**

- Product Name
- Price (in ₹)
- Image URL
- Category (select from existing categories)
- Stock Count

**Optional Fields:**

- Description (detailed product information)
- Tags (comma-separated, helps with search and AI recommendations)

**Image Preview:**

- URL preview shown on the form
- Use high-quality images (recommended 500x500px or larger)

### 3. Edit Product

Click the **Edit** button on any product to update:

- All product details
- Price and stock levels
- Images and descriptions
- Tags and categorization

**Note:** Changes are saved immediately and reflected across the store.

### 4. Delete Product

Click the **Delete** button to remove a product (confirmation required).

**Warning:** This action is permanent and will:

- Remove the product from all customer views
- Remove from active carts (but not completed orders)
- Cannot be undone

### 5. Search & Filter

- Use the search box to quickly find products by name or category
- Results update in real-time

### 6. Dashboard Statistics

Quick overview metrics:

- **Total Products:** Count of all products
- **In Stock:** Products with quantity > 0
- **Out of Stock:** Products with quantity = 0
- **Average Rating:** Mean rating across all products

## Product Management Best Practices

### Naming Conventions

✅ Good:

- "iPhone 15 Pro Max 256GB Space Gray"
- "Sony WH-1000XM5 Wireless Headphones"
- "Adidas Ultra Boost Running Shoes"

❌ Avoid:

- "phone"
- "item"
- "product 1"

### Descriptions

- Be detailed and specific
- Include specifications and features
- Mention materials, dimensions, or compatibility
- Highlight unique selling points
- Use line breaks for readability

### Pricing

- Keep prices competitive
- Update regularly based on demand
- Consider bulk discounts in future updates
- Prices should be realistic and consistent

### Stock Management

- Update stock counts after each order
- Set to 0 when items are out
- Monitor slow-moving inventory
- Plan restocking based on sales trends

### Tags

Useful tags for an iPhone:

- smartphone
- apple
- 5g
- camera
- premium
- flagship

Useful tags for shoes:

- athletics
- running
- comfortable
- durable
- sports

### Images

- Use multiple angles if possible
- Ensure proper lighting
- Avoid watermarks or logos
- Consistent dimensions across similar products
- High resolution (1000x1000px optimal)

## Navigation

```
From Main Menu:
  Login/Logout
  ↓
  Click "Admin" button (only visible to admin users)
  ↓
  Admin Dashboard
    ├── Add New Product
    ├── View All Products
    ├── Edit Product (click Edit button)
    └── Delete Product (click Delete button)
```

## Troubleshooting

### Cannot see "Admin" button

- Make sure you're logged in
- Verify your account has admin role
- Try refreshing the page

### Cannot access admin pages

- Check if you're authenticated
- Verify browser is not in private/incognito mode
- Clear browser cache and cookies
- Try logging out and logging back in

### Product not appearing in store

- Verify stock count is > 0
- Check category is correct
- Ensure image URL is valid and accessible
- Wait a few seconds for page to refresh

### Changes not saving

- Check browser console for errors (F12)
- Verify MongoDB connection is active
- Check server logs for issues
- Ensure all required fields are filled

### Image not loading

- Verify URL is correct (starts with http/https)
- Check image still exists at that URL
- Use a different image URL if original is broken
- Recommended: Use image hosting service (Imgur, Cloudinary, etc.)

## Role-Based Access

### Admin Privileges

- ✅ View all products
- ✅ Add new products
- ✅ Edit any product
- ✅ Delete products
- ✅ View all orders
- ✅ Mark orders as delivered
- ✅ View dashboard statistics

### Regular User Privileges

- ✅ View products
- ✅ Search and filter
- ✅ View AI recommendations
- ✅ Add items to cart
- ✅ Checkout
- ✅ View their own orders
- ❌ Cannot manage products
- ❌ Cannot view all orders
- ❌ Cannot delete products

## Future Admin Features (Coming Soon)

- Inventory management dashboard
- Sales analytics and reports
- Order management interface
- Customer management
- Category management
- Discount/coupon system
- Product reviews and ratings management
- Bulk product import/export
- Automated stock alerts
- Sales forecasting

## Security Notes

### Admin Account Security

1. Use a strong, unique password
2. Don't share admin credentials
3. Log out after each session
4. Change password regularly
5. Enable browser autofill carefully

### Data Protection

- All admin actions are logged
- Product changes are tracked
- API requests require authentication
- Webhook events are verified
- Database backups are maintained

## API Reference

### Create Product

```
POST /api/products
Headers: Authorization: Bearer <admin_token>
Body: {
  name: string (required),
  description: string,
  price: number (required),
  image: string (required),
  category: string (required),
  tags: array,
  countInStock: number
}
```

### Update Product

```
PUT /api/products/:id
Headers: Authorization: Bearer <admin_token>
Body: (same as create)
```

### Delete Product

```
DELETE /api/products/:id
Headers: Authorization: Bearer <admin_token>
```

## Support

For admin access or issues:

1. Check dashboard logs (check server console)
2. Review product data for accuracy
3. Verify MongoDB connection
4. Contact support with issue details
5. Include screenshots or error messages

Happy managing! 🚀
