#!/bin/bash

echo "🚀 QuestEd - Installation Script"
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
    echo "Required configuration:"
    echo "  1. MONGO_URI - MongoDB Atlas connection string"
    echo "  2. JWT_SECRET - A secure random string"
    echo ""
    echo "Optional configuration:"
    echo "  3. SMTP settings - For email invitations"
    echo "  4. Microsoft Teams - For Teams integration"
    echo "  5. Cloudinary - For image uploads"
    echo ""
    echo "Note: Socket.IO (real-time features) requires no configuration!"
    echo "See README.md for detailed setup instructions."
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
