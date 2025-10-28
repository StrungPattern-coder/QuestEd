#!/bin/bash

echo "🚀 PICT German Test Platform - Installation Script"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your credentials."
    echo ""
    echo "You need to configure:"
    echo "  1. MONGO_URI - MongoDB Atlas connection string"
    echo "  2. JWT_SECRET - A secure random string"
    echo "  3. ABLY_API_KEY - Ably API key"
    echo "  4. NEXT_PUBLIC_ABLY_CLIENT_KEY - Ably client key"
    echo ""
    echo "See SETUP.md for detailed instructions."
else
    echo "✅ .env file found"
fi

echo ""
echo "=================================================="
echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env file with your credentials"
echo "  2. Run 'npm run dev' to start development server"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed setup instructions, see SETUP.md"
echo "=================================================="
