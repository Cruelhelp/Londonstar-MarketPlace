-- Migration: Fix seller registration to allow role/status override during signup
-- This allows users to set their own role to 'seller' and status to 'pending' during registration

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Users can insert own profile during registration" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Allow users to insert their own profile with ANY role during registration
CREATE POLICY "Users can insert own profile during registration"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile including role/status during registration
-- This is needed for UPSERT operations
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Add policy for users to view their own profile
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Keep the existing policy for viewing all profiles (for marketplace, etc)
-- This should already exist, but we'll recreate it to be safe
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
CREATE POLICY "Users can view all profiles"
    ON public.users FOR SELECT
    USING (true);

-- Success notification
DO $$
BEGIN
    RAISE NOTICE 'Seller registration RLS policies updated successfully!';
    RAISE NOTICE 'Users can now set their own role during registration.';
END $$;
