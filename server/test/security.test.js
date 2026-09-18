process.env.JWT_SECRET = process.env.JWT_SECRET || 'synthetic_test_secret_with_at_least_32_characters';
process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const jwt = require('jsonwebtoken');

const config = require('../src/config');
const LocalStorage = require('../src/storage/LocalStorage');
const { hasValidSignature } = require('../src/middlewares/uploadMiddleware');
const { authenticateToken } = require('../src/middlewares/authMiddleware');
const { createRateLimit } = require('../src/middlewares/rateLimit');
const { pool } = require('../src/database/db');

test.after(async () => { if (pool) await pool.end(); });

function responseRecorder() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    setHeader(name, value) { this.headers[name] = value; },
  };
}

test('LocalStorage rejects path traversal and absolute paths', () => {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alianza-storage-test-'));
  const storage = new LocalStorage(baseDir);
  for (const key of ['../../etc/passwd', '..\\..\\secret.txt', 'documents/../../../secret', '/documents/file.pdf']) {
    assert.throws(() => storage.getAbsolutePath(key), /Invalid storage key/);
  }
  assert.equal(storage.getAbsolutePath('documents/2026/file.pdf'), path.join(baseDir, 'documents', '2026', 'file.pdf'));
  fs.rmSync(baseDir, { recursive: true, force: true });
});

test('file signatures reject simple MIME and extension spoofing', () => {
  assert.equal(hasValidSignature(Buffer.from('%PDF-1.7'), 'application/pdf'), true);
  assert.equal(hasValidSignature(Buffer.from('<script>'), 'application/pdf'), false);
  assert.equal(hasValidSignature(Buffer.from([0xff, 0xd8, 0xff, 0xe0]), 'image/jpeg'), true);
  assert.equal(hasValidSignature(Buffer.from('not jpeg'), 'image/jpeg'), false);
  assert.equal(hasValidSignature(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), 'image/png'), true);
});

test('JWT middleware accepts valid cookie and rejects expired or tampered tokens', async (t) => {
  const valid = jwt.sign({ id: 1, role: 'client' }, config.jwt.secret, { algorithm: 'HS256', expiresIn: '5m' });
  const expired = jwt.sign({ id: 1, role: 'client' }, config.jwt.secret, { algorithm: 'HS256', expiresIn: '-1s' });

  await t.test('valid cookie', () => {
    const req = { headers: { cookie: `access_token=${valid}` } };
    const res = responseRecorder();
    let nextCalled = false;
    authenticateToken(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(req.user.id, 1);
  });

  for (const token of [expired, `${valid.slice(0, -1)}x`, 'not-a-token']) {
    const req = { headers: { cookie: `access_token=${token}` } };
    const res = responseRecorder();
    authenticateToken(req, res, () => assert.fail('invalid token reached next'));
    assert.equal(res.statusCode, 403);
  }
});

test('rate limiter returns 429 and standard rate headers', () => {
  const limiter = createRateLimit({ windowMs: 60000, max: 2 });
  const req = { ip: '192.0.2.10', socket: {} };
  const next = () => {};
  limiter(req, responseRecorder(), next);
  limiter(req, responseRecorder(), next);
  const blocked = responseRecorder();
  limiter(req, blocked, next);
  assert.equal(blocked.statusCode, 429);
  assert.equal(blocked.headers['RateLimit-Limit'], '2');
  assert.ok(blocked.headers['Retry-After']);
});

test('/uploads is never served publicly', async () => {
  const app = require('../src/app');
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/uploads/synthetic.pdf`);
    assert.equal(response.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
