# Deployment Guide: Vercel + Render + MongoDB Atlas

## Step 1: MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and sign in
3. Click "Create" to build a new cluster
4. Choose the free tier and select a region close to you
5. Create database user:
   - Username: `sujit`
   - Password: Create a strong password (save it!)
6. Add IP Address: Click "Add My Current IP Address" or add `0.0.0.0/0` for all IPs
7. Click "Connect" > "Drivers" > Copy the connection string
8. Replace `<password>` with your database password
9. Save this connection string - you'll need it for Render

**Example MongoDB URI:**

```
mongodb+srv://username:password@cluster0.abc.mongodb.net/?appName=Cluster0
```

## Step 2: Backend Deployment (Render)

### 2.1 Prepare Backend

1. Make sure your `server/package.json` has a start script:

```json
"scripts": {
  "start": "node index.js"
}
```

2. Update `server/index.js` to allow CORS from your frontend URL (we'll do this after getting the Vercel URL)

### 2.2 Deploy to Render

1. Go to https://render.com and sign up
2. Click "New +" > "Web Service"
3. Connect your GitHub repository (or select "Public Git Repository")
4. Fill in the details:
   - **Name:** `ecommerce-server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = Your JWT secret key
   - `JWT_EXPIRE` = `7d`
   - `RAZORPAY_KEY_ID` = Your Razorpay test key
   - `RAZORPAY_KEY_SECRET` = Your Razorpay secret
   - `RAZORPAY_WEBHOOK_SECRET` = Your webhook secret
   - `PORT` = `5000`
   - `NODE_ENV` = `production`

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy your backend URL (e.g., `https://ecommerce-server.onrender.com`)

### 2.3 Update CORS

After getting your Render URL, update `server/index.js`:

```javascript
cors({
  origin:
    process.env.NODE_ENV === "production"
      ? "https://yourdomain.vercel.app" // Update with your Vercel URL
      : "http://localhost:3000",
  credentials: true,
});
```

## Step 3: Frontend Deployment (Vercel)

### 3.1 Prepare Frontend

1. Create `.env.production` file in `client/` folder:

```
REACT_APP_API_URL=https://ecommerce-server.onrender.com/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_SXlvyyS4r5DUNA
```

2. Make sure `client/package.json` has:

```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build"
}
```

### 3.2 Deploy to Vercel

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New +" > "Project"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js (or select React)
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

5. Add Environment Variables:
   - `REACT_APP_API_URL` = `https://ecommerce-server.onrender.com/api`
   - `REACT_APP_RAZORPAY_KEY_ID` = `rzp_test_SXlvyyS4r5DUNA`

6. Click "Deploy"
7. Wait for deployment to complete
8. Your frontend URL will be displayed (e.g., `https://yourdomain.vercel.app`)

## Step 4: Final Updates

### Update Backend CORS

Update the CORS origin in `server/index.js` with your actual Vercel URL:

```javascript
origin: process.env.NODE_ENV === "production"
  ? "https://yourprojectname.vercel.app"  // Your actual Vercel URL
  : "http://localhost:3000",
```

Deploy the updated backend to Render.

## Step 5: Test Deployment

1. Open your Vercel frontend URL
2. Try the following:
   - Add products to cart ✓
   - View products ✓
   - Submit a review (if logged in) ✓
   - Test checkout ✓

## Troubleshooting

### "CORS Error" or "API not reachable"

- Check that Vercel URL is correctly added to backend CORS
- Verify MongoDB connection string is correct
- Check Render backend logs in dashboard

### "Database connection failed"

- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Ensure password doesn't have special characters that need URL encoding

### "Environment variables not working"

- Redeploy after adding environment variables
- Clear browser cache and hard refresh

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Render with all env variables
- [ ] Frontend deployed to Vercel with all env variables
- [ ] CORS updated with Vercel URL
- [ ] Backend redeployed after CORS change
- [ ] All features tested on production
- [ ] SSL certificate working (automatic with Vercel & Render)

## Useful Links

- Render Docs: https://docs.render.com
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
