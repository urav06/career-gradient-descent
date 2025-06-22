#!/bin/bash

# Frontend deployment script for career-gradient-descent portfolio
# Usage: ./scripts/deploy-frontend.sh

set -e  # Exit on any error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
TERRAFORM_DIR="$PROJECT_ROOT/infrastructure/terraform"

echo "🚀 Career Gradient Descent - Frontend Deployment"
echo "================================================"

# Check dependencies
echo ""
echo "🔍 Checking dependencies..."

if ! command -v npm &> /dev/null; then
    echo "❌ npm is missing. Please install Node.js first!"
    echo "💡 Download from: https://nodejs.org/"
    exit 1
fi

if ! command -v gsutil &> /dev/null; then
    echo "❌ gsutil is missing. Please install Google Cloud SDK first!"
    echo "💡 Download from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud is missing. Please install Google Cloud SDK first!"
    exit 1
fi

echo "✅ All dependencies found"

# Get deployment configuration from Terraform
echo ""
echo "📊 Getting deployment configuration..."

cd "$TERRAFORM_DIR"

bucket_name=$(terraform output -raw frontend_bucket_name 2>/dev/null || echo "")
url_map_name=$(terraform output -raw url_map_name 2>/dev/null || echo "")

if [ -z "$bucket_name" ]; then
    echo "❌ Could not get bucket name from Terraform output!"
    echo "💡 Make sure you're in the right directory and terraform has been applied"
    echo ""
    echo -n "Enter bucket name manually: "
    read -r bucket_name
    
    if [ -z "$bucket_name" ]; then
        echo "❌ Bucket name cannot be empty!"
        exit 1
    fi
fi

cd "$FRONTEND_DIR"

echo "📦 Target bucket: $bucket_name"
echo "🗺️ URL map: ${url_map_name:-'(not found - CDN invalidation will be skipped)'}"

# Check for analytics configuration
echo ""
echo "📈 Checking analytics configuration..."

if [ -f ".env.local" ] && grep -q "NEXT_PUBLIC_GA_ID=G-" ".env.local"; then
    echo "✅ Analytics configured"
else
    echo "⚠️  No analytics configuration found"
    echo "💡 Create .env.local with NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX to enable analytics"
fi

# Verify assets
echo ""
echo "🖼️  Checking assets..."

if [ -f "public/profile.jpg" ]; then
    echo "✅ Profile image found"
else
    echo "⚠️  Profile image not found at public/profile.jpg"
fi

if [ -f "public/favicon.ico" ]; then
    echo "✅ Favicon found"
else
    echo "⚠️  Favicon not found - using Next.js default"
fi

# Build frontend
echo ""
echo "🏗️  Building Next.js application..."

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --no-audit --prefer-offline
fi

# Clean previous build
if [ -d "out" ]; then
    rm -rf out
fi

# Build with production optimizations
echo "⚡ Building production bundle..."
npm run build

if [ ! -d "out" ]; then
    echo "❌ Build failed - no 'out' directory found!"
    echo "💡 Check the build logs above for errors"
    exit 1
fi

echo "✅ Build completed successfully"

# Deployment
echo ""
echo "☁️  Deploying to Google Cloud Storage..."

# Upload with optimized settings
echo "📤 Uploading files..."
gsutil -m -h "Cache-Control:no-cache, no-store, must-revalidate" rsync -r -d out/ "gs://$bucket_name/"

echo "🏷️  Setting cache headers for optimization..."

# HTML files - short cache for quick updates
gsutil -m setmeta \
    -h "Cache-Control:public, max-age=300, s-maxage=300" \
    -h "Content-Type:text/html; charset=utf-8" \
    "gs://$bucket_name/**/*.html" 2>/dev/null || true

# Static assets - long cache for performance  
gsutil -m setmeta \
    -h "Cache-Control:public, max-age=31536000, immutable" \
    "gs://$bucket_name/_next/**" 2>/dev/null || true

# Images - medium cache
gsutil -m setmeta \
    -h "Cache-Control:public, max-age=86400" \
    -h "Content-Type:image/jpeg" \
    "gs://$bucket_name/**/*.jpg" 2>/dev/null || true

gsutil -m setmeta \
    -h "Cache-Control:public, max-age=86400" \
    -h "Content-Type:image/png" \
    "gs://$bucket_name/**/*.png" 2>/dev/null || true

# PDFs - medium cache
gsutil -m setmeta \
    -h "Cache-Control:public, max-age=86400" \
    -h "Content-Type:application/pdf" \
    "gs://$bucket_name/**/*.pdf" 2>/dev/null || true

# Invalidate CDN cache if possible
if [ -n "$url_map_name" ]; then
    echo "🔄 Invalidating CDN cache..."
    gcloud compute url-maps invalidate-cdn-cache "$url_map_name" \
        --path "/*" \
        --async \
        --quiet || echo "⚠️  CDN invalidation failed (non-critical)"
else
    echo "⚠️  Skipping CDN invalidation (URL map not found)"
fi

# Get final URLs
echo ""
echo "🎉 Deployment completed successfully!"
echo ""

cd "$TERRAFORM_DIR"
access_urls=$(terraform output -json access_urls 2>/dev/null || echo "{}")

if [ "$access_urls" != "{}" ]; then
    echo "🌐 Your site is available at:"
    echo "$access_urls" | jq -r 'to_entries[] | "  \(.key): \(.value)"' 2>/dev/null || echo "  Check terraform output for URLs"
else
    echo "🌐 Check terraform output access_urls for your site URLs"
fi

echo ""
echo "💡 Notes:"
echo "  • CDN cache invalidation takes 1-2 minutes to propagate globally"
echo "  • Analytics data appears in GA4 within 24-48 hours"
echo "  • Static assets are cached for 1 year for optimal performance"
echo ""
echo "🔧 Next steps:"
echo "  • Test your site across different devices and browsers"
echo "  • Monitor analytics data in Google Analytics"
echo "  • Consider adding more projects to showcase your work"
