# MERN E-Commerce Platform

A fully functional e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, AI-powered product recommendations using Jaccard Similarity, Stripe payment integration, and an admin dashboard.

## Features

- **User Authentication**: JWT-based authentication with user and admin roles
- **Product Management**:
  - Search and filter products by name, category, price range
  - Product details with ratings and reviews
  - Pagination support
- **Shopping Cart**: Redux-based state management with persistent localStorage
- **AI Recommendations**: Jaccard Similarity-based product recommendations based on product tags
- **Payment Integration**: Stripe payment processing with payment intent flow
- **Order Management**: User order history and admin order tracking
- **Admin Dashboard**: Full CRUD operations for products and order management
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Project Structure

```
eccommerce/
├── server/                          # Backend (Node.js + Express)
│   ├── models/
│   │   ├── User.js                  # User schema with password hashing
│   │   ├── Product.js               # Product schema with text indexing
│   │   └── Order.js                 # Order schema with relationships
│   ├── controllers/
│   │   ├── authController.js        # Auth logic (register, login)
│   │   ├── productController.js     # Product operations & search
│   │   └── paymentController.js     # Payment & order handling
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── productRoutes.js         # Product endpoints
│   │   └── paymentRoutes.js         # Payment & order endpoints
│   ├── middleware/
│   │   └── auth.js                  # JWT verification & auth middleware
│   ├── utils/
│   │   └── recommendations.js       # Jaccard Similarity algorithm
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── index.js                     # Express server entry point
│   └── package.json                 # Dependencies
│
├── client/                          # Frontend (React + Redux)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductList.js       # Product listing with filters
│   │   │   ├── ProductDetails.js    # Product details & recommendations
│   │   │   └── ShoppingCart.js      # Cart management
│   │   ├── pages/
│   │   │   ├── Checkout.js          # Stripe payment page
│   │   │   ├── Login.js             # User login
│   │   │   └── Register.js          # User registration
│   │   ├── redux/
│   │   │   ├── store.js             # Redux store configuration
│   │   │   ├── cartSlice.js         # Cart state management
│   │   │   └── authSlice.js         # Auth state management
│   │   ├── utils/
│   │   │   └── api.js               # Axios API client
│   │   ├── App.js                   # Main app component
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles with Tailwind
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── package.json                 # Dependencies
│   ├── tailwind.config.js           # Tailwind configuration
│   └── postcss.config.js            # PostCSS configuration
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Stripe account

### Backend Setup

1. **Navigate to server directory**:

```bash
cd server
```

2. **Install dependencies**:

```bash
npm install
```

3. **Create .env file** (copy from .env.example):

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
PORT=5000
NODE_ENV=development
```

4. **Start the server**:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**:

```bash
cd client
```

2. **Install dependencies**:

```bash
npm install
```

3. **Create .env file**:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

4. **Start the development server**:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)

### Products

- `GET /api/products` - Get all products with filters
  - Query params: `search`, `category`, `sortBy`, `minPrice`, `maxPrice`, `page`, `limit`
- `GET /api/products/:id` - Get product details and recommendations
- `GET /api/products/:productId/recommendations` - Get AI recommendations
- `GET /api/products/categories` - Get all categories
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Payments & Orders

- `POST /api/payments/create-payment-intent` - Create Stripe payment intent
- `POST /api/payments/confirm-payment` - Confirm payment and update order
- `POST /api/payments/orders` - Create order
- `GET /api/payments/orders/user` - Get user orders
- `GET /api/payments/orders` - Get all orders (admin only)
- `PUT /api/payments/orders/:orderId/deliver` - Mark order as delivered (admin only)

## AI Recommendation Algorithm

The system uses **Jaccard Similarity** to recommend products based on their tags:

$$\text{Jaccard Similarity} = \frac{|A \cap B|}{|A \cup B|}$$

Where:

- A = tags of viewed product
- B = tags of candidate product

### Example

If a user views a laptop with tags: `["electronics", "computers", "portable"]`

- A Dell laptop with tags `["electronics", "computers", "portable", "business"]` → Similarity = 3/4 = 0.75
- An iPhone with tags `["electronics", "mobile", "portable"]` → Similarity = 2/4 = 0.5
- A desk chair with tags `["furniture", "office"]` → Similarity = 0/5 = 0

## Stripe Payment Flow

1. **User adds products** to cart
2. **Proceeds to checkout** → Stripe payment form
3. **Order created** in database (initially unpaid)
4. **Payment intent** created with Stripe
5. **Card verified** with Stripe using SECAscii
6. **Payment confirmed** → Order marked as paid
7. **Confirmation page** shown with order details

## Redux State Management

### Cart Slice

```javascript
{
  items: [{ id, name, price, quantity, image, ... }],
  totalPrice: 199.99,
  totalQuantity: 3
}
```

### Auth Slice

```javascript
{
  user: { id, name, email, role },
  token: "jwt_token_here",
  loading: false,
  error: null
}
```

## Technologies Used

### Backend

- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database & ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Stripe** - Payment processing
- **CORS** - Cross-origin requests

### Frontend

- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Stripe React** - Payment UI

## Environment Variables

### Server (.env)

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NODE_ENV=development
PORT=5000
```

### Client (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Testing the Application

### Create Sample Products

```bash
# Use MongoDB Compass or MongoDB CLI to insert sample products
db.products.insertMany([
  {
    name: "Gaming Laptop",
    description: "High-performance laptop for gaming",
    price: 1299,
    image: "https://via.placeholder.com/300x300",
    category: "Electronics",
    tags: ["laptop", "gaming", "electronics", "portable"],
    countInStock: 5,
    rating: 4.5,
    numReviews: 10
  },
  // ... more products
])
```

### Test Stripe Payments

Use Stripe test card: `4242 4242 4242 4242` with any future date and CVC

## Deployment

### Backend (Heroku/Railway)

1. Update CORS origin in `index.js`
2. Set production environment variables
3. Deploy using Git

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy the `build/` folder
3. Set environment variables in deployment platform

## Features Breakdown

### Search & Filtering

- **Full-text search** on product name, description, category, tags
- **Category filtering**
- **Price range filtering** (min/max)
- **Sorting** (newest, price, rating)
- **Pagination**

### Product Recommendations

- Automatically recommended on product detail page
- Based on Jaccard Similarity of product tags
- Fallback to category-based recommendations
- Shown as "Recommended For You" section

### Admin Features

- Create/Edit/Delete products
- View all orders and mark as delivered
- Manage product inventory

## Future Enhancements

- Product reviews and ratings system
- Wishlist functionality
- Social auth (Google, GitHub)
- Email notifications
- Admin analytics dashboard
- Product variants (size, color)
- Coupon/discount codes
- Inventory management alerts
- User profile management

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the GitHub repository.
#   e c c o m e r c e  
 