-- Migration: Create a database function for seller registration
-- This function runs with elevated permissions (SECURITY DEFINER) and bypasses RLS
-- This is the RECOMMENDED approach for seller registration

-- Drop the function if it exists
DROP FUNCTION IF EXISTS create_seller_profile(uuid, text, text, text, jsonb);

-- Create the function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION create_seller_profile(
    user_id uuid,
    user_email text,
    user_full_name text,
    user_phone text,
    user_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS policies
SET search_path = public
AS $$
DECLARE
    result_data jsonb;
BEGIN
    -- Verify the user is authenticated and owns this user_id
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF auth.uid() != user_id THEN
        RAISE EXCEPTION 'Cannot create profile for another user';
    END IF;

    -- Delete any existing profile (if trigger created one)
    DELETE FROM public.users WHERE id = user_id;

    -- Insert new seller profile
    INSERT INTO public.users (
        id,
        email,
        full_name,
        role,
        status,
        phone,
        metadata,
        created_at,
        updated_at
    ) VALUES (
        user_id,
        user_email,
        user_full_name,
        'seller',
        'pending',
        user_phone,
        user_metadata,
        now(),
        now()
    )
    RETURNING jsonb_build_object(
        'id', id,
        'email', email,
        'full_name', full_name,
        'role', role,
        'status', status,
        'phone', phone,
        'metadata', metadata
    ) INTO result_data;

    RETURN result_data;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error creating seller profile: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_seller_profile(uuid, text, text, text, jsonb) TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION create_seller_profile IS 'Creates a seller profile for a newly registered user. Bypasses RLS policies using SECURITY DEFINER.';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Seller registration function created successfully!';
    RAISE NOTICE '✅ Use this function from JavaScript: supabase.rpc("create_seller_profile", {...})';
END $$;
