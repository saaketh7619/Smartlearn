import {
  User,
  Course,
  Test,
  TestSubmission,
  WeakTopic,
  Badge,
  NotificationItem,
  ChatMessage,
  SupportTicket,
  ModerationItem,
  LeaderboardEntry,
  Role,
} from '@/types';

// Pre-seeded Realistic Users
export const INITIAL_USERS: User[] = [
  // 1. Primary Demo Student
  {
    id: 'user-student-alex',
    name: 'Alex Rivera',
    email: 'student@smartlearn.edu',
    phone: '+1 (555) 234-5678',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T08:00:00.000Z',
    studentProfile: {
      grade: 'Grade 10',
      school: 'St. Jude International Academy',
      rollNumber: 'SJA-2026-1042',
      xp: 2450,
      level: 12,
      coins: 380,
      streakDays: 7,
      lastActive: 'Just now',
      enrolledCourseIds: ['course-calc-1', 'course-phys-1', 'course-ai-1'],
      badges: ['badge-quick-learner', 'badge-math-wizard', 'badge-streak-master', 'badge-quiz-champion'],
    },
  },
  // 2. Primary Demo Teacher
  {
    id: 'user-teacher-sarah',
    name: 'Dr. Sarah Jenkins',
    email: 'teacher@smartlearn.edu',
    phone: '+1 (555) 987-6543',
    role: 'TEACHER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-08-10T09:00:00.000Z',
    teacherProfile: {
      department: 'Mathematics & STEM',
      subjects: ['Algebra II', 'Calculus', 'Statistics'],
      classes: ['Class 10-A', 'Class 10-B', 'Class 11-Honors'],
      experienceYears: 9,
      rating: 4.9,
    },
  },
  // 3. Primary Demo Parent
  {
    id: 'user-parent-priya',
    name: 'Priya Sharma',
    email: 'parent@smartlearn.edu',
    phone: '+1 (555) 456-7890',
    role: 'PARENT',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-09-01T10:00:00.000Z',
    parentProfile: {
      childrenIds: ['user-student-alex', 'user-student-maya'],
      occupation: 'Pediatric Specialist',
      preferredLanguage: 'en',
    },
  },
  // 4. Primary Demo Admin
  {
    id: 'user-admin-marcus',
    name: 'Marcus Vance',
    email: 'admin@smartlearn.edu',
    phone: '+1 (555) 890-1234',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-06-01T07:30:00.000Z',
  },
  // Sibling of Alex (for Parent multi-child view)
  {
    id: 'user-student-maya',
    name: 'Maya Rivera',
    email: 'maya.rivera@smartlearn.edu',
    phone: '+1 (555) 234-5679',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01T08:00:00.000Z',
    studentProfile: {
      grade: 'Grade 7',
      school: 'St. Jude International Academy',
      rollNumber: 'SJA-2026-0718',
      xp: 1320,
      level: 7,
      coins: 210,
      streakDays: 4,
      lastActive: '2 hours ago',
      enrolledCourseIds: ['course-bio-1', 'course-eng-1'],
      badges: ['badge-quick-learner', 'badge-bookworm'],
    },
  },
];

// Generate 28 additional realistic students to meet the 30 students requirement
const STUDENT_NAMES = [
  'Liam Chen', 'Emma Watson', 'Noah Patel', 'Olivia Kim', 'Ethan Rossi',
  'Sophia Al-Mansoor', 'Lucas Silva', 'Ava Dubois', 'Mason Takahashi', 'Isabella Gomez',
  'Aiden Murphy', 'Mia Kowalski', 'James Thorne', 'Harper Lee', 'Benjamin Novak',
  'Charlotte Zhao', 'Elijah Santos', 'Amelia Larsson', 'Henry O\'Connor', 'Evelyn Brooks',
  'Alexander Popescu', 'Abigail Becker', 'Daniel Mehta', 'Emily Fontaine', 'Logan Wright',
  'Chloe Lindqvist', 'Jackson Morales', 'Zoe Petrov'
];

STUDENT_NAMES.forEach((name, idx) => {
  const roll = 1000 + idx;
  const xp = 800 + Math.floor(Math.random() * 2200);
  INITIAL_USERS.push({
    id: `student-${idx + 1}`,
    name,
    email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@smartlearn.edu`,
    role: 'STUDENT',
    avatar: `https://images.unsplash.com/photo-${1500000000000 + (idx * 34567) % 50000000}?w=150&auto=format&fit=crop&q=80`,
    createdAt: '2026-01-20T10:00:00.000Z',
    studentProfile: {
      grade: idx % 2 === 0 ? 'Grade 10' : 'Grade 11',
      school: 'St. Jude International Academy',
      rollNumber: `SJA-2026-${roll}`,
      xp,
      level: Math.max(1, Math.floor(xp / 200)),
      coins: Math.floor(xp * 0.15),
      streakDays: (idx % 14) + 1,
      lastActive: `${(idx % 8) + 1}h ago`,
      enrolledCourseIds: ['course-calc-1', 'course-phys-1'],
      badges: ['badge-quick-learner'],
    },
  });
});

// Additional teachers
const TEACHERS_DATA = [
  { name: 'Prof. David Vance', dept: 'Physics & Engineering', rating: 4.8, subs: ['Mechanics', 'Electromagnetism'] },
  { name: 'Dr. Anita Desai', dept: 'Chemistry & Life Sciences', rating: 4.9, subs: ['Organic Chem', 'Biochemistry'] },
  { name: 'Elena Rostova', dept: 'Computer Science & AI', rating: 4.95, subs: ['Python & Algorithms', 'Machine Learning'] },
  { name: 'Arthur Pendelton', dept: 'Humanities & Literature', rating: 4.7, subs: ['World History', 'Critical Analysis'] },
];

TEACHERS_DATA.forEach((t, i) => {
  INITIAL_USERS.push({
    id: `teacher-${i + 2}`,
    name: t.name,
    email: `${t.name.toLowerCase().replace(/[^a-z]/g, '')}@smartlearn.edu`,
    role: 'TEACHER',
    avatar: `https://images.unsplash.com/photo-${1530000000000 + i * 99999}?w=150&auto=format&fit=crop&q=80`,
    createdAt: '2025-07-01T09:00:00.000Z',
    teacherProfile: {
      department: t.dept,
      subjects: t.subs,
      classes: ['Class 10-A', 'Class 11-B'],
      experienceYears: 8 + i,
      rating: t.rating,
    },
  });
});

// 15 Realistic Courses
export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-calc-1',
    title: 'Mastering Differential Calculus & Applications',
    description: 'A visual, intuitive journey from limits and continuity to derivatives, optimization problems, and real-world STEM modeling.',
    subject: 'Mathematics',
    grade: 'Grade 10-12',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Sarah Jenkins',
    instructorRole: 'Head of Mathematics',
    rating: 4.92,
    enrollmentCount: 420,
    durationHours: 18,
    modules: [
      {
        id: 'mod-1',
        title: 'Foundations: Intuitive Limits & Continuity',
        durationMinutes: 90,
        lessons: [
          { id: 'les-1-1', title: 'Why Calculus Matters in the Real World', durationMinutes: 15, type: 'video', completed: true },
          { id: 'les-1-2', title: 'The Epsilon-Delta Limit Visualized', durationMinutes: 25, type: 'reading', completed: true },
          { id: 'les-1-3', title: 'Rates of Change: From Secant to Tangent', durationMinutes: 20, type: 'video', completed: true },
          { id: 'les-1-4', title: 'Check Your Grasp: Limits Diagnostic Quiz', durationMinutes: 30, type: 'quiz', completed: false },
        ]
      },
      {
        id: 'mod-2',
        title: 'Core Derivative Rules & Power Laws',
        durationMinutes: 120,
        lessons: [
          { id: 'les-2-1', title: 'Product & Quotient Rule Proofs & Tricks', durationMinutes: 30, type: 'video', completed: false },
          { id: 'les-2-2', title: 'The Chain Rule: Unlocking Composite Functions', durationMinutes: 35, type: 'video', completed: false },
          { id: 'les-2-3', title: 'Implicit Differentiation & Tangent Equations', durationMinutes: 30, type: 'reading', completed: false },
        ]
      }
    ]
  },
  {
    id: 'course-phys-1',
    title: 'Kinematics & Newtonian Mechanics with AI Simulations',
    description: 'Explore velocity, acceleration vectors, Newton’s laws, and planetary motion with interactive algorithmic physics engines.',
    subject: 'Physics',
    grade: 'Grade 10-11',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Prof. David Vance',
    instructorRole: 'Senior Physics Fellow',
    rating: 4.88,
    enrollmentCount: 380,
    durationHours: 14,
    modules: [
      {
        id: 'mod-p1',
        title: 'Motion in 1D & 2D Vectors',
        durationMinutes: 80,
        lessons: [
          { id: 'les-p1-1', title: 'Vector Decomposition in Cartesian Planes', durationMinutes: 20, type: 'video', completed: true },
          { id: 'les-p1-2', title: 'Projectile Motion: Trajectory & Range Derivations', durationMinutes: 35, type: 'video', completed: false },
        ]
      }
    ]
  },
  {
    id: 'course-ai-1',
    title: 'Python for Artificial Intelligence & Data Science',
    description: 'Learn computational thinking, NumPy, Pandas dataframes, and build your first neural network from scratch.',
    subject: 'Computer Science',
    grade: 'Grade 9-12',
    difficulty: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Elena Rostova',
    instructorRole: 'AI Research Director',
    rating: 4.96,
    enrollmentCount: 512,
    durationHours: 24,
    modules: [
      {
        id: 'mod-ai-1',
        title: 'Python Core & Matrix Vectorization',
        durationMinutes: 100,
        lessons: [
          { id: 'les-ai-1', title: 'Matrix Math with NumPy Arrays', durationMinutes: 30, type: 'video', completed: true },
          { id: 'les-ai-2', title: 'Data Cleaning with Pandas', durationMinutes: 30, type: 'video', completed: false },
        ]
      }
    ]
  },
  {
    id: 'course-chem-1',
    title: 'Organic Chemistry & Reaction Mechanisms',
    description: 'Understand electron push mechanisms, electrophilic aromatic substitution, isomerism, and stereochemistry.',
    subject: 'Chemistry',
    grade: 'Grade 11-12',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Anita Desai',
    instructorRole: 'Head of Chemistry',
    rating: 4.85,
    enrollmentCount: 290,
    durationHours: 16,
    modules: []
  },
  {
    id: 'course-bio-1',
    title: 'Molecular Genetics & CRISPR Technology',
    description: 'DNA replication, transcription, translation, epigenetics, and the bioethics of modern gene editing.',
    subject: 'Biology',
    grade: 'Grade 10-12',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Anita Desai',
    instructorRole: 'Head of Chemistry & Life Sciences',
    rating: 4.91,
    enrollmentCount: 340,
    durationHours: 15,
    modules: []
  },
  {
    id: 'course-eng-1',
    title: 'Critical Thinking & Persuasive Rhetoric',
    description: 'Master argumentation structures, logical fallacies, essay rhetoric, and debate framing.',
    subject: 'Literature & Humanities',
    grade: 'Grade 9-12',
    difficulty: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Arthur Pendelton',
    instructorRole: 'Humanities Lead',
    rating: 4.79,
    enrollmentCount: 275,
    durationHours: 10,
    modules: []
  },
  {
    id: 'course-geo-1',
    title: 'Modern World Economics & Geopolitics',
    description: 'Explore monetary policies, global trade balances, energy transitions, and emerging technological shifts.',
    subject: 'Social Sciences',
    grade: 'Grade 10-12',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Arthur Pendelton',
    instructorRole: 'Humanities Lead',
    rating: 4.82,
    enrollmentCount: 215,
    durationHours: 12,
    modules: []
  },
  {
    id: 'course-alg-2',
    title: 'Advanced Algebra & Quadratic Systems',
    description: 'Quadratic curves, complex roots, polynomials of degree n, and matrix transformations.',
    subject: 'Mathematics',
    grade: 'Grade 10',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Sarah Jenkins',
    instructorRole: 'Head of Mathematics',
    rating: 4.89,
    enrollmentCount: 460,
    durationHours: 16,
    modules: []
  },
  {
    id: 'course-stats-1',
    title: 'Applied Statistics, Probability & Bayes Theorem',
    description: 'Master discrete and continuous probability distributions, hypothesis testing, p-values, and Bayesian inference for STEM.',
    subject: 'Mathematics',
    grade: 'Grade 11-12',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Sarah Jenkins',
    instructorRole: 'Head of Mathematics',
    rating: 4.93,
    enrollmentCount: 395,
    durationHours: 20,
    modules: []
  },
  {
    id: 'course-chem-thermo',
    title: 'Chemical Thermodynamics & Dynamic Equilibrium',
    description: 'Enthalpy, entropy, Gibbs free energy, Le Chatelier’s principle, and electrochemical potential calculations.',
    subject: 'Chemistry',
    grade: 'Grade 11-12',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Anita Desai',
    instructorRole: 'Head of Chemistry',
    rating: 4.88,
    enrollmentCount: 310,
    durationHours: 18,
    modules: []
  },
  {
    id: 'course-phys-em',
    title: 'Electromagnetism, Electric Circuits & Maxwell Laws',
    description: 'Coulomb law, Gauss law, magnetic flux, electromagnetic induction, AC circuits, and wave propagation.',
    subject: 'Physics',
    grade: 'Grade 11-12',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Prof. David Vance',
    instructorRole: 'Senior Physics Fellow',
    rating: 4.91,
    enrollmentCount: 430,
    durationHours: 22,
    modules: []
  },
  {
    id: 'course-cs-dsa',
    title: 'Data Structures & Algorithm Design in Java',
    description: 'From linked lists, binary search trees, and heaps to Dijkstra shortest path and dynamic programming patterns.',
    subject: 'Computer Science',
    grade: 'Grade 10-12',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Elena Rostova',
    instructorRole: 'AI Research Director',
    rating: 4.95,
    enrollmentCount: 580,
    durationHours: 28,
    modules: []
  },
  {
    id: 'course-bio-eco',
    title: 'Ecology, Conservation Biology & Systems Ecology',
    description: 'Ecosystem energy flows, population dynamics, biodiversity hotspots, and climate feedback modeling.',
    subject: 'Biology',
    grade: 'Grade 9-11',
    difficulty: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Anita Desai',
    instructorRole: 'Head of Chemistry & Life Sciences',
    rating: 4.84,
    enrollmentCount: 260,
    durationHours: 12,
    modules: []
  },
  {
    id: 'course-world-hist',
    title: 'World History & Civilizational Turning Points',
    description: 'Comparative analysis of the Agricultural Revolution, Silk Road commerce, the Enlightenment, and the Industrial Age.',
    subject: 'Literature & Humanities',
    grade: 'Grade 9-12',
    difficulty: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Arthur Pendelton',
    instructorRole: 'Humanities Lead',
    rating: 4.81,
    enrollmentCount: 220,
    durationHours: 14,
    modules: []
  },
  {
    id: 'course-linear-alg',
    title: 'Linear Algebra, Eigenvalues & Geometric Transforms',
    description: 'Vector spaces, matrix determinants, linear transformations, dot and cross products, eigenvalues, and SVD.',
    subject: 'Mathematics',
    grade: 'Grade 11-12',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Sarah Jenkins',
    instructorRole: 'Head of Mathematics',
    rating: 4.94,
    enrollmentCount: 375,
    durationHours: 18,
    modules: []
  },
  {
    id: 'course-astrophys',
    title: 'Foundations of Astrophysics & Observational Cosmology',
    description: 'Stellar evolution, Hertzsprung-Russell diagrams, gravitational lensing, black holes, and the cosmic microwave background.',
    subject: 'Physics',
    grade: 'Grade 10-12',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    instructorName: 'Prof. David Vance',
    instructorRole: 'Senior Physics Fellow',
    rating: 4.97,
    enrollmentCount: 490,
    durationHours: 16,
    modules: []
  }
];

// Tests and Mock Exams
export const INITIAL_TESTS: Test[] = [
  {
    id: 'test-adaptive-math-1',
    title: 'All-India Mathematics Olympiad Diagnostic Test',
    subject: 'Mathematics',
    grade: 'Grade 10-11',
    durationMinutes: 20,
    totalMarks: 50,
    isAdaptive: true,
    antiCheatEnabled: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    questions: [
      {
        id: 'q-1',
        text: 'What is the derivative of f(x) = 3x^4 - 5x^2 + 7 with respect to x?',
        options: ['12x^3 - 10x', '12x^4 - 10x', '7x^3 - 5x + 7', '12x^3 - 5'],
        correctAnswerIndex: 0,
        explanation: 'Apply the power rule: d/dx[x^n] = n*x^(n-1). d/dx[3x^4] = 12x^3, d/dx[-5x^2] = -10x, and d/dx[7] = 0.',
        topic: 'Differentiation Rules',
        subject: 'Mathematics',
        difficulty: 'Easy'
      },
      {
        id: 'q-2',
        text: 'If roots of the equation x^2 - px + 8 = 0 differ by 2, what is the value of p?',
        options: ['±4', '±6', '±8', '±2√2'],
        correctAnswerIndex: 1,
        explanation: 'Let roots be α and β. α+β = p, αβ = 8. (α-β)^2 = (α+β)^2 - 4αβ = 4. Hence p^2 - 32 = 4 => p^2 = 36 => p = ±6.',
        topic: 'Quadratic Equations',
        subject: 'Mathematics',
        difficulty: 'Medium'
      },
      {
        id: 'q-3',
        text: 'Find the limit as x approaches 0 of sin(5x) / (2x).',
        options: ['0', '1', '5/2', 'Undefined'],
        correctAnswerIndex: 2,
        explanation: 'Using the standard limit lim_{θ->0} sin(kθ)/θ = k, lim (5/2) * (sin(5x)/5x) = 5/2 * 1 = 5/2.',
        topic: 'Limits & Continuity',
        subject: 'Mathematics',
        difficulty: 'Medium'
      },
      {
        id: 'q-4',
        text: 'In a right triangle with hypotenuse 10, what is the maximum possible area of the triangle?',
        options: ['25', '50', '25√2', '100'],
        correctAnswerIndex: 0,
        explanation: 'Area = 1/2 * a * b. By AM-GM or setting a = b = 10/√2 = 5√2, Area = 1/2 * (50) = 25.',
        topic: 'Optimization & Maxima',
        subject: 'Mathematics',
        difficulty: 'Hard'
      },
      {
        id: 'q-5',
        text: 'Find the number of integral solutions to x + y + z = 12 where x, y, z >= 1.',
        options: ['55', '66', '78', '45'],
        correctAnswerIndex: 0,
        explanation: 'By Stars and Bars theorem, number of positive integer solutions is C(n-1, k-1) = C(12-1, 3-1) = C(11, 2) = (11 * 10) / 2 = 55.',
        topic: 'Combinatorics',
        subject: 'Mathematics',
        difficulty: 'Olympiad'
      }
    ]
  },
  {
    id: 'test-phys-weekly',
    title: 'Weekly Physics Sprint: Kinematics & Momentum',
    subject: 'Physics',
    grade: 'Grade 10',
    durationMinutes: 15,
    totalMarks: 30,
    isAdaptive: true,
    antiCheatEnabled: true,
    createdAt: '2026-03-05T09:00:00.000Z',
    questions: [
      {
        id: 'qp-1',
        text: 'A ball is thrown horizontally at 15 m/s from a cliff of height 20m. How long does it take to strike the ground? (g = 9.8 m/s^2)',
        options: ['2.02 seconds', '1.41 seconds', '3.14 seconds', '0.98 seconds'],
        correctAnswerIndex: 0,
        explanation: 'Vertical motion is independent: h = 1/2 * g * t^2 => 20 = 4.9 * t^2 => t = √(20/4.9) ≈ 2.02s.',
        topic: 'Projectile Motion',
        subject: 'Physics',
        difficulty: 'Medium'
      },
      {
        id: 'qp-2',
        text: 'Which law directly implies the conservation of linear momentum in an isolated system?',
        options: ['Newton\'s First Law', 'Newton\'s Second Law', 'Newton\'s Third Law', 'Law of Universal Gravitation'],
        correctAnswerIndex: 2,
        explanation: 'Newton’s third law states that forces between two interacting objects are equal and opposite (F12 = -F21), meaning the sum of internal impulses is zero.',
        topic: 'Newtonian Laws',
        subject: 'Physics',
        difficulty: 'Easy'
      },
      {
        id: 'qp-3',
        text: 'What is the escape velocity from Earth’s surface? (Radius R ≈ 6371 km, g ≈ 9.8 m/s²)',
        options: ['7.9 km/s', '11.2 km/s', '16.7 km/s', '24.5 km/s'],
        correctAnswerIndex: 1,
        explanation: 'Escape velocity is given by v_e = √(2gR) = √(2 * 9.8 * 6.371 * 10^6) ≈ 11,180 m/s ≈ 11.2 km/s.',
        topic: 'Gravitation & Orbits',
        subject: 'Physics',
        difficulty: 'Medium'
      },
      {
        id: 'qp-4',
        text: 'In an elastic collision between two identical masses where one is initially at rest, what happens to the velocity of the moving mass after collision?',
        options: ['It doubles', 'It reverses', 'It comes to rest (velocity = 0)', 'It continues at half speed'],
        correctAnswerIndex: 2,
        explanation: 'For head-on elastic collision of equal masses m1 = m2, the velocities swap. The first mass stops completely and the target moves off with the original velocity.',
        topic: 'Elastic Collisions',
        subject: 'Physics',
        difficulty: 'Hard'
      }
    ]
  },
  {
    id: 'test-cs-algorithms',
    title: 'Computer Science Diagnostic: Algorithms & Big-O Complexity',
    subject: 'Computer Science',
    grade: 'Grade 10-12',
    durationMinutes: 15,
    totalMarks: 40,
    isAdaptive: true,
    antiCheatEnabled: true,
    createdAt: '2026-03-06T11:00:00.000Z',
    questions: [
      {
        id: 'qcs-1',
        text: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswerIndex: 1,
        explanation: 'At each node in a balanced BST, half of the search space is eliminated, yielding logarithmic time O(log n).',
        topic: 'Binary Search Trees',
        subject: 'Computer Science',
        difficulty: 'Easy'
      },
      {
        id: 'qcs-2',
        text: 'Which data structure operates on a Last-In, First-Out (LIFO) principle and is used for call stack management?',
        options: ['Queue', 'Stack', 'Linked List', 'Max Heap'],
        correctAnswerIndex: 1,
        explanation: 'A Stack strictly adheres to LIFO semantics, used for function call stacks and undo mechanisms.',
        topic: 'Stacks & Queues',
        subject: 'Computer Science',
        difficulty: 'Easy'
      },
      {
        id: 'qcs-3',
        text: 'What is the worst-case time complexity of QuickSort when using naive pivot selection on an already sorted array?',
        options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(2^n)'],
        correctAnswerIndex: 2,
        explanation: 'Naive pivot selection produces unbalanced partitions of size 1 and n-1, leading to quadratic recurrence T(n) = T(n-1) + O(n) = O(n²).',
        topic: 'Sorting Algorithms',
        subject: 'Computer Science',
        difficulty: 'Medium'
      },
      {
        id: 'qcs-4',
        text: 'In Dynamic Programming, which condition indicates that a problem can be broken into overlapping subproblems with optimal substructure?',
        options: ['Greedy Choice Property', 'Bellman Equation Principle of Optimality', 'P versus NP Equivalence', 'Amortized Cost Invariance'],
        correctAnswerIndex: 1,
        explanation: 'Richard Bellman’s Principle of Optimality requires that optimal solutions to a problem contain optimal solutions to its subproblems.',
        topic: 'Dynamic Programming',
        subject: 'Computer Science',
        difficulty: 'Hard'
      }
    ]
  },
  {
    id: 'test-chem-olympiad',
    title: 'National Chemistry Diagnostic: Kinetics & Bonding',
    subject: 'Chemistry',
    grade: 'Grade 11-12',
    durationMinutes: 15,
    totalMarks: 40,
    isAdaptive: true,
    antiCheatEnabled: true,
    createdAt: '2026-03-07T14:00:00.000Z',
    questions: [
      {
        id: 'qch-1',
        text: 'What is the hybridization of carbon atoms in benzene (C6H6)?',
        options: ['sp', 'sp2', 'sp3', 'dsp2'],
        correctAnswerIndex: 1,
        explanation: 'Each carbon in benzene forms three sigma bonds (planar trigonal geometry) and participates in a delocalized pi ring, which corresponds to sp2 hybridization.',
        topic: 'Chemical Bonding',
        subject: 'Chemistry',
        difficulty: 'Easy'
      },
      {
        id: 'qch-2',
        text: 'According to Le Chatelier’s principle, what happens to the exothermic Haber process (N2 + 3H2 ⇌ 2NH3, ΔH < 0) when temperature is increased?',
        options: ['Equilibrium shifts right (more NH3)', 'Equilibrium shifts left (less NH3)', 'No change in equilibrium', 'Reaction stops completely'],
        correctAnswerIndex: 1,
        explanation: 'For an exothermic reaction, heat is a product. Increasing temperature shifts equilibrium toward reactants (left) to absorb the added heat.',
        topic: 'Dynamic Equilibrium',
        subject: 'Chemistry',
        difficulty: 'Medium'
      },
      {
        id: 'qch-3',
        text: 'What is the pH of a 0.001 M HCl solution at 25°C assuming complete dissociation?',
        options: ['1', '2', '3', '11'],
        correctAnswerIndex: 2,
        explanation: 'HCl is a strong monoprotic acid, so [H+] = 10^-3 M. pH = -log10(10^-3) = 3.',
        topic: 'Acids & Bases',
        subject: 'Chemistry',
        difficulty: 'Easy'
      },
      {
        id: 'qch-4',
        text: 'In a first-order chemical reaction, how does the half-life t_1/2 depend on the initial reactant concentration [A]0?',
        options: ['Directly proportional to [A]0', 'Inversely proportional to [A]0', 'Independent of [A]0', 'Proportional to [A]0²'],
        correctAnswerIndex: 2,
        explanation: 'For first-order reactions, t_1/2 = ln(2)/k = 0.693/k, which has no concentration term and is strictly independent of initial concentration.',
        topic: 'Chemical Kinetics',
        subject: 'Chemistry',
        difficulty: 'Medium'
      }
    ]
  }
];

// Student Submissions
export const INITIAL_SUBMISSIONS: TestSubmission[] = [
  {
    id: 'sub-alex-1',
    testId: 'test-adaptive-math-1',
    testTitle: 'All-India Mathematics Olympiad Diagnostic Test',
    studentId: 'user-student-alex',
    score: 42,
    maxScore: 50,
    percentage: 84,
    completedAt: '2026-03-08T14:22:00.000Z',
    timeTakenSeconds: 840,
    difficultyBreakdown: {
      easyCorrect: 1,
      mediumCorrect: 2,
      hardCorrect: 1,
    },
    conceptualErrors: 1,
    timeManagementErrors: 0,
    carelessErrors: 1,
    tabSwitchesDetected: 0,
    topicScores: [
      { topic: 'Differentiation Rules', score: 10, maxScore: 10 },
      { topic: 'Quadratic Equations', score: 10, maxScore: 10 },
      { topic: 'Limits & Continuity', score: 8, maxScore: 10 },
      { topic: 'Optimization & Maxima', score: 9, maxScore: 10 },
      { topic: 'Combinatorics', score: 5, maxScore: 10 }
    ]
  }
];

// Class Weak Topics for Teachers
export const INITIAL_WEAK_TOPICS: WeakTopic[] = [
  {
    id: 'wt-1',
    subject: 'Mathematics',
    topic: 'Quadratic Equations & Complex Roots',
    accuracyPercentage: 54,
    affectedStudentsCount: 18,
    recommendedAction: 'Schedule a revision drill focusing on discriminant analysis (b² - 4ac).'
  },
  {
    id: 'wt-2',
    subject: 'Physics',
    topic: 'Wave Optics & Double Slit Interference',
    accuracyPercentage: 58,
    affectedStudentsCount: 14,
    recommendedAction: 'Demonstrate ray diagrams and path difference conditions with an interactive lab.'
  },
  {
    id: 'wt-3',
    subject: 'Chemistry',
    topic: 'Electrophilic Aromatic Substitution',
    accuracyPercentage: 61,
    affectedStudentsCount: 11,
    recommendedAction: 'Review ortho/para versus meta directing resonant structures.'
  },
  {
    id: 'wt-4',
    subject: 'Mathematics',
    topic: 'Combinatorics & Stars and Bars',
    accuracyPercentage: 48,
    affectedStudentsCount: 22,
    recommendedAction: 'Walk through partitioning problems and distinguish between identical vs distinct items.'
  }
];

// Gamification Badges
export const INITIAL_BADGES: Badge[] = [
  { id: 'badge-quick-learner', title: 'Quick Learner', description: 'Finished 5 lessons in a single 24-hour streak', icon: '⚡', xpReward: 100, category: 'achievement' },
  { id: 'badge-math-wizard', title: 'Math Wizard', description: 'Scored 90%+ in 3 consecutive Calculus tests', icon: '🧙‍♂️', xpReward: 250, category: 'mastery' },
  { id: 'badge-streak-master', title: 'Streak Titan', description: 'Maintained an unbroken 7-day study streak', icon: '🔥', xpReward: 150, category: 'streak' },
  { id: 'badge-quiz-champion', title: 'Quiz Champion', description: 'Ranked in the top 5% of a bi-weekly contest', icon: '🏆', xpReward: 300, category: 'contest' },
  { id: 'badge-doubt-crusher', title: 'Inquisitive Mind', description: 'Asked 10 deep conceptual questions to AI Tutor', icon: '💡', xpReward: 120, category: 'achievement' },
  { id: 'badge-zen-master', title: 'Focus Prodigy', description: 'Completed 120 minutes of uninterrupted Focus Mode', icon: '🧘', xpReward: 200, category: 'mastery' },
];

// Notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-student-alex',
    title: '🔥 7-Day Streak Achieved!',
    message: 'Awesome consistency! You unlocked 50 bonus coins and the Streak Titan badge.',
    type: 'badge',
    read: false,
    createdAt: '10 minutes ago',
    linkUrl: '/student/'
  },
  {
    id: 'notif-2',
    userId: 'user-student-alex',
    title: 'New Adaptive Mock Test Available',
    message: 'Dr. Sarah Jenkins assigned: All-India Math Olympiad Diagnostic.',
    type: 'test',
    read: false,
    createdAt: '2 hours ago',
    linkUrl: '/student/tests/'
  },
  {
    id: 'notif-3',
    userId: 'user-teacher-sarah',
    title: '18 Students Need Attention in Quadratics',
    message: 'Recent diagnostic revealed a 54% class average in Quadratic Equations.',
    type: 'alert',
    read: false,
    createdAt: '1 hour ago',
    linkUrl: '/teacher/'
  },
  {
    id: 'notif-4',
    userId: 'user-parent-priya',
    title: 'Alex scored 84% in Math Olympiad Prep',
    message: 'Alex demonstrated strong mastery in Differentiation rules! Click to review summary.',
    type: 'alert',
    read: false,
    createdAt: '3 hours ago',
    linkUrl: '/parent/progress/'
  },
];

// Chat Messages
export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'user-teacher-sarah',
    senderName: 'Dr. Sarah Jenkins',
    senderRole: 'TEACHER',
    receiverId: 'user-parent-priya',
    content: 'Hello Mrs. Sharma! Alex had a fantastic showing in today\'s Calculus diagnostics. We just need to give extra attention to Combinatorics before next week\'s competition.',
    timestamp: 'Yesterday at 4:15 PM'
  },
  {
    id: 'msg-2',
    senderId: 'user-parent-priya',
    senderName: 'Priya Sharma',
    senderRole: 'PARENT',
    receiverId: 'user-teacher-sarah',
    content: 'Thank you Dr. Jenkins! We scheduled 30 minutes with SmartLearn\'s AI revision generator for combinatorics tonight.',
    timestamp: 'Yesterday at 5:00 PM'
  }
];

// Moderation Items for Admin
export const INITIAL_MODERATION: ModerationItem[] = [
  {
    id: 'mod-item-1',
    authorName: 'Elijah Santos',
    authorRole: 'STUDENT',
    type: 'Forum Post',
    contentSnippet: 'Hey does anyone have the leaked answer key for next week\'s district physics exam?',
    reasonFlagged: 'Academic integrity violation / test leaks',
    status: 'Pending',
    timestamp: '25 mins ago'
  },
  {
    id: 'mod-item-2',
    authorName: 'Lucas Silva',
    authorRole: 'STUDENT',
    type: 'Notes Upload',
    contentSnippet: 'Handwritten notes for Organic Chem Chapter 4 - uploaded as PDF with high-res scans.',
    reasonFlagged: 'Copyright check / standard automated verification',
    status: 'Pending',
    timestamp: '2 hours ago'
  }
];

// Support Tickets for Admin
export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-101',
    userId: 'user-student-alex',
    userName: 'Alex Rivera',
    userRole: 'STUDENT',
    subject: 'Audio not playing in Calculus Lesson 2.2 on iOS Safari',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-03-09T11:20:00Z'
  },
  {
    id: 'tkt-102',
    userId: 'user-teacher-sarah',
    userName: 'Dr. Sarah Jenkins',
    userRole: 'TEACHER',
    subject: 'Requesting export of Class 10-A semester grades to CSV',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-03-08T09:15:00Z'
  },
  {
    id: 'tkt-103',
    userId: 'user-parent-priya',
    userName: 'Priya Sharma',
    userRole: 'PARENT',
    subject: 'Question regarding weekly email report digest timing',
    priority: 'Low',
    status: 'Open',
    createdAt: '2026-03-10T08:00:00Z'
  }
];

// Global Leaderboard
export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, studentId: 'std-champ-1', name: 'Sophia Al-Mansoor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', school: 'Dubai Scholars Academy', xp: 4890, level: 24, streakDays: 28, tier: 'Diamond' },
  { rank: 2, studentId: 'std-champ-2', name: 'Liam Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', school: 'Raffles STEM Institute', xp: 4520, level: 22, streakDays: 24, tier: 'Diamond' },
  { rank: 3, studentId: 'user-student-alex', name: 'Alex Rivera (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', school: 'St. Jude International Academy', xp: 2450, level: 12, streakDays: 7, tier: 'Platinum' },
  { rank: 4, studentId: 'std-champ-4', name: 'Noah Patel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', school: 'National Public School', xp: 2310, level: 11, streakDays: 12, tier: 'Platinum' },
  { rank: 5, studentId: 'std-champ-5', name: 'Emma Watson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', school: 'Eton High School', xp: 2190, level: 10, streakDays: 9, tier: 'Gold' },
  { rank: 6, studentId: 'std-champ-6', name: 'Ethan Rossi', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100', school: 'Milan International', xp: 1950, level: 9, streakDays: 6, tier: 'Gold' },
  { rank: 7, studentId: 'std-champ-7', name: 'Maya Rivera', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', school: 'St. Jude International Academy', xp: 1320, level: 7, streakDays: 4, tier: 'Silver' },
];

// In-Memory Database Controller (Prisma-like API)
class SmartLearnDatabase {
  public users: User[] = [...INITIAL_USERS];
  public courses: Course[] = [...INITIAL_COURSES];
  public tests: Test[] = [...INITIAL_TESTS];
  public submissions: TestSubmission[] = [...INITIAL_SUBMISSIONS];
  public weakTopics: WeakTopic[] = [...INITIAL_WEAK_TOPICS];
  public badges: Badge[] = [...INITIAL_BADGES];
  public notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
  public messages: ChatMessage[] = [...INITIAL_MESSAGES];
  public tickets: SupportTicket[] = [...INITIAL_TICKETS];
  public moderation: ModerationItem[] = [...INITIAL_MODERATION];
  public leaderboard: LeaderboardEntry[] = [...INITIAL_LEADERBOARD];

  // Curriculum catalogue — deep-cloned from seed, editable by Admin
  // We use the EDUCATIONAL_LEVELS from curriculumData and keep a mutable copy
  private _curriculum: import('@/types').EducationalLevel[] = [];

  get curriculum(): import('@/types').EducationalLevel[] {
    if (this._curriculum.length === 0) {
      // Lazy-load from curriculumData (avoids circular import at module init)
      const { EDUCATIONAL_LEVELS } = require('@/lib/curriculumData');
      this._curriculum = JSON.parse(JSON.stringify(EDUCATIONAL_LEVELS));
    }
    return this._curriculum;
  }

  // User methods
  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUsersByRole(role: Role): User[] {
    return this.users.filter(u => u.role === role);
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.users[idx] = { ...this.users[idx], ...updates };
    return this.users[idx];
  }

  addUser(user: User): User {
    this.users.push(user);
    return user;
  }

  deleteUser(id: string): boolean {
    const before = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    return this.users.length < before;
  }

  // Course methods
  getCourseById(id: string): Course | undefined {
    return this.courses.find(c => c.id === id);
  }

  // Test & Submissions
  getTestById(id: string): Test | undefined {
    return this.tests.find(t => t.id === id);
  }

  addSubmission(sub: TestSubmission): TestSubmission {
    this.submissions.unshift(sub);
    // Update user XP
    const user = this.getUserById(sub.studentId);
    if (user && user.studentProfile) {
      const earnedXp = Math.round(sub.score * 10);
      user.studentProfile.xp += earnedXp;
      user.studentProfile.coins += Math.round(sub.score * 1.5);
      user.studentProfile.level = Math.floor(user.studentProfile.xp / 200) + 1;
    }
    return sub;
  }

  // Notifications
  getNotifications(userId: string): NotificationItem[] {
    return this.notifications.filter(n => n.userId === userId || n.userId === 'all');
  }

  markNotificationRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
  }

  markAllNotificationsRead(userId: string) {
    this.notifications.forEach(n => {
      if (n.userId === userId || n.userId === 'all') n.read = true;
    });
  }

  // Messages
  getMessagesForUser(userId: string): ChatMessage[] {
    return this.messages.filter(m => m.senderId === userId || m.receiverId === userId);
  }

  addMessage(msg: ChatMessage): ChatMessage {
    this.messages.push(msg);
    return msg;
  }

  // ============================================================
  // CURRICULUM CATALOGUE METHODS
  // ============================================================

  /** Get subjects for a specific classId across the full curriculum */
  getSubjectsByClassId(classId: string): import('@/types').Subject[] {
    for (const level of this.curriculum) {
      for (const stream of level.streams) {
        const cls = stream.classes.find(c => c.id === classId);
        if (cls) return cls.subjects;
      }
    }
    return [];
  }

  /** Get published subjects only, for students */
  getPublishedSubjectsByClassId(classId: string): import('@/types').Subject[] {
    return this.getSubjectsByClassId(classId).filter(s => s.status === 'published');
  }

  /** Find class object by id */
  getClassById(classId: string): import('@/types').ClassLevel | undefined {
    for (const level of this.curriculum) {
      for (const stream of level.streams) {
        const cls = stream.classes.find(c => c.id === classId);
        if (cls) return cls;
      }
    }
    return undefined;
  }

  /** Find subject by id across all classes */
  getSubjectById(subjectId: string): import('@/types').Subject | undefined {
    if (!subjectId) return undefined;
    const normalized = subjectId.toLowerCase().trim();
    for (const level of this.curriculum) {
      for (const stream of level.streams) {
        for (const cls of stream.classes) {
          const sub = cls.subjects.find((s) => {
            if (s.id === subjectId) return true;
            const sName = s.name.toLowerCase();
            if (sName === normalized) return true;
            if (normalized === `class-10-${sName}` || normalized === `class-10-${sName.replace(/\s+/g, '-')}`) return true;
            if (normalized === 'class-10-math' && sName.includes('math')) return true;
            if (normalized === 'class-10-sci' && sName.includes('sci')) return true;
            if (normalized === 'class-10-social' && sName.includes('social')) return true;
            return false;
          });
          if (sub) return sub;
        }
      }
    }
    return undefined;
  }

  /** Add a new subject to a class */
  addSubject(classId: string, subject: import('@/types').Subject): boolean {
    for (const level of this.curriculum) {
      for (const stream of level.streams) {
        const cls = stream.classes.find(c => c.id === classId);
        if (cls) {
          cls.subjects.push(subject);
          return true;
        }
      }
    }
    return false;
  }

  /** Update a subject's status (draft → published → archived) */
  updateSubjectStatus(subjectId: string, status: import('@/types').ContentStatus, editorName: string): boolean {
    const sub = this.getSubjectById(subjectId);
    if (!sub) return false;
    sub.status = status;
    sub.audit.editedBy = editorName;
    sub.audit.editedAt = new Date().toISOString();
    return true;
  }

  /** Add a chapter to a subject */
  addChapter(subjectId: string, chapter: import('@/types').Chapter): boolean {
    const sub = this.getSubjectById(subjectId);
    if (!sub) return false;
    sub.chapters.push(chapter);
    return true;
  }

  /** Find a chapter by id across all subjects */
  getChapterById(chapterId: string): import('@/types').Chapter | undefined {
    for (const level of this.curriculum) {
      for (const stream of level.streams) {
        for (const cls of stream.classes) {
          for (const sub of cls.subjects) {
            const ch = sub.chapters.find(c => c.id === chapterId);
            if (ch) return ch;
          }
        }
      }
    }
    return undefined;
  }

  /** Add a concept to a chapter */
  addConcept(chapterId: string, concept: import('@/types').Concept): boolean {
    const ch = this.getChapterById(chapterId);
    if (!ch) return false;
    ch.concepts.push(concept);
    return true;
  }

  /** Add a resource to a chapter or concept */
  addResource(parentId: string, parentType: 'chapter' | 'concept', resource: import('@/types').LearningResource): boolean {
    if (parentType === 'chapter') {
      const ch = this.getChapterById(parentId);
      if (!ch) return false;
      ch.resources.push(resource);
      return true;
    } else {
      // Find concept
      for (const level of this.curriculum) {
        for (const stream of level.streams) {
          for (const cls of stream.classes) {
            for (const sub of cls.subjects) {
              for (const ch of sub.chapters) {
                const con = ch.concepts.find(c => c.id === parentId);
                if (con) {
                  con.resources.push(resource);
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  /** Update resource status */
  updateResourceStatus(resourceId: string, status: import('@/types').ContentStatus, editorName: string): boolean {
    const resource = this.findResourceById(resourceId);
    if (!resource) return false;
    resource.status = status;
    resource.audit.editedBy = editorName;
    resource.audit.editedAt = new Date().toISOString();
    return true;
  }

  /** Delete resource by id */
  deleteResource(resourceId: string): boolean {
    for (const level of this.curriculum) {
      for (const stream of level.streams) {
        for (const cls of stream.classes) {
          for (const sub of cls.subjects) {
            for (const ch of sub.chapters) {
              const chIdx = ch.resources.findIndex(r => r.id === resourceId);
              if (chIdx !== -1) { ch.resources.splice(chIdx, 1); return true; }
              for (const con of ch.concepts) {
                const conIdx = con.resources.findIndex(r => r.id === resourceId);
                if (conIdx !== -1) { con.resources.splice(conIdx, 1); return true; }
              }
            }
          }
        }
      }
    }
    return false;
  }

  /** Increment view count for a resource */
  incrementResourceView(resourceId: string) {
    const r = this.findResourceById(resourceId);
    if (r) r.viewCount++;
  }

  /** Find a resource by id anywhere in the curriculum */
  findResourceById(resourceId: string): import('@/types').LearningResource | undefined {
    for (const level of this.curriculum) {
      for (const stream of level.streams) {
        for (const cls of stream.classes) {
          for (const sub of cls.subjects) {
            for (const ch of sub.chapters) {
              const r = ch.resources.find(res => res.id === resourceId);
              if (r) return r;
              for (const con of ch.concepts) {
                const cr = con.resources.find(res => res.id === resourceId);
                if (cr) return cr;
              }
            }
          }
        }
      }
    }
    return undefined;
  }

  /** Get aggregate curriculum statistics for Admin dashboard */
  getCurriculumStats(): import('@/types').CurriculumStats {
    let publishedSubjects = 0;
    let draftSubjects = 0;
    let archivedSubjects = 0;
    let totalChapters = 0;
    let totalResources = 0;
    let mostViewed: import('@/types').LearningResource | undefined;

    for (const level of this.curriculum) {
      for (const stream of level.streams) {
        for (const cls of stream.classes) {
          for (const sub of cls.subjects) {
            if (sub.status === 'published') publishedSubjects++;
            else if (sub.status === 'draft') draftSubjects++;
            else archivedSubjects++;

            totalChapters += sub.chapters.length;
            for (const ch of sub.chapters) {
              totalResources += ch.resources.length;
              for (const r of ch.resources) {
                if (!mostViewed || r.viewCount > mostViewed.viewCount) mostViewed = r;
              }
              for (const con of ch.concepts) {
                totalResources += con.resources.length;
                for (const r of con.resources) {
                  if (!mostViewed || r.viewCount > mostViewed.viewCount) mostViewed = r;
                }
              }
            }
          }
        }
      }
    }

    return {
      totalLevels: this.curriculum.length,
      publishedSubjects,
      draftSubjects,
      archivedSubjects,
      totalChapters,
      totalResources,
      mostViewedResource: mostViewed,
    };
  }

  /** Search across published curriculum (for student search) */
  searchCurriculum(query: string, classId?: string): Array<{
    type: 'subject' | 'chapter' | 'concept' | 'resource';
    id: string;
    title: string;
    subjectName: string;
    chapterTitle?: string;
    classId: string;
  }> {
    const results: Array<{
      type: 'subject' | 'chapter' | 'concept' | 'resource';
      id: string;
      title: string;
      subjectName: string;
      chapterTitle?: string;
      classId: string;
    }> = [];
    const q = query.toLowerCase();

    for (const level of this.curriculum) {
      for (const stream of level.streams) {
        for (const cls of stream.classes) {
          if (classId && cls.id !== classId) continue;
          for (const sub of cls.subjects) {
            if (sub.status !== 'published') continue;
            if (sub.name.toLowerCase().includes(q)) {
              results.push({ type: 'subject', id: sub.id, title: sub.name, subjectName: sub.name, classId: cls.id });
            }
            for (const ch of sub.chapters) {
              if (ch.title.toLowerCase().includes(q)) {
                results.push({ type: 'chapter', id: ch.id, title: ch.title, subjectName: sub.name, chapterTitle: ch.title, classId: cls.id });
              }
              for (const con of ch.concepts) {
                if (con.title.toLowerCase().includes(q)) {
                  results.push({ type: 'concept', id: con.id, title: con.title, subjectName: sub.name, chapterTitle: ch.title, classId: cls.id });
                }
              }
              for (const r of ch.resources) {
                if (r.status === 'published' && r.title.toLowerCase().includes(q)) {
                  results.push({ type: 'resource', id: r.id, title: r.title, subjectName: sub.name, chapterTitle: ch.title, classId: cls.id });
                }
              }
            }
          }
        }
      }
    }
    return results.slice(0, 50);
  }
}

// Global Singleton for in-memory persistence
declare global {
  var __smartLearnDb: SmartLearnDatabase | undefined;
}

export const db = global.__smartLearnDb || new SmartLearnDatabase();
if (process.env.NODE_ENV !== 'production') {
  global.__smartLearnDb = db;
}

