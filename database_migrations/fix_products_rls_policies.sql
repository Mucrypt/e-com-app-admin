-- Fix RLS policies for products table to allow SUPERADMIN import functionality

-- First, let's check what policies currently exist
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
-- FROM pg_policies WHERE tablename = 'products';

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can view active products" ON products;
DROP POLICY IF EXISTS "Admins can manage all products" ON products;
DROP POLICY IF EXISTS "Superadmins can do everything" ON products;

-- Create comprehensive RLS policies for products table

-- Policy 1: Allow public read access to active, non-deleted products
CREATE POLICY "Public can view active products" ON products
  FOR SELECT 
  USING (is_active = true AND (is_deleted = false OR is_deleted IS NULL));

-- Policy 2: Allow authenticated users to view all products they have access to
CREATE POLICY "Authenticated users can view products" ON products
  FOR SELECT 
  TO authenticated
  USING (
    is_active = true AND (is_deleted = false OR is_deleted IS NULL)
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- Policy 3: Allow SUPERADMIN full access (INSERT, UPDATE, DELETE, SELECT)
CREATE POLICY "Superadmin full access" ON products
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superadmin'
    )
  );

-- Policy 4: Allow ADMIN users to manage products (INSERT, UPDATE, SELECT)
CREATE POLICY "Admin can manage products" ON products
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- Policy 5: Allow product creators to update their own products
CREATE POLICY "Users can update own products" ON products
  FOR UPDATE 
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Ensure the policies are applied in the right order by setting priorities
-- (Note: PostgreSQL applies policies in order, so more specific ones should come first)

-- Make sure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON products TO anon;
GRANT ALL ON products TO authenticated;

-- Also ensure we have the right permissions on the users table for role checking
GRANT SELECT ON users TO authenticated;