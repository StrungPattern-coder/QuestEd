import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import QuestionOfTheDay from '@/backend/models/QuestionOfTheDay';

export async function GET() {
  try {
    await connectDB();

    // Get current date in IST (India Standard Time - UTC+5:30)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istTime = new Date(now.getTime() + istOffset);
    
    // Get today's date at midnight IST
    const todayIST = new Date(istTime);
    todayIST.setUTCHours(0, 0, 0, 0);
    
    // Convert back to UTC for database query
    const todayUTC = new Date(todayIST.getTime() - istOffset);

    // Find today's question
    let question = await QuestionOfTheDay.findOne({
      date: todayUTC,
      isActive: true,
    });

    // If no question exists for today, create a random one from pool
    if (!question) {
      const questionPool = [
        { question: "Cats or Dogs?", optionA: "🐱 Cats", optionB: "🐶 Dogs", category: "General" },
        { question: "Marvel or DC?", optionA: "Marvel", optionB: "DC", category: "Entertainment" },
        { question: "Messi or Ronaldo?", optionA: "Messi", optionB: "Ronaldo", category: "Sports" },
        { question: "Coffee or Tea?", optionA: "☕ Coffee", optionB: "🍵 Tea", category: "Food" },
        { question: "iOS or Android?", optionA: "🍎 iOS", optionB: "🤖 Android", category: "Tech" },
        { question: "Beach or Mountains?", optionA: "🏖️ Beach", optionB: "⛰️ Mountains", category: "General" },
        { question: "Pizza or Burger?", optionA: "🍕 Pizza", optionB: "🍔 Burger", category: "Food" },
        { question: "Morning or Night?", optionA: "🌅 Morning", optionB: "🌙 Night", category: "General" },
        { question: "Books or Movies?", optionA: "📚 Books", optionB: "🎬 Movies", category: "Entertainment" },
        { question: "Summer or Winter?", optionA: "☀️ Summer", optionB: "❄️ Winter", category: "General" },
        { question: "Windows or Mac?", optionA: "Windows", optionB: "Mac", category: "Tech" },
        { question: "Football or Basketball?", optionA: "⚽ Football", optionB: "🏀 Basketball", category: "Sports" },
        { question: "Netflix or YouTube?", optionA: "Netflix", optionB: "YouTube", category: "Entertainment" },
        { question: "City or Countryside?", optionA: "🏙️ City", optionB: "🌾 Countryside", category: "General" },
        { question: "Sweet or Savory?", optionA: "🍰 Sweet", optionB: "🧀 Savory", category: "Food" },
        
        // 🧠 General
        { question: "Introvert or Extrovert?", optionA: "😌 Introvert", optionB: "😄 Extrovert", category: "General" },
        { question: "Early bird or Night owl?", optionA: "🐦 Early Bird", optionB: "🦉 Night Owl", category: "General" },
        { question: "Rain or Sunshine?", optionA: "🌧️ Rain", optionB: "☀️ Sunshine", category: "General" },
        { question: "Train journey or Flight?", optionA: "🚆 Train", optionB: "✈️ Flight", category: "General" },
        { question: "Texting or Calling?", optionA: "💬 Texting", optionB: "📞 Calling", category: "General" },
        { question: "Save or Spend?", optionA: "💰 Save", optionB: "🛍️ Spend", category: "General" },
        { question: "Adventure or Comfort?", optionA: "🧗 Adventure", optionB: "🛋️ Comfort", category: "General" },
        { question: "Stay home or Go out?", optionA: "🏠 Stay home", optionB: "🚶 Go out", category: "General" },
        { question: "Work from home or Office?", optionA: "🏡 Home", optionB: "🏢 Office", category: "General" },
        { question: "Art or Science?", optionA: "🎨 Art", optionB: "🔬 Science", category: "General" },

        // 🎮 Entertainment
        { question: "Clash Royale or Brawl Stars?", optionA: "⚔️ Clash Royale", optionB: "💥 Brawl Stars", category: "Entertainment" },
        { question: "Anime or Cartoons?", optionA: "🎌 Anime", optionB: "📺 Cartoons", category: "Entertainment" },
        { question: "Marvel or Star Wars?", optionA: "🦸 Marvel", optionB: "🚀 Star Wars", category: "Entertainment" },
        { question: "Comedy or Action movies?", optionA: "😂 Comedy", optionB: "💣 Action", category: "Entertainment" },
        { question: "Music or Podcasts?", optionA: "🎶 Music", optionB: "🎙️ Podcasts", category: "Entertainment" },
        { question: "Single-player or Multiplayer games?", optionA: "🎮 Single", optionB: "👾 Multi", category: "Entertainment" },
        { question: "TikTok or Instagram Reels?", optionA: "🎵 TikTok", optionB: "📱 Reels", category: "Entertainment" },
        { question: "Books or Audiobooks?", optionA: "📖 Books", optionB: "🎧 Audiobooks", category: "Entertainment" },

        // 🍔 Food
        { question: "Chocolate or Ice Cream?", optionA: "🍫 Chocolate", optionB: "🍦 Ice Cream", category: "Food" },
        { question: "Fries or Nachos?", optionA: "🍟 Fries", optionB: "🌮 Nachos", category: "Food" },
        { question: "Coke or Pepsi?", optionA: "🥤 Coke", optionB: "🥤 Pepsi", category: "Food" },
        { question: "Veg or Non-Veg?", optionA: "🥗 Veg", optionB: "🍗 Non-Veg", category: "Food" },
        { question: "Paneer or Mushroom?", optionA: "🧀 Paneer", optionB: "🍄 Mushroom", category: "Food" },
        { question: "South Indian or North Indian cuisine?", optionA: "🍛 South", optionB: "🥘 North", category: "Food" },
        { question: "Dessert first or Last?", optionA: "🍰 First!", optionB: "🍮 Last!", category: "Food" },
        { question: "Home food or Restaurant?", optionA: "🏠 Home", optionB: "🍴 Restaurant", category: "Food" },

        // ⚽ Sports
        { question: "Cricket or Football?", optionA: "🏏 Cricket", optionB: "⚽ Football", category: "Sports" },
        { question: "Messi or Ronaldo?", optionA: "🐐 Messi", optionB: "🔥 Ronaldo", category: "Sports" },
        { question: "Gym or Yoga?", optionA: "🏋️ Gym", optionB: "🧘 Yoga", category: "Sports" },
        { question: "Indoor or Outdoor sports?", optionA: "🏓 Indoor", optionB: "🏃 Outdoor", category: "Sports" },
        { question: "Running or Cycling?", optionA: "🏃 Running", optionB: "🚴 Cycling", category: "Sports" },
        { question: "Team sports or Solo sports?", optionA: "👥 Team", optionB: "🧍 Solo", category: "Sports" },

        // 💻 Tech
        { question: "Mac or Windows?", optionA: "🍎 Mac", optionB: "🪟 Windows", category: "Tech" },
        { question: "Laptop or Desktop?", optionA: "💻 Laptop", optionB: "🖥️ Desktop", category: "Tech" },
        { question: "ChatGPT or Gemini?", optionA: "🧠 ChatGPT", optionB: "🌐 Gemini", category: "Tech" },
        { question: "Front-end or Back-end?", optionA: "🎨 Front-end", optionB: "⚙️ Back-end", category: "Tech" },
        { question: "Python or JavaScript?", optionA: "🐍 Python", optionB: "🟨 JS", category: "Tech" },
        { question: "Android or iOS?", optionA: "🤖 Android", optionB: "🍏 iOS", category: "Tech" },
        { question: "AI or Blockchain?", optionA: "🤖 AI", optionB: "⛓️ Blockchain", category: "Tech" },
        { question: "Gaming PC or Console?", optionA: "🖥️ PC", optionB: "🎮 Console", category: "Tech" },

        // 🌍 Lifestyle / Travel
        { question: "Travel solo or with friends?", optionA: "🧳 Solo", optionB: "👯 With Friends", category: "Lifestyle" },
        { question: "Mountains or Beaches?", optionA: "⛰️ Mountains", optionB: "🏖️ Beaches", category: "Lifestyle" },
        { question: "Car or Bike?", optionA: "🚗 Car", optionB: "🏍️ Bike", category: "Lifestyle" },
        { question: "City life or Village life?", optionA: "🏙️ City", optionB: "🌾 Village", category: "Lifestyle" },
        { question: "Minimalist or Maximalist?", optionA: "🌿 Minimalist", optionB: "💎 Maximalist", category: "Lifestyle" },
        { question: "Summer or Winter vacation?", optionA: "☀️ Summer", optionB: "❄️ Winter", category: "Lifestyle" },
        { question: "Camping or Luxury hotel?", optionA: "🏕️ Camping", optionB: "🏨 Luxury", category: "Lifestyle" },
];

      // Pick a random question
      const randomQ = questionPool[Math.floor(Math.random() * questionPool.length)];

      question = await QuestionOfTheDay.create({
        ...randomQ,
        date: todayUTC,
        isActive: true,
      });
    }

    return NextResponse.json({
      question: {
        _id: question._id,
        question: question.question,
        optionA: question.optionA,
        optionB: question.optionB,
        votesA: question.votesA,
        votesB: question.votesB,
        category: question.category,
      },
    });
  } catch (error: any) {
    console.error('Fetch QOTD error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch question of the day' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { questionId, vote } = await request.json();

    if (!questionId || !vote || !['A', 'B'].includes(vote)) {
      return NextResponse.json(
        { error: 'Invalid vote data' },
        { status: 400 }
      );
    }

    // Update vote count
    const updateField = vote === 'A' ? 'votesA' : 'votesB';
    const question = await QuestionOfTheDay.findByIdAndUpdate(
      questionId,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Calculate percentages
    const totalVotes = question.votesA + question.votesB;
    const percentageA = totalVotes > 0 ? Math.round((question.votesA / totalVotes) * 100) : 50;
    const percentageB = totalVotes > 0 ? Math.round((question.votesB / totalVotes) * 100) : 50;

    return NextResponse.json({
      message: 'Vote recorded successfully',
      results: {
        votesA: question.votesA,
        votesB: question.votesB,
        percentageA,
        percentageB,
        totalVotes,
      },
    });
  } catch (error: any) {
    console.error('Vote QOTD error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record vote' },
      { status: 500 }
    );
  }
}
