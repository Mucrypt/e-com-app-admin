-- Update RLS policies to use correct case for role values

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Superadmin full access" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;

-- Create updated RLS policies with correct case for roles

-- Policy 1: Allow public read access to active, non-deleted products
CREATE POLICY "Public can view active products" ON products
  FOR SELECT 
  USING (is_active = true AND (is_deleted = false OR is_deleted IS NULL));

-- Policy 2: Allow SUPERADMIN full access (using uppercase SUPERADMIN)
CREATE POLICY "Superadmin full access" ON products
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'SUPERADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'SUPERADMIN'
    )
  );

-- Policy 3: Allow ADMIN users to manage products (using uppercase ADMIN and SUPERADMIN)
CREATE POLICY "Admin can manage products" ON products
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('ADMIN', 'SUPERADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON products TO anon;
GRANT ALL ON products TO authenticated;
GRANT SELECT ON users TO authenticated;