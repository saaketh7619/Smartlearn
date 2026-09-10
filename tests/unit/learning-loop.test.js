const test = require('node:test');
const assert = require('node:assert');

// Test grading, error classification, and learning loop extraction
function gradeTest(questions, selectedAnswers) {
  let score = 0;
  let conceptualErrors = 0;
  let carelessErrors = 0;
  const weakTopics = [];

  questions.forEach((q, idx) => {
    const selected = selectedAnswers[idx];
    if (selected === q.correctAnswerIndex) {
      score += 10;
    } else {
      weakTopics.push(q.topic);
      if (selected !== undefined) {
        if (q.difficulty === 'Hard' || q.difficulty === 'Olympiad') {
          conceptualErrors++;
        } else {
          carelessErrors++;
        }
      } else {
        conceptualErrors++;
      }
    }
  });

  const maxScore = questions.length * 10;
  const percentage = Math.round((score / maxScore) * 100);

  return { score, maxScore, percentage, conceptualErrors, carelessErrors, weakTopics };
}

function generatePlannerTasks(weakTopics, subject = 'Mathematics') {
  return weakTopics.map((topic, i) => ({
    id: `task-gen-${i}`,
    title: `Diagnostic Review: ${topic}`,
    subject,
    durationMinutes: 30,
    priority: 'High',
  }));
}

test('Adaptive Learning Loop & Weak Topic Remediation', async (t) => {
  const mockQuestions = [
    { id: 'q1', topic: 'Differentiation', correctAnswerIndex: 0, difficulty: 'Easy' },
    { id: 'q2', topic: 'Quadratic Equations', correctAnswerIndex: 1, difficulty: 'Medium' },
    { id: 'q3', topic: 'Limits', correctAnswerIndex: 2, difficulty: 'Hard' },
    { id: 'q4', topic: 'Combinatorics', correctAnswerIndex: 3, difficulty: 'Olympiad' },
  ];

  await t.test('calculates 100% on perfect answers', () => {
    const result = gradeTest(mockQuestions, { 0: 0, 1: 1, 2: 2, 3: 3 });
    assert.strictEqual(result.score, 40);
    assert.strictEqual(result.percentage, 100);
    assert.strictEqual(result.weakTopics.length, 0);
  });

  await t.test('classifies Hard/Olympiad mistakes as conceptual errors', () => {
    // Correct on q1, q2; incorrect on q3 (Hard), q4 (Olympiad)
    const result = gradeTest(mockQuestions, { 0: 0, 1: 1, 2: 0, 3: 0 });
    assert.strictEqual(result.score, 20);
    assert.strictEqual(result.percentage, 50);
    assert.strictEqual(result.conceptualErrors, 2);
    assert.strictEqual(result.carelessErrors, 0);
    assert.deepStrictEqual(result.weakTopics, ['Limits', 'Combinatorics']);
  });

  await t.test('classifies Easy/Medium mistakes as careless errors', () => {
    // Incorrect on q1 (Easy); correct on q2, q3, q4
    const result = gradeTest(mockQuestions, { 0: 1, 1: 1, 2: 2, 3: 3 });
    assert.strictEqual(result.score, 30);
    assert.strictEqual(result.carelessErrors, 1);
    assert.strictEqual(result.conceptualErrors, 0);
    assert.deepStrictEqual(result.weakTopics, ['Differentiation']);
  });

  await t.test('synthesizes study planner tasks from weak topics', () => {
    const tasks = generatePlannerTasks(['Quadratic Equations', 'Combinatorics'], 'Mathematics');
    assert.strictEqual(tasks.length, 2);
    assert.strictEqual(tasks[0].title, 'Diagnostic Review: Quadratic Equations');
    assert.strictEqual(tasks[0].priority, 'High');
  });
});
