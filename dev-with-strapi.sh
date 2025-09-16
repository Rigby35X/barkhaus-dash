#!/bin/bash

# Start both the main app and Strapi CMS
echo "🚀 Starting Barkhaus Dashboard with Strapi CMS..."

# Check if Strapi exists
if [ ! -d "barkhaus-cms" ]; then
    echo "❌ Strapi not found. Run ./setup-strapi.sh first"
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo "🛑 Stopping services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start main app
echo "📱 Starting main app on http://localhost:5173..."
npm run dev &

# Start Strapi
echo "🎛️  Starting Strapi CMS on http://localhost:1337..."
cd barkhaus-cms
npm run develop &

# Wait for both processes
wait
