import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Received request body type:', typeof body);
    console.log('Received request body keys:', Object.keys(body));

    const { historyId, imageBase64 } = body;

    if (!historyId) {
      return NextResponse.json(
        { error: 'History ID is required' },
        { status: 400 }
      );
    }

    if (!imageBase64) {
      console.error('Missing image data');
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Process base64 string
    let cleanBase64 = imageBase64;
    try {
      // Validate and clean base64
      if (cleanBase64.includes('base64,')) {
        cleanBase64 = cleanBase64.split('base64,')[1];
      }
      
      // Test if it's valid base64
      const testBuffer = Buffer.from(cleanBase64, 'base64');
      if (testBuffer.length === 0) {
        throw new Error('Empty base64 data');
      }

      console.log('Valid base64 length:', testBuffer.length);

      // Get prediction from Gemini with more specific prompt
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: "Look at this image and list all visible text characters. For each character, provide a confidence score between 0 and 1. Response format should be: character1:score1,character2:score2,etc"
          }, {
            inlineData: {
              mimeType: "image/png",
              data: cleanBase64
            }
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 150,
        }
      });

      const responseText = result.response.text().trim();
      console.log('Raw Gemini response:', responseText);

      // Parse character:confidence pairs
      const characters = responseText
        .split(',')
        .map(pair => {
          const [char, conf] = pair.trim().split(':');
          return {
            char: char.trim(),
            confidence: parseFloat(conf) || 0.5
          };
        })
        .filter(item => item.char.match(/^[A-Z0-9]$/i))
        .sort((a, b) => b.confidence - a.confidence);

      // Update history
      await prisma.history.update({
        where: { id: historyId },
        data: {
          prediction: characters.map(c => c.char).join(''),
          confidence: characters[0]?.confidence || 0,
          modelVersion: 'gemini-v1.0'
        }
      });

      return NextResponse.json({
        text: characters.map(c => c.char).join(''),
        characters
      });

    } catch (geminiError) {
      console.error('Gemini processing error details:', geminiError);
      throw new Error(`Failed to process image with AI: ${geminiError instanceof Error ? geminiError.message : String(geminiError)}`);
    }

  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error classifying character' },
      { status: 500 }
    );
  }
}