-- Migration: Add auth_background column to homepage_settings
-- This allows admins to customize the login/auth page background image

-- Add auth_background column to homepage_settings table
ALTER TABLE homepage_settings
ADD COLUMN IF NOT EXISTS auth_background TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN homepage_settings.auth_background IS 'Custom background image for the authentication/login page (Base64 encoded)';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Auth background column added to homepage_settings table';
    RAISE NOTICE '✅ Admins can now upload custom login page backgrounds';
END $$;
