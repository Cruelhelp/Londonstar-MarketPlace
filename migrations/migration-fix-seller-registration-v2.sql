-- Migration: Fix seller registration RLS policies (CORRECTED VERSION)
-- This allows authenticated users to set their own role to 'seller' during registration
--
-- IMPORTANT: The key fix is adding "TO authenticated" to specify these policies
-- apply to logged-in users, not anonymous/public users.

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert own profile during registration" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;

-- Policy 1: Allow authenticated users to INSERT their own profile
-- This is for initial profile creation during registration
CREATE POLICY "Users can insert own profile during registration"
    ON public.users
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Policy 2: Allow authenticated users to UPDATE their own profile
-- This is critical for UPSERT operations and profile updates
CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy 3: Allow authenticated users to SELECT their own profile
CREATE POLICY "Users can view own profile"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Policy 4: Allow everyone (authenticated and anonymous) to view all profiles
-- This is needed for marketplace browsing, seller profiles, etc.
CREATE POLICY "Users can view all profiles"
    ON public.users
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Optional: Add admin override policy if you have admin users
-- Uncomment if you have an admin role
/*
CREATE POLICY "Admins can do everything"
    ON public.users
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
*/

-- Success notification
DO $$
BEGIN
    RAISE NOTICE '✅ Seller registration RLS policies updated successfully!';
    RAISE NOTICE '✅ Authenticated users can now insert/update their own profiles.';
    RAISE NOTICE '✅ Users can set their own role to "seller" during registration.';
END $$;
