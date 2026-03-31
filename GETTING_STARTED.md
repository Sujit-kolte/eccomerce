# MERN E-Commerce Platform - Quick Start Guide

## ✅ Project Complete!

Your production-ready MERN e-commerce platform has been fully scaffolded with all essential features.

---

## 📁 What's Been Created

### Backend (Node.js + Express)

✅ **Models** (MongoDB Schemas)

- User (with bcrypt password hashing)
- Product (with full-text search indexing)
- Order (with relationships and payment tracking)

✅ **Controllers**

- Authentication (register, login, profile)
- Product Management (CRUD + Search + Filter + Recommendations)
- Payment Processing (Stripe integration + Order management)

✅ **Middleware**

- JWT Authentication & Authorization
- Admin role verification

✅ **Utilities**

- AI Recommendation Engine (Jaccard Similarity algorithm)
- Database Configuration

✅ **Routes**

- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product listing, search, recommendations
- `/api/payments/*` - Payment processing & order management

### Frontend (React + Redux)

✅ **Redux State Management**

- Cart Management (add, remove, update quantity, persist to localStorage)
- Authentication State (login, logout, token persistence)

✅ **Components**

- ProductList (with search, filters, categories, sorting, pagination)
- ProductDetails (with AI recommendations)
- ShoppingCart (with quantity management)

✅ **Pages**

- Checkout (Stripe integration with card payment)
- Login & Register (with validation)

✅ **Utilities**

- API Client (Axios with automatic JWT token attachment)

✅ **Styling**

- Tailwind CSS configuration
- Responsive design system

---

## 🚀 Getting Started

### Step 1: Install Dependencies

**At root level:**

```bash
npm install-all
```

This will install dependencies for both server and client.

Or manually:

```bash
# Backend
cd server
npm install

# Frontend (in another terminal)
cd client
npm install
```

### Step 2: Configure Environment Variables

1. **Server (.env):**

   ```bash
   cd server
   cp .env.example .env
   ```

   Edit `server/.env`:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/ecommerce
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   PORT=5000
   NODE_ENV=development
   ```

2. **Client (.env):**

   ```bash
   cd client
   ```

   Create `client/.env`:

   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

### Step 3: Setup MongoDB

**Option A: MongoDB Atlas (Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Replace in `server/.env`

**Option B: Local MongoDB**

1. Install MongoDB locally
2. Connection string: `mongodb://localhost:27017/ecommerce`

### Step 4: Setup Stripe

1. Go to https://stripe.com
2. Create account
3. Get API keys from Dashboard → Developers → API Keys
4. Add to `server/.env` and `client/.env`

### Step 5: Seed Sample Data (Optional)

```bash
cd server
npm install
# Then run:
node seeds.js
```

This will add 10 sample products to your database.

### Step 6: Start Development Servers

**Option A: Both servers at once:**

```bash
npm run dev
```

**Option B: Separate terminals:**

Terminal 1 - Backend:

```bash
cd server
npm run dev
```

Terminal 2 - Frontend:

```bash
cd client
npm start
```

---

## 🎯 Testing the Application

### Backend Health Check

Visit: http://localhost:5000/api/health

```json
{ "message": "Server is running" }
```

### Frontend

Visit: http://localhost:3000
You should see the product listing page

### Test User Flow

1. **Register Account**
   - Click "Register"
   - Enter name, email, password
   - Get JWT token (stored in localStorage)

2. **Browse Products**
   - Search by name
   - Filter by category
   - Sort by price or rating
   - View details & recommendations

3. **Add to Cart**
   - Click on product
   - View AI recommendations
   - Add to cart (stored in localStorage)

4. **Checkout**
   - View cart
   - Fill shipping address
   - Enter test Stripe card: `4242 4242 4242 4242`
   - Complete payment

5. **View Orders**
   - Orders are created after successful payment
   - Check backend database for order records

---

## 🌟 Key Features Explained

### AI Recommendations (Jaccard Similarity)

**How it works:**

```
Product A tags: [laptop, gaming, electronics, portable]
Product B tags: [laptop, gaming, electronics, work]

Jaccard Similarity = intersection / union
                   = 3 / 5 = 0.6 (60% similar)
```

Located in: `server/utils/recommendations.js`

**Used on:**

- Product detail page (shows 5 most similar products)
- Available via API: `GET /api/products/:id/recommendations`

### Stripe Payment Flow

1. Create order in database
2. Create Stripe payment intent
3. Confirm card with Stripe (using client secret)
4. Mark order as paid in database
5. Clear cart and show confirmation

Code: `client/src/pages/Checkout.js`

### Redux Cart State

**Automatically saved to localStorage**

- Persists across browser sessions
- Synced in real-time
- Total price and quantity calculated automatically

Code: `client/src/redux/cartSlice.js`

---

## 📊 Database Schema

### User

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user | admin),
  createdAt: Date
}
```

### Product

```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  tags: Array[String],
  countInStock: Number,
  rating: Number (0-5),
  numReviews: Number,
  createdAt: Date
}
```

### Order

```javascript
{
  user: ObjectId,
  orderItems: Array[{product, quantity, price}],
  totalPrice: Number,
  shippingAddress: {address, city, postalCode, country},
  paymentMethod: String,
  paymentResult: {id, status, update_time, email},
  isPaid: Boolean,
  paidAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date,
  createdAt: Date
}
```

---

## 🔐 Authentication Flow

1. **Register:**
   - User submits name, email, password
   - Password hashed with bcryptjs (10 salt rounds)
   - JWT token generated & returned
   - Token stored in localStorage

2. **Login:**
   - User submits email & password
   - Password compared with hashed version
   - JWT token generated & returned

3. **Protected Routes:**
   - Token sent in Authorization header: `Bearer <token>`
   - Middleware verifies JWT signature
   - User info decoded from token
   - Request proceeds with user context

Code: `server/middleware/auth.js`

---

## 🛠️ API Response Format

All API responses follow this format:

**Success (2xx):**

```json
{
  "message": "Success message",
  "data": { ... } or []
}
```

**Error (4xx/5xx):**

```json
{
  "message": "Error message"
}
```

---

## 📦 Dependencies

### Backend

- express: Web framework
- mongoose: MongoDB ORM
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- stripe: Payment processing
- cors: Cross-origin requests
- dotenv: Environment variables

### Frontend

- react: UI library
- react-redux: State management
- @reduxjs/toolkit: Redux utilities
- axios: HTTP client
- react-router-dom: Routing
- @stripe/react-stripe-js: Stripe payment UI
- tailwindcss: Styling

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED
```

**Fix:** Check if MongoDB is running and connection string is correct

### Stripe Error

```
Error: Invalid API Key provided
```

**Fix:** Verify Stripe keys in .env files (secret vs publishable)

### CORS Error

```
No 'Access-Control-Allow-Origin' header
```

**Fix:** Already configured in server, make sure frontend URL matches CORS settings

### Cart Empty After Refresh

**This is normal** - localStorage stores JSON, check browser DevTools → Application → localStorage

---

## 📈 Next Steps

### Enhancements to Add

1. Product reviews & ratings system
2. Wishlist functionality
3. Email notifications
4. Admin dashboard analytics
5. Product variants (size, color)
6. Coupon/discount codes
7. Social authentication
8. Payment history page

### Deployment Options

**Backend:**

- Heroku
- Railway
- Render
- DigitalOcean

**Frontend:**

- Vercel
- Netlify
- GitHub Pages

**Database:**

- MongoDB Atlas (free tier available)

---

## 📝 Common Commands

```bash
# Backend
npm run dev              # Start with nodemon (auto-reload)
npm start               # Start production
node seeds.js           # Seed database

# Frontend
npm start               # Start dev server
npm run build           # Build for production
npm test                # Run tests

# Root
npm run dev             # Start both backend & frontend
npm install-all         # Install all dependencies
```

---

## 🎓 Learning Resources

- **MERN Stack:** https://mern.io
- **MongoDB:** https://docs.mongodb.com
- **Express:** https://expressjs.com
- **React:** https://react.dev
- **Redux Toolkit:** https://redux-toolkit.js.org
- **Stripe API:** https://stripe.com/docs/api
- **JWT:** https://jwt.io
- **Tailwind CSS:** https://tailwindcss.com

---

## 📞 Support

If you encounter any issues:

1. Check the README.md for detailed documentation
2. Review API endpoint specifications
3. Check browser console for frontend errors
4. Check terminal/logs for backend errors
5. Verify environment variables are set correctly

---

## ⭐ Features Summary

| Feature               | Status | Location                  |
| --------------------- | ------ | ------------------------- |
| User Authentication   | ✅     | `/api/auth/*`             |
| Product Search/Filter | ✅     | `/api/products`           |
| Shopping Cart         | ✅     | Redux state               |
| AI Recommendations    | ✅     | Jaccard Similarity        |
| Stripe Payments       | ✅     | `/api/payments/*`         |
| Order Management      | ✅     | Database & API            |
| Admin Routes          | ✅     | Protected with role check |
| Responsive Design     | ✅     | Tailwind CSS              |
| State Persistence     | ✅     | localStorage              |
| Error Handling        | ✅     | Middleware & try-catch    |

---

## 🎉 You're All Set!

Your MERN e-commerce platform is ready to run. Start the servers and begin testing!

```bash
npm run dev
```

Visit `http://localhost:3000` and start building your store! 🚀
