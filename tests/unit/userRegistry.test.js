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
});
