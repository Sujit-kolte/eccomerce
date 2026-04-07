# 🚀 Vercel Full-Stack Deployment Guide

Your e-commerce project is now configured for **complete Vercel deployment** (both frontend + backend on Vercel).

## ✅ What's Configured

- ✓ **API serverless functions** in `/api` directory
- ✓ **Frontend** configured to use relative API URLs (`/api`)
- ✓ **vercel.json** set up for full-stack routing
- ✓ **Environment variables** configured (.env.production)
- ✓ **CORS handling** for Vercel deployment

## 📋 Pre-Deployment Checklist

### 1. **Push to GitHub**

```bash
git add .
git commit -m "Setup full-stack Vercel deployment"
git push origin main
```

### 2. **Create/Update Vercel Project**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Click **"Deploy"** (it should auto-detect the configuration)

### 3. **Add Environment Variables in Vercel Dashboard**

In your Vercel project settings, go to **Settings** → **Environment Variables** and add:

| Variable                  | Value                                |
| ------------------------- | ------------------------------------ |
| `MONGODB_URI`             | Your MongoDB Atlas connection string |
| `JWT_SECRET`              | Your JWT secret key                  |
| `JWT_EXPIRE`              | `7d`                                 |
| `RAZORPAY_KEY_ID`         | Your Razorpay test key               |
| `RAZORPAY_KEY_SECRET`     | Your Razorpay secret                 |
| `RAZORPAY_WEBHOOK_SECRET` | Your webhook secret                  |
| `NODE_ENV`                | `production`                         |

**Example MongoDB URI:**

```
mongodb+srv://username:password@cluster0.abc.mongodb.net/?appName=Cluster0
```

### 4. **Deploy**

Click **"Deploy"** in Vercel dashboard. The build process will:

1. Install root dependencies
2. Install server dependencies
3. Install client dependencies
4. Build React app
5. Deploy everything as one project

## 🌐 After Deployment

Your site will be live at: `https://your-project.vercel.app`

- **Frontend**: `https://your-project.vercel.app`
- **API Endpoints**: `https://your-project.vercel.app/api/*`

### Update CORS (if needed)

If you need to restrict CORS, update `api/index.js`:

```javascript
const allowedOrigins = ["https://your-project.vercel.app"];
```

## 🔄 Deployment Updates

To update your deployment:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically redeploy on every push to main branch.

## ❌ Troubleshooting

### Build Fails

- Check that all environment variables are set in Vercel dashboard
- Ensure MongoDB connection string is correct
- Check build logs in Vercel dashboard

### API Returns 404

- Verify `/api` routes in `vercel.json`
- Check that `api/index.js` exports the app correctly

### CORS Errors

- Add your Vercel URL to `allowedOrigins` in `api/index.js`
- Verify `REACT_APP_API_URL=/api` in `client/.env.production`

### Database Connection Issues

- Verify MongoDB Atlas connection string
- Allow Vercel IPs: In MongoDB Atlas → Network Access → Add `0.0.0.0/0`

## 📝 File Structure

```
project/
├── api/
│   └── index.js           # Main serverless function (Express app)
├── client/
│   ├── .env.production    # Frontend production config (uses /api)
│   └── src/
├── server/
│   ├── config/
│   ├── routes/
│   ├── models/
│   └── controllers/
├── .env.production        # Root production env
└── vercel.json           # Vercel configuration
```

## 🎯 Next Steps

1. **Test locally**: `npm run dev` still works for local development
2. **Push to GitHub**
3. **Deploy to Vercel**
4. **Monitor deployment** in Vercel dashboard
5. **Test API endpoints** from production

---

For questions, check the [Vercel Docs](https://vercel.com/docs) or [MongoDB Atlas Setup Guide](../MONGODB_SETUP.md).
