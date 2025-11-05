-- Temporarily disable all triggers on products table to identify the problematic one

-- List all triggers on products table first (for reference)
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'products';

-- Disable all triggers temporarily
ALTER TABLE products DISABLE TRIGGER ALL;

-- Re-enable only essential triggers one by one for testing
-- First, let's enable just the updated_at trigger
ALTER TABLE products ENABLE TRIGGER update_products_updated_at;

-- You can test import here, then enable more triggers one by one:
-- ALTER TABLE products ENABLE TRIGGER product_change_tracking;
-- ALTER TABLE products ENABLE TRIGGER protect_stock_updates_trigger;
-- ALTER TABLE products ENABLE TRIGGER update_product_count_delete;
-- ALTER TABLE products ENABLE TRIGGER update_product_count_insert;
-- ALTER TABLE products ENABLE TRIGGER update_product_count_update;
-- ALTER TABLE products ENABLE TRIGGER update_product_stock_status;
-- ALTER TABLE products ENABLE TRIGGER products_slug_trigger;