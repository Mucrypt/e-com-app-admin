# Product Scraper System - Setup & Usage Guide

## Overview

The Product Scraper is a comprehensive web scraping tool designed for importing products from major e-commerce platforms for dropshipping businesses. It supports multiple platforms including Amazon, Alibaba, AliExpress, eBay, Walmart, and Shopify stores.

## Features

### 🔍 Multi-Platform Support
- **Amazon**: Product pages, variant detection, pricing info
- **Alibaba**: Wholesale products, supplier information
- **AliExpress**: Consumer products, ratings and reviews
- **eBay**: Auction and buy-it-now listings
- **Walmart**: Product catalog items
- **Shopify**: Independent store products
- **Generic**: Fallback for other e-commerce sites

### 🛠 Core Capabilities
- ✅ URL validation and platform detection
- ✅ Batch scraping (up to 50 URLs per job)
- ✅ Product data extraction (title, description, price, images, etc.)
- ✅ Image validation and processing
- ✅ Real-time progress tracking
- ✅ Error handling and retry logic
- ✅ Product preview and editing
- ✅ Bulk import to store catalog
- ✅ Job history and management

## System Architecture

```
Frontend (React/TypeScript)
├── SuperAdmin Sidebar Navigation
├── Product Scraper Page (Tabs: Scrape, Jobs, Products)
├── Product Preview Component
└── Toast Notifications

Backend APIs
├── /api/scraper/validate - URL validation
├── /api/scraper/extract - Product data extraction (mock)
├── /api/scraper/scrape - Batch scraping jobs
└── /api/scraper/jobs - Job management

Services
├── ProductScraperService - Core scraping logic
├── Platform Configurations - Site-specific selectors
└── Data Normalization - Clean and format scraped data

Types
└── scraper.types.ts - TypeScript interfaces
```

## Getting Started

### 1. Access the Scraper
1. Login to SuperAdmin panel
2. Navigate to **Content > Product Scraper**
3. You'll see three main tabs:
   - **New Scraping Job**: Start new scraping operations
   - **Scraping Jobs**: View and manage job history
   - **Scraped Products**: Review and import products

### 2. Start Your First Scraping Job

#### Step 1: Add Product URLs
- Click the "New Scraping Job" tab
- Enter product URLs in the input fields
- Click "Add URL" to add more URLs (max 50 per job)
- Supported URL formats:
  ```
  Amazon: https://amazon.com/dp/PRODUCT_ID
  Alibaba: https://alibaba.com/product-detail/PRODUCT_ID
  AliExpress: https://aliexpress.com/item/PRODUCT_ID.html
  eBay: https://ebay.com/itm/PRODUCT_ID
  Walmart: https://walmart.com/ip/PRODUCT_ID
  Shopify: https://store.myshopify.com/products/PRODUCT_NAME
  ```

#### Step 2: Configure Settings
- **Auto Import Products**: Import successful scrapes automatically
- **Default Product Status**: Set as 'Draft' or 'Active'
- **Max Images per Product**: Limit images (1-20)
- **Validate Images**: Check image accessibility
- **Exclude Out of Stock**: Skip unavailable products

#### Step 3: Start Scraping
- Click "Start Scraping" button
- Job will be created and processed in background
- Switch to "Scraping Jobs" tab to monitor progress

### 3. Monitor Scraping Jobs

The Jobs tab shows:
- **Job Status**: Pending, Processing, Completed, Failed
- **Progress**: URLs processed, successes, failures
- **Platform**: Detected e-commerce platform
- **Timestamps**: Created and completion times
- **Actions**: View details, delete job

### 4. Review and Import Products

After scraping completes:
1. Go to "Scraped Products" tab
2. Click on products to preview
3. Edit product details if needed
4. Select target category
5. Set price markup percentage
6. Click "Import to Store"

## Platform-Specific Guidelines

### Amazon
- Use direct product URLs with `/dp/` or `/gp/product/`
- Remove tracking parameters (ref=, tag=) for cleaner URLs
- Works best with main product pages, not variants

### Alibaba
- Use product detail pages with `/product-detail/`
- Wholesale pricing may show ranges
- Supplier information included when available

### AliExpress
- Individual product URLs with `/item/`
- Avoid category or search result URLs
- Handles variants and specifications well

### eBay
- Works with both auction and Buy It Now listings
- May include bidding information for auctions
- Best-effort extraction for varied listing formats

### Walmart
- Use product pages with `/ip/` identifier
- Generally reliable product data
- Good image and specification extraction

### Shopify Stores
- Works with most Shopify-powered stores
- Product URLs typically `/products/product-name`
- Varies by store customization

## Best Practices

### URL Selection
- ✅ Use direct product page URLs
- ✅ Test URLs manually first
- ✅ Remove unnecessary parameters
- ❌ Avoid category/search pages
- ❌ Don't use mobile URLs (m.amazon.com)

### Scraping Settings
- Start with **Auto Import: OFF** for review
- Use **Max Images: 5** for faster processing
- Enable **Validate Images** for quality
- Set **Default Status: Draft** for safety

### Rate Limiting
- Keep batch sizes reasonable (10-20 URLs)
- Allow time between large jobs
- Monitor for platform blocking

### Data Quality
- Review scraped data before importing
- Edit titles and descriptions as needed
- Verify pricing and availability
- Check image quality and relevance

## Troubleshooting

### Common Issues

#### URLs Not Validating
- Check URL format and platform support
- Ensure URL is accessible publicly
- Remove tracking parameters

#### Scraping Failures
- Platform may be blocking requests
- URL may be invalid or expired
- Network connectivity issues

#### Missing Product Data
- Some platforms have anti-scraping measures
- Product page structure may have changed
- Limited data available on source page

#### Import Failures
- Check required fields (title, category)
- Verify category selection
- Ensure product data is complete

### Error Codes
- **400**: Invalid URL format
- **401**: Authentication required
- **429**: Rate limit exceeded
- **500**: Server/extraction error

## Development Notes

### Current Implementation
The current system uses **mock data extraction** for development and testing. The actual scraping logic is simulated to demonstrate the complete workflow.

### Production Deployment
For production use, you would need to implement:

1. **Real Scraping Engine**:
   ```bash
   npm install puppeteer playwright
   # or use third-party services like ScrapingBee, Apify
   ```

2. **Database Tables**:
   ```sql
   CREATE TABLE scraping_jobs (
     id UUID PRIMARY KEY,
     urls TEXT[],
     status VARCHAR(50),
     created_by UUID,
     settings JSONB,
     results JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE scraped_products (
     id UUID PRIMARY KEY,
     job_id UUID REFERENCES scraping_jobs(id),
     title TEXT NOT NULL,
     description TEXT,
     price DECIMAL,
     images TEXT[],
     source_url TEXT,
     source_platform VARCHAR(50),
     product_data JSONB,
     scraped_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Queue System**:
   ```typescript
   // Use Bull, Agenda, or similar for background processing
   import Bull from 'bull';
   const scrapingQueue = new Bull('scraping jobs');
   ```

4. **Proxy/Anti-Detection**:
   ```typescript
   // Rotating proxies, user agents, delays
   const proxyList = ['proxy1:port', 'proxy2:port'];
   const userAgents = ['Mozilla/5.0...', 'Chrome/91.0...'];
   ```

### Legal Considerations
- Respect robots.txt files
- Implement reasonable delays
- Don't overload target servers
- Check platform terms of service
- Consider API alternatives when available

## API Documentation

### POST /api/scraper/validate
Validate and detect platform from URL.

**Request**:
```json
{
  "url": "https://amazon.com/dp/B08N5WRWNW"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "valid": true,
    "platform": "amazon",
    "suggestions": ["Remove tracking parameters for cleaner URLs"]
  }
}
```

### POST /api/scraper/scrape
Start batch scraping job.

**Request**:
```json
{
  "urls": ["https://amazon.com/dp/PRODUCT1", "https://alibaba.com/product-detail/PRODUCT2"],
  "settings": {
    "auto_import": false,
    "default_status": "draft",
    "max_images": 5,
    "validate_images": true,
    "exclude_out_of_stock": true
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "job_id": "uuid-here",
    "status": "processing",
    "total_urls": 2,
    "message": "Scraping job started successfully"
  }
}
```

### GET /api/scraper/jobs
List scraping jobs with filters.

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status (all, pending, processing, completed, failed)
- `platform`: Filter by platform

**Response**:
```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

## Support

For technical support or feature requests:
1. Check this documentation first
2. Review error messages and logs
3. Test with smaller batches
4. Contact development team

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Status**: Development/Testing Phase