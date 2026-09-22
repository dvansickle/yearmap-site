const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const homepage = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('homepage features the Night Sky Planner with the established sample event', () => {
  const section = homepage.match(
    /<section class="section featured-calendar"[\s\S]*?<\/section>/
  );

  assert.ok(section, 'expected a featured calendar section');
  assert.match(section[0], /data-analytics-section="featured-calendar"/);
  assert.match(section[0], /href="\/night-sky\/"/);
  assert.match(section[0], /data-analytics-event="sample_calendar_cta_clicked"/);
  assert.match(section[0], /data-analytics-location="featured-calendar-night-sky"/);
  assert.match(section[0], /Meteor showers/);
  assert.match(section[0], /Dark-sky windows/);
  assert.match(section[0], /Planet oppositions/);
});
