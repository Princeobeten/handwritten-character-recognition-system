import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET endpoint to retrieve recognition history
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.history.count({
      where: { userId: session.user.id }
    });

    // Get paginated results
    const results = await prisma.history.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
      select: {
        id: true,
        image: true,
        prediction: true,
        confidence: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      data: results.map(entry => ({
        id: entry.id,
        originalImage: entry.image,
        recognizedText: entry.prediction,
        confidenceScore: entry.confidence,
        createdAt: entry.createdAt
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Error fetching recognition history' },
      { status: 500 }
    );
  }
}

// POST endpoint to store recognition result
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { historyId, prediction, confidence } = await request.json();

    if (!historyId || !prediction || confidence === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update history entry with recognition result
    const result = await prisma.history.update({
      where: { id: historyId },
      data: {
        prediction,
        confidence
      }
    });

    return NextResponse.json({
      message: 'Recognition result stored successfully',
      id: result.id,
      createdAt: result.createdAt
    });

  } catch (error) {
    console.error('Error storing recognition result:', error);
    return NextResponse.json(
      { error: 'Error storing recognition result' },
      { status: 500 }
    );
  }
}