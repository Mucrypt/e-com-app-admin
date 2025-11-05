#!/bin/bash

# Image Gallery Demo Testing Script
# This script tests the image manipulation API endpoints

echo "🖼️  Image Gallery Demo - API Testing Script"
echo "=============================================="

# Configuration
BASE_URL="http://localhost:3000"
PRODUCT_ID="your-product-id-here"  # Replace with actual product ID

echo ""
echo "📋 Available endpoints to test:"
echo "1. GET /api/product/[id] - Get product with images"
echo "2. PATCH /api/product/[id]/images - Manipulate images (reorder, set main, delete)"
echo "3. POST /api/product/[id]/images - Upload new images"
echo ""

# Function to test getting product
test_get_product() {
    echo "🔍 Testing: Get product with images"
    echo "GET ${BASE_URL}/api/product/${PRODUCT_ID}"
    echo ""
}

# Function to test image reordering
test_reorder_images() {
    echo "🔄 Testing: Reorder images"
    echo "PATCH ${BASE_URL}/api/product/${PRODUCT_ID}/images"
    echo "Body: {\"action\": \"reorder\", \"images\": [\"url1\", \"url2\", \"url3\"]}"
    echo ""
}

# Function to test setting main image
test_set_main_image() {
    echo "⭐ Testing: Set main image"
    echo "PATCH ${BASE_URL}/api/product/${PRODUCT_ID}/images"
    echo "Body: {\"action\": \"setMain\", \"mainImageIndex\": 1}"
    echo ""
}

# Function to test deleting image
test_delete_image() {
    echo "🗑️  Testing: Delete image"
    echo "PATCH ${BASE_URL}/api/product/${PRODUCT_ID}/images"
    echo "Body: {\"action\": \"delete\", \"imageIndex\": 2}"
    echo ""
}

# Function to test uploading images
test_upload_images() {
    echo "📤 Testing: Upload new images"
    echo "POST ${BASE_URL}/api/product/${PRODUCT_ID}/images"
    echo "Body: FormData with 'images' field containing files"
    echo ""
}

# Function to show demo features
show_demo_features() {
    echo "✨ Demo Features Available:"
    echo ""
    echo "🎯 For Users:"
    echo "  • View multiple product images"
    echo "  • Navigate with arrow keys or buttons"
    echo "  • Fullscreen image viewing"
    echo "  • Thumbnail navigation"
    echo "  • Auto-play slideshow"
    echo "  • Image zoom and smooth transitions"
    echo ""
    echo "🔧 For Admins:"
    echo "  • Drag and drop to reorder images"
    echo "  • Set main/featured image"
    echo "  • Delete unwanted images"
    echo "  • Upload new images"
    echo "  • Real-time image manipulation"
    echo ""
    echo "📱 Responsive Design:"
    echo "  • Mobile-friendly touch navigation"
    echo "  • Responsive grid layouts"
    echo "  • Optimized image loading"
    echo "  • Progressive enhancement"
    echo ""
}

# Function to show implementation details
show_implementation() {
    echo "🏗️  Implementation Details:"
    echo ""
    echo "📁 Key Files Created/Updated:"
    echo "  • /src/components/common/ProductImageGallery.tsx - Main gallery component"
    echo "  • /src/components/common/ProductCard.tsx - Enhanced product cards"
    echo "  • /src/app/api/product/[id]/images/route.ts - Image manipulation API"
    echo "  • /src/hooks/useImageManipulation.ts - Image manipulation hook"
    echo "  • /src/app/products/[id]/enhanced-page.tsx - Enhanced product details"
    echo "  • /src/app/products/image-gallery-demo/page.tsx - Demo showcase"
    echo ""
    echo "🔌 API Endpoints:"
    echo "  • PATCH /api/product/[id]/images - Reorder, set main, delete images"
    echo "  • POST /api/product/[id]/images - Upload new images"
    echo ""
    echo "🎨 Features:"
    echo "  • Drag & drop image reordering"
    echo "  • Main image selection"
    echo "  • Image deletion with confirmation"
    echo "  • File upload with progress"
    echo "  • Fullscreen viewing"
    echo "  • Keyboard navigation"
    echo "  • Touch/swipe support"
    echo "  • Admin permission checking"
    echo ""
}

# Function to show usage instructions
show_usage() {
    echo "📖 Usage Instructions:"
    echo ""
    echo "1. 🚀 Start your development server:"
    echo "   npm run dev"
    echo ""
    echo "2. 🌐 Visit the demo page:"
    echo "   http://localhost:3000/products/image-gallery-demo"
    echo ""
    echo "3. 👤 Login as admin to access manipulation features:"
    echo "   http://localhost:3000/Authentication"
    echo ""
    echo "4. 🛒 View enhanced product pages:"
    echo "   http://localhost:3000/products/[product-id]"
    echo ""
    echo "5. 🔧 Test API endpoints using curl or Postman"
    echo ""
}

# Main menu
show_menu() {
    echo "🎮 Choose an option:"
    echo "1. Show demo features"
    echo "2. Show implementation details"
    echo "3. Show usage instructions"
    echo "4. Test API endpoints"
    echo "5. Exit"
    echo ""
    echo -n "Enter your choice (1-5): "
}

# Main execution
while true; do
    show_menu
    read choice
    echo ""
    
    case $choice in
        1)
            show_demo_features
            ;;
        2)
            show_implementation
            ;;
        3)
            show_usage
            ;;
        4)
            echo "🧪 API Testing Commands:"
            test_get_product
            test_reorder_images
            test_set_main_image
            test_delete_image
            test_upload_images
            echo "💡 Tip: Replace PRODUCT_ID with an actual product ID from your database"
            ;;
        5)
            echo "👋 Thanks for using the Image Gallery Demo!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please try again."
            ;;
    esac
    echo ""
    echo "Press Enter to continue..."
    read
    clear
done