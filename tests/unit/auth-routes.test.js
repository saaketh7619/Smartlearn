const test = require('node:test');
const assert = require('node:assert');

// Role routing and authorization validation
const ROLE_DASHBOARDS = {
  STUDENT: '/student',
  TEACHER: '/teacher',
  PARENT: '/parent',
  ADMIN: '/admin',
};

function getDashboardRouteForRole(role) {
  const normalized = role?.toUpperCase();
  return ROLE_DASHBOARDS[normalized] || '/login';
}

function validateDemoOtp(inputCode) {
  // Production demo accounts accept 123456 as universal verification
  return inputCode === '123456';
}

function canAccessRoute(userRole, path) {
  if (path.startsWith('/student') && userRole !== 'STUDENT') return false;
  if (path.startsWith('/teacher') && userRole !== 'TEACHER') return false;
  if (path.startsWith('/parent') && userRole !== 'PARENT') return false;
  if (path.startsWith('/admin') && userRole !== 'ADMIN') return false;
  return true;
}

test('Role-Aware Authentication & Navigation Routing', async (t) => {
  await t.test('maps all 4 roles to their exact workspace dashboard', () => {
    assert.strictEqual(getDashboardRouteForRole('student'), '/student');
    assert.strictEqual(getDashboardRouteForRole('STUDENT'), '/student');
    assert.strictEqual(getDashboardRouteForRole('teacher'), '/teacher');
    assert.strictEqual(getDashboardRouteForRole('parent'), '/parent');
    assert.strictEqual(getDashboardRouteForRole('admin'), '/admin');
  });

  await t.test('routes invalid or missing role to login', () => {
    assert.strictEqual(getDashboardRouteForRole('unknown'), '/login');
    assert.strictEqual(getDashboardRouteForRole(null), '/login');
  });

  await t.test('validates demo OTP code accurately', () => {
    assert.strictEqual(validateDemoOtp('123456'), true);
    assert.strictEqual(validateDemoOtp('000000'), false);
    assert.strictEqual(validateDemoOtp(''), false);
  });

  await t.test('enforces role authorization guards across portals', () => {
    assert.strictEqual(canAccessRoute('STUDENT', '/student/courses'), true);
    assert.strictEqual(canAccessRoute('STUDENT', '/teacher'), false);
    assert.strictEqual(canAccessRoute('TEACHER', '/teacher/roster'), true);
    assert.strictEqual(canAccessRoute('PARENT', '/admin'), false);
    assert.strictEqual(canAccessRoute('ADMIN', '/admin/settings'), true);
  });
});
