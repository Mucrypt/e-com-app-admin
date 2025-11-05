-- Simple migration to add placement columns to banners table
-- Run this in your Supabase SQL editor

-- Add placement column
ALTER TABLE banners ADD COLUMN placement TEXT;

-- Add placement_priority column  
ALTER TABLE banners ADD COLUMN placement_priority INTEGER DEFAULT 1;

-- Add indexes for performance
CREATE INDEX idx_banners_placement ON banners(placement);
CREATE INDEX idx_banners_placement_priority ON banners(placement, placement_priority);

-- Set default placement for existing banners
UPDATE banners SET placement = 'general' WHERE placement IS NULL;