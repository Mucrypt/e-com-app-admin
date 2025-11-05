-- Disable only custom triggers, not system triggers
-- First, let's see what triggers we have
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'products'
AND trigger_name NOT LIKE 'RI_ConstraintTrigger%';

-- Disable custom triggers one by one (not system triggers)
-- Note: Remove IF EXISTS as it's not supported with DISABLE TRIGGER
ALTER TABLE products DISABLE TRIGGER generate_slug_trigger;
ALTER TABLE products DISABLE TRIGGER product_change_tracking;
ALTER TABLE products DISABLE TRIGGER products_slug_trigger;
ALTER TABLE products DISABLE TRIGGER protect_stock_updates_trigger;
ALTER TABLE products DISABLE TRIGGER update_product_count_delete;
ALTER TABLE products DISABLE TRIGGER update_product_count_insert;
ALTER TABLE products DISABLE TRIGGER update_product_count_update;
ALTER TABLE products DISABLE TRIGGER update_product_stock_status;
ALTER TABLE products DISABLE TRIGGER update_products_updated_at;