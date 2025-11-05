# Cloudinary Setup Fix Guide

## Current Issue
You're getting the error: "Cloudinary is not configured" when trying to upload images because the upload preset is missing.

## Solution Steps

### Step 1: Create Upload Preset in Cloudinary Dashboard

1. **Go to your Cloudinary Dashboard**: https://cloudinary.com/console
2. **Login** with your account (cloud name: `due7exd2c`)
3. **Navigate to Settings** → **Upload**
4. **Scroll down to "Upload presets"**
5. **Click "Add upload preset"**

### Step 2: Configure the Upload Preset

**Preset Configuration:**
- **Preset name**: `product-images`
- **Signing Mode**: `Unsigned` (important for client-side uploads)
- **Folder**: `products` (optional, for organization)
- **Format**: `Auto`
- **Quality**: `Auto`
- **Access Mode**: `Public`

**Advanced Settings (Optional):**
- **Allowed formats**: `jpg,png,gif,webp`
- **Max file size**: `10MB`
- **Max image width**: `2000px`
- **Max image height**: `2000px`

### Step 3: Save and Test

1. **Click "Save"** in Cloudinary dashboard
2. **Restart your development server**:
   ```bash
   npm run dev
   ```
3. **Try uploading an image** in your product edit page

## Alternative: Use ml_default Preset

If you don't want to create a custom preset, you can try using the default preset:

1. **Update your `.env.local` file**:
   ```bash
   CLOUDINARY_UPLOAD_PRESET=ml_default
   ```

2. **If that doesn't work, check what presets exist** in your Cloudinary dashboard

## Environment Variables Check

Your current `.env.local` should have:
```bash
# Cloudinary
CLOUDINARY_CLOUD_NAME=due7exd2c
CLOUDINARY_API_KEY=636519889852319
CLOUDINARY_API_SECRET=2XPJ4RjAXei9dgxXaK8apB7JRLk
CLOUDINARY_UPLOAD_PRESET=product-images
```

## Testing the Configuration

1. **Check browser console** for detailed error messages
2. **Look for logs** that show:
   - Cloud name: `due7exd2c`
   - Upload preset: `product-images`
   - Upload URL: `https://api.cloudinary.com/v1_1/due7exd2c/image/upload`

## Troubleshooting

### If you get "Invalid upload preset" error:
- The preset name doesn't exist in your Cloudinary account
- Go back to Step 1 and create the preset

### If you get "Network error":
- Check your internet connection
- Verify the cloud name is correct

### If you get "Unauthorized" error:
- Make sure the preset is set to "Unsigned"
- Check that the preset exists and is active

## Quick Test

You can test your Cloudinary configuration with this curl command:

```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/due7exd2c/image/upload \
  -F upload_preset=product-images \
  -F file=@/path/to/test-image.jpg
```

Replace `/path/to/test-image.jpg` with an actual image file path.

## Success Indicators

When everything is working, you should see:
1. ✅ No error messages in the browser console
2. ✅ Image uploads successfully
3. ✅ Image URLs start with `https://res.cloudinary.com/due7exd2c/`
4. ✅ Images appear in your Cloudinary media library

## Need Help?

If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify the upload preset exists in your Cloudinary dashboard
3. Make sure you restart your development server after changing `.env.local`
4. Try uploading a small test image (< 1MB) first