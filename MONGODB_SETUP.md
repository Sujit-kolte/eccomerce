# MongoDB Setup Guide for E-Commerce Platform

## Option 1: MongoDB Atlas (Cloud) - RECOMMENDED ⭐

### Quick Setup (5 minutes):

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up with email

2. **Create a Cluster**
   - Choose "AWS" region
   - Select "Free" tier (0.5GB storage)
   - Create cluster (takes 2-3 minutes)

3. **Get Connection String**
   - Click "CONNECT"
   - Choose "Connect your application"
   - Copy the MongoDB URI
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `ecommerce`

4. **Update server/.env**

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

5. **Add IP to Whitelist**
   - In MongoDB Atlas: Security → Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (for development)
   - Confirm

6. **Done!** Your database is ready

---

## Option 2: MongoDB Local Installation

### Windows Installation:

1. **Download MongoDB Community**
   - Go to: https://www.mongodb.com/try/download/community
   - Select Windows
   - Download `.msi` installer

2. **Install MongoDB**
   - Run the installer
   - Accept license agreement
   - Choose "Complete" installation
   - MongoDB will install as a Windows Service

3. **Verify Installation**

   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service**

   ```powershell
   # MongoDB should start automatically
   # Or manually:
   Get-Service MongoDB | Start-Service
   ```

5. **Default Connection String**
   ```
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   ```

---

## Testing the Connection

Once MongoDB is set up, run this to verify:

```powershell
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected!')).catch(err => console.log('❌ Error:', err.message))"
```

---

## Seed Sample Products

Once MongoDB is connected:

```powershell
cd server
node seeds.js
```

Expected output:

```
Connected to MongoDB
Cleared existing products
Successfully inserted 40 sample products
Sample products:
1. iPhone 15 Pro Max - $1199.99
2. Samsung Galaxy S24 Ultra - $1299.99
... (40 products total)
Database seeding completed!
```

---

## Start Development Server

```powershell
cd .. (back to root)
npm run dev
```

Then visit: **http://localhost:3000**

---

## Troubleshooting

### "connect ECONNREFUSED"

- MongoDB is not running
- Solution: Start MongoDB service or create MongoDB Atlas account

### "Authentication failed"

- Wrong password in connection string
- Solution: Check MONGODB_URI in .env

### "Cannot find module 'mongoose'"

- Dependencies not installed
- Solution: `cd server && npm install`

---

## Quick Reference

| Task                 | Command                      |
| -------------------- | ---------------------------- |
| Run seed script      | `cd server && node seeds.js` |
| Start app            | `npm run dev`                |
| Check MongoDB status | `tasklist \| findstr mongo`  |
| View .env example    | `cat .env.example`           |

---

**Recommended**: Use MongoDB Atlas for easiest setup! No local installation needed. ☁️
