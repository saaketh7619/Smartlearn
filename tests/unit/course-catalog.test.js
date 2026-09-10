const test = require('node:test');
const assert = require('node:assert');

// Mock catalog sample for deterministic unit testing
const SAMPLE_COURSES = [
  { id: 'c-1', title: 'Differential Calculus', subject: 'Mathematics', difficulty: 'Intermediate', rating: 4.92, enrollmentCount: 420, durationHours: 18 },
  { id: 'c-2', title: 'Newtonian Kinematics', subject: 'Physics', difficulty: 'Intermediate', rating: 4.88, enrollmentCount: 380, durationHours: 14 },
  { id: 'c-3', title: 'Python for AI', subject: 'Computer Science', difficulty: 'Beginner', rating: 4.96, enrollmentCount: 512, durationHours: 24 },
  { id: 'c-4', title: 'Organic Chemistry', subject: 'Chemistry', difficulty: 'Advanced', rating: 4.85, enrollmentCount: 290, durationHours: 16 },
  { id: 'c-5', title: 'Critical Thinking', subject: 'Literature & Humanities', difficulty: 'Beginner', rating: 4.79, enrollmentCount: 275, durationHours: 10 },
];

function filterCourses(courses, { search = '', subject = 'All', difficulty = 'All' } = {}) {
  return courses.filter((c) => {
    const matchesSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subject === 'All' || c.subject === subject;
    const matchesDifficulty = difficulty === 'All' || c.difficulty === difficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });
}

function sortCourses(courses, sortBy = 'featured') {
  const copy = [...courses];
  if (sortBy === 'rating') return copy.sort((a, b) => b.rating - a.rating);
  if (sortBy === 'popular') return copy.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
  if (sortBy === 'duration') return copy.sort((a, b) => b.durationHours - a.durationHours);
  if (sortBy === 'title') return copy.sort((a, b) => a.title.localeCompare(b.title));
  return copy;
}

test('Course Catalog Filtering & Sorting', async (t) => {
  await t.test('filters by search keyword', () => {
    const results = filterCourses(SAMPLE_COURSES, { search: 'calculus' });
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].id, 'c-1');
  });

  await t.test('filters by subject', () => {
    const results = filterCourses(SAMPLE_COURSES, { subject: 'Physics' });
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].id, 'c-2');
  });

  await t.test('filters by difficulty level', () => {
    const results = filterCourses(SAMPLE_COURSES, { difficulty: 'Beginner' });
    assert.strictEqual(results.length, 2);
  });

  await t.test('combines search, subject, and difficulty filters', () => {
    const results = filterCourses(SAMPLE_COURSES, { search: 'python', subject: 'Computer Science', difficulty: 'Beginner' });
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].title, 'Python for AI');
  });

  await t.test('sorts by highest rating', () => {
    const sorted = sortCourses(SAMPLE_COURSES, 'rating');
    assert.strictEqual(sorted[0].id, 'c-3'); // 4.96 rating
  });

  await t.test('sorts by most popular enrollment count', () => {
    const sorted = sortCourses(SAMPLE_COURSES, 'popular');
    assert.strictEqual(sorted[0].id, 'c-3'); // 512 enrolled
  });

  await t.test('sorts alphabetically by title', () => {
    const sorted = sortCourses(SAMPLE_COURSES, 'title');
    assert.strictEqual(sorted[0].title, 'Critical Thinking');
  });
});
