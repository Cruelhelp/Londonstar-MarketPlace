# Seller Registration Setup Guide

## Problem Summary

Seller registration was failing because the database trigger creates user profiles with `role='buyer'` by default, and Row Level Security (RLS) policies were blocking the frontend from updating the role to `seller`.

## Solution: Database Function Approach (RECOMMENDED)

We've implemented a **Postgres function** that runs with elevated permissions (`SECURITY DEFINER`) to bypass RLS policies. This is the most reliable approach for user registration flows.

---

## Step-by-Step Setup Instructions

### Step 1: Run the Migration SQL

Open your **Supabase SQL Editor** and run this file:

```
migration-seller-registration-function.sql
```

This creates a Postgres function called `create_seller_profile` that:
- Deletes any auto-created buyer profile
- Creates a fresh seller profile with `role='seller'` and `status='pending'`
- Bypasses RLS policies using `SECURITY DEFINER`
- Validates that the authenticated user owns the profile

### Step 2: Verify the Function Exists

Run this SQL to confirm the function was created:

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'create_seller_profile';
```

You should see one row returned.

### Step 3: Clean Up Test Users (Optional)

If you have test users in a bad state from previous registration attempts:

```sql
-- View all current users
SELECT id, email, role, status FROM public.users;

-- Delete specific test user (replace with actual ID)
DELETE FROM public.users WHERE email = 'your-test-email@example.com';

-- Also delete from auth.users if needed (be careful!)
-- DELETE FROM auth.users WHERE email = 'your-test-email@example.com';
```

### Step 4: Wait for Rate Limits to Reset

If you've been testing repeatedly, Supabase may have rate-limited your email. Wait **60 seconds** before testing again.

### Step 5: Test Seller Registration

1. Open `seller-registration.html` in your browser
2. Fill out the seller registration form
3. Submit the form
4. Check the browser console for these messages:
   - ✅ Auth user created: [user-id]
   - 🔐 Current session: Authenticated [user-id]
   - 📝 Creating seller profile using database function...
   - ✅ Seller profile created: [profile-data]
   - ✅ Seller registration complete!

### Step 6: Verify in Admin Panel

1. Log in to `admin.html` with admin credentials
2. Navigate to the **Sellers** tab
3. You should see the pending seller request with `status='pending'`
4. Approve or reject the seller

---

## Alternative Approach: RLS Policy Fix

If you prefer to use RLS policies instead of the database function, run:

```
migration-fix-seller-registration-v2.sql
```

**Key difference in this file:**
- Adds `TO authenticated` clause to policies (this was missing before!)
- Allows authenticated users to INSERT and UPDATE their own profiles

Then update `seller-registration.html` to use UPSERT instead of `supabase.rpc()`.

⚠️ **Note**: The database function approach is more reliable and recommended for production use.

---

## Diagnostic Tools

### Check RLS Policies

Run `diagnostic-check-rls-policies.sql` in Supabase SQL Editor to:
- Verify RLS is enabled
- List all current policies
- Check for interfering triggers
- View user profiles and their roles

### Console Logging

The seller registration process includes detailed console logging:
- ✅ = Success
- 🔐 = Authentication info
- 📝 = Database operation
- ❌ = Error
- ⚠️ = Warning

---

## How It Works Now

### Old Flow (BROKEN):
1. User signs up → Supabase creates auth user
2. Database trigger creates profile with `role='buyer'`, `status='active'`
3. Frontend tries to UPSERT to `role='seller'`, `status='pending'`
4. ❌ RLS policy blocks the update → Seller stays as buyer

### New Flow (FIXED):
1. User signs up → Supabase creates auth user
2. Database trigger creates profile with `role='buyer'`, `status='active'`
3. Frontend calls `create_seller_profile()` function
4. Function **deletes** the buyer profile (has elevated permissions)
5. Function **creates** fresh seller profile with `role='seller'`, `status='pending'`
6. ✅ Seller profile created successfully

---

## Troubleshooting

### Error: "function create_seller_profile does not exist"
**Solution**: Run `migration-seller-registration-function.sql` in Supabase SQL Editor

### Error: "Not authenticated"
**Solution**: The auth session isn't established. Try:
- Increasing the wait time (currently 2 seconds)
- Signing in manually after signup
- Checking Supabase auth settings

### Error: "Cannot create profile for another user"
**Solution**: The function validates `auth.uid() = user_id`. This error means the authenticated user doesn't match the profile being created. Clear your session and try again.

### Error: 429 Too Many Requests
**Solution**: Wait 60 seconds between registration attempts. Supabase has rate limiting on auth endpoints.

### Seller still shows as "buyer" in admin
**Solution**:
1. Delete the test user completely (auth.users and public.users)
2. Run the migration SQL again
3. Test with a fresh email address

### No sellers showing in admin panel
**Solution**: Check the browser console in `admin.html` for errors. The `loadSellers()` function includes logging to help debug.

---

## File Summary

| File | Purpose |
|------|---------|
| `migration-seller-registration-function.sql` | ✅ **RECOMMENDED**: Creates database function to handle seller registration |
| `migration-fix-seller-registration-v2.sql` | Alternative: RLS policy fix with `TO authenticated` clause |
| `diagnostic-check-rls-policies.sql` | Diagnostic queries to check RLS policies and triggers |
| `seller-registration.html` | Updated to use `supabase.rpc('create_seller_profile', ...)` |
| `admin.html` | Admin panel with seller approval/rejection |

---

## Success Checklist

- [ ] Run `migration-seller-registration-function.sql` in Supabase
- [ ] Verify function exists with diagnostic query
- [ ] Clean up test users (optional)
- [ ] Wait for rate limits to reset (if needed)
- [ ] Test seller registration with console open
- [ ] Verify seller appears in admin panel with `status='pending'`
- [ ] Test admin approval/rejection workflow

---

## Need Help?

If you're still experiencing issues:
1. Run `diagnostic-check-rls-policies.sql` and share the results
2. Check browser console for detailed error messages
3. Verify your Supabase project URL and anon key in `js/supabase-config.js`
4. Ensure your database schema is up to date (run `supabase-schema.sql`)
