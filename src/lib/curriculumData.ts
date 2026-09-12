/**
 * curriculumData.ts
 * Educational hierarchy constants and initial curriculum seed data.
 *
 * This file defines the structural skeleton. Actual content (textbook links,
 * PDFs, notes, practice questions) is added by Admins via the Curriculum CMS
 * and stored in db.ts (localStorage-persisted in the static build).
 */

import {
  EducationalLevel,
  Subject,
  Chapter,
  Concept,
  LearningResource,
  AuditInfo,
} from '@/types';

const SYSTEM_AUDIT: AuditInfo = {
  uploadedBy: 'system',
  uploadedAt: new Date('2026-01-01').toISOString(),
};

// ============================================================
// HELPER BUILDERS
// ============================================================

let _idCounter = 1000;
function uid(prefix = 'id') {
  return `${prefix}-${_idCounter++}`;
}

function makeResource(
  parentId: string,
  parentType: 'chapter' | 'concept',
  title: string,
  type: LearningResource['type'],
  status: 'draft' | 'published' | 'archived' = 'draft'
): LearningResource {
  return {
    id: uid('res'),
    parentId,
    parentType,
    type,
    title,
    tags: [],
    language: 'English',
    status,
    audit: SYSTEM_AUDIT,
    viewCount: 0,
  };
}

function makeConcept(chapterId: string, title: string, order: number): Concept {
  return {
    id: uid('con'),
    chapterId,
    title,
    displayOrder: order,
    resources: [],
  };
}

function makeTextbookResource(
  title: string,
  fileUrl?: string,
  externalUrl?: string,
  source?: string
): LearningResource {
  return {
    id: uid('res'),
    parentId: '',
    parentType: 'chapter',
    type: 'textbook',
    title,
    description: `Official NCERT Class 10 textbook unit: ${title}`,
    fileUrl,
    externalUrl,
    source: source || 'NCERT Class 10 Official Textbook',
    tags: ['NCERT', 'Textbook', 'Class 10', 'CBSE'],
    language: 'English',
    status: 'published',
    audit: SYSTEM_AUDIT,
    viewCount: 48,
  };
}

function makeChapter(
  subjectId: string,
  title: string,
  order: number,
  concepts: string[],
  resources: LearningResource[] = []
): Chapter {
  const chapterId = uid('chap');
  return {
    id: chapterId,
    subjectId,
    title,
    displayOrder: order,
    concepts: concepts.map((t, i) => makeConcept(chapterId, t, i + 1)),
    resources: resources.map((r) => ({ ...r, parentId: chapterId })),
  };
}

// ============================================================
// CLASS 10 — PLACEHOLDER CURRICULUM (CBSE)
// Admin must upload actual content via the Curriculum CMS.
// ============================================================

const mathSubjectId = uid('sub');
const sciSubjectId = uid('sub');
const engSubjectId = uid('sub');
const socialSubjectId = uid('sub');
const itSubjectId = uid('sub');

export const CLASS_10_SUBJECTS_PLACEHOLDER: Subject[] = [
  {
    id: mathSubjectId,
    classId: 'class-10',
    name: 'Mathematics',
    board: 'CBSE',
    academicYear: '2025-26',
    language: 'English',
    description: 'NCERT Mathematics for Class 10 — Algebra, Geometry, Trigonometry, Statistics & Probability',
    status: 'published',
    audit: SYSTEM_AUDIT,
    chapters: [
      makeChapter(
        mathSubjectId,
        'Real Numbers',
        1,
        [
          'Euclid\'s Division Lemma',
          'Fundamental Theorem of Arithmetic',
          'Irrational Numbers',
          'Rational Numbers and their Decimal Expansions',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 1 - Real Numbers',
            '/textbooks/class-10/mathematics/jemh101.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
          makeTextbookResource(
            'Preliminary Pages & Syllabus Guide',
            '/textbooks/class-10/mathematics/jemh1ps.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Polynomials',
        2,
        [
          'Geometrical Meaning of Zeroes of a Polynomial',
          'Relationship between Zeroes and Coefficients of a Polynomial',
          'Division Algorithm for Polynomials',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 2 - Polynomials',
            '/textbooks/class-10/mathematics/jemh102.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Pair of Linear Equations in Two Variables',
        3,
        [
          'Graphical Method of Solution',
          'Substitution Method',
          'Elimination Method',
          'Cross-Multiplication Method',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 3 - Pair of Linear Equations in Two Variables',
            '/textbooks/class-10/mathematics/jemh103.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Quadratic Equations',
        4,
        [
          'Standard Form of a Quadratic Equation',
          'Solution by Factorisation',
          'Solution by Completing the Square',
          'Nature of Roots & Discriminant',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 4 - Quadratic Equations',
            '/textbooks/class-10/mathematics/jemh104.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Arithmetic Progressions',
        5,
        [
          'Introduction to AP',
          'nth Term of an AP',
          'Sum of First n Terms of an AP',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 5 - Arithmetic Progressions',
            '/textbooks/class-10/mathematics/jemh105.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Triangles',
        6,
        [
          'Similar Figures',
          'Similarity of Triangles',
          'Basic Proportionality Theorem',
          'Pythagoras Theorem',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 6 - Triangles',
            '/textbooks/class-10/mathematics/jemh106.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Coordinate Geometry',
        7,
        [
          'Distance Formula',
          'Section Formula',
          'Area of a Triangle',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 7 - Coordinate Geometry',
            '/textbooks/class-10/mathematics/jemh107.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Introduction to Trigonometry',
        8,
        [
          'Trigonometric Ratios',
          'Trigonometric Ratios of Some Specific Angles',
          'Trigonometric Identities',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 8 - Introduction to Trigonometry',
            '/textbooks/class-10/mathematics/jemh108.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Applications of Trigonometry',
        9,
        [
          'Heights and Distances',
          'Angle of Elevation & Depression',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 9 - Applications of Trigonometry',
            '/textbooks/class-10/mathematics/jemh109.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Circles',
        10,
        [
          'Tangent to a Circle',
          'Number of Tangents from a Point on a Circle',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 10 - Circles',
            '/textbooks/class-10/mathematics/jemh110.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Areas Related to Circles',
        11,
        [
          'Perimeter and Area of a Circle',
          'Areas of Sector and Segment',
          'Areas of Combinations of Plane Figures',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 11 - Areas Related to Circles',
            '/textbooks/class-10/mathematics/jemh111.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Surface Areas and Volumes',
        12,
        [
          'Surface Area of a Combination of Solids',
          'Volume of a Combination of Solids',
          'Conversion of Solid from One Shape to Another',
          'Frustum of a Cone',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 12 - Surface Areas and Volumes',
            '/textbooks/class-10/mathematics/jemh112.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Statistics',
        13,
        [
          'Mean of Grouped Data',
          'Mode of Grouped Data',
          'Median of Grouped Data',
          'Graphical Representation: Ogive',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 13 - Statistics',
            '/textbooks/class-10/mathematics/jemh113.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
      makeChapter(
        mathSubjectId,
        'Probability',
        14,
        [
          'Probability — A Theoretical Approach',
          'Classical Definition of Probability',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 14 - Probability',
            '/textbooks/class-10/mathematics/jemh114.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
          makeTextbookResource(
            'Answers & Hints to Exercises',
            '/textbooks/class-10/mathematics/jemh1an.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
          makeTextbookResource(
            'Appendix 1: Proofs in Mathematics',
            '/textbooks/class-10/mathematics/jemh1a1.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
          makeTextbookResource(
            'Appendix 2: Mathematical Modelling',
            '/textbooks/class-10/mathematics/jemh1a2.pdf',
            undefined,
            'NCERT Class 10 Mathematics'
          ),
        ]
      ),
    ],
  },
  {
    id: sciSubjectId,
    classId: 'class-10',
    name: 'Science',
    board: 'CBSE',
    academicYear: '2025-26',
    language: 'English',
    description: 'NCERT Science for Class 10 — Physics, Chemistry, Biology integrated',
    status: 'published',
    audit: SYSTEM_AUDIT,
    chapters: [
      makeChapter(
        sciSubjectId,
        'Chemical Reactions and Equations',
        1,
        [
          'Chemical Equations',
          'Types of Chemical Reactions',
          'Effects of Oxidation Reactions in Everyday Life',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 1 - Chemical Reactions and Equations',
            '/textbooks/class-10/science/jesc101.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
          makeTextbookResource(
            'Preliminary Pages & Science Lab Guidelines',
            '/textbooks/class-10/science/jesc1ps.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
      makeChapter(
        sciSubjectId,
        'Acids, Bases and Salts',
        2,
        [
          'Understanding Acids, Bases and Salts',
          'pH Scale',
          'Salts and their Applications',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 2 - Acids, Bases and Salts',
            '/textbooks/class-10/science/jesc102.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
      makeChapter(
        sciSubjectId,
        'Metals and Non-metals',
        3,
        [
          'Physical Properties of Metals and Non-metals',
          'Reactivity Series',
          'Corrosion and Prevention',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 3 - Metals and Non-metals',
            '/textbooks/class-10/science/jesc103.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
      makeChapter(
        sciSubjectId,
        'Carbon and its Compounds',
        4,
        [
          'Bonding in Carbon Compounds',
          'Saturated and Unsaturated Carbon Compounds',
          'Nomenclature of Carbon Compounds',
          'Important Carbon Compounds — Ethanol and Ethanoic Acid',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 4 - Carbon and its Compounds',
            '/textbooks/class-10/science/jesc104.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
      makeChapter(
        sciSubjectId,
        'Life Processes',
        5,
        [
          'Nutrition — Autotrophic and Heterotrophic',
          'Respiration',
          'Transportation in Plants and Animals',
          'Excretion',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 5 - Life Processes',
            '/textbooks/class-10/science/jesc105.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
      makeChapter(
        sciSubjectId,
        'Control and Coordination',
        6,
        [
          'Nervous System in Animals',
          'Coordination in Plants',
          'Hormones in Animals',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 6 - Control and Coordination',
            '/textbooks/class-10/science/jesc106.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
      makeChapter(
        sciSubjectId,
        'How do Organisms Reproduce?',
        7,
        [
          'Asexual Reproduction',
          'Sexual Reproduction',
          'Reproductive Health',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 7 - How do Organisms Reproduce?',
            '/textbooks/class-10/science/jesc107.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
      makeChapter(
        sciSubjectId,
        'Heredity',
        8,
        [
          'Accumulation of Variation During Reproduction',
          'Mendel\'s Laws of Heredity',
          'Sex Determination',
          'Speciation and Evolution',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 8 - Heredity',
            '/textbooks/class-10/science/jesc108.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
      makeChapter(
        sciSubjectId,
        'Light — Reflection and Refraction',
        9,
        [
          'Reflection of Light by Curved Surfaces',
          'Mirror Formula and Magnification',
          'Refraction of Light',
          'Lens Formula and Power of a Lens',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 9 - Light — Reflection and Refraction',
            '/textbooks/class-10/science/jesc109.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
      makeChapter(
        sciSubjectId,
        'Human Eye and Colourful World',
        10,
        [
          'Human Eye',
          'Defects of Vision and their Correction',
          'Refraction of Light through a Prism',
          'Atmospheric Refraction',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 10 - Human Eye and Colourful World',
            '/textbooks/class-10/science/jesc110.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
      makeChapter(
        sciSubjectId,
        'Electricity',
        11,
        [
          'Electric Current and Circuit',
          'Electric Potential and Potential Difference',
          'Ohm\'s Law',
          'Factors on which Resistance Depends',
          'Heating Effect of Electric Current — Joule\'s Law',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 11 - Electricity',
            '/textbooks/class-10/science/jesc111.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
      makeChapter(
        sciSubjectId,
        'Magnetic Effects of Electric Current',
        12,
        [
          'Magnetic Field and Field Lines',
          'Magnetic Field due to a Current-Carrying Conductor',
          'Force on a Current-Carrying Conductor in a Magnetic Field',
          'Electric Motor and Generator',
          'Domestic Electric Circuits',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 12 - Magnetic Effects of Electric Current',
            '/textbooks/class-10/science/jesc112.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
      makeChapter(
        sciSubjectId,
        'Our Environment',
        13,
        [
          'Eco-System and its Components',
          'Food Chains and Webs',
          'Ozone Layer and How it is Getting Depleted',
          'Managing the Garbage We Produce',
        ],
        [
          makeTextbookResource(
            'NCERT Textbook: Chapter 13 - Our Environment',
            '/textbooks/class-10/science/jesc113.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
          makeTextbookResource(
            'Answers & Solutions to In-Text Questions',
            '/textbooks/class-10/science/jesc1an.pdf',
            undefined,
            'NCERT Class 10 Science'
          ),
        ]
      ),
    ],
  },
  {
    id: engSubjectId,
    classId: 'class-10',
    name: 'English',
    board: 'CBSE',
    academicYear: '2025-26',
    language: 'English',
    description: 'CBSE English (Language & Literature) for Class 10 — First Flight & Footprints Without Feet',
    status: 'published',
    audit: SYSTEM_AUDIT,
    chapters: [
      makeChapter(engSubjectId, 'A Letter to God (First Flight)', 1, [
        'Story Summary & Comprehension',
        'Author & Theme',
        'Character Analysis',
        'Important Questions',
      ]),
      makeChapter(engSubjectId, 'Nelson Mandela: Long Walk to Freedom', 2, [
        'Extract from Autobiography',
        'Values and Lessons',
        'Vocabulary & Grammar',
      ]),
      makeChapter(engSubjectId, 'Two Stories about Flying', 3, [
        'His First Flight — Liam O\'Flaherty',
        'Black Aeroplane — Frederick Forsyth',
      ]),
      makeChapter(engSubjectId, 'From the Diary of Anne Frank', 4, [
        'Historical Context',
        'Story Analysis',
        'Writing Style',
      ]),
      makeChapter(engSubjectId, 'Grammar & Writing Skills', 5, [
        'Formal Letter Writing',
        'Notice Writing',
        'Paragraph Writing',
        'Grammar — Tenses, Voice, Reported Speech',
      ]),
    ],
  },
  {
    id: socialSubjectId,
    classId: 'class-10',
    name: 'Social Science',
    board: 'CBSE',
    academicYear: '2025-26',
    language: 'English',
    description: 'CBSE Social Science for Class 10 — History, Geography, Civics & Economics',
    status: 'published',
    audit: SYSTEM_AUDIT,
    chapters: [
      makeChapter(
        socialSubjectId,
        'The Rise of Nationalism in Europe (History)',
        1,
        [
          'The French Revolution and the Idea of the Nation',
          'The Making of Nationalism in Europe',
          'The Age of Revolutions: 1830-1848',
          'Visualising the Nation',
        ],
        [
          makeTextbookResource(
            'NCERT E-Textbook: History Chapter 1 - The Rise of Nationalism in Europe',
            undefined,
            'https://ncert.nic.in/textbook.php?jess1=1-5',
            'NCERT Class 10 India and the Contemporary World-II'
          ),
        ]
      ),
      makeChapter(
        socialSubjectId,
        'Nationalism in India (History)',
        2,
        [
          'The First World War, Khilafat and Non-Cooperation',
          'Differing Strands within the Movement',
          'Towards Civil Disobedience',
          'The Sense of Collective Belonging',
        ],
        [
          makeTextbookResource(
            'NCERT E-Textbook: History Chapter 2 - Nationalism in India',
            undefined,
            'https://ncert.nic.in/textbook.php?jess1=2-5',
            'NCERT Class 10 India and the Contemporary World-II'
          ),
        ]
      ),
      makeChapter(
        socialSubjectId,
        'Resources and Development (Geography)',
        3,
        [
          'Types of Resources',
          'Development of Resources',
          'Resource Planning in India',
          'Land Resources and Land Use',
          'Soil as a Resource',
        ],
        [
          makeTextbookResource(
            'NCERT E-Textbook: Geography Chapter 1 - Resources and Development',
            undefined,
            'https://ncert.nic.in/textbook.php?jess2=1-7',
            'NCERT Class 10 Contemporary India-II'
          ),
        ]
      ),
      makeChapter(
        socialSubjectId,
        'Water Resources (Geography)',
        4,
        [
          'Water Scarcity and the Need for Conservation',
          'Multi-Purpose River Projects',
          'Rainwater Harvesting',
        ],
        [
          makeTextbookResource(
            'NCERT E-Textbook: Geography Chapter 3 - Water Resources',
            undefined,
            'https://ncert.nic.in/textbook.php?jess2=3-7',
            'NCERT Class 10 Contemporary India-II'
          ),
        ]
      ),
      makeChapter(
        socialSubjectId,
        'Power Sharing (Civics)',
        5,
        [
          'Belgium and Sri Lanka Case Studies',
          'Forms of Power Sharing',
          'Why is Power Sharing Desirable?',
        ],
        [
          makeTextbookResource(
            'NCERT E-Textbook: Civics Chapter 1 - Power Sharing',
            undefined,
            'https://ncert.nic.in/textbook.php?jess3=1-8',
            'NCERT Class 10 Democratic Politics-II'
          ),
        ]
      ),
      makeChapter(
        socialSubjectId,
        'Federalism (Civics)',
        6,
        [
          'What is Federalism?',
          'Federalism in India',
          'Decentralisation in India',
        ],
        [
          makeTextbookResource(
            'NCERT E-Textbook: Civics Chapter 2 - Federalism',
            undefined,
            'https://ncert.nic.in/textbook.php?jess3=2-8',
            'NCERT Class 10 Democratic Politics-II'
          ),
        ]
      ),
      makeChapter(
        socialSubjectId,
        'Development (Economics)',
        7,
        [
          'What Development Promises',
          'Income and Other Goals',
          'National Development',
          'How to Compare Different Countries or States',
        ],
        [
          makeTextbookResource(
            'NCERT E-Textbook: Economics Chapter 1 - Development',
            undefined,
            'https://ncert.nic.in/textbook.php?jess4=1-5',
            'NCERT Class 10 Understanding Economic Development'
          ),
        ]
      ),
      makeChapter(
        socialSubjectId,
        'Sectors of the Indian Economy (Economics)',
        8,
        [
          'Primary, Secondary and Tertiary Sectors',
          'Comparing Activities',
          'Employment and GDP',
          'Organised and Unorganised Sectors',
        ],
        [
          makeTextbookResource(
            'NCERT E-Textbook: Economics Chapter 2 - Sectors of the Indian Economy',
            undefined,
            'https://ncert.nic.in/textbook.php?jess4=2-5',
            'NCERT Class 10 Understanding Economic Development'
          ),
        ]
      ),
    ],
  },
  {
    id: itSubjectId,
    classId: 'class-10',
    name: 'Information Technology',
    board: 'CBSE',
    academicYear: '2025-26',
    language: 'English',
    description: 'CBSE IT (Code 402) for Class 10 — Digital Documentation, Spreadsheets, AI Basics',
    status: 'published',
    audit: SYSTEM_AUDIT,
    chapters: [
      makeChapter(itSubjectId, 'Digital Documentation Advanced', 1, [
        'Styles and Templates',
        'Table of Contents',
        'Mail Merge',
        'Macros',
      ]),
      makeChapter(itSubjectId, 'Electronic Spreadsheet Advanced', 2, [
        'Consolidating Data',
        'Sorting Data',
        'Subtotals',
        'Scenarios',
      ]),
      makeChapter(itSubjectId, 'Introduction to DBMS', 3, [
        'Database Concepts',
        'Creating Tables',
        'Queries and Forms',
        'Reports',
      ]),
    ],
  },
];

// ============================================================
// FULL EDUCATIONAL HIERARCHY
// ============================================================

export const EDUCATIONAL_LEVELS: EducationalLevel[] = [
  {
    id: 'level-school',
    name: 'School',
    icon: '🏫',
    description: 'Classes 1 through 10 — Primary and Secondary education',
    streams: [
      {
        id: 'stream-primary',
        levelId: 'level-school',
        name: 'Primary',
        classes: [
          { id: 'class-1', streamId: 'stream-primary', name: 'Class 1', shortName: 'Cls 1', displayOrder: 1, subjects: [] },
          { id: 'class-2', streamId: 'stream-primary', name: 'Class 2', shortName: 'Cls 2', displayOrder: 2, subjects: [] },
          { id: 'class-3', streamId: 'stream-primary', name: 'Class 3', shortName: 'Cls 3', displayOrder: 3, subjects: [] },
          { id: 'class-4', streamId: 'stream-primary', name: 'Class 4', shortName: 'Cls 4', displayOrder: 4, subjects: [] },
          { id: 'class-5', streamId: 'stream-primary', name: 'Class 5', shortName: 'Cls 5', displayOrder: 5, subjects: [] },
        ],
      },
      {
        id: 'stream-secondary',
        levelId: 'level-school',
        name: 'Secondary',
        classes: [
          { id: 'class-6', streamId: 'stream-secondary', name: 'Class 6', shortName: 'Cls 6', displayOrder: 1, subjects: [] },
          { id: 'class-7', streamId: 'stream-secondary', name: 'Class 7', shortName: 'Cls 7', displayOrder: 2, subjects: [] },
          { id: 'class-8', streamId: 'stream-secondary', name: 'Class 8', shortName: 'Cls 8', displayOrder: 3, subjects: [] },
          { id: 'class-9', streamId: 'stream-secondary', name: 'Class 9', shortName: 'Cls 9', displayOrder: 4, subjects: [] },
          { id: 'class-10', streamId: 'stream-secondary', name: 'Class 10', shortName: 'Cls 10', displayOrder: 5, subjects: CLASS_10_SUBJECTS_PLACEHOLDER },
        ],
      },
    ],
  },
  {
    id: 'level-intermediate',
    name: 'Intermediate / Higher Secondary',
    icon: '📚',
    description: 'Classes 11 & 12 — Higher Secondary / Junior College',
    streams: [
      {
        id: 'stream-sci',
        levelId: 'level-intermediate',
        name: 'Science',
        classes: [
          { id: 'class-11-sci', streamId: 'stream-sci', name: 'Class 11', shortName: 'Cls 11', displayOrder: 1, subjects: [] },
          { id: 'class-12-sci', streamId: 'stream-sci', name: 'Class 12', shortName: 'Cls 12', displayOrder: 2, subjects: [] },
        ],
      },
      {
        id: 'stream-com',
        levelId: 'level-intermediate',
        name: 'Commerce',
        classes: [
          { id: 'class-11-com', streamId: 'stream-com', name: 'Class 11', shortName: 'Cls 11', displayOrder: 1, subjects: [] },
          { id: 'class-12-com', streamId: 'stream-com', name: 'Class 12', shortName: 'Cls 12', displayOrder: 2, subjects: [] },
        ],
      },
      {
        id: 'stream-arts',
        levelId: 'level-intermediate',
        name: 'Arts / Humanities',
        classes: [
          { id: 'class-11-arts', streamId: 'stream-arts', name: 'Class 11', shortName: 'Cls 11', displayOrder: 1, subjects: [] },
          { id: 'class-12-arts', streamId: 'stream-arts', name: 'Class 12', shortName: 'Cls 12', displayOrder: 2, subjects: [] },
        ],
      },
    ],
  },
  {
    id: 'level-college',
    name: 'College',
    icon: '🎓',
    description: 'Undergraduate degree programs',
    streams: [
      {
        id: 'stream-college-gen',
        levelId: 'level-college',
        name: 'General',
        classes: [
          { id: 'col-yr1', streamId: 'stream-college-gen', name: 'Year 1', shortName: 'Yr 1', displayOrder: 1, subjects: [] },
          { id: 'col-yr2', streamId: 'stream-college-gen', name: 'Year 2', shortName: 'Yr 2', displayOrder: 2, subjects: [] },
          { id: 'col-yr3', streamId: 'stream-college-gen', name: 'Year 3', shortName: 'Yr 3', displayOrder: 3, subjects: [] },
        ],
      },
    ],
  },
  {
    id: 'level-btech',
    name: 'B.Tech',
    icon: '⚙️',
    description: 'Bachelor of Technology — Engineering programs',
    streams: [
      {
        id: 'stream-cse',
        levelId: 'level-btech',
        name: 'Computer Science & Engineering',
        classes: [
          { id: 'btech-sem1', streamId: 'stream-cse', name: 'Semester 1', shortName: 'Sem 1', displayOrder: 1, subjects: [] },
          { id: 'btech-sem2', streamId: 'stream-cse', name: 'Semester 2', shortName: 'Sem 2', displayOrder: 2, subjects: [] },
          { id: 'btech-sem3', streamId: 'stream-cse', name: 'Semester 3', shortName: 'Sem 3', displayOrder: 3, subjects: [] },
          { id: 'btech-sem4', streamId: 'stream-cse', name: 'Semester 4', shortName: 'Sem 4', displayOrder: 4, subjects: [] },
          { id: 'btech-sem5', streamId: 'stream-cse', name: 'Semester 5', shortName: 'Sem 5', displayOrder: 5, subjects: [] },
          { id: 'btech-sem6', streamId: 'stream-cse', name: 'Semester 6', shortName: 'Sem 6', displayOrder: 6, subjects: [] },
          { id: 'btech-sem7', streamId: 'stream-cse', name: 'Semester 7', shortName: 'Sem 7', displayOrder: 7, subjects: [] },
          { id: 'btech-sem8', streamId: 'stream-cse', name: 'Semester 8', shortName: 'Sem 8', displayOrder: 8, subjects: [] },
        ],
      },
      {
        id: 'stream-ece',
        levelId: 'level-btech',
        name: 'Electronics & Communication',
        classes: [
          { id: 'ece-sem1', streamId: 'stream-ece', name: 'Semester 1', shortName: 'Sem 1', displayOrder: 1, subjects: [] },
          { id: 'ece-sem2', streamId: 'stream-ece', name: 'Semester 2', shortName: 'Sem 2', displayOrder: 2, subjects: [] },
        ],
      },
    ],
  },
  {
    id: 'level-mtech',
    name: 'M.Tech',
    icon: '🔬',
    description: 'Master of Technology — Advanced Engineering',
    streams: [
      {
        id: 'stream-mtech-cse',
        levelId: 'level-mtech',
        name: 'Computer Science & Engineering',
        classes: [
          { id: 'mtech-sem1', streamId: 'stream-mtech-cse', name: 'Semester 1', shortName: 'Sem 1', displayOrder: 1, subjects: [] },
          { id: 'mtech-sem2', streamId: 'stream-mtech-cse', name: 'Semester 2', shortName: 'Sem 2', displayOrder: 2, subjects: [] },
          { id: 'mtech-sem3', streamId: 'stream-mtech-cse', name: 'Semester 3', shortName: 'Sem 3', displayOrder: 3, subjects: [] },
          { id: 'mtech-sem4', streamId: 'stream-mtech-cse', name: 'Semester 4', shortName: 'Sem 4', displayOrder: 4, subjects: [] },
        ],
      },
    ],
  },
  {
    id: 'level-other',
    name: 'Other / Professional',
    icon: '💼',
    description: 'Professional certifications, skill courses, and vocational training',
    streams: [
      {
        id: 'stream-prof',
        levelId: 'level-other',
        name: 'Professional Courses',
        classes: [
          { id: 'prof-cert', streamId: 'stream-prof', name: 'Certification', shortName: 'Cert', displayOrder: 1, subjects: [] },
          { id: 'prof-diploma', streamId: 'stream-prof', name: 'Diploma', shortName: 'Dip', displayOrder: 2, subjects: [] },
        ],
      },
    ],
  },
];

// ============================================================
// LOOKUP HELPERS
// ============================================================

/** Get a flat list of all ClassLevel objects across the full hierarchy */
export function getAllClasses(): import('@/types').ClassLevel[] {
  const classes: import('@/types').ClassLevel[] = [];
  for (const level of EDUCATIONAL_LEVELS) {
    for (const stream of level.streams) {
      for (const cls of stream.classes) {
        classes.push(cls);
      }
    }
  }
  return classes;
}

/** Find a ClassLevel by id */
export function getClassById(classId: string): import('@/types').ClassLevel | undefined {
  return getAllClasses().find((c) => c.id === classId);
}

/** Find a Stream by id */
export function getStreamById(streamId: string): import('@/types').Stream | undefined {
  for (const level of EDUCATIONAL_LEVELS) {
    const found = level.streams.find((s) => s.id === streamId);
    if (found) return found;
  }
  return undefined;
}

/** Find an EducationalLevel by id */
export function getLevelById(levelId: string): EducationalLevel | undefined {
  return EDUCATIONAL_LEVELS.find((l) => l.id === levelId);
}

/** Given a classId, find all ancestor info */
export function getClassAncestors(classId: string): {
  level: EducationalLevel | undefined;
  stream: import('@/types').Stream | undefined;
  classLevel: import('@/types').ClassLevel | undefined;
} {
  for (const level of EDUCATIONAL_LEVELS) {
    for (const stream of level.streams) {
      const classLevel = stream.classes.find((c) => c.id === classId);
      if (classLevel) {
        return { level, stream, classLevel };
      }
    }
  }
  return { level: undefined, stream: undefined, classLevel: undefined };
}

/** Get subjects for a given classId from the live curriculum store */
export function getSubjectsByClassId(classId: string, curriculum: EducationalLevel[]): import('@/types').Subject[] {
  for (const level of curriculum) {
    for (const stream of level.streams) {
      const cls = stream.classes.find((c) => c.id === classId);
      if (cls) return cls.subjects;
    }
  }
  return [];
}

export const BOARDS = [
  'CBSE',
  'ICSE / ISC',
  'State Board (AP)',
  'State Board (Telangana)',
  'State Board (Maharashtra)',
  'State Board (Tamil Nadu)',
  'State Board (Karnataka)',
  'State Board (Kerala)',
  'State Board (Rajasthan)',
  'State Board (UP)',
  'State Board (MP)',
  'State Board (Gujarat)',
  'State Board (Bengal)',
  'State Board (Bihar)',
  'IB (International Baccalaureate)',
  'Cambridge IGCSE / A-Level',
  'NIOS',
  'Other',
];

export const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Other'];
