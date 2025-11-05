# Cloudinary Setup Guide

## Overview
This guide will help you set up Cloudinary for your e-commerce application to enable proper image uploads and eliminate placeholder images.

## Prerequisites
1. A Cloudinary account (free tier available)
2. Access to your project's environment variables

## Step 1: Create Cloudinary Account
1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. Complete the email verification process

## Step 2: Get Your Cloudinary Credentials
1. After logging in, go to your Dashboard
2. You'll see your account details:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (keep this private)

## Step 3: Create Upload Preset
1. In your Cloudinary Dashboard, go to **Settings** > **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `product-images` (or any name you prefer)
   - **Signing Mode**: Choose "Unsigned" for easier setup
   - **Folder**: `products` (optional, for organization)
   - **Format**: Auto
   - **Quality**: Auto
   - **Transformation**: Optional (you can add resize/crop settings)
5. Save the preset

## Step 4: Configure Environment Variables
Add these variables to your `.env.local` file:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_UPLOAD_PRESET=product-images
```

**Note**: Replace `your-cloud-name` with your actual cloud name and `product-images` with your upload preset name.

## Step 5: Test the Configuration
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Go to the SuperAdmin > Content > Products > Create Product page
3. Try uploading an image
4. If configured correctly, you should see:
   - No error messages about Cloudinary configuration
   - Images upload successfully to Cloudinary
   - Real image URLs (starting with `https://res.cloudinary.com/`) instead of placeholder URLs

## Troubleshooting

### Common Issues:

1. **"Cloudinary not configured" Error**
   - Check that `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET` are set in `.env.local`
   - Restart your development server after adding environment variables

2. **Upload Preset Not Found**
   - Verify the upload preset name in Cloudinary Dashboard
   - Ensure the preset is set to "Unsigned" mode
   - Check spelling in the environment variable

3. **CORS Errors**
   - In Cloudinary Dashboard, go to Settings > Security
   - Add your development URL (e.g., `http://localhost:3000`) to allowed origins

4. **Images Still Showing as Placeholders**
   - Clear your browser cache
   - Check the Network tab in browser dev tools for failed requests
   - Verify that new uploads return Cloudinary URLs

### Environment Variable File Location
Make sure your `.env.local` file is in the root directory of your project:
```
/home/mukulah/e-com-app-admin/
├── .env.local          ← This file should be here
├── package.json
├── next.config.ts
└── src/
```

## Verification Steps
1. Upload a new product with images
2. Check that the image URLs in the database start with `https://res.cloudinary.com/`
3. Visit the product detail page to confirm real images are displayed
4. No placeholder images should appear for products with uploaded images

## Security Notes
- Never commit your API Secret to version control
- Use unsigned upload presets for client-side uploads
- Consider implementing upload restrictions (file size, format) in your preset
- For production, consider using signed uploads for better security

## Next Steps
Once Cloudinary is properly configured:
1. All new product images will upload to Cloudinary
2. Existing products with placeholder URLs will show "No image" placeholders
3. You can re-upload images for existing products to replace placeholders
4. The application will automatically filter out placeholder URLs from display

## Support
If you encounter issues:
1. Check the browser console for error messages
2. Verify your Cloudinary Dashboard shows received uploads
3. Test with different image formats (JPEG, PNG, WebP)
4. Ensure your upload preset allows the file types you're uploading