-- Check the actual schema of scraping_jobs table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'scraping_jobs' 
ORDER BY ordinal_position;

-- Check current jobs and their ID types
SELECT 
    id,
    pg_typeof(id) as id_type,
    status,
    created_at,
    products_count
FROM scraping_jobs 
ORDER BY created_at DESC;

-- Check if there are any non-UUID IDs
SELECT 
    id,
    CASE 
        WHEN id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
        THEN 'UUID format'
        ELSE 'Non-UUID format'
    END as id_format
FROM scraping_jobs;