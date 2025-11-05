-- Fix the slug generation function to avoid array operation errors

-- First, let's drop the existing trigger and function
DROP TRIGGER IF EXISTS products_slug_trigger ON products;
DROP FUNCTION IF EXISTS generate_product_slug();

-- Create a simpler, more robust slug generation function
CREATE OR REPLACE FUNCTION generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate slug if it's NULL or empty
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    -- Clean the name: remove special characters, convert to lowercase, replace spaces with hyphens
    NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9\s]', '', 'g'));
    NEW.slug := REGEXP_REPLACE(NEW.slug, '\s+', '-', 'g');
    NEW.slug := TRIM(BOTH '-' FROM NEW.slug);
    
    -- If slug is still empty, use a default
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
      NEW.slug := 'product';
    END IF;
    
    -- Check for uniqueness and append number if needed
    DECLARE
      base_slug TEXT := NEW.slug;
      counter INTEGER := 1;
      temp_slug TEXT := NEW.slug;
      slug_exists BOOLEAN;
    BEGIN
      LOOP
        -- Check if this slug exists (excluding current record)
        SELECT EXISTS(
          SELECT 1 FROM products 
          WHERE slug = temp_slug 
          AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
        ) INTO slug_exists;
        
        -- If slug doesn't exist, use it
        IF NOT slug_exists THEN
          NEW.slug := temp_slug;
          EXIT;
        END IF;
        
        -- Otherwise, try with a number suffix
        counter := counter + 1;
        temp_slug := base_slug || '-' || counter::TEXT;
        
        -- Safety exit after 1000 attempts
        IF counter > 1000 THEN
          NEW.slug := base_slug || '-' || EXTRACT(EPOCH FROM NOW())::INTEGER::TEXT;
          EXIT;
        END IF;
      END LOOP;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER products_slug_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION generate_product_slug();

-- Update existing products to have slugs (this will trigger the function)
UPDATE products 
SET updated_at = NOW()
WHERE slug IS NULL;