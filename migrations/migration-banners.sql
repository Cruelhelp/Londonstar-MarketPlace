-- Migration: Create banners table for category banners
-- Run this in Supabase SQL Editor

-- Create banners table
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_banners_category ON public.banners(category);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON public.banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_display_order ON public.banners(display_order);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.banners
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active banners"
    ON public.banners FOR SELECT
    USING (is_active = true OR auth.uid() IN (
        SELECT id FROM public.users WHERE role = 'admin'
    ));

CREATE POLICY "Admins can insert banners"
    ON public.banners FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can update banners"
    ON public.banners FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete banners"
    ON public.banners FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Insert sample banners (optional)
INSERT INTO public.banners (category, title, description, image_url, display_order) VALUES
    ('Electronics', 'Electronics', 'Latest gadgets and devices', 'https://via.placeholder.com/1200x400/1e3a8a/ffffff?text=Electronics', 1),
    ('Fashion', 'Fashion', 'Trendy clothing and accessories', 'https://via.placeholder.com/1200x400/be123c/ffffff?text=Fashion', 2),
    ('Home & Garden', 'Home & Garden', 'Everything for your home', 'https://via.placeholder.com/1200x400/15803d/ffffff?text=Home+%26+Garden', 3),
    ('Sports', 'Sports', 'Sports equipment and gear', 'https://via.placeholder.com/1200x400/c2410c/ffffff?text=Sports', 4),
    ('Books', 'Books', 'Best sellers and classics', 'https://via.placeholder.com/1200x400/7c2d12/ffffff?text=Books', 5)
ON CONFLICT DO NOTHING;
