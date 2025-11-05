-- Create a simple test function to insert products directly
CREATE OR REPLACE FUNCTION test_insert_product(
  p_name TEXT,
  p_description TEXT DEFAULT '',
  p_price DECIMAL DEFAULT 0,
  p_user_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  new_id := gen_random_uuid();
  
  INSERT INTO products (
    id,
    name, 
    description, 
    price, 
    is_active, 
    in_stock, 
    stock_quantity,
    created_by,
    created_at,
    updated_at
  ) VALUES (
    new_id,
    p_name,
    p_description,
    p_price,
    true,
    true,
    0,
    p_user_id,
    NOW(),
    NOW()
  );
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION test_insert_product TO authenticated;

-- Test the function
-- SELECT test_insert_product('Test Scraped Product', 'Test description', 29.99);