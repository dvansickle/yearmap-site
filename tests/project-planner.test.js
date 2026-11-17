const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { createSnapshot, createPath } = require('../project-planner/example/snapshot.js');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const byId = s => Object.fromEntries(s.ranges.map(r => [r.id, r]));
const overlaps = (a,b) => a.startDate <= b.endDate && a.endDate >= b.startDate;

test('project variants round-trip with UTF-8 and retain the same commitments', () => {
  for (const plan of ['original', 'revised']) {
    const snapshot = createSnapshot(plan), url = createPath(plan);
    assert.match(url, /^\/view\/\?sample=1&source=project-planner#ym1\.json\./);
    const bytes = Buffer.from(url.split('ym1.json.')[1], 'base64url');
    assert.deepEqual(JSON.parse(bytes.toString('utf8')), snapshot);
    assert.ok(bytes.length < 50000 && url.split('#')[1].length < 60000);
    assert.equal(snapshot.categories.length, 5);
    for (const r of snapshot.ranges) {
      assert.ok(snapshot.categories.some(c => c.id === r.categoryId));
      assert.ok(r.startDate <= r.endDate);
      assert.ok(r.note.length <= 500);
    }
  }
  const original = byId(createSnapshot()), revised = byId(createSnapshot('revised'));
  for (const id of Object.keys(original).filter(id => !id.startsWith('cedar-'))) assert.deepEqual(original[id], revised[id]);
  assert.ok(overlaps(original['cedar-work'], original['atlas-delivery']));
  assert.ok(overlaps(original['cedar-work'], original['birch-delivery']));
  assert.ok(overlaps(original['cedar-delivery'], original['time-off']));
  for (const id of ['atlas-work','birch-work','summer-off','time-off','winter-off']) assert.equal(overlaps(revised['cedar-work'], revised[id]), false);
  assert.equal(Date.parse(original['cedar-work'].endDate)-Date.parse(original['cedar-work'].startDate), Date.parse(revised['cedar-work'].endDate)-Date.parse(revised['cedar-work'].startDate));
  const occupiedMonths = new Set();
  for (const r of Object.values(original)) {
    for (let date = new Date(r.startDate + 'T00:00:00Z'); date <= new Date(r.endDate + 'T00:00:00Z'); date.setUTCDate(date.getUTCDate()+1)) occupiedMonths.add(date.getUTCMonth());
  }
  assert.equal(new Set([...occupiedMonths].map(month => Math.floor(month / 3))).size, 4, 'the example must span all four quarters');
  assert.ok(revised['cedar-delivery'].endDate < revised['winter-off'].startDate);
  assert.deepEqual(createSnapshot('unexpected'), createSnapshot('original'));
});

test('all guide sample/store links send safe established events to both providers', () => {
  const listeners = {}, ph = [], ga = [];
  const context = {
    posthog: { __loaded: true, init() {}, capture: (...args) => ph.push(args) },
    gtag: (...args) => ga.push(args),
    document: { body: { dataset: { analyticsPage: 'project-planner' } }, addEventListener: (name, fn) => { listeners[name] = fn; } },
    location: { origin: 'https://yearmap.app', pathname: '/project-planner/', search: '', hash: '' },
    addEventListener() {}
  };
  context.window = context;
  vm.runInNewContext(read('assets/posthog.js'), context);
  const links = [...read('project-planner/index.html').matchAll(/<a\b([^>]+)>([\s\S]*?)<\/a>/g)];
  let count = 0;
  for (const [, attrs, content] of links) {
    const href = /href="([^"]+)"/.exec(attrs)?.[1].replace(/&amp;/g, '&');
    const store = href?.includes('chromewebstore.google.com');
    if (!store && !href?.startsWith('/project-planner/example/')) continue;
    count++;
    const location = /data-analytics-location="([^"]+)"/.exec(attrs)?.[1];
    const link = { dataset: { analyticsLocation: location, analyticsEvent: /data-analytics-event="([^"]+)"/.exec(attrs)?.[1] }, textContent: content.replace(/<[^>]*>/g, ''), getAttribute: () => href, closest: () => null };
    listeners.click({ target: { closest: () => link } });
    const [event, props] = ph.at(-1);
    assert.equal(event, store ? 'chrome_store_cta_clicked' : 'sample_calendar_cta_clicked');
    assert.equal(props.link_location, location);
    assert.equal(props.href, href);
    const [kind, gaEvent, gaProps] = ga.at(-1);
    assert.equal(kind, 'event'); assert.equal(gaEvent, event);
    assert.equal(gaProps.link_url, href); assert.equal(gaProps.link_location, location);
    assert.equal(gaProps.page_location, 'https://yearmap.app/project-planner/');
    assert.doesNotMatch(JSON.stringify([props, gaProps]), /ym1\.|#|Atlas brand project|2027|snapshot|note/);
  }
  assert.equal(count, 8);
  assert.doesNotMatch(read('project-planner/example/index.html'), /posthog|gtag|analytics\.js/);
});
