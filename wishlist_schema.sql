-- Enhanced Wishlist Schema for Supabase
-- Drop existing favorites table and create comprehensive wishlist system

-- Drop existing favorites table (if you want to replace it)
-- DROP TABLE IF EXISTS public.favorites;

-- Create wishlist_collections table for organizing wishlists
CREATE TABLE public.wishlist_collections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NULL,
  emoji text NULL DEFAULT '❤️',
  color text NULL DEFAULT '#ff6b9d',
  is_public boolean NULL DEFAULT false,
  is_default boolean NULL DEFAULT false,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  is_deleted boolean NULL DEFAULT false,
  CONSTRAINT wishlist_collections_pkey PRIMARY KEY (id),
  CONSTRAINT wishlist_collections_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Create wishlist_items table for individual wishlist items
CREATE TABLE public.wishlist_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  collection_id uuid NULL,
  notes text NULL,
  priority integer NULL DEFAULT 1, -- 1=low, 2=medium, 3=high
  price_alert_threshold numeric(10, 2) NULL,
  is_purchased boolean NULL DEFAULT false,
  purchased_at timestamp with time zone NULL,
  quantity_wanted integer NULL DEFAULT 1,
  added_from text NULL, -- track where item was added from (product page, category, etc.)
  tags text[] NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  is_deleted boolean NULL DEFAULT false,
  CONSTRAINT wishlist_items_pkey PRIMARY KEY (id),
  CONSTRAINT wishlist_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT wishlist_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT wishlist_items_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES wishlist_collections (id) ON DELETE SET NULL,
  CONSTRAINT wishlist_items_priority_check CHECK (priority >= 1 AND priority <= 3),
  CONSTRAINT wishlist_items_quantity_check CHECK (quantity_wanted > 0),
  CONSTRAINT wishlist_items_unique_user_product UNIQUE (user_id, product_id)
);

-- Create wishlist_shares table for sharing wishlists
CREATE TABLE public.wishlist_shares (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL,
  shared_by uuid NOT NULL,
  shared_with uuid NULL, -- NULL means public share
  share_token text NOT NULL UNIQUE,
  permissions text[] NULL DEFAULT ARRAY['view'], -- view, comment, edit
  expires_at timestamp with time zone NULL,
  view_count integer NULL DEFAULT 0,
  last_viewed_at timestamp with time zone NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  is_active boolean NULL DEFAULT true,
  CONSTRAINT wishlist_shares_pkey PRIMARY KEY (id),
  CONSTRAINT wishlist_shares_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES wishlist_collections (id) ON DELETE CASCADE,
  CONSTRAINT wishlist_shares_shared_by_fkey FOREIGN KEY (shared_by) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT wishlist_shares_shared_with_fkey FOREIGN KEY (shared_with) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Create wishlist_price_history table for tracking price changes
CREATE TABLE public.wishlist_price_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  wishlist_item_id uuid NOT NULL,
  old_price numeric(10, 2) NULL,
  new_price numeric(10, 2) NOT NULL,
  price_change_percent numeric(5, 2) NULL,
  recorded_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT wishlist_price_history_pkey PRIMARY KEY (id),
  CONSTRAINT wishlist_price_history_wishlist_item_id_fkey FOREIGN KEY (wishlist_item_id) REFERENCES wishlist_items (id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlist_collections_user_id ON public.wishlist_collections USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_collections_is_public ON public.wishlist_collections USING btree (is_public);
CREATE INDEX IF NOT EXISTS idx_wishlist_collections_is_default ON public.wishlist_collections USING btree (is_default);
CREATE INDEX IF NOT EXISTS idx_wishlist_collections_is_deleted ON public.wishlist_collections USING btree (is_deleted);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON public.wishlist_items USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON public.wishlist_items USING btree (product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_collection_id ON public.wishlist_items USING btree (collection_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_priority ON public.wishlist_items USING btree (priority);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_is_purchased ON public.wishlist_items USING btree (is_purchased);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_created_at ON public.wishlist_items USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_is_deleted ON public.wishlist_items USING btree (is_deleted);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_tags ON public.wishlist_items USING gin (tags);

CREATE INDEX IF NOT EXISTS idx_wishlist_shares_collection_id ON public.wishlist_shares USING btree (collection_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_shares_shared_by ON public.wishlist_shares USING btree (shared_by);
CREATE INDEX IF NOT EXISTS idx_wishlist_shares_shared_with ON public.wishlist_shares USING btree (shared_with);
CREATE INDEX IF NOT EXISTS idx_wishlist_shares_share_token ON public.wishlist_shares USING btree (share_token);
CREATE INDEX IF NOT EXISTS idx_wishlist_shares_is_active ON public.wishlist_shares USING btree (is_active);

CREATE INDEX IF NOT EXISTS idx_wishlist_price_history_wishlist_item_id ON public.wishlist_price_history USING btree (wishlist_item_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_price_history_recorded_at ON public.wishlist_price_history USING btree (recorded_at);

-- Create functions for wishlist management

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_wishlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create default wishlist collection for new users
CREATE OR REPLACE FUNCTION create_default_wishlist_collection()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wishlist_collections (name, description, is_default, user_id)
  VALUES ('My Wishlist', 'Your default wishlist collection', true, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to track price changes
CREATE OR REPLACE FUNCTION track_wishlist_price_changes()
RETURNS TRIGGER AS $$
DECLARE
  current_price numeric(10, 2);
  price_change_percent numeric(5, 2);
BEGIN
  -- Get current product price
  SELECT price INTO current_price FROM products WHERE id = NEW.product_id;
  
  -- Only track if we have a price alert threshold and price has changed
  IF NEW.price_alert_threshold IS NOT NULL AND OLD.price_alert_threshold IS NOT NULL THEN
    IF current_price != OLD.price_alert_threshold THEN
      -- Calculate percentage change
      IF OLD.price_alert_threshold > 0 THEN
        price_change_percent := ((current_price - OLD.price_alert_threshold) / OLD.price_alert_threshold) * 100;
      END IF;
      
      -- Insert price history record
      INSERT INTO public.wishlist_price_history (
        wishlist_item_id, 
        old_price, 
        new_price, 
        price_change_percent
      )
      VALUES (NEW.id, OLD.price_alert_threshold, current_price, price_change_percent);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate share tokens
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_token IS NULL OR NEW.share_token = '' THEN
    NEW.share_token := encode(gen_random_bytes(16), 'base64url');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_wishlist_collections_updated_at
  BEFORE UPDATE ON wishlist_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_wishlist_updated_at();

CREATE TRIGGER update_wishlist_items_updated_at
  BEFORE UPDATE ON wishlist_items
  FOR EACH ROW
  EXECUTE FUNCTION update_wishlist_updated_at();

-- Create trigger for default wishlist creation (optional - uncomment if you want automatic default wishlist)
-- CREATE TRIGGER create_user_default_wishlist
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION create_default_wishlist_collection();

CREATE TRIGGER track_price_changes_trigger
  BEFORE UPDATE ON wishlist_items
  FOR EACH ROW
  EXECUTE FUNCTION track_wishlist_price_changes();

CREATE TRIGGER generate_share_token_trigger
  BEFORE INSERT ON wishlist_shares
  FOR EACH ROW
  EXECUTE FUNCTION generate_share_token();

-- Enable Row Level Security (RLS)
ALTER TABLE public.wishlist_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_price_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Wishlist Collections Policies
CREATE POLICY "Users can view their own collections" ON public.wishlist_collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public collections" ON public.wishlist_collections
  FOR SELECT USING (is_public = true AND is_deleted = false);

CREATE POLICY "Users can create their own collections" ON public.wishlist_collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections" ON public.wishlist_collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections" ON public.wishlist_collections
  FOR DELETE USING (auth.uid() = user_id);

-- Wishlist Items Policies
CREATE POLICY "Users can view their own wishlist items" ON public.wishlist_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wishlist items" ON public.wishlist_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlist items" ON public.wishlist_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items" ON public.wishlist_items
  FOR DELETE USING (auth.uid() = user_id);

-- Wishlist Shares Policies
CREATE POLICY "Users can view shares they created" ON public.wishlist_shares
  FOR SELECT USING (auth.uid() = shared_by);

CREATE POLICY "Users can view shares directed to them" ON public.wishlist_shares
  FOR SELECT USING (auth.uid() = shared_with);

CREATE POLICY "Users can create shares for their collections" ON public.wishlist_shares
  FOR INSERT WITH CHECK (
    auth.uid() = shared_by AND 
    EXISTS (
      SELECT 1 FROM wishlist_collections 
      WHERE id = collection_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own shares" ON public.wishlist_shares
  FOR UPDATE USING (auth.uid() = shared_by);

CREATE POLICY "Users can delete their own shares" ON public.wishlist_shares
  FOR DELETE USING (auth.uid() = shared_by);

-- Price History Policies
CREATE POLICY "Users can view price history for their items" ON public.wishlist_price_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM wishlist_items 
      WHERE id = wishlist_item_id AND user_id = auth.uid()
    )
  );

-- Create helpful views

-- View for wishlist items with product details
CREATE OR REPLACE VIEW wishlist_items_with_products AS
SELECT 
  wi.*,
  p.name as product_name,
  p.description as product_description,
  p.price as current_price,
  p.original_price,
  p.image_url,
  p.images,
  p.brand,
  p.in_stock,
  p.rating,
  p.review_count,
  p.is_on_sale,
  c.name as category_name,
  wc.name as collection_name,
  wc.color as collection_color,
  wc.emoji as collection_emoji,
  -- Calculate if price has dropped below alert threshold
  CASE 
    WHEN wi.price_alert_threshold IS NOT NULL AND p.price <= wi.price_alert_threshold 
    THEN true 
    ELSE false 
  END as price_alert_triggered,
  -- Calculate savings if there's an original price
  CASE 
    WHEN p.original_price IS NOT NULL AND p.original_price > p.price 
    THEN p.original_price - p.price 
    ELSE 0 
  END as potential_savings
FROM wishlist_items wi
LEFT JOIN products p ON wi.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN wishlist_collections wc ON wi.collection_id = wc.id
WHERE wi.is_deleted = false AND p.is_active = true;

-- View for collection stats
CREATE OR REPLACE VIEW wishlist_collection_stats AS
SELECT 
  wc.*,
  COUNT(wi.id) as item_count,
  COUNT(CASE WHEN wi.is_purchased = true THEN 1 END) as purchased_count,
  COUNT(CASE WHEN p.in_stock = true THEN 1 END) as in_stock_count,
  COUNT(CASE WHEN p.is_on_sale = true THEN 1 END) as on_sale_count,
  COALESCE(SUM(p.price), 0) as total_value,
  COALESCE(SUM(CASE WHEN p.original_price IS NOT NULL THEN p.original_price - p.price ELSE 0 END), 0) as total_savings
FROM wishlist_collections wc
LEFT JOIN wishlist_items wi ON wc.id = wi.collection_id AND wi.is_deleted = false
LEFT JOIN products p ON wi.product_id = p.id AND p.is_active = true
WHERE wc.is_deleted = false
GROUP BY wc.id, wc.name, wc.description, wc.emoji, wc.color, wc.is_public, wc.is_default, wc.user_id, wc.created_at, wc.updated_at, wc.is_deleted;

-- Grant necessary permissions
GRANT ALL ON public.wishlist_collections TO authenticated;
GRANT ALL ON public.wishlist_items TO authenticated;
GRANT ALL ON public.wishlist_shares TO authenticated;
GRANT ALL ON public.wishlist_price_history TO authenticated;
GRANT SELECT ON public.wishlist_items_with_products TO authenticated;
GRANT SELECT ON public.wishlist_collection_stats TO authenticated;