const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { snapshot, createPath } = require('../vacation-planner/example/snapshot.js');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');

test('vacation example survives UTF-8 sharing and fits existing viewer limits', () => {
  const url = createPath();
  assert.match(url, /^\/view\/\?sample=1&source=vacation-planner#ym1\.json\./);
  assert.ok(url.split('#')[1].length < 60000);
  const bytes = Buffer.from(url.split('ym1.json.')[1], 'base64url');
  assert.ok(bytes.length < 50000);
  assert.deepEqual(JSON.parse(bytes.toString('utf8')), snapshot);
  assert.ok(snapshot.categories.length <= 5);
  const ranges = Object.fromEntries(snapshot.ranges.map(r => [r.id, r]));
  assert.ok(ranges.a.startDate <= ranges.conference.endDate && ranges.a.endDate >= ranges.conference.startDate);
  assert.ok(ranges.b.startDate > ranges.conference.endDate);
  for (const trip of [ranges.a, ranges.b]) {
    assert.ok(trip.startDate >= ranges.summer.startDate && trip.endDate <= ranges.summer.endDate);
    assert.equal((Date.parse(trip.endDate) - Date.parse(trip.startDate)) / 86400000 + 1, 9);
  }
});

test('all guide sample/store links send safe established events to both providers', () => {
  const listeners = {}, ph = [], ga = [];
  const context = {
    posthog: { __loaded: true, init() {}, capture: (...args) => ph.push(args) },
    gtag: (...args) => ga.push(args),
    document: { body: { dataset: { analyticsPage: 'vacation-planner' } }, addEventListener: (name, fn) => { listeners[name] = fn; } },
    location: { origin: 'https://yearmap.app', pathname: '/vacation-planner/', search: '', hash: '' },
    addEventListener() {}
  };
  context.window = context;
  vm.runInNewContext(read('assets/posthog.js'), context);
  const links = [...read('vacation-planner/index.html').matchAll(/<a\b([^>]+)>([\s\S]*?)<\/a>/g)];
  let count = 0;
  for (const [, attrs, content] of links) {
    const href = /href="([^"]+)"/.exec(attrs)?.[1].replace(/&amp;/g, '&');
    const store = href?.includes('chromewebstore.google.com');
    if (!store && href !== '/vacation-planner/example/') continue;
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
    assert.equal(gaProps.page_location, 'https://yearmap.app/vacation-planner/');
    assert.doesNotMatch(JSON.stringify([props, gaProps]), /ym1\.|#|School breaks|2027|snapshot|note/);
  }
  assert.equal(count, 7);
  assert.doesNotMatch(read('vacation-planner/example/index.html'), /posthog|gtag|analytics\.js/);
});
