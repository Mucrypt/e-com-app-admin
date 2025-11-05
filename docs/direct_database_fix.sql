-- DIRECT DATABASE FIX for Job #2 UUID Issue
-- This bypasses the API and works directly with the database

-- First, let's see what we're dealing with
SELECT 'Current Jobs with ID Types:' as info;
SELECT 
    id,
    pg_typeof(id) as id_type,
    status,
    created_at,
    CASE 
        WHEN id::text ~ '^[0-9]+$' THEN 'Looks like integer'
        WHEN id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 'Valid UUID'
        ELSE 'Other format'
    END as id_format
FROM scraping_jobs 
ORDER BY created_at DESC;

-- Method 1: Use a subquery to find the problematic job
DELETE FROM scraping_jobs 
WHERE id IN (
    SELECT id FROM scraping_jobs 
    WHERE id::text = '2'
);

-- Method 2: If the ID column is actually UUID type but contains invalid data,
-- we need to use a different approach
DELETE FROM scraping_jobs 
WHERE EXISTS (
    SELECT 1 
    FROM scraping_jobs s2 
    WHERE s2.id::text = '2' 
    AND s2.id = scraping_jobs.id
);

-- Method 3: Direct row deletion using ctid (physical row identifier)
DELETE FROM scraping_jobs 
WHERE ctid IN (
    SELECT ctid FROM scraping_jobs 
    WHERE id::text = '2'
);

-- Clean up any remaining stuck jobs
UPDATE scraping_jobs 
SET status = 'failed'
WHERE status = 'processing' 
AND created_at < NOW() - INTERVAL '10 minutes';

-- Final verification
SELECT 'Final Check:' as result;
SELECT 
    CASE 
        WHEN EXISTS(SELECT 1 FROM scraping_jobs WHERE id::text = '2') 
        THEN 'Job #2 STILL EXISTS - Manual intervention needed'
        ELSE 'SUCCESS: Job #2 has been deleted!'
    END as deletion_result;

-- Show remaining jobs
SELECT 'Remaining Jobs:' as info;
SELECT id, status, created_at FROM scraping_jobs ORDER BY created_at DESC;