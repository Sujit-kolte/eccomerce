# Admin Signup & Registration Guide

## Overview

There are two ways to create admin accounts in the system:

1. **Standard Flow** - Regular user signup → Admin promotion
2. **Direct Admin Creation** - Create admin account directly

## Method 1: Register as User → Promote to Admin (Recommended)

### Step 1: User Registration

1. Go to http://localhost:3000/register
2. Fill in the form:
   - Name
   - Email
   - Password (minimum 6 characters)
3. Click "Register"
4. You'll be logged in and redirected

### Step 2: Promote to Admin

Admin must run one of these commands:

**Option A: Using Node Script (Easiest)**

```bash
cd server
node makeAdmin.js user-email@example.com
```

Output:

```
🔗 Connecting to MongoDB...
🔍 Looking for user: user-email@example.com
✅ user-email@example.com has been promoted to admin
📧 Email: user-email@example.com
👤 Name: User Name
🔐 Role: admin
```

**Option B: Using MongoDB Shell**

```bash
# Start mongo shell
mongosh

# Connect to database
use ecommerce

# Update user role
db.users.updateOne(
  { email: "user-email@example.com" },
  { $set: { role: "admin" } }
)

# Verify
db.users.findOne({ email: "user-email@example.com" })
```

**Option C: Using MongoDB Compass (GUI)**

1. Connect to your MongoDB instance
2. Go to ecommerce → users collection
3. Find the user by email
4. Edit the document
5. Change `role` field from `"user"` to `"admin"`
6. Save

### Step 3: Login as Admin

1. Logout from current account
2. Login with admin credentials
3. You'll see "Admin" button in header

---

## Method 2: Direct Admin Creation (Development Only)

### Create New Admin User via API

Send POST request to `/api/auth/register` with data:

```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "securepassword123",
  "role": "admin"
}
```

**Note:** The `role` field is optional during signup - it gets ignored and set to "user" by default.

---

## Method 3: Create Admin from MongoDB

### Using MongoDB Shell

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "will_be_hashed", // This won't actually work - use Method 1 instead
  role: "admin",
  createdAt: new Date(),
});
```

**Problem:** Password won't be hashed. Use Method 1 instead.

---

## Step-by-Step Admin Setup Example

### Example: Create Admin "John Doe"

**Step 1: User Registration**

```
1. Go to http://localhost:3000/register
2. Fill in:
   - Name: John Doe
   - Email: john@example.com
   - Password: John@123456
3. Click Register
4. Logged in as regular user
```

**Step 2: Promote to Admin**

```bash
# Terminal
cd server
node makeAdmin.js john@example.com
```

**Step 3: Refresh & See Admin Panel**

```
1. Refresh browser (or logout/login)
2. "Admin" button appears in header
3. Click "Admin" → Access dashboard
```

**Step 4: Start Managing Products**

```
1. Click "Admin" button
2. Click "+ Add New Product"
3. Fill product details
4. Click "Add Product"
```

---

## User Role Hierarchy

```
┌─────────────────────────┐
│     Super Admin         │ (Can manage other admins)
│   (Future Feature)      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│     Admin               │ (Can manage products)
│  • Add products         │
│  • Edit products        │
│  • Delete products      │
│  • View orders          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│     Regular User        │ (Can browse & buy)
│  • View products        │
│  • Add to cart          │
│  • Checkout             │
│  • View own orders      │
└─────────────────────────┘
```

---

## Troubleshooting

### User doesn't become admin after promotion

**Solution:**

1. Verify email spelling is correct
2. Refresh the page or logout/login
3. Check MongoDB directly:
   ```bash
   db.users.findOne({ email: "user@example.com" })
   ```

### Can't see Admin button after promotion

**Solution:**

1. Clear browser cache (Ctrl+Shift+Delete)
2. Logout completely
3. Close browser entirely
4. Login again

### makeAdmin.js script not found

**Solution:**

```bash
# Make sure you're in server directory
cd server
node makeAdmin.js email@example.com
```

### MongoDB not running

**Solution:**

```bash
# Windows
# Start MongoDB:
mongod

# Mac/Linux
brew services start mongodb-community
```

### "User not found" error

**Solution:**

1. User must register first via UI or API
2. Check email spelling matches exactly
3. Verify user exists in database:
   ```bash
   db.users.find({})
   ```

---

## Best Practices

### For Development (Local)

✅ Use `makeAdmin.js` script - fastest and easiest
✅ Create multiple test admins for testing
✅ Use predictable emails like `admin1@test.com`

### For Production

✅ Carefully control who gets admin role
✅ Use strong, unique passwords
✅ Log all admin promotions
✅ Don't share admin credentials
✅ Implement 2FA (future feature)
✅ Regular audit of admin accounts

### Security Checklist

- [ ] Admin passwords are strong (12+ characters, mixed case, numbers, symbols)
- [ ] Only trusted users are promoted to admin
- [ ] Admin emails are verified
- [ ] No test accounts left as admin in production
- [ ] Admin accounts are monitored
- [ ] Clear audit trail of who promoted whom (future feature)

---

## API Reference

### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"  // Always "user" for new registrations
  }
}
```

### Login User

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "admin@example.com",
    "role": "admin"  // Shows current role
  }
}
```

### Promote User to Admin (Manual - via script)

```bash
node server/makeAdmin.js user@example.com
```

No API endpoint for this - must be done locally via script (security feature).

---

## Quick Start Commands

### Windows/PowerShell

```powershell
# Register new user (via UI)
# Then promote to admin
cd server
node makeAdmin.js admin@example.com
```

### Mac/Linux

```bash
# Register new user (via UI)
# Then promote to admin
cd server
node makeAdmin.js admin@example.com
```

---

## Testing Admin Features

### Create Test Admin

```bash
cd server
node makeAdmin.js testadmin@example.com
```

### Login as Admin

1. Go to http://localhost:3000/login
2. Email: testadmin@example.com
3. Password: (whatever you registered with)
4. Click Login

### Access Admin Dashboard

1. Look for "Admin" button (purple) in header
2. Click it to go to dashboard
3. Try:
   - Adding a product
   - Editing a product
   - Deleting a product
   - Searching products

---

## Account Management

### View All Users (Admin)

```bash
db.users.find({})
```

### List All Admins

```bash
db.users.find({ role: "admin" })
```

### Count Admins

```bash
db.users.countDocuments({ role: "admin" })
```

### Remove Admin (Demote to User)

```bash
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "user" } }
)
```

### Delete User Account

```bash
db.users.deleteOne({ email: "user@example.com" })
```

---

## Future Enhancements

Planned features:

- [ ] Admin registration page (with secret code)
- [ ] Two-factor authentication (2FA)
- [ ] Admin audit logs
- [ ] Admin role levels (super-admin, moderator, etc.)
- [ ] Automatic admin creation during first setup
- [ ] Admin invitation system
- [ ] Admin account recovery

---

## Support

For help with admin setup:

1. **Check logs:** Review server console output
2. **Verify MongoDB:** Make sure database is running
3. **Test connectivity:** Try accessing `/api/products`
4. **Review database:** Check users collection directly
5. **Restart services:** Stop and restart both servers

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd server
npm run dev

# Terminal 3: Frontend
cd client
npm start
```

---

## Summary

| Step | Action           | Command/Where                                    |
| ---- | ---------------- | ------------------------------------------------ |
| 1    | Register user    | Go to http://localhost:3000/register             |
| 2    | Promote to admin | Run `node server/makeAdmin.js email@example.com` |
| 3    | Login            | Go to http://localhost:3000/login                |
| 4    | Access admin     | Click "Admin" button in header                   |
| 5    | Manage products  | Use admin dashboard                              |

That's it! 🎉
