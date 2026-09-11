/**
 * SmartLearn Gemini AI Tutor Service
 * Connects to Google Gemini API (Gemini 2.5 Flash / 2.0 Flash / 1.5 Flash)
 * with robust offline STEM fallback and multi-turn Socratic tutoring.
 */

export interface TutorMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  equation?: string;
  steps?: string[];
  keyTakeaway?: string;
  followUps?: string[];
  timestamp: string;
  isLiveGemini?: boolean;
}

export interface TutorResponse {
  success: boolean;
  text: string;
  equation?: string;
  steps?: string[];
  keyTakeaway?: string;
  followUps?: string[];
  isLiveGemini: boolean;
  modelUsed?: string;
  error?: string;
}

const STORAGE_KEY = 'smartlearn_gemini_api_key';

/**
 * Get configured Gemini API Key from localStorage or environment
 */
export function getGeminiApiKey(): string {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored.trim()) return stored.trim();
    } catch {
      // ignore
    }
  }
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
}

/**
 * Save Gemini API Key to client localStorage
 */
export function saveGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    try {
      if (key && key.trim()) {
        localStorage.setItem(STORAGE_KEY, key.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }
}

export const GEMINI_SYSTEM_INSTRUCTION = `You are SmartLearn Master STEM AI Tutor — an elite, inspiring, and pedagogically brilliant private tutor for students preparing for high school, AP courses, SAT, and competitive entrance exams (JEE, NEET).

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

/**
 * Call Google Gemini API directly (client-side or server-side compatible)
 * with multi-model fallback: gemini-2.5-flash -> gemini-2.0-flash -> gemini-1.5-flash
 */
export async function callGeminiTutorLive(
  query: string,
  apiKey?: string,
  history?: Array<{ sender: 'user' | 'ai'; text: string }>,
  imageBase64?: string
): Promise<TutorResponse> {
  const effectiveApiKey =
    (apiKey && apiKey.trim()) ||
    getGeminiApiKey() ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';

  if (!effectiveApiKey) {
    const offline = getOfflineStemResponse(query || 'Help with attached diagram');
    return {
      ...offline,
      isLiveGemini: false,
      error: 'No Gemini API key configured.',
    };
  }

  const contents: any[] = [];
  const parts: any[] = [{ text: `${GEMINI_SYSTEM_INSTRUCTION}\n\nStudent's question: "${query}"` }];

  if (imageBase64) {
    const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (match) {
      parts.push({
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      });
    }
  }

  // Include recent conversation context if available
  if (history && history.length > 0) {
    const historyContext = history
      .map((h) => `${h.sender === 'user' ? 'Student' : 'Tutor'}: ${h.text}`)
      .join('\n');
    parts[0].text = `${GEMINI_SYSTEM_INSTRUCTION}\n\nConversation Context:\n${historyContext}\n\nStudent's question: "${query}"`;
  }

  contents.push({
    role: 'user',
    parts,
  });

  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError = '';

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveApiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
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
            const cleanJson = candidateText
              .replace(/^```json\s*/i, '')
              .replace(/^```\s*/i, '')
              .replace(/\s*```$/i, '')
              .trim();

            const parsed = JSON.parse(cleanJson);
            return {
              success: true,
              isLiveGemini: true,
              modelUsed: model,
              text: parsed.text || candidateText,
              equation: parsed.equation || '',
              steps: Array.isArray(parsed.steps) ? parsed.steps : [],
              keyTakeaway: parsed.keyTakeaway || '',
              followUps: Array.isArray(parsed.followUps) ? parsed.followUps : [],
            };
          } catch {
            return {
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
            };
          }
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        lastError = errData?.error?.message || `Gemini API HTTP ${res.status}`;
      }
    } catch (err: any) {
      lastError = err.message || 'Network error connecting to Gemini API';
    }
  }

  // Gracefully fallback to offline STEM engine if API calls fail
  const offline = getOfflineStemResponse(query || 'Help with STEM doubt');
  return {
    ...offline,
    isLiveGemini: false,
    error: `Gemini API: ${lastError}. Serving from SmartLearn STEM Knowledge Base.`,
  };
}

/**
 * Comprehensive STEM Offline Knowledge Base for instant, high-quality responses
 * when offline or when no Gemini API key is configured.
 */
export function getOfflineStemResponse(query: string): TutorResponse {
  const q = query.toLowerCase().trim();

  // 1. Quadratic equations
  if (q.includes('quadratic') || q.includes('2x^2') || q.includes('2x²') || q.includes('discriminant') || q.includes('roots')) {
    return {
      success: true,
      isLiveGemini: false,
      modelUsed: 'SmartLearn STEM Engine',
      text: 'A quadratic equation is a polynomial equation of degree 2: ax² + bx + c = 0. Its roots represent the points where the parabola crosses the x-axis. We solve it using factorization, completing the square, or the quadratic formula:',
      equation: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      steps: [
        'Standard Form: Express equation as ax² + bx + c = 0 and identify coefficients a, b, c.',
        'Discriminant Analysis (Δ = b² - 4ac): Determines nature of roots: Δ > 0 (two distinct real roots), Δ = 0 (one repeated real root), Δ < 0 (two complex conjugate roots).',
        'Substitute into Quadratic Formula: Evaluate the square root of Δ and apply the ± operation.',
        'Solve for both branches: x₁ = (-b + √Δ)/(2a) and x₂ = (-b - √Δ)/(2a).',
        'Verification: Plug roots back into original equation or check Vieta’s formulas: sum = -b/a, product = c/a.',
      ],
      keyTakeaway: 'The discriminant Δ = b² - 4ac tells you everything about the roots without doing the full calculation.',
      followUps: [
        'How do Vieta\'s formulas connect roots to coefficients?',
        'What is the geometric meaning of the vertex of a parabola?',
        'Solve: 3x² - 5x + 2 = 0 step-by-step',
      ],
    };
  }

  // 2. Chain Rule / Differentiation
  if (q.includes('chain rule') || q.includes('composite function') || q.includes('d/dx') || q.includes('derivative') || q.includes('differentiation')) {
    return {
      success: true,
      isLiveGemini: false,
      modelUsed: 'SmartLearn STEM Engine',
      text: 'The Chain Rule is the fundamental differentiation law for composite functions f(g(x)) — a function nested inside another. An intuitive analogy: think of nested Russian nesting dolls (matryoshka); to open the inner doll, you must first open the outer doll, multiplying the rates of change.',
      equation: "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)",
      steps: [
        'Identify outer function f(u) and inner function u = g(x).',
        'Differentiate outer function with respect to the inner argument: f\'(u).',
        'Differentiate inner function with respect to x: g\'(x) = du/dx.',
        'Multiply both derivatives together: dy/dx = (dy/du) · (du/dx).',
        'Example: y = sin(3x² + 1) → outer is sin(u), inner is 3x² + 1 → dy/dx = cos(3x² + 1) · (6x) = 6x·cos(3x² + 1).',
      ],
      keyTakeaway: 'Always work from outside-in: differentiate outer layer, leave inside alone, then multiply by inner derivative.',
      followUps: [
        'How do we apply the Chain Rule to exponential functions like e^(cos x)?',
        'What is the difference between Chain Rule and Product Rule?',
        'Find the derivative of y = ln(x² + 4x + 1)',
      ],
    };
  }

  // 3. Projectile Motion
  if (q.includes('projectile') || q.includes('parabolic') || q.includes('trajectory') || q.includes('range')) {
    return {
      success: true,
      isLiveGemini: false,
      modelUsed: 'SmartLearn STEM Engine',
      text: 'Projectile motion occurs when an object is launched into a gravitational field with an initial velocity v₀ at angle θ. Galileo discovered that horizontal motion (constant velocity) and vertical motion (constant acceleration under gravity) are completely independent.',
      equation: 'y(x) = x \\tan(\\theta) - \\frac{g x^2}{2 v_0^2 \\cos^2(\\theta)}',
      steps: [
        'Decompose initial velocity: v₀x = v₀·cos(θ) and v₀y = v₀·sin(θ).',
        'Horizontal equation (no acceleration): x(t) = v₀·cos(θ)·t → t = x / (v₀·cos(θ)).',
        'Vertical equation (acceleration -g): y(t) = v₀·sin(θ)·t - 0.5·g·t².',
        'Time of flight (when y = 0): T = 2·v₀·sin(θ) / g.',
        'Maximum horizontal range: R = (v₀²·sin(2θ)) / g (achieved maximum at θ = 45° in vacuum).',
        'Maximum height: H = (v₀²·sin²(θ)) / (2g).',
      ],
      keyTakeaway: 'Horizontal velocity never changes during flight (neglecting drag); only vertical velocity is affected by gravity.',
      followUps: [
        'Why does launching at 30° and 60° yield the same horizontal range?',
        'How does air resistance alter the symmetrical parabolic shape?',
        'Calculate maximum height if v₀ = 20 m/s and launch angle is 30°',
      ],
    };
  }

  // 4. Newton's Laws
  if (q.includes('newton') || q.includes('third law') || q.includes('action-reaction') || q.includes('force') || q.includes('f=ma')) {
    return {
      success: true,
      isLiveGemini: false,
      modelUsed: 'SmartLearn STEM Engine',
      text: "Newton's Third Law states that whenever Object A exerts a force on Object B, Object B simultaneously exerts a force of equal magnitude and opposite direction on Object A. A crucial insight: action-reaction pairs act on DIFFERENT bodies, so they never cancel each other out!",
      equation: '\\vec{F}_{AB} = -\\vec{F}_{BA}',
      steps: [
        'Principle of Mutual Interaction: Forces in nature always occur in matched pairs.',
        'Simultaneous Occurrence: There is no time delay between action and reaction.',
        'Act on Separate Objects: Earth pulls an apple down with gravity mg; apple pulls Earth up with gravity mg.',
        'Rocket Propulsion Example: Rocket engines exert downward force expelling hot gas; exhaust gas exerts equal upward thrust on rocket.',
        'Normal Force Distinction: On a table, Normal force N and Gravity mg on a book are NOT a third-law pair because both act on the same book.',
      ],
      keyTakeaway: 'If you want to move forward, you must push something else backward.',
      followUps: [
        'Why doesn\'t a horse pulling a cart cancel with the cart pulling the horse?',
        'Explain Newton\'s Second Law: F = dp/dt and its connection to impulse.',
        'How does a swimmer propel through water using Newton\'s third law?',
      ],
    };
  }

  // 5. QuickSort & Algorithm Complexity
  if (q.includes('quicksort') || q.includes('o(n log n)') || q.includes('sorting') || q.includes('divide and conquer') || q.includes('time complexity')) {
    return {
      success: true,
      isLiveGemini: false,
      modelUsed: 'SmartLearn STEM Engine',
      text: 'QuickSort is an in-place divide-and-conquer sorting algorithm. It selects a "pivot" element and partitions the array such that all smaller elements precede the pivot and all larger elements follow it, then recursively sorts both halves.',
      equation: 'T(n) = 2T(n/2) + O(n) \\implies O(n \\log n)',
      steps: [
        'Pivot Selection: Pick an element (Lomuto uses last element, Hoare uses first/median).',
        'Partitioning: Rearrange array elements so all values ≤ pivot are left, and > pivot are right. This takes O(n) time.',
        'Recursive Call: Apply QuickSort to left sub-array and right sub-array.',
        'Base Case: Sub-arrays of size 0 or 1 are already sorted.',
        'Average Case O(n log n): Tree depth is log₂ n, each level does O(n) comparison work.',
        'Worst Case O(n²): Occurs when pivot is always extreme (already sorted array with naive pivot); avoided via randomized pivot or median-of-three.',
      ],
      keyTakeaway: 'QuickSort is faster in practice than MergeSort due to excellent CPU cache locality and zero extra memory allocation.',
      followUps: [
        'How does 3-way QuickSort handle arrays with many duplicate keys?',
        'Compare QuickSort vs MergeSort: When should each be chosen?',
        'How does Randomized Pivot guarantee O(n log n) with high probability?',
      ],
    };
  }

  // 6. Chemical Bonding & Organic Chemistry
  if (q.includes('bonding') || q.includes('hybridization') || q.includes('electronegativity') || q.includes('covalent') || q.includes('sn1') || q.includes('sn2') || q.includes('organic')) {
    return {
      success: true,
      isLiveGemini: false,
      modelUsed: 'SmartLearn STEM Engine',
      text: 'Chemical bonding is driven by the octet rule and energy minimization. Hybridization explains molecular geometry by mixing atomic orbitals (s and p) into identical hybrid orbitals that maximize spatial separation according to VSEPR theory.',
      equation: '\\text{Steric Number} = (\\text{Lone Pairs}) + (\\sigma\\text{-Bonds})',
      steps: [
        'Count total valence electrons for all atoms in the species.',
        'Determine central atom (least electronegative, excluding Hydrogen).',
        'Calculate Steric Number: SN = 4 → sp³ (tetrahedral, 109.5°), SN = 3 → sp² (trigonal planar, 120°), SN = 2 → sp (linear, 180°).',
        'Account for lone pair repulsion: Lone pairs occupy more space than bonding pairs, compressing bond angles (e.g., Water H₂O is 104.5°).',
        'Sigma (σ) vs Pi (π) bonds: Single bond is 1 σ; double bond is 1 σ + 1 π; triple bond is 1 σ + 2 π.',
      ],
      keyTakeaway: 'Molecular shape is determined by electron domain geometry minus the invisible lone pairs.',
      followUps: [
        'Why is CO₂ linear and non-polar, while SO₂ is bent and polar?',
        'Explain the difference between SN1 and SN2 reaction mechanisms.',
        'Determine the hybridization of carbon in ethylene (C₂H₄).',
      ],
    };
  }

  // 7. Electromagnetic Induction & Faraday's Law
  if (q.includes('faraday') || q.includes('induction') || q.includes('lenz') || q.includes('magnetic flux') || q.includes('emf')) {
    return {
      success: true,
      isLiveGemini: false,
      modelUsed: 'SmartLearn STEM Engine',
      text: "Faraday's Law of Electromagnetic Induction states that any change in magnetic flux through a closed conducting loop induces an electromotive force (EMF). Lenz's Law provides the negative sign, demonstrating conservation of energy: the induced current always opposes the change in flux that created it.",
      equation: '\\mathcal{E} = -N \\frac{d\\Phi_B}{dt} = -N \\frac{d}{dt}(B \\cdot A \\cdot \\cos\\theta)',
      steps: [
        'Magnetic Flux Definition: Φ_B = B · A · cos(θ), where θ is angle between magnetic field B and area normal vector.',
        'Three Ways to Change Flux: Change B magnitude, change loop area A, or rotate the loop (change θ).',
        'Lenz\'s Law (Negative Sign): If flux increases, induced B opposes it; if flux decreases, induced B reinforces it.',
        'Right Hand Rule: Curl fingers in direction of induced current; thumb points in direction of induced magnetic field.',
        'Applications: Electric generators, transformers, induction cooktops, and magnetic braking.',
      ],
      keyTakeaway: 'Nature resists changes in magnetic flux — Lenz’s law is just energy conservation in electromagnetic clothing.',
      followUps: [
        'How does an AC generator convert rotational kinetic energy into voltage?',
        'Explain eddy currents and how laminated transformer cores reduce energy losses.',
        'What is self-inductance and back EMF in an RL circuit?',
      ],
    };
  }

  // 8. General STEM Structured Reasoning Fallback
  return {
    success: true,
    isLiveGemini: false,
    modelUsed: 'SmartLearn STEM Engine',
    text: `Here is a structured, first-principles explanation for "${query}":`,
    equation: '\\text{Mastery} = \\text{Conceptual Clarity} + \\text{Deliberate Practice}',
    steps: [
      'Foundational Principle: Break the concept into its primitive components (First-Principles Thinking).',
      'Identify Givens & Constraints: Write down known variables, physical laws, and boundary conditions.',
      'Governing Relationship: Determine the mathematical theorem or scientific law that connects inputs to outputs.',
      'Step-by-Step Resolution: Execute algebra cleanly, verify dimensional consistency, and inspect limiting cases.',
      'Pro Tip: Add your Google Gemini API Key in settings for real-time, personalized AI tutoring on any advanced problem!',
    ],
    keyTakeaway: 'Deep understanding comes from mastering the derivation, not merely memorizing final results.',
    followUps: [
      `Can you give a practical numerical example of ${query}?`,
      `What are the most common student misconceptions regarding ${query}?`,
      `How does this connect to real-world engineering or scientific applications?`,
    ],
  };
}
