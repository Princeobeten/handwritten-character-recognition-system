import { NextRequest, NextResponse } from 'next/server';
import { knnClassifier } from '@/lib/classifier';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "../../api/auth/auth.config";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { features, historyId } = await request.json();

    if (!features || !Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Invalid features data' },
        { status: 400 }
      );
    }

    // Ensure features array has correct length (784 for 28x28 image)
    if (features.length !== 784) {
      return NextResponse.json(
        { error: 'Invalid feature vector length' },
        { status: 400 }
      );
    }

    // Classify the character using k-NN
    const result = await knnClassifier.predict(features);

    // Update the history entry with classification results
    await prisma.history.update({
      where: { id: historyId },
      data: {
        prediction: result.prediction,
        confidence: result.confidence,
        modelVersion: 'knn-v1.0'
      }
    });

    return NextResponse.json({
      character: result.prediction,
      confidence: result.confidence,
      alternatives: result.alternatives
    });

  } catch (error) {
    console.error('Error classifying character:', error);
    return NextResponse.json(
      { error: 'Error classifying character' },
      { status: 500 }
    );
  }
}