const test = require('node:test');
const assert = require('node:assert');

// Leitner active recall interval calculation and XP rewards
const INTERVAL_MINUTES = {
  again: 1,
  hard: 10,
  good: 1440,    // 1 day
  easy: 5760,    // 4 days
};

function calculateNextInterval(rating) {
  return INTERVAL_MINUTES[rating] || 1;
}

function calculateRecallXP(rating) {
  if (rating === 'easy') return 30;
  if (rating === 'good') return 20;
  if (rating === 'hard') return 15;
  return 10; // 'again'
}

function updateCardMastery(currentMastery, rating) {
  if (rating === 'again') return 'learning';
  if (rating === 'hard') return 'review';
  if (rating === 'good') return currentMastery === 'learning' ? 'review' : 'mastered';
  if (rating === 'easy') return 'mastered';
  return 'learning';
}

test('Spaced Repetition & Active Recall Engine', async (t) => {
  await t.test('calculates correct repetition intervals', () => {
    assert.strictEqual(calculateNextInterval('again'), 1);
    assert.strictEqual(calculateNextInterval('hard'), 10);
    assert.strictEqual(calculateNextInterval('good'), 1440);
    assert.strictEqual(calculateNextInterval('easy'), 5760);
  });

  await t.test('awards proportional XP based on recall quality', () => {
    assert.strictEqual(calculateRecallXP('easy'), 30);
    assert.strictEqual(calculateRecallXP('good'), 20);
    assert.strictEqual(calculateRecallXP('hard'), 15);
    assert.strictEqual(calculateRecallXP('again'), 10);
  });

  await t.test('progresses mastery level through ratings', () => {
    assert.strictEqual(updateCardMastery('learning', 'again'), 'learning');
    assert.strictEqual(updateCardMastery('learning', 'hard'), 'review');
    assert.strictEqual(updateCardMastery('learning', 'good'), 'review');
    assert.strictEqual(updateCardMastery('review', 'good'), 'mastered');
    assert.strictEqual(updateCardMastery('learning', 'easy'), 'mastered');
  });
});
