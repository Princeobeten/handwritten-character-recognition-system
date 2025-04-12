import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Process with Gemini for text enhancement
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: "Analyze this image for text content. If you see any text:\n1. Describe what text you see\n2. List all visible characters\n3. Rate the image clarity (1-10)"
        }, {
          inlineData: {
            mimeType: file.type,
            data: base64Image
          }
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 200,
      }
    });

    const analysisText = await result.response?.text();
    console.log('Image analysis:', analysisText);

    return NextResponse.json({ 
      success: true,
      data: base64Image,
      width: 28,
      height: 28,
      analysis: analysisText // Include analysis for debugging
    });

  } catch (error) {
    console.error('Error preprocessing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
