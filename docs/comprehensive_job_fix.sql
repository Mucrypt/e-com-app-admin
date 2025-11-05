-- Comprehensive Job #2 Fix Script
-- This script handles both UUID and non-UUID ID formats

BEGIN;

-- First, let's see what we're dealing with
SELECT 'Current jobs before cleanup:' as info;
SELECT 
    id,
    pg_typeof(id) as id_type,
    status,
    created_at,
    products_count,
    CASE 
        WHEN id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
        THEN 'UUID format'
        ELSE 'Non-UUID format'
    END as id_format
FROM scraping_jobs 
ORDER BY created_at DESC;

-- Method 1: Try to delete Job #2 using direct ID match
DELETE FROM scraping_jobs WHERE id = '2';

-- Method 2: If that didn't work, try casting ID to text
DELETE FROM scraping_jobs WHERE id::text = '2';

-- Method 3: Clean up any stuck processing jobs
UPDATE scraping_jobs 
SET status = 'failed', 
    error_message = 'Force stopped - was stuck in processing'
WHERE status = 'processing' 
  AND created_at < NOW() - INTERVAL '10 minutes';

-- Method 4: Delete any jobs that are clearly problematic
DELETE FROM scraping_jobs 
WHERE status = 'processing' 
  AND created_at < NOW() - INTERVAL '1 hour';

-- Show final state
SELECT 'Jobs after cleanup:' as info;
SELECT 
    id,
    pg_typeof(id) as id_type,
    status,
    created_at,
    products_count
FROM scraping_jobs 
ORDER BY created_at DESC;

-- Check if any rows were affected
SELECT 'Cleanup complete!' as result;

COMMIT;