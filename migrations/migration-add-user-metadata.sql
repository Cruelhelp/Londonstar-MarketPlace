-- Migration: Add status and metadata columns to users table
-- Run this in Supabase SQL Editor to fix seller registration

-- Add status column
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
CHECK (status IN ('active', 'pending', 'suspended', 'rejected'));

-- Add metadata column for seller business information
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Update existing users to have active status if null
UPDATE public.users
SET status = 'active'
WHERE status IS NULL;

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- Create index on metadata for faster JSONB queries
CREATE INDEX IF NOT EXISTS idx_users_metadata ON public.users USING GIN (metadata);
