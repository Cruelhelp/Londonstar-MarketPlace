-- Migration: Allow users to insert their own profile during registration
-- This is needed for seller registration when the trigger doesn't create the profile

-- Add policy to allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile during registration"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Success notification
DO $$
BEGIN
    RAISE NOTICE 'User self-insert policy created successfully!';
END $$;
