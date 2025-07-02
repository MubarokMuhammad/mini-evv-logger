#!/bin/bash

# Mini EVV Logger Deployment Script
# This script helps deploy both frontend and backend to Vercel

set -e  # Exit on any error

echo "🚀 Mini EVV Logger Deployment Script"
echo "====================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Function to deploy backend
deploy_backend() {
    echo "\n📦 Deploying Backend..."
    cd backend
    
    # Check if go.mod exists
    if [ ! -f "go.mod" ]; then
        echo "❌ go.mod not found in backend directory"
        exit 1
    fi
    
    # Deploy to Vercel
    echo "Deploying backend to Vercel..."
    vercel --prod
    
    echo "✅ Backend deployed successfully!"
    cd ..
}

# Function to deploy frontend
deploy_frontend() {
    echo "\n🎨 Deploying Frontend..."
    cd frontend
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo "❌ package.json not found in frontend directory"
        exit 1
    fi
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install
    
    # Build the project
    echo "Building frontend..."
    npm run build
    
    # Deploy to Vercel
    echo "Deploying frontend to Vercel..."
    vercel --prod
    
    echo "✅ Frontend deployed successfully!"
    cd ..
}

# Function to show deployment info
show_info() {
    echo "\n📋 Deployment Complete!"
    echo "========================"
    echo "\n📝 Next Steps:"
    echo "1. Update frontend .env.production with your backend URL"
    echo "2. Redeploy frontend with updated API URL"
    echo "3. Test the complete application"
    echo "4. Configure custom domain (optional)"
    echo "\n🔗 Useful Commands:"
    echo "   vercel --prod                 # Deploy to production"
    echo "   vercel domains                # Manage domains"
    echo "   vercel env                    # Manage environment variables"
    echo "   vercel logs                   # View deployment logs"
    echo "\n📚 Documentation:"
    echo "   Frontend: React app with TypeScript"
    echo "   Backend: Go API with Gin framework"
    echo "   API Docs: /swagger/index.html"
}

# Main deployment flow
echo "\nSelect deployment option:"
echo "1. Deploy Backend only"
echo "2. Deploy Frontend only"
echo "3. Deploy Both (Backend first, then Frontend)"
echo "4. Show deployment info"
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        deploy_backend
        ;;
    2)
        deploy_frontend
        ;;
    3)
        deploy_backend
        deploy_frontend
        show_info
        ;;
    4)
        show_info
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo "\n🎉 Deployment script completed!"