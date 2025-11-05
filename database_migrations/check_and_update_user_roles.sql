-- Check current user roles and update to SUPERADMIN if needed

-- First, let's see what users exist and their current roles
SELECT id, email, role, created_at 
FROM users 
ORDER BY created_at DESC;

-- To update a specific user to SUPERADMIN role, use one of these queries:

-- Option 1: Update by email (replace 'your-email@example.com' with your actual email)
-- UPDATE users 
-- SET role = 'superadmin' 
-- WHERE email = 'your-email@example.com';

-- Option 2: Update the most recent user (if that's you)
-- UPDATE users 
-- SET role = 'superadmin' 
-- WHERE id = (SELECT id FROM users ORDER BY created_at DESC LIMIT 1);

-- Option 3: Update a specific user by ID (replace with your actual user ID)
-- UPDATE users 
-- SET role = 'superadmin' 
-- WHERE id = 'your-user-id-here';

-- After updating, verify the change:
-- SELECT id, email, role 
-- FROM users 
-- WHERE role = 'superadmin';