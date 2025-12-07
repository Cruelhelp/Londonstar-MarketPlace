-- Diagnostic SQL: Check RLS policies on users table
-- Run this in Supabase SQL Editor to verify your RLS policies are configured correctly

-- 1. Check if RLS is enabled on users table
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'users';

-- 2. List all current policies on users table
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY policyname;

-- 3. Check for any database triggers on auth.users
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';

-- 4. Check for any database triggers on public.users
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table = 'users';

-- 5. View the actual auth user and corresponding profile
-- Replace 'your-test-email@example.com' with the email you're testing with
SELECT
    au.id as auth_user_id,
    au.email,
    au.created_at as auth_created,
    u.id as profile_id,
    u.email as profile_email,
    u.role,
    u.status,
    u.created_at as profile_created
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE au.email = 'your-test-email@example.com';

-- INSTRUCTIONS:
-- 1. Run this entire script in Supabase SQL Editor
-- 2. Check the results of each query:
--    - Query 1: rowsecurity should be TRUE
--    - Query 2: Should show 4 policies (insert, update, select own, select all)
--    - Query 3 & 4: Check if triggers are interfering
--    - Query 5: Verify user profile was created with correct role
