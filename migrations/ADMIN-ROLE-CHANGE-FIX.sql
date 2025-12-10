-- ============================================
-- FIX: Admin Role Change Permission Issue
-- ============================================
-- This SQL fixes Row Level Security (RLS) policies to allow admins to update user roles

-- ============================================
-- OPTION 1: If policies already exist, drop and recreate
-- ============================================

-- Drop existing policies (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Admins can update any user" ON users;
DROP POLICY IF EXISTS "Admins can delete any user" ON users;

-- Create fresh policies
CREATE POLICY "Admins can update any user"
ON users
FOR UPDATE
USING (
  -- Check if the current user is an admin
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  -- Check if the current user is an admin
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete any user"
ON users
FOR DELETE
USING (
  -- Check if the current user is an admin
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================
-- STEP 3: Verify the policies were created
-- ============================================
SELECT * FROM pg_policies WHERE tablename = 'users';

-- ============================================
-- STEP 4: DIAGNOSTIC - Check if your admin user is properly set up
-- ============================================

-- Check your current user's auth ID and role
SELECT
    auth.uid() as "My Auth ID",
    u.id as "My User Table ID",
    u.email as "My Email",
    u.role as "My Role",
    (auth.uid() = u.id) as "IDs Match"
FROM users u
WHERE u.email = 'admin@londonstarrecords.studio';

-- If the above query shows:
-- - "My Role" is NOT 'admin' → Your role needs to be set to 'admin'
-- - "IDs Match" is false → Your auth.uid doesn't match users.id (sync issue)
-- - No rows returned → Your user doesn't exist in the users table

-- ============================================
-- STEP 5: FIX - If your role is not 'admin', run this:
-- ============================================
-- Replace 'admin@londonstarrecords.studio' with your actual email
UPDATE users
SET role = 'admin'
WHERE email = 'admin@londonstarrecords.studio';

-- Verify it worked:
SELECT email, role FROM users WHERE email = 'admin@londonstarrecords.studio';

-- ============================================
-- HOW TO USE:
-- ============================================
-- 1. Go to your Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Select your project
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "New Query"
-- 5. Copy and paste this entire file
-- 6. Click "Run" (or press Ctrl+Enter)
-- 7. You should see "Success. No rows returned"
-- 8. Try changing a user role in the admin panel - it should work now!

-- ============================================
-- TROUBLESHOOTING:
-- ============================================
-- If you get "policy already exists" error, drop the old policy first:
-- DROP POLICY IF EXISTS "Admins can update any user" ON users;
-- DROP POLICY IF EXISTS "Admins can delete any user" ON users;
-- Then run the CREATE POLICY commands again.

-- ============================================
-- VERIFICATION:
-- ============================================
-- To verify your admin status, run:
-- SELECT id, email, role FROM users WHERE role = 'admin';

-- To check all RLS policies on users table:
-- SELECT * FROM pg_policies WHERE tablename = 'users';
