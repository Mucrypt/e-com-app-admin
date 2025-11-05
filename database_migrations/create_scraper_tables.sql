-- Create scraped_products table for storing scraped product data
CREATE TABLE IF NOT EXISTS scraped_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    images TEXT[] DEFAULT '{}',
    rating DECIMAL(2,1),
    review_count INTEGER,
    brand VARCHAR(255),
    category VARCHAR(255),
    availability VARCHAR(50),
    source_url TEXT NOT NULL UNIQUE,
    source_platform VARCHAR(50) NOT NULL,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    imported_at TIMESTAMP WITH TIME ZONE,
    product_id UUID REFERENCES products(id),
    specifications JSONB DEFAULT '{}',
    discount_percentage INTEGER,
    sku VARCHAR(255),
    weight DECIMAL(8,2),
    dimensions JSONB,
    shipping_info JSONB,
    seller_info JSONB,
    variants JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scraping_jobs table for tracking scraping operations
CREATE TABLE IF NOT EXISTS scraping_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    urls TEXT[] NOT NULL,
    platform VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    total_urls INTEGER NOT NULL DEFAULT 0,
    processed_urls INTEGER DEFAULT 0,
    successful_scrapes INTEGER DEFAULT 0,
    failed_scrapes INTEGER DEFAULT 0,
    imported_products INTEGER DEFAULT 0,
    results JSONB DEFAULT '[]',
    error_message TEXT,
    settings JSONB DEFAULT '{}'
);

-- Create imported_products table for tracking imports
CREATE TABLE IF NOT EXISTS imported_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scraped_product_id UUID REFERENCES scraped_products(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    import_job_id UUID REFERENCES scraping_jobs(id),
    imported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'imported',
    modifications JSONB DEFAULT '{}',
    error_message TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scraped_products_source_platform ON scraped_products(source_platform);
CREATE INDEX IF NOT EXISTS idx_scraped_products_scraped_at ON scraped_products(scraped_at);
CREATE INDEX IF NOT EXISTS idx_scraped_products_imported_at ON scraped_products(imported_at);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status ON scraping_jobs(status);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_created_by ON scraping_jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_created_at ON scraping_jobs(created_at);

-- Create updated_at trigger for scraped_products
CREATE OR REPLACE FUNCTION update_scraped_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scraped_products_updated_at
    BEFORE UPDATE ON scraped_products
    FOR EACH ROW
    EXECUTE PROCEDURE update_scraped_products_updated_at();

-- Add RLS policies for security
ALTER TABLE scraped_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE imported_products ENABLE ROW LEVEL SECURITY;

-- Policy for scraped_products: Users can only see their own scraped products
CREATE POLICY "Users can view their own scraped products" ON scraped_products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM scraping_jobs 
            WHERE scraping_jobs.id IN (
                SELECT UNNEST(ARRAY(SELECT jsonb_array_elements_text(results::jsonb -> 'job_id')))::UUID
            ) 
            AND scraping_jobs.created_by = auth.uid()
        )
    );

-- Policy for scraping_jobs: Users can only see their own jobs
CREATE POLICY "Users can view their own scraping jobs" ON scraping_jobs
    FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create their own scraping jobs" ON scraping_jobs
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own scraping jobs" ON scraping_jobs
    FOR UPDATE USING (created_by = auth.uid());

-- Policy for imported_products: Users can see imports they created
CREATE POLICY "Users can view their own imported products" ON imported_products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM scraping_jobs 
            WHERE scraping_jobs.id = imported_products.import_job_id 
            AND scraping_jobs.created_by = auth.uid()
        )
    );

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON scraped_products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON scraping_jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON imported_products TO authenticated;