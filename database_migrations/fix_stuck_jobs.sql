-- Fix stuck scraping jobs
-- First, let's see what jobs are currently stuck in processing
SELECT id, status, created_at, total_urls, processed_urls, successful_scrapes, failed_scrapes
FROM scraping_jobs 
WHERE status = 'processing' 
ORDER BY created_at DESC;

-- Update stuck processing jobs to completed or failed based on their state
-- For jobs that have processed some URLs but are stuck
UPDATE scraping_jobs 
SET 
  status = CASE 
    WHEN successful_scrapes > 0 THEN 'completed'
    WHEN failed_scrapes = total_urls THEN 'failed'
    ELSE 'failed'
  END,
  completed_at = NOW()
WHERE status = 'processing' 
  AND created_at < NOW() - INTERVAL '10 minutes'; -- Jobs older than 10 minutes

-- Check the results
SELECT id, status, created_at, completed_at, total_urls, processed_urls, successful_scrapes, failed_scrapes
FROM scraping_jobs 
ORDER BY created_at DESC;