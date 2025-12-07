-- Migration: Add admin delete policies for users and related tables
-- This allows admins to delete users, products, and orders from the admin panel

-- Users table - Allow admins to delete any user
CREATE POLICY "Admins can delete any user"
    ON public.users FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Products table - Allow admins to delete any product
CREATE POLICY "Admins can delete any product"
    ON public.products FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Orders table - Allow admins to view and update any order
CREATE POLICY "Admins can view all orders"
    ON public.orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can update any order"
    ON public.orders FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete any order"
    ON public.orders FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Payment info - Allow admins to view and delete
CREATE POLICY "Admins can view all payment info"
    ON public.payment_info FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete payment info"
    ON public.payment_info FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Reviews - Allow admins to delete any review
CREATE POLICY "Admins can delete any review"
    ON public.reviews FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Cart items - Allow admins to delete any cart item
CREATE POLICY "Admins can delete any cart item"
    ON public.cart_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Success notification
DO $$
BEGIN
    RAISE NOTICE 'Admin delete policies created successfully!';
END $$;
