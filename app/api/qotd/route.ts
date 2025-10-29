import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import QuestionOfTheDay from '@/backend/models/QuestionOfTheDay';

export async function GET() {
  try {
    await connectDB();

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's question
    let question = await QuestionOfTheDay.findOne({
      date: today,
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
      ];

      // Pick a random question
      const randomQ = questionPool[Math.floor(Math.random() * questionPool.length)];

      question = await QuestionOfTheDay.create({
        ...randomQ,
        date: today,
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
