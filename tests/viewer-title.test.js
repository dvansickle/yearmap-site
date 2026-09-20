const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const titleContract = require('../view/snapshot-title.js');

function snapshot(overrides = {}) {
  return {
    v: 1,
    year: 2026,
    createdAt: '2026-09-19T14:00:00.000Z',
    categories: [],
    ranges: [],
    ...overrides
  };
}

function formatCreatedDate() {
  return 'Sep 19, 2026';
}

function createDocumentDouble() {
  const elements = new Map([
    ['page-title', { textContent: 'Shared YearMap' }],
    ['page-subhead', { textContent: 'Read-only calendar shared from YearMap' }]
  ]);

  return {
    title: 'Shared YearMap',
    getElementById(id) {
      return elements.get(id);
    },
    elements
  };
}

test('accepts a valid optional title and the 80-character boundary', () => {
  assert.doesNotThrow(() => titleContract.validateSnapshotTitle(snapshot({ title: 'Family and travel plans' })));
  assert.doesNotThrow(() => titleContract.validateSnapshotTitle(snapshot({ title: 'x'.repeat(80) })));
});

test('keeps title-less version 1 snapshots valid', () => {
  assert.doesNotThrow(() => titleContract.validateSnapshotTitle(snapshot()));
});

test('rejects invalid title types', () => {
  [null, 42, true, {}, []].forEach((title) => {
    assert.throws(() => titleContract.validateSnapshotTitle(snapshot({ title })), /Invalid title/);
  });
});

test('rejects blank, untrimmed, and overlong titles', () => {
  ['', '   ', ' Family plans', 'Family plans ', 'x'.repeat(81)].forEach((title) => {
    assert.throws(() => titleContract.validateSnapshotTitle(snapshot({ title })), /Invalid title/);
  });
});

test('renders titled snapshots as text and sets the titled document name', () => {
  const documentDouble = createDocumentDouble();
  const unsafeTitle = '<img src=x onerror=alert(1)>';

  titleContract.renderSnapshotHeader(
    documentDouble,
    snapshot({ title: unsafeTitle }),
    formatCreatedDate
  );

  assert.equal(documentDouble.title, `${unsafeTitle} — YearMap`);
  assert.equal(documentDouble.elements.get('page-title').textContent, unsafeTitle);
  assert.equal(
    documentDouble.elements.get('page-subhead').textContent,
    '2026 · Read-only calendar shared Sep 19, 2026'
  );
  assert.equal(Object.hasOwn(documentDouble.elements.get('page-title'), 'innerHTML'), false);
});

test('preserves the existing title-less viewer presentation', () => {
  const documentDouble = createDocumentDouble();

  titleContract.renderSnapshotHeader(documentDouble, snapshot(), formatCreatedDate);

  assert.equal(documentDouble.title, 'YearMap 2026');
  assert.equal(documentDouble.elements.get('page-title').textContent, 'YearMap 2026');
  assert.equal(
    documentDouble.elements.get('page-subhead').textContent,
    'Read-only calendar shared Sep 19, 2026'
  );
});

test('viewer analytics remain title-free', () => {
  const viewerPath = path.join(__dirname, '..', 'view', 'index.html');
  const viewerSource = fs.readFileSync(viewerPath, 'utf8');
  const analyticsCall = viewerSource.match(
    /YearMapAnalytics\?\.track\?\.\('shared_calendar_viewed',\s*\{([\s\S]*?)\}\);/
  );

  assert.ok(analyticsCall, 'expected the shared-calendar analytics call');
  assert.match(analyticsCall[1], /is_sample/);
  assert.doesNotMatch(analyticsCall[1], /title|snapshot|location|hash/i);
  assert.match(
    viewerSource,
    /gtag\('config', 'G-290HM1TX70', \{ page_title: 'Shared YearMap' \}\)/
  );
  assert.match(viewerSource, /<title>Shared YearMap<\/title>/);

  const analyticsSource = fs.readFileSync(path.join(__dirname, '..', 'assets', 'posthog.js'), 'utf8');
  assert.match(analyticsSource, /analyticsPage === 'shared-view'/);
  assert.match(
    analyticsSource,
    /disable_session_recording: document\.body\?\.dataset\.analyticsPage === 'shared-view'/
  );
  assert.match(analyticsSource, /delete event\.properties\.\$title/);
  assert.match(
    analyticsSource,
    /page_title: document\.body\?\.dataset\.analyticsPage === 'shared-view'[\s\S]*?'Shared YearMap'/
  );
  assert.doesNotMatch(analyticsSource, /snapshot\.title|snapshot\[['"]title['"]\]/);

  const contractSource = fs.readFileSync(path.join(__dirname, '..', 'view', 'snapshot-title.js'), 'utf8');
  assert.doesNotMatch(contractSource, /YearMapAnalytics|posthog|gtag|fetch\(|XMLHttpRequest|sendBeacon/i);
});

test('shared-view analytics suppress the dynamic document title at runtime', () => {
  const analyticsSource = fs.readFileSync(path.join(__dirname, '..', 'assets', 'posthog.js'), 'utf8');
  const posthogCaptures = [];
  const gtagCalls = [];
  let posthogConfig;

  const posthog = {
    __loaded: true,
    capture(eventName, properties) {
      posthogCaptures.push({ eventName, properties });
    },
    init(_token, config) {
      posthogConfig = config;
    }
  };
  const document = {
    addEventListener() {},
    body: { dataset: { analyticsPage: 'shared-view' } },
    querySelectorAll() { return []; }
  };
  const context = {
    document,
    posthog,
    window: {
      addEventListener() {},
      document,
      gtag(...args) { gtagCalls.push(args); },
      location: {
        origin: 'https://yearmap.app',
        pathname: '/view/',
        search: '?sample=1'
      },
      posthog
    }
  };

  vm.runInNewContext(analyticsSource, context);

  assert.equal(posthogConfig.disable_session_recording, true);
  const sanitizedEvent = posthogConfig.before_send({
    properties: {
      $current_url: 'https://yearmap.app/view/#private-payload',
      $title: 'Private family calendar'
    }
  });
  assert.equal(sanitizedEvent.properties.$title, undefined);
  assert.equal(sanitizedEvent.properties.$current_url, 'https://yearmap.app/view/');

  context.window.YearMapAnalytics.track('shared_calendar_viewed', { is_sample: true });

  assert.deepEqual(posthogCaptures, [
    { eventName: 'shared_calendar_viewed', properties: { is_sample: true } }
  ]);
  assert.equal(gtagCalls.length, 1);
  assert.equal(gtagCalls[0][0], 'event');
  assert.equal(gtagCalls[0][1], 'shared_calendar_viewed');
  assert.equal(gtagCalls[0][2].page_title, 'Shared YearMap');
  assert.equal(gtagCalls[0][2].page_location, 'https://yearmap.app/view/?sample=1');
  assert.equal(JSON.stringify(gtagCalls).includes('Private family calendar'), false);
});
