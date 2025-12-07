-- Migration: Add admin policies for platform_settings
-- Run this in Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can insert platform settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins can update platform settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins can delete platform settings" ON public.platform_settings;

-- Allow admins to insert platform settings
CREATE POLICY "Admins can insert platform settings"
    ON public.platform_settings FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Allow admins to update platform settings
CREATE POLICY "Admins can update platform settings"
    ON public.platform_settings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Allow admins to delete platform settings (optional)
CREATE POLICY "Admins can delete platform settings"
    ON public.platform_settings FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
