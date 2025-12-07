# Supabase Setup Guide - London Star Marketplace

Complete step-by-step guide to configure Supabase for production use.

## Overview

This marketplace uses Supabase for:
- **Authentication** - User sign up, login, session management
- **Database** - PostgreSQL for all data storage
- **Storage** - Image hosting for products and profiles
- **Real-time** - Live updates (future feature)

---

## Quick Setup (5 Minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project** / **New Project**
3. Create an organization (if needed)
4. Fill in project details:
   - **Name**: `london-star-marketplace`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click **Create new project**
6. Wait 1-2 minutes for setup

### Step 2: Get Your API Keys

1. In your Supabase project, go to **Settings** > **API**
2. Copy these two values:
   - **Project URL** - e.g., `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key** - Long JWT token

3. Update `js/supabase-config.js`:
```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

### Step 3: Create Database Tables

**Option A: Using SQL Editor (Recommended)**

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `supabase-schema.sql` from this project
4. Copy ALL the contents
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)
7. Wait for "Success. No rows returned" message

**Option B: Using Setup Tool**

1. Open `setup-database.html` in your browser
2. Follow the step-by-step wizard
3. Copy and run the SQL as instructed

### Step 4: Create Storage Buckets

1. In Supabase Dashboard, go to **Storage**
2. Click **New Bucket**
3. Create first bucket:
   - Name: `product-images`
   - Public: **Yes** ✓
   - Click **Create bucket**
4. Create second bucket:
   - Name: `profile-pictures`
   - Public: **Yes** ✓
   - Click **Create bucket**

### Step 5: Configure Authentication

1. Go to **Authentication** > **Settings**
2. Under **Site URL**, add your domain:
   - Development: `http://localhost:8000`
   - Production: `https://yourdomain.com`
3. Under **Redirect URLs**, add:
   - `http://localhost:8000/**`
   - `https://yourdomain.com/**`
4. Click **Save**

### Step 6: Test Your Setup

1. Open `setup-database.html` in browser
2. Click **Test Connection**
3. Click **Verify Tables**
4. Click **Run Full Verification**
5. All checks should pass ✅

---

## Detailed Configuration

### Database Schema Details

The SQL schema creates these tables:

#### `users`
- Extends Supabase auth.users
- Stores user profiles (name, role, avatar, etc.)
- Role: buyer, seller, or admin

#### `products`
- Product catalog
- Links to seller (user_id)
- JSONB for images array
- Stock tracking

#### `orders`
- Order history
- Links to buyer and seller
- JSONB for order items
- Status tracking

#### `payment_info`
- Seller payment details
- One per seller
- Encrypted storage

#### `reviews`
- Product reviews and ratings
- One review per buyer per product

#### `cart_items`
- Shopping cart state
- Persists across sessions

#### `platform_settings`
- Global platform configuration
- Commission rates, currency, etc.

### Row Level Security (RLS)

The schema automatically enables RLS policies:

**Products:**
- Anyone can view active products
- Sellers can create/update/delete own products

**Users:**
- All profiles are viewable
- Users can only update their own profile

**Orders:**
- Buyers and sellers can view their orders
- Sellers can update order status

**Payment Info:**
- Sellers can only see their own payment info

**Reviews:**
- Anyone can read
- Buyers can create/update own reviews

### Storage Bucket Policies

**product-images:**
```sql
-- Allow public read
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated uploads
CREATE POLICY "Authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);
```

**profile-pictures:**
```sql
-- Allow public read
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-pictures');

-- Allow users to upload own avatar
CREATE POLICY "Users upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Verification Checklist

Use this checklist to ensure everything is set up correctly:

### Database
- [ ] All 7 tables created (users, products, orders, payment_info, reviews, cart_items, platform_settings)
- [ ] RLS policies enabled on all tables
- [ ] Triggers created for updated_at columns
- [ ] Indexes created for performance
- [ ] Default platform settings inserted

### Storage
- [ ] `product-images` bucket created (public)
- [ ] `profile-pictures` bucket created (public)
- [ ] Storage policies configured
- [ ] Test upload works

### Authentication
- [ ] Email auth enabled
- [ ] Site URL configured
- [ ] Redirect URLs added
- [ ] Email templates customized (optional)

### Connection
- [ ] API keys updated in `supabase-config.js`
- [ ] Test connection successful
- [ ] Can create test account
- [ ] Can sign in to test account

---

## Testing Your Setup

### Test 1: Create Account

1. Open `index.html`
2. Click **Sign Up**
3. Fill in email, password, name
4. Select "Seller" role
5. Click **Create Account**
6. Check your email for verification
7. Verify you're redirected to seller dashboard

### Test 2: Add Product

1. In seller dashboard, click **Add New Product**
2. Fill in product details
3. Upload an image
4. Click **Save Product**
5. Verify product appears in dashboard
6. Check Supabase table `products` has new row

### Test 3: View in Marketplace

1. Go to `marketplace.html`
2. Verify your product appears
3. Test search functionality
4. Add to cart
5. Check cart persists after refresh

### Test 4: Profile Update

1. Go to `seller-profile.html`
2. Upload profile picture
3. Update business information
4. Save changes
5. Check `users` table and `profile-pictures` bucket

---

## Troubleshooting

### "Invalid API key" Error

**Problem:** Can't connect to Supabase

**Solutions:**
1. Verify API key in `supabase-config.js` matches Supabase dashboard
2. Check there are no extra spaces or quotes
3. Make sure you're using the **anon public** key, not service role key
4. Try regenerating the key in Supabase settings

### "relation does not exist" Error

**Problem:** Tables not created

**Solutions:**
1. Run the full SQL schema in SQL Editor
2. Check for error messages in SQL execution
3. Verify you're connected to the correct database
4. Try running schema creation again

### "Row Level Security" Errors

**Problem:** Can't insert/update data

**Solutions:**
1. Verify user is authenticated
2. Check RLS policies exist on table
3. Verify user ID matches policy conditions
4. Temporarily disable RLS for testing (not recommended for production)

### Storage Upload Fails

**Problem:** Can't upload images

**Solutions:**
1. Verify bucket exists and is public
2. Check storage policies are configured
3. Verify file size is under limit (5MB)
4. Check file type is allowed (image/*)
5. Verify user is authenticated

### Email Verification Not Received

**Problem:** No verification email

**Solutions:**
1. Check spam folder
2. Verify email settings in Supabase Auth
3. Use custom SMTP for production (Supabase > Auth > Settings > SMTP)
4. Disable email confirmation for testing (not recommended)

### Session Expired Errors

**Problem:** User logged out unexpectedly

**Solutions:**
1. Check session duration in Supabase settings
2. Implement refresh token logic
3. Verify cookies are enabled in browser
4. Check for third-party cookie blockers

---

## Advanced Configuration

### Custom Email Templates

1. Go to **Authentication** > **Email Templates**
2. Customize:
   - Confirm signup email
   - Magic link email
   - Password reset email
3. Use variables: `{{ .Token }}`, `{{ .Email }}`, etc.

### Enable Social Auth

1. Go to **Authentication** > **Providers**
2. Enable desired providers:
   - Google
   - GitHub
   - Facebook
   - etc.
3. Add OAuth credentials from each provider
4. Update redirect URLs

### Database Backups

1. Go to **Database** > **Backups**
2. Enable daily backups (free tier: 7 days)
3. Set backup time
4. Test restore process

### Performance Optimization

1. **Enable Connection Pooling:**
   - Use Supavisor (built-in)
   - Configure in Database settings

2. **Add Indexes:**
   ```sql
   CREATE INDEX idx_products_seller ON products(seller_id);
   CREATE INDEX idx_products_category ON products(category);
   ```

3. **Enable Realtime:**
   - Go to Database > Replication
   - Enable for tables that need live updates

---

## Production Checklist

Before going live:

### Security
- [ ] Change database password from default
- [ ] Enable RLS on all tables
- [ ] Verify policies are restrictive enough
- [ ] Use environment variables for keys (not hardcoded)
- [ ] Enable email verification requirement
- [ ] Set up rate limiting
- [ ] Configure CORS properly

### Performance
- [ ] Enable connection pooling
- [ ] Add necessary indexes
- [ ] Configure caching headers
- [ ] Optimize images before upload
- [ ] Use CDN for static assets

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure database alerts
- [ ] Monitor query performance
- [ ] Track storage usage
- [ ] Set up uptime monitoring

### Backup
- [ ] Enable automated backups
- [ ] Test restore process
- [ ] Export schema to version control
- [ ] Document recovery procedures

---

## Next Steps

Once Supabase is configured:

1. ✅ **Test thoroughly** - Create accounts, add products, test all features
2. 🎨 **Customize branding** - Update colors, logo, text
3. 💳 **Integrate payments** - Add Stripe or PayPal
4. 📧 **Set up emails** - Custom SMTP, transactional emails
5. 📊 **Add analytics** - Google Analytics, Plausible, etc.
6. 🚀 **Deploy** - Netlify, Vercel, or your hosting
7. 🔒 **Security audit** - Test for vulnerabilities
8. 📱 **Mobile optimize** - Test on various devices

---

## Helpful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [SQL Reference](https://supabase.com/docs/guides/database/overview)

---

## Support

**Having issues?**

1. Check this guide first
2. Review Supabase documentation
3. Check browser console for errors
4. Review `setup-database.html` verification
5. Ask in Supabase Discord: [discord.gg/supabase](https://discord.gg/supabase)

---

**Your marketplace is now powered by Supabase!** 🚀
