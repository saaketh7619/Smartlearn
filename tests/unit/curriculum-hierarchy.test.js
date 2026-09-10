const test = require('node:test');
const assert = require('node:assert');

// =========================================================================
// Curriculum Hierarchy Definition & Validation Tests
// =========================================================================

const EDUCATIONAL_LEVELS = [
  'School',
  'Intermediate / Higher Secondary',
  'College / University (Undergraduate)',
  'B.Tech (Engineering)',
  'M.Tech (Postgraduate)',
  'Other / Professional Courses',
];

const SCHOOL_STREAMS = {
  Primary: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
  Secondary: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
};

const INTERMEDIATE_STREAMS = {
  'MPC (Maths, Physics, Chemistry)': ['Class 11 (1st Year)', 'Class 12 (2nd Year)'],
  'BiPC (Biology, Physics, Chemistry)': ['Class 11 (1st Year)', 'Class 12 (2nd Year)'],
  'MEC (Maths, Economics, Commerce)': ['Class 11 (1st Year)', 'Class 12 (2nd Year)'],
  'CEC (Civics, Economics, Commerce)': ['Class 11 (1st Year)', 'Class 12 (2nd Year)'],
  'HEC (History, Economics, Civics)': ['Class 11 (1st Year)', 'Class 12 (2nd Year)'],
};

const BTECH_STREAMS = [
  'Computer Science and Engineering (CSE)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
];

const CLASS_10_SUBJECTS = [
  { name: 'Mathematics', chaptersCount: 14, firstChapter: 'Chapter 1: Real Numbers', lastChapter: 'Chapter 14: Probability' },
  { name: 'Science', chaptersCount: 13, firstChapter: 'Chapter 1: Chemical Reactions and Equations' },
  { name: 'English', chaptersCount: 5, firstChapter: 'Chapter 1: A Letter to God' },
  { name: 'Social Science', chaptersCount: 8, firstChapter: 'Chapter 1: Resources and Development' },
  { name: 'Information Technology', chaptersCount: 3, firstChapter: 'Chapter 1: Digital Documentation (Advanced)' },
];

function getClassAncestors(classId, levels) {
  for (const level of levels) {
    for (const stream of level.streams || []) {
      for (const cls of stream.classes || []) {
        if (cls.id === classId) {
          return { level: level.name, stream: stream.name, classLevel: cls.name };
        }
      }
    }
  }
  return null;
}

function filterPublishedSubjects(subjects) {
  return subjects.filter((s) => s.status === 'published');
}

function calculateCurriculumStats(levels) {
  let published = 0;
  let draft = 0;
  let archived = 0;
  let chapters = 0;

  for (const l of levels) {
    for (const s of l.streams || []) {
      for (const c of s.classes || []) {
        for (const sub of c.subjects || []) {
          if (sub.status === 'published') published++;
          else if (sub.status === 'draft') draft++;
          else archived++;
          chapters += (sub.chapters || []).length;
        }
      }
    }
  }
  return { published, draft, archived, chapters };
}

test('Curriculum Hierarchy — Academic Catalogue Structure', async (t) => {
  await t.test('has 6 educational levels matching official requirements', () => {
    assert.strictEqual(EDUCATIONAL_LEVELS.length, 6);
    assert.ok(EDUCATIONAL_LEVELS.includes('School'));
    assert.ok(EDUCATIONAL_LEVELS.includes('Intermediate / Higher Secondary'));
    assert.ok(EDUCATIONAL_LEVELS.includes('College / University (Undergraduate)'));
    assert.ok(EDUCATIONAL_LEVELS.includes('B.Tech (Engineering)'));
    assert.ok(EDUCATIONAL_LEVELS.includes('M.Tech (Postgraduate)'));
    assert.ok(EDUCATIONAL_LEVELS.includes('Other / Professional Courses'));
  });

  await t.test('School level accurately splits into Primary (1-5) and Secondary (6-10)', () => {
    assert.strictEqual(SCHOOL_STREAMS.Primary.length, 5);
    assert.strictEqual(SCHOOL_STREAMS.Secondary.length, 5);
    assert.deepStrictEqual(SCHOOL_STREAMS.Primary, ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5']);
    assert.deepStrictEqual(SCHOOL_STREAMS.Secondary, ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']);
  });

  await t.test('Intermediate level provides MPC, BiPC, MEC, CEC, HEC streams', () => {
    const streamKeys = Object.keys(INTERMEDIATE_STREAMS);
    assert.strictEqual(streamKeys.length, 5);
    for (const stream of streamKeys) {
      assert.strictEqual(INTERMEDIATE_STREAMS[stream].length, 2);
    }
  });

  await t.test('B.Tech level contains core engineering streams', () => {
    assert.ok(BTECH_STREAMS.includes('Computer Science and Engineering (CSE)'));
    assert.ok(BTECH_STREAMS.includes('Artificial Intelligence & Data Science (AI & DS)'));
    assert.ok(BTECH_STREAMS.includes('Electronics and Communication Engineering (ECE)'));
    assert.strictEqual(BTECH_STREAMS.length, 6);
  });
});

test('Curriculum Data — Class 10 Syllabus Integrity', async (t) => {
  await t.test('Class 10 contains 5 core subjects', () => {
    assert.strictEqual(CLASS_10_SUBJECTS.length, 5);
    const names = CLASS_10_SUBJECTS.map((s) => s.name);
    assert.deepStrictEqual(names, ['Mathematics', 'Science', 'English', 'Social Science', 'Information Technology']);
  });

  await t.test('Mathematics has 14 chapters from Real Numbers to Probability', () => {
    const math = CLASS_10_SUBJECTS.find((s) => s.name === 'Mathematics');
    assert.ok(math);
    assert.strictEqual(math.chaptersCount, 14);
    assert.strictEqual(math.firstChapter, 'Chapter 1: Real Numbers');
    assert.strictEqual(math.lastChapter, 'Chapter 14: Probability');
  });

  await t.test('Science has 13 chapters starting with Chemical Reactions and Equations', () => {
    const sci = CLASS_10_SUBJECTS.find((s) => s.name === 'Science');
    assert.ok(sci);
    assert.strictEqual(sci.chaptersCount, 13);
    assert.strictEqual(sci.firstChapter, 'Chapter 1: Chemical Reactions and Equations');
  });
});

test('Curriculum Logic — Status Filtering & Ancestor Resolution', async (t) => {
  const mockLevels = [
    {
      name: 'School',
      streams: [
        {
          name: 'Secondary',
          classes: [
            {
              id: 'cls-sec-10',
              name: 'Class 10',
              subjects: [
                { id: 'sub-1', name: 'Math', status: 'published', chapters: [{}, {}] },
                { id: 'sub-2', name: 'Science', status: 'draft', chapters: [{}] },
                { id: 'sub-3', name: 'English', status: 'published', chapters: [{}] },
              ],
            },
          ],
        },
      ],
    },
  ];

  await t.test('getClassAncestors resolves breadcrumb hierarchy accurately', () => {
    const ancestors = getClassAncestors('cls-sec-10', mockLevels);
    assert.ok(ancestors);
    assert.strictEqual(ancestors.level, 'School');
    assert.strictEqual(ancestors.stream, 'Secondary');
    assert.strictEqual(ancestors.classLevel, 'Class 10');
  });

  await t.test('filterPublishedSubjects only returns subjects with published status', () => {
    const subs = mockLevels[0].streams[0].classes[0].subjects;
    const published = filterPublishedSubjects(subs);
    assert.strictEqual(published.length, 2);
    assert.strictEqual(published[0].id, 'sub-1');
    assert.strictEqual(published[1].id, 'sub-3');
  });

  await t.test('calculateCurriculumStats aggregates subjects and chapters accurately', () => {
    const stats = calculateCurriculumStats(mockLevels);
    assert.strictEqual(stats.published, 2);
    assert.strictEqual(stats.draft, 1);
    assert.strictEqual(stats.archived, 0);
    assert.strictEqual(stats.chapters, 4);
  });
});
