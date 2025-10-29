@echo off
echo 🚀 Building E-commerce Admin Application...

REM Load environment variables from .env.local
for /f "usebackq tokens=1,2 delims==" %%a in (".env.local") do (
    set %%a=%%b
)

REM Build Docker image
docker build ^
  --build-arg NEXT_PUBLIC_SUPABASE_URL=%NEXT_PUBLIC_SUPABASE_URL% ^
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=%NEXT_PUBLIC_SUPABASE_ANON_KEY% ^
  --build-arg NEXT_PUBLIC_SITE_URL=%NEXT_PUBLIC_SITE_URL% ^
  --build-arg CLOUDINARY_CLOUD_NAME=%CLOUDINARY_CLOUD_NAME% ^
  --build-arg CLOUDINARY_API_KEY=%CLOUDINARY_API_KEY% ^
  --build-arg CLOUDINARY_API_SECRET=%CLOUDINARY_API_SECRET% ^
  --build-arg OPENAI_API_KEY=%OPENAI_API_KEY% ^
  -t ecom-admin:latest .

echo ✅ Build completed successfully!
pause