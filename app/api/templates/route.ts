import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import QuizTemplate from '@/backend/models/QuizTemplate';

export const dynamic = 'force-dynamic';

/**
 * GET /api/templates
 * 
 * Browse and search quiz templates
 * Supports filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const visibility = searchParams.get('visibility') || 'public';
    const sort = searchParams.get('sort') || 'recent'; // recent, popular, rating
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const userId = searchParams.get('userId') || ''; // For viewing own templates

    // Build filter query
    const filter: any = {};

    // Visibility filter
    if (userId) {
      // Show user's own templates (public + private) OR public templates from others
      filter.$or = [
        { authorId: userId },
        { visibility: 'public' }
      ];
    } else {
      // Only show public templates
      filter.visibility = visibility || 'public';
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }

    // Text search (if provided)
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort query
    let sortQuery: any = {};
    switch (sort) {
      case 'popular':
        sortQuery = { cloneCount: -1, createdAt: -1 };
        break;
      case 'rating':
        sortQuery = { rating: -1, ratingCount: -1, createdAt: -1 };
        break;
      case 'recent':
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [templates, total] = await Promise.all([
      QuizTemplate.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .select('-questions') // Don't send full questions in list view
        .lean(),
      QuizTemplate.countDocuments(filter),
    ]);

    // Calculate average rating for each template
    const templatesWithRating = templates.map(t => ({
      ...t,
      averageRating: t.ratingCount > 0 ? Math.round((t.rating / t.ratingCount) * 10) / 10 : 0,
      questionsCount: t.questions?.length || 0,
    }));

    return NextResponse.json({
      templates: templatesWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
