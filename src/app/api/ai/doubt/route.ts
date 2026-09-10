import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const clean = (query || '').toLowerCase();

    let text = `Here is a structured explanation for: "${query}":`;
    let equation = '';
    let steps = [
      'Identify governing mathematical or physical axioms.',
      'Solve intermediate boundary conditions.',
      'Check limits and dimensional consistency.',
    ];

    if (clean.includes('quadratic') || clean.includes('root')) {
      text = 'A quadratic equation ax² + bx + c = 0 can be solved using the quadratic formula:';
      equation = 'x = [-b ± √(b² - 4ac)] / (2a)';
      steps = [
        'Calculate discriminant Δ = b² - 4ac.',
        'If Δ > 0: two distinct real roots.',
        'If Δ = 0: one repeated real root.',
        'If Δ < 0: two complex conjugate roots.',
      ];
    } else if (clean.includes('chain rule') || clean.includes('derivative')) {
      text = 'The Chain Rule differentiates composite functions f(g(x)):';
      equation = 'd/dx [f(g(x))] = f\'(g(x)) · g\'(x)';
      steps = [
        'Differentiate the outer function with respect to the inner argument.',
        'Differentiate the inner function with respect to x.',
        'Multiply both derivatives together.',
      ];
    }

    return NextResponse.json({
      success: true,
      text,
      equation,
      steps,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'AI processing failed' }, { status: 500 });
  }
}
