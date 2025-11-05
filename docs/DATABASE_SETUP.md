# Database Setup for Product Scraper

## Prerequisites

Before using the scraper functionality, you need to set up the database tables for storing scraped products.

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database_migrations/create_scraper_tables.sql`
4. Run the SQL query

## Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Install Supabase CLI
curl -fsSL https://get.supabase.com/install/linux | sh

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migration
supabase db push
```

## Option 3: Manual Installation

Run these SQL commands in your Supabase SQL editor:

```sql
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
```

## After Migration

1. Run the type generation command:
```bash
npx supabase gen types typescript --project-id "YOUR_PROJECT_ID" --schema public > src/supabase/types.ts
```

2. Restart your development server:
```bash
npm run dev
```

## Features Available After Setup

- ✅ Real web scraping using Puppeteer
- ✅ Store scraped products in database
- ✅ Import scraped products to main catalog
- ✅ Track scraping jobs and progress
- ✅ Bulk import functionality
- ✅ Product management interface

## Troubleshooting

### Tables not showing up
- Make sure you ran the migration SQL
- Check that your Supabase project is properly connected
- Verify RLS policies are enabled for your user

### TypeScript errors
- Regenerate types after adding tables
- Restart your development server
- Clear Next.js cache: `rm -rf .next`

### Permission errors
- Ensure your user has the proper role (admin/superadmin)
- Check RLS policies in Supabase dashboard
- Verify authentication is working properly