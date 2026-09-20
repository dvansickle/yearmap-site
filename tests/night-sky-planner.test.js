const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const planner = require('../night-sky/planner.js');
const titleContract = require('../view/snapshot-title.js');

function rangeById(id) {
  return planner.snapshot.ranges.find((range) => range.id === id);
}

test('night-sky planner is a valid titled version 1 snapshot', () => {
  const { snapshot } = planner;
  const categoryIds = new Set(snapshot.categories.map((category) => category.id));
  const rangeIds = new Set();

  assert.equal(snapshot.v, 1);
  assert.equal(snapshot.year, 2026);
  assert.equal(snapshot.title, 'Night Sky Planner — Fall & Winter 2026');
  assert.doesNotThrow(() => titleContract.validateSnapshotTitle(snapshot));
  assert.equal(snapshot.categories.length, 5);

  snapshot.ranges.forEach((range) => {
    assert.equal(categoryIds.has(range.categoryId), true, `unknown category for ${range.id}`);
    assert.equal(rangeIds.has(range.id), false, `duplicate range id ${range.id}`);
    assert.match(range.startDate, /^2026-\d{2}-\d{2}$/);
    assert.match(range.endDate, /^2026-\d{2}-\d{2}$/);
    assert.equal(range.startDate <= range.endDate, true);
    assert.equal(typeof range.note, 'string');
    assert.equal(range.note.length <= 500, true);
    rangeIds.add(range.id);
  });
});

test('planner contains the researched meteor, Moon, planet, and season layers', () => {
  assert.deepEqual(
    [
      'draconids',
      'orionids',
      'southern-taurids',
      'northern-taurids',
      'leonids',
      'geminids',
      'ursids'
    ].map((id) => rangeById(id).endDate),
    [
      '2026-10-09',
      '2026-10-22',
      '2026-11-05',
      '2026-11-12',
      '2026-11-18',
      '2026-12-14',
      '2026-12-22'
    ]
  );

  assert.deepEqual(
    ['october-dark-sky', 'november-dark-sky', 'december-dark-sky'].map((id) => [
      rangeById(id).startDate,
      rangeById(id).endDate
    ]),
    [
      ['2026-10-08', '2026-10-12'],
      ['2026-11-07', '2026-11-11'],
      ['2026-12-07', '2026-12-11']
    ]
  );

  assert.deepEqual(
    ['neptune-opposition', 'saturn-opposition', 'uranus-opposition'].map((id) => rangeById(id).startDate),
    ['2026-09-25', '2026-10-04', '2026-11-25']
  );

  assert.equal(rangeById('september-equinox').startDate, '2026-09-23');
  assert.equal(rangeById('december-solstice').startDate, '2026-12-21');
});

test('permanent route creates a local fragment-only snapshot link', () => {
  const sharePath = planner.createSharePath();
  const prefix = '/view/?source=night-sky#ym1.json.';
  const encoded = sharePath.slice(prefix.length);

  assert.equal(sharePath.startsWith(prefix), true);
  assert.equal(encoded.length <= 60000, true);
  assert.equal(Buffer.byteLength(JSON.stringify(planner.snapshot), 'utf8') <= 50000, true);
  const decoded = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  assert.deepEqual(decoded, planner.snapshot);
});

test('night-sky route has public preview copy and no embedded snapshot fragment', () => {
  const pageSource = fs.readFileSync(path.join(__dirname, '..', 'night-sky', 'index.html'), 'utf8');

  assert.match(pageSource, /<title>2026 Night Sky Planner — YearMap<\/title>/);
  assert.match(pageSource, /https:\/\/yearmap\.app\/night-sky\//);
  assert.match(pageSource, /International Meteor Organization/);
  assert.match(pageSource, /U\.S\. Naval Observatory/);
  assert.match(pageSource, /NASA/);
  assert.doesNotMatch(pageSource, /#ym1\./);
});
