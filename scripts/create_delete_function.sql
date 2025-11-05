-- Create a database function to handle problematic job deletions
-- This function will work with both UUID and text-based IDs

CREATE OR REPLACE FUNCTION delete_job_by_text_id(job_id text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Try to delete by casting the column to text for comparison
    DELETE FROM scraping_jobs WHERE id::text = job_id;
    
    -- If no rows affected, try other methods
    IF NOT FOUND THEN
        -- Try direct comparison (for when job_id is already proper format)
        DELETE FROM scraping_jobs WHERE id = job_id::uuid;
    EXCEPTION 
        WHEN invalid_text_representation THEN
            -- If UUID conversion fails, the job_id is not a valid UUID
            -- This means the row probably has a non-UUID id, so delete by text comparison
            DELETE FROM scraping_jobs WHERE id::text = job_id;
    END IF;
END;
$$;