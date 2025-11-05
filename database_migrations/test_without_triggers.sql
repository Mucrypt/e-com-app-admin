-- Step 1: Disable all triggers to test if they're causing the issue
ALTER TABLE products DISABLE TRIGGER ALL;

-- Step 2: Try a direct insert to see if it works without triggers
INSERT INTO products (name, description, price, is_active, in_stock, stock_quantity) 
VALUES ('Test Product', 'Test Description', 10.00, true, true, 0);