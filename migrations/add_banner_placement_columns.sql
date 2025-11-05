-- Add placement and placement_priority columns to banners table
-- Migration: Add banner placement management

-- Add placement column with enum type
ALTER TABLE banners 
ADD COLUMN placement TEXT CHECK (placement IN (
  'homepage_hero',
  'homepage_grid', 
  'category_page_top',
  'category_page_inline',
  'product_page',
  'checkout',
  'general'
));

-- Add placement_priority column
ALTER TABLE banners 
ADD COLUMN placement_priority INTEGER DEFAULT 1;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_banners_placement ON banners(placement);
CREATE INDEX IF NOT EXISTS idx_banners_placement_priority ON banners(placement, placement_priority);

-- Update existing banners to have a default placement
UPDATE banners 
SET placement = 'general' 
WHERE placement IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN banners.placement IS 'Defines where the banner should be displayed on the website';
COMMENT ON COLUMN banners.placement_priority IS 'Priority order within the placement (lower number = higher priority)';