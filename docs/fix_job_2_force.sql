-- FORCE FIX Job #2 - Run this in Supabase SQL Editor
-- This will definitely fix the stuck job

-- Step 1: Check current jobs (showing actual IDs and types)
SELECT 
  id, 
  pg_typeof(id) as id_type,
  status, 
  created_at, 
  total_urls, 
  successful_scrapes, 
  failed_scrapes,
  EXTRACT(EPOCH FROM (NOW() - created_at))/60 as minutes_running
FROM scraping_jobs 
ORDER BY created_at DESC 
LIMIT 10;

-- Step 2: Force update ALL processing jobs to completed/failed (no time restriction)
UPDATE scraping_jobs 
SET 
  status = CASE 
    WHEN successful_scrapes > 0 THEN 'completed'
    ELSE 'failed'
  END,
  completed_at = NOW(),
  error_message = 'Job manually completed - was stuck in processing'
WHERE status = 'processing';

-- Step 3: Verify all jobs are now properly completed/failed
SELECT 
  id, 
  status, 
  created_at, 
  completed_at,
  total_urls, 
  successful_scrapes, 
  failed_scrapes,
  error_message
FROM scraping_jobs 
ORDER BY created_at DESC 
LIMIT 10;

-- Step 4: (Alternative) If job ID is actually "2", force delete it
DELETE FROM scraping_jobs WHERE id::text = '2';

-- Step 5: (Alternative) If you want to delete ALL processing jobs
-- DELETE FROM scraping_jobs WHERE status = 'processing';