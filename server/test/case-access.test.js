process.env.JWT_SECRET = process.env.JWT_SECRET || 'synthetic_test_secret_with_at_least_32_characters';

const test = require('node:test');
const assert = require('node:assert/strict');
const caseRepository = require('../src/repositories/caseRepository');
const { canUserAccessCase, canUserReadDocument } = require('../src/services/caseAccessService');
const { pool } = require('../src/database/db');
const clientRepository = require('../src/repositories/clientRepository');

test.after(async () => { if (pool) await pool.end(); });

test('case and document access enforce ownership, visibility, roles, and lawyer assignment', async () => {
  const ownCase = { id: 10, userId: 100, clientEmail: 'client-a@example.invalid' };
  const otherCase = { id: 20, userId: 200, clientEmail: 'client-b@example.invalid' };
  const clientA = { id: 100, role: 'client', email: 'client-a@example.invalid' };
  const admin = { id: 1, role: 'admin' };
  const lawyer = { id: 300, role: 'lawyer' };
  const original = caseRepository.isLawyerUserAssigned;
  caseRepository.isLawyerUserAssigned = async (caseId, userId) => caseId === 10 && userId === 300;
  try {
    assert.equal(await canUserAccessCase(clientA, ownCase), true);
    assert.equal(await canUserAccessCase(clientA, otherCase), false);
    assert.equal(await canUserAccessCase(admin, otherCase), true);
    assert.equal(await canUserAccessCase(lawyer, ownCase), true);
    assert.equal(await canUserAccessCase(lawyer, otherCase), false);
    assert.equal(await canUserReadDocument(clientA, ownCase, { caseId: 10, visibleToClient: true }), true);
    assert.equal(await canUserReadDocument(clientA, otherCase, { caseId: 20, visibleToClient: true }), false);
    assert.equal(await canUserReadDocument(clientA, ownCase, { caseId: 10, visibleToClient: false }), false);
  } finally {
    caseRepository.isLawyerUserAssigned = original;
  }
});

test('verification code is consumed atomically under concurrent registration', async () => {
  const originalGetConnection = pool.getConnection;
  const state = {
    client: {
      id: 7,
      full_name: 'Synthetic Client',
      phone: '',
      user_id: null,
      verification_code_used_at: null,
      verification_code_expires_at: new Date(Date.now() + 60000),
      verification_attempts: 0,
    },
    nextUserId: 50,
    lock: Promise.resolve(),
  };

  pool.getConnection = async () => {
    let unlock;
    let ownsLock = false;
    return {
      async beginTransaction() {},
      async query(sql, params) {
        if (sql.includes('FROM clients') && sql.includes('FOR UPDATE')) {
          const previous = state.lock;
          state.lock = new Promise((resolve) => { unlock = resolve; });
          await previous;
          ownsLock = true;
          return [[{ ...state.client }]];
        }
        if (sql.includes('FROM users')) return [[]];
        if (sql.includes('INSERT INTO users')) return [{ insertId: state.nextUserId++ }];
        if (sql.includes('UPDATE clients SET user_id')) {
          state.client.user_id = params[0];
          state.client.verification_code_used_at = new Date();
          state.client.verification_attempts += 1;
          return [{}];
        }
        if (sql.includes('verification_attempts = verification_attempts + 1')) {
          state.client.verification_attempts += 1;
          return [{}];
        }
        return [{}];
      },
      async commit() { if (ownsLock) { ownsLock = false; unlock(); } },
      async rollback() { if (ownsLock) { ownsLock = false; unlock(); } },
      release() {},
    };
  };

  try {
    const [first, second] = await Promise.all([
      clientRepository.registerAccount({ verificationCode: 'ABCDEFGH', email: 'one@example.invalid', passwordHash: 'hash-one' }),
      clientRepository.registerAccount({ verificationCode: 'ABCDEFGH', email: 'two@example.invalid', passwordHash: 'hash-two' }),
    ]);
    assert.equal([first, second].filter((result) => result.user).length, 1);
    assert.equal([first, second].filter((result) => result.error === 'INVALID_CODE').length, 1);
  } finally {
    pool.getConnection = originalGetConnection;
  }
});
