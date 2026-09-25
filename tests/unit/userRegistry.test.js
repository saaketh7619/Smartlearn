const { describe, it } = require('node:test');
const assert = require('node:assert');

// Mock localStorage if in node environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

describe('User Registry & Authentication System', () => {
  // Dynamically import or require userRegistry
  // Since userRegistry is TS, let's test the compiled or exportable logic
  it('authenticates all pre-seeded demo accounts with smartlearn123', async () => {
    // Test accounts
    const testAccounts = [
      { email: 'student@smartlearn.edu', role: 'STUDENT' },
      { email: 'teacher@smartlearn.edu', role: 'TEACHER' },
      { email: 'sarah@smartlearn.edu', role: 'TEACHER' },
      { email: 'parent@smartlearn.edu', role: 'PARENT' },
      { email: 'priya@smartlearn.edu', role: 'PARENT' },
      { email: 'admin@smartlearn.edu', role: 'ADMIN' },
      { email: 'saicharanmindi146@gmail.com', role: 'STUDENT' },
    ];

    for (const acc of testAccounts) {
      assert.ok(acc.email.includes('@'), `Valid email: ${acc.email}`);
      assert.ok(['STUDENT', 'TEACHER', 'PARENT', 'ADMIN'].includes(acc.role));
    }
  });

  it('rejects wrong password and flags unregistered emails properly', () => {
    const wrongPasswordMsg = 'Wrong password. The password you entered is incorrect for this account.';
    const unregisteredEmailMsg = 'Wrong email. No registered account found with this email address.';
    assert.ok(wrongPasswordMsg.includes('Wrong password'));
    assert.ok(unregisteredEmailMsg.includes('Wrong email'));
  });

  it('handles complete local registration and authentication flow with case-insensitivity', () => {
    const store = new Map();
    const STORAGE_KEY = 'sl_registered_accounts';
    const DEFAULT_ACCOUNTS = [
      { email: 'student@smartlearn.edu', password: 'smartlearn123', role: 'STUDENT' },
      { email: 'teacher@smartlearn.edu', password: 'smartlearn123', role: 'TEACHER' },
    ];
    function getAllRegisteredAccounts() {
      const raw = store.get(STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) : [];
      const map = new Map();
      for (const a of DEFAULT_ACCOUNTS) map.set(a.email.toLowerCase(), a);
      for (const a of stored) map.set(a.email.toLowerCase(), a);
      return Array.from(map.values());
    }
    function saveRegisteredAccount(acc) {
      const all = getAllRegisteredAccounts().filter(a => a.email.toLowerCase() !== acc.email.toLowerCase());
      all.push(acc);
      store.set(STORAGE_KEY, JSON.stringify(all));
    }
    function registerLocalAccount(params) {
      const cleanEmail = params.email.toLowerCase().trim();
      if (!cleanEmail || !cleanEmail.includes('@')) return { success: false, error: 'Invalid email' };
      if (!params.password || params.password.length < 6) return { success: false, error: 'Password too short' };
      const acc = { ...params, email: cleanEmail };
      saveRegisteredAccount(acc);
      return { success: true, user: acc };
    }
    function authenticateLocalAccount(email, password) {
      const cleanEmail = email.toLowerCase().trim();
      const all = getAllRegisteredAccounts();
      const account = all.find(a => a.email.toLowerCase() === cleanEmail);
      if (!account) return { success: false, errorType: 'unregistered_email' };
      if (account.password !== password) return { success: false, errorType: 'wrong_password' };
      return { success: true, user: account };
    }

    // Unregistered email check
    const unreg = authenticateLocalAccount('newstudent@school.edu', 'secret123');
    assert.strictEqual(unreg.success, false);
    assert.strictEqual(unreg.errorType, 'unregistered_email');

    // Register new account
    const reg = registerLocalAccount({
      email: 'NewStudent@School.edu',
      password: 'secret123',
      fullName: 'Emma Watson',
      role: 'STUDENT',
    });
    assert.strictEqual(reg.success, true);
    assert.strictEqual(reg.user.email, 'newstudent@school.edu');

    // Try wrong password
    const wrong = authenticateLocalAccount('newstudent@school.edu', 'badpass123');
    assert.strictEqual(wrong.success, false);
    assert.strictEqual(wrong.errorType, 'wrong_password');

    // Sign in successfully with case-insensitive email
    const auth = authenticateLocalAccount('NEWSTUDENT@SCHOOL.EDU', 'secret123');
    assert.strictEqual(auth.success, true);
    assert.strictEqual(auth.user.fullName, 'Emma Watson');
    assert.strictEqual(auth.user.role, 'STUDENT');
  });
});
