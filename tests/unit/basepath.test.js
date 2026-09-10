const test = require('node:test');
const assert = require('node:assert');

// Replica of src/lib/basePath.ts logic for test execution
function resolveBasePath(path, basePathEnv = '/Smartlearn') {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanBase = basePathEnv.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanBase && cleanPath.startsWith(`${cleanBase}/`)) {
    return cleanPath;
  }
  return `${cleanBase}${cleanPath}`;
}

test('Base Path Resolution for GitHub Pages', async (t) => {
  await t.test('prepends base path to root-relative paths', () => {
    assert.strictEqual(resolveBasePath('/images/logo.png', '/Smartlearn'), '/Smartlearn/images/logo.png');
    assert.strictEqual(resolveBasePath('/favicon.ico', '/Smartlearn'), '/Smartlearn/favicon.ico');
  });

  await t.test('handles paths without leading slash', () => {
    assert.strictEqual(resolveBasePath('manifest.json', '/Smartlearn'), '/Smartlearn/manifest.json');
  });

  await t.test('does not double prepend base path if already present', () => {
    assert.strictEqual(resolveBasePath('/Smartlearn/images/logo.png', '/Smartlearn'), '/Smartlearn/images/logo.png');
  });

  await t.test('preserves external absolute URLs', () => {
    const external = 'https://images.unsplash.com/photo-123';
    assert.strictEqual(resolveBasePath(external, '/Smartlearn'), external);
  });

  await t.test('preserves data URIs', () => {
    const dataUri = 'data:image/svg+xml;base64,...';
    assert.strictEqual(resolveBasePath(dataUri, '/Smartlearn'), dataUri);
  });

  await t.test('handles empty base path in standard local dev', () => {
    assert.strictEqual(resolveBasePath('/student', ''), '/student');
  });
});
