import { NextResponse } from 'next/server';
import { getOfflineStemResponse } from '@/lib/gemini';

interface TutorRequestBody {
  query: string;
  history?: Array<{ sender: 'user' | 'ai'; text: string }>;
  imageBase64?: string;
  apiKey?: string;
}

const SYSTEM_INSTRUCTION = `You are SmartLearn Master STEM AI Tutor — an elite, inspiring, and pedagogically brilliant private tutor for students preparing for high school, AP courses, SAT, and competitive entrance exams (JEE, NEET).

Your mission is to make every math, physics, chemistry, biology, and computer science concept crystal clear, intuitive, and unforgettable through Socratic guidance and first-principles thinking.

When answering a question or analyzing an attached handwritten diagram:
1. Explain the fundamental intuition and use a vivid real-world analogy.
2. Present the governing equation or formula in clean mathematical notation.
3. Provide a clear, numbered step-by-step derivation or solution.
4. Give a memorable "Key Takeaway" or exam mnemonic.
5. Provide 3 thoughtful follow-up questions to test deep understanding.

Format your response STRICTLY as a valid JSON object matching this structure:
{
  "text": "Clear, encouraging explanation with real-world analogy and intuition",
  "equation": "Governing mathematical equation or formula (LaTeX or clean notation, or empty if none)",
  "steps": [
    "Step 1: Initial setup and identifying givens",
    "Step 2: Core theorem or transformation applied",
    "Step 3: Algebraic or physical simplification",
    "Step 4: Final solution and verification"
  ],
  "keyTakeaway": "1-sentence golden rule or mnemonic for exams",
  "followUps": [
    "Follow-up question 1 to test understanding",
    "Deeper exploration question 2",
    "Common exam trap or edge case question 3"
  ]
}

Return ONLY the raw JSON object, without extra conversational text before or after.`;

export async function POST(req: Request) {
  try {
    const body: TutorRequestBody = await req.json();
    const { query, history, imageBase64, apiKey } = body;

    if (!query && !imageBase64) {
      return NextResponse.json(
        { success: false, error: 'Query or image is required' },
        { status: 400 }
      );
    }

    const effectiveApiKey =
      (apiKey && apiKey.trim()) ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      '';

    // If no Gemini key is configured, return high-quality offline STEM knowledge engine
    if (!effectiveApiKey) {
      const offline = getOfflineStemResponse(query || 'Help with attached diagram');
      return NextResponse.json({
        ...offline,
        isLiveGemini: false,
        requiresKey: true,
        message: 'Running in offline STEM mode. Add a Gemini API key for live AI reasoning on any topic.',
      });
    }

    // Prepare contents for Gemini REST API
    const contents: any[] = [];

    // System instruction injected as first turn or context
    contents.push({
      role: 'user',
      parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nStudent's question: "${query}"` }],
    });

    // Handle image attachment if provided
    if (imageBase64) {
      const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        contents[0].parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    // Call Gemini API prioritizing ultra-fast models: gemini-3.5-flash-lite -> gemini-flash-lite-latest -> gemini-3.6-flash
    const modelsToTry = [
      'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite',
      'gemini-3.6-flash',
      'gemini-3.7-flash',
      'gemini-flash-latest',
      'gemini-2.5-flash',
    ];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveApiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1200,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const candidateText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

          if (candidateText) {
            try {
              // Strip potential markdown code block backticks if present
              const cleanJson = candidateText
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/\s*```$/i, '')
                .trim();

              const parsed = JSON.parse(cleanJson);
              return NextResponse.json({
                success: true,
                isLiveGemini: true,
                modelUsed: model,
                text: parsed.text || candidateText,
                equation: parsed.equation || '',
                steps: Array.isArray(parsed.steps) ? parsed.steps : [],
                keyTakeaway: parsed.keyTakeaway || '',
                followUps: Array.isArray(parsed.followUps) ? parsed.followUps : [],
              });
            } catch (jsonErr) {
              // Fallback to raw text if JSON parsing fails
              return NextResponse.json({
                success: true,
                isLiveGemini: true,
                modelUsed: model,
                text: candidateText,
                equation: '',
                steps: [],
                followUps: [
                  'Can you break this down further?',
                  'Can you give another example?',
                ],
              });
            }
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          lastError = errData?.error?.message || `Gemini API HTTP ${res.status}`;
        }
      } catch (err: any) {
        lastError = err.message || 'Network error connecting to Gemini';
      }
    }

    // If Gemini call failed (e.g. invalid key or network issue), gracefully fall back to offline engine
    const offline = getOfflineStemResponse(query || 'Help with doubt');
    return NextResponse.json({
      ...offline,
      isLiveGemini: false,
      requiresKey: false,
      error: `Gemini API error: ${lastError}. Falling back to SmartLearn STEM Engine.`,
    });
  } catch (error: any) {
    const fallback = getOfflineStemResponse('general doubt');
    return NextResponse.json(
      {
        ...fallback,
        success: false,
        error: error?.message || 'AI processing encountered an error',
      },
      { status: 500 }
    );
  }
}

