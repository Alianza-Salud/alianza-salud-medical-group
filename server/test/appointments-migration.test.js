const test = require('node:test');
const assert = require('node:assert/strict');
const { up } = require('../migrations/007_complete_appointments_columns');

function database(existing = [], failOnceOn = null) {
  const columns = new Set(existing);
  const additions = [];
  return {
    columns, additions,
    async query(sql, params) {
      if (sql.includes('information_schema.COLUMNS')) {
        return [columns.has(params[0]) ? [{ COLUMN_NAME: params[0] }] : []];
      }
      const match = /^ALTER TABLE appointments ADD COLUMN `([a-z_]+)` /.exec(sql);
      assert.ok(match, 'migration must only inspect schema or add columns');
      if (failOnceOn === match[1]) {
        failOnceOn = null;
        throw new Error('synthetic interruption');
      }
      assert.equal(columns.has(match[1]), false, 'must not duplicate a column');
      columns.add(match[1]);
      additions.push(match[1]);
      return [{}];
    },
  };
}

test('appointment migration fills missing columns and is safe to repeat', async () => {
  const db = database(['assigned_lawyer_id', 'modality', 'meet_link']);
  await up(db);
  assert.deepEqual(db.additions, ['case_type', 'has_lawyer', 'wants_legal_support']);
  await up(db);
  assert.equal(db.additions.length, 3);
});

test('appointment migration resumes after partially committed DDL', async () => {
  const db = database([], 'has_lawyer');
  await assert.rejects(up(db), /synthetic interruption/);
  assert.ok(db.columns.has('case_type'));
  await up(db);
  assert.equal(db.columns.size, 6);
  assert.equal(db.additions.length, 6);
});
