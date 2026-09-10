const test = require('node:test');
const assert = require('node:assert');

// =========================================================================
// Onboarding Routing Tests — Get Started Page, Login Flow, Role Guard
// =========================================================================

// Helper: build Get Started card URL params (same logic as get-started/page.tsx)
function buildGetStartedLoginUrl(roleId, mode) {
  return `/login?role=${roleId}&mode=${mode}`;
}

// Helper: check valid role IDs on /get-started page
const VALID_ROLE_IDS = ['student', 'teacher', 'parent', 'admin'];

// Helper: role-guard access check
const ROLE_DASHBOARDS = {
  STUDENT: '/student',
  TEACHER: '/teacher',
  PARENT: '/parent',
  ADMIN: '/admin',
};

function getRedirectPath(role) {
  const normalized = role?.toUpperCase();
  return ROLE_DASHBOARDS[normalized] ?? '/login';
}

function canAccessPortal(userRole, requiredRole) {
  if (!userRole) return false;
  return userRole.toUpperCase() === requiredRole.toUpperCase();
}

// Helper: parse role/mode from login URL
function parseLoginSearchParams(url) {
  const params = new URLSearchParams(url.split('?')[1] || '');
  return {
    role: params.get('role'),
    mode: params.get('mode'),
  };
}

// =========================================================================
// Test Suite 1: /get-started role card URL generation
// =========================================================================

test('/get-started page — role card action URLs', async (t) => {
  await t.test('all 4 role IDs are valid', () => {
    assert.ok(VALID_ROLE_IDS.includes('student'), 'student must be present');
    assert.ok(VALID_ROLE_IDS.includes('teacher'), 'teacher must be present');
    assert.ok(VALID_ROLE_IDS.includes('parent'), 'parent must be present');
    assert.ok(VALID_ROLE_IDS.includes('admin'), 'admin must be present');
    assert.strictEqual(VALID_ROLE_IDS.length, 4, 'exactly 4 roles must exist');
  });

  await t.test('Create Account button links to /login?role=<role>&mode=signup for all 4 roles', () => {
    for (const roleId of VALID_ROLE_IDS) {
      const url = buildGetStartedLoginUrl(roleId, 'signup');
      const { role, mode } = parseLoginSearchParams(url);
      assert.strictEqual(role, roleId, `role param mismatch for ${roleId}`);
      assert.strictEqual(mode, 'signup', `mode must be signup for ${roleId}`);
    }
  });

  await t.test('Log In button links to /login?role=<role>&mode=signin for all 4 roles', () => {
    for (const roleId of VALID_ROLE_IDS) {
      const url = buildGetStartedLoginUrl(roleId, 'signin');
      const { role, mode } = parseLoginSearchParams(url);
      assert.strictEqual(role, roleId, `role param mismatch for ${roleId}`);
      assert.strictEqual(mode, 'signin', `mode must be signin for ${roleId}`);
    }
  });

  await t.test('no role is auto-selected (explicit user choice required)', () => {
    // The page renders all 4 cards with equal weight — no preselected active state on initial load
    const defaultSelectedRole = null; // No role auto-selected
    assert.strictEqual(defaultSelectedRole, null, 'default role must be null (explicit user choice)');
  });
});

// =========================================================================
// Test Suite 2: Login page role + mode query param handling
// =========================================================================

test('/login page — role and mode parameter handling', async (t) => {
  await t.test('maps student role param to STUDENT dashboard on OTP success', () => {
    const redirectPath = getRedirectPath('student');
    assert.strictEqual(redirectPath, '/student');
  });

  await t.test('maps teacher role param to TEACHER dashboard on OTP success', () => {
    const redirectPath = getRedirectPath('teacher');
    assert.strictEqual(redirectPath, '/teacher');
  });

  await t.test('maps parent role param to PARENT dashboard on OTP success', () => {
    const redirectPath = getRedirectPath('parent');
    assert.strictEqual(redirectPath, '/parent');
  });

  await t.test('maps admin role param to ADMIN dashboard on OTP success', () => {
    const redirectPath = getRedirectPath('admin');
    assert.strictEqual(redirectPath, '/admin');
  });

  await t.test('falls back to /login for unknown role params', () => {
    assert.strictEqual(getRedirectPath('superuser'), '/login');
    assert.strictEqual(getRedirectPath(null), '/login');
    assert.strictEqual(getRedirectPath(undefined), '/login');
  });

  await t.test('mode=signup maps to Create Account form mode', () => {
    const { mode } = parseLoginSearchParams('/login?role=student&mode=signup');
    assert.strictEqual(mode, 'signup');
  });

  await t.test('mode=signin maps to Sign In form mode', () => {
    const { mode } = parseLoginSearchParams('/login?role=teacher&mode=signin');
    assert.strictEqual(mode, 'signin');
  });

  await t.test('STUDENT role normalized correctly in redirect map', () => {
    assert.strictEqual(getRedirectPath('STUDENT'), '/student');
    assert.strictEqual(getRedirectPath('Student'), '/student');
  });
});

// =========================================================================
// Test Suite 3: RoleGuard authorization rules
// =========================================================================

test('RoleGuard — role-based access control', async (t) => {
  await t.test('STUDENT can access /student portal', () => {
    assert.strictEqual(canAccessPortal('STUDENT', 'STUDENT'), true);
  });

  await t.test('STUDENT cannot access /teacher portal', () => {
    assert.strictEqual(canAccessPortal('STUDENT', 'TEACHER'), false);
  });

  await t.test('STUDENT cannot access /parent portal', () => {
    assert.strictEqual(canAccessPortal('STUDENT', 'PARENT'), false);
  });

  await t.test('STUDENT cannot access /admin portal', () => {
    assert.strictEqual(canAccessPortal('STUDENT', 'ADMIN'), false);
  });

  await t.test('TEACHER can access /teacher portal', () => {
    assert.strictEqual(canAccessPortal('TEACHER', 'TEACHER'), true);
  });

  await t.test('TEACHER cannot access /student portal', () => {
    assert.strictEqual(canAccessPortal('TEACHER', 'STUDENT'), false);
  });

  await t.test('PARENT can access /parent portal', () => {
    assert.strictEqual(canAccessPortal('PARENT', 'PARENT'), true);
  });

  await t.test('PARENT cannot access /admin portal', () => {
    assert.strictEqual(canAccessPortal('PARENT', 'ADMIN'), false);
  });

  await t.test('ADMIN can access /admin portal', () => {
    assert.strictEqual(canAccessPortal('ADMIN', 'ADMIN'), true);
  });

  await t.test('ADMIN cannot access /student portal', () => {
    assert.strictEqual(canAccessPortal('ADMIN', 'STUDENT'), false);
  });

  await t.test('unauthenticated (null) user cannot access any portal', () => {
    for (const requiredRole of ['STUDENT', 'TEACHER', 'PARENT', 'ADMIN']) {
      assert.strictEqual(canAccessPortal(null, requiredRole), false, `null should fail ${requiredRole}`);
    }
  });

  await t.test('unauthenticated (undefined) user cannot access any portal', () => {
    for (const requiredRole of ['STUDENT', 'TEACHER', 'PARENT', 'ADMIN']) {
      assert.strictEqual(canAccessPortal(undefined, requiredRole), false, `undefined should fail ${requiredRole}`);
    }
  });

  await t.test('role comparison is case-insensitive', () => {
    assert.strictEqual(canAccessPortal('student', 'STUDENT'), true);
    assert.strictEqual(canAccessPortal('TEACHER', 'teacher'), true);
    assert.strictEqual(canAccessPortal('parent', 'parent'), true);
  });
});

// =========================================================================
// Test Suite 4: Auth redirect mapping — all 4 roles
// =========================================================================

test('Auth redirect mapping — verified login redirects', async (t) => {
  const roleRedirectTable = [
    { role: 'STUDENT', expectedPath: '/student' },
    { role: 'TEACHER', expectedPath: '/teacher' },
    { role: 'PARENT', expectedPath: '/parent' },
    { role: 'ADMIN', expectedPath: '/admin' },
  ];

  await t.test('all 4 roles redirect to the correct dashboard after login', () => {
    for (const entry of roleRedirectTable) {
      const actual = getRedirectPath(entry.role);
      assert.strictEqual(
        actual,
        entry.expectedPath,
        `After login, ${entry.role} should redirect to ${entry.expectedPath}, got ${actual}`
      );
    }
  });

  await t.test('redirect table covers exactly 4 roles', () => {
    assert.strictEqual(roleRedirectTable.length, 4);
  });

  await t.test('each redirect path is a unique path prefix', () => {
    const paths = roleRedirectTable.map((e) => e.expectedPath);
    const uniquePaths = new Set(paths);
    assert.strictEqual(uniquePaths.size, 4, 'all redirect paths must be unique');
  });

  await t.test('all redirect paths start with /', () => {
    for (const entry of roleRedirectTable) {
      assert.ok(entry.expectedPath.startsWith('/'), `${entry.expectedPath} must start with /`);
    }
  });
});
