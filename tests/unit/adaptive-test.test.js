const test = require('node:test');
const assert = require('node:assert');

// Adaptive difficulty logic unit tests
function calculateNextDifficulty(currentDifficulty, consecutiveCorrect) {
  if (consecutiveCorrect >= 2) {
    if (currentDifficulty === 'Easy') return 'Medium';
    if (currentDifficulty === 'Medium') return 'Hard';
    if (currentDifficulty === 'Hard') return 'Olympiad';
    return 'Olympiad';
  }
  if (consecutiveCorrect === 0) {
    if (currentDifficulty === 'Olympiad') return 'Hard';
    if (currentDifficulty === 'Hard') return 'Medium';
    if (currentDifficulty === 'Medium') return 'Easy';
    return 'Easy';
  }
  return currentDifficulty;
}

function calculateLevelFromXP(xp) {
  return Math.floor(xp / 200) + 1;
}

test('Adaptive Difficulty Scaling Algorithm', async (t) => {
  await t.test('raises difficulty after 2 consecutive correct answers', () => {
    assert.strictEqual(calculateNextDifficulty('Easy', 2), 'Medium');
    assert.strictEqual(calculateNextDifficulty('Medium', 2), 'Hard');
    assert.strictEqual(calculateNextDifficulty('Hard', 2), 'Olympiad');
  });

  await t.test('lowers difficulty after incorrect answer', () => {
    assert.strictEqual(calculateNextDifficulty('Olympiad', 0), 'Hard');
    assert.strictEqual(calculateNextDifficulty('Hard', 0), 'Medium');
    assert.strictEqual(calculateNextDifficulty('Medium', 0), 'Easy');
  });

  await t.test('maintains difficulty on single correct answer', () => {
    assert.strictEqual(calculateNextDifficulty('Medium', 1), 'Medium');
  });
});

test('Gamification Level Calculation', async (t) => {
  await t.test('correctly calculates level based on XP thresholds', () => {
    assert.strictEqual(calculateLevelFromXP(0), 1);
    assert.strictEqual(calculateLevelFromXP(199), 1);
    assert.strictEqual(calculateLevelFromXP(200), 2);
    assert.strictEqual(calculateLevelFromXP(2450), 13);
  });
});
