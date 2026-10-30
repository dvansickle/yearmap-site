# YearMap SEO experiment

Prepared October 30, 2026. This is a working plan, not a traffic forecast.

## Evidence and baseline

Search Console, Web search, July 29–October 28, 2026:

- 55 clicks, 308 impressions, aggregate CTR 17.9%, average position 6.3.
- Homepage: 53 clicks, 279 impressions. Changelog and support: one click each.
- Visible query rows: yearmap (9 clicks/19 impressions), yearmaps (6/15), year map (0/3), yearapp (0/1), yearmatch (0/1). Google withholds some queries; these rows do not establish the branded share of all traffic. Aggregate position is not a target-keyword ranking.
- Indexing report last updated October 22: five indexed pages, nine excluded URLs. Three duplicate-without-canonical examples are HTTP versions of changelog, support, and privacy. Other exclusions require individual inspection; noindex and redirects can be intentional.

PostHog project 492120, marketing dashboard 1801856, September 30–October 30, 2026:

- Homepage-to-store insight g3jQmulO: 64 unique entrants, 19 store clickers (29.69%). Sequential steps: $pageview with $pathname = /, then chrome_store_cta_clicked within 30 minutes. Internal/test-user exclusion enabled. No global production-host restriction was visible. Store clicks are not installs.
- Temporary event-property breakdown by $referring_domain, first-touchpoint attribution: www.google.com 30 entrants/7 converters; direct 27/10; Android Google app 2/1; yearmap.app 2/0; Substack 1/1; ChatGPT 1/0; Bing 1/0. Groups can overlap. Referral domains are not a verified organic channel classification; paid/campaign attribution was not audited.
- Dashboard shared-view funnel: 19 viewers/7 create clickers. Night Sky viewer funnel: 2/1. These tiles were read, but their full configurations were not audited. Do not compare these rates as controlled experiments.
- Homepage funnel description says it is broken down by location, but saved configuration has no breakdown. Do not silently change the existing insight.
- Temporary breakdown was discarded; dashboard unchanged.

Sources: https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Ayearmap.app and https://us.posthog.com/project/492120/insights/g3jQmulO .

## First implementation: crawl and canonical housekeeping

- Add robots.txt advertising sitemap.xml, allowing crawlers to read page-level directives.
- Sitemap lists homepage, support, changelog, privacy, and terms. Omit sample and shared viewers (intentional noindex). Omit Night Sky while it automatically redirects to the noindex viewer.
- Add self-referencing HTTPS canonicals on support, changelog, privacy, and terms. Existing homepage and Night Sky canonicals remain.
- No lastmod dates until there is a reliable per-page modification record; deployment time is not substantive content freshness.
- Production HTTP support navigation landed on HTTPS in Chrome. This alone does not verify the server response status, redirect chain, or every route. No redirect changes are justified yet.
- After deployment, verify live file responses, submit the sitemap to the existing Search Console property, and inspect canonical selection after recrawl. Do not submit a sitemap that is only available locally.

## Search research and page ownership

Initial public search checks on October 30 are qualitative, not a ranked Google SERP export. Volumes and difficulty are unknown. Do not invent them or infer demand from the existence of competing pages.

| Theme | Owner | Decision |
| --- | --- | --- |
| Year-at-a-glance calendar; Chrome year planner | Homepage | Improve existing URL if useful; do not create another generic product page. |
| Choosing family vacation dates around school and work | Proposed /vacation-planner/ | First distinct use-case page; brief below. |
| Yearly habit tracking | Unassigned | Research after the first brief; feature claims must match released extension behavior. |
| Night sky calendar | Existing /night-sky/ | Secondary experiment; two viewers cannot validate acquisition value. |
| Generic best calendar apps, live family calendars, PTO optimizers | None | Defer: broad competition or expectations YearMap does not meet. |

Reference results inspected in search:

- https://yearglance.com/ — year-planning product with calendar connections and sharing.
- https://getglance.io/quick-start-guide/ — practical year-view setup guide.
- https://famino.app/en/school-holidays — school-holiday/family-calendar use case.
- https://longvacation.eu/ — PTO optimization, a separate job from manually comparing dates.
- https://www.timeanddate.com/calendar/create.html?typ=7 — printable family calendar intent.

## First page brief: vacation planning

Status: implemented locally October 30, 2026; not committed or deployed. Public editorial route: /vacation-planner/. Fictional example launcher: /vacation-planner/example/ (noindex), opening the existing viewer.

- Proposed URL: /vacation-planner/.
- Working title: Vacation Planning Calendar for Your Year | YearMap.
- Working H1: Plan vacations around school breaks and work commitments.
- Description: See trips, school breaks, and work commitments together in a yearly calendar. Explore a read-only example, then plan your own in YearMap for Chrome.
- Primary intent hypothesis: compare possible trip dates across the year before booking. Keyword volume: unknown.
- Candidate query family: yearly vacation planner; vacation planning calendar; plan vacations around school holidays. Keep these on one page unless later results demonstrate different intent.
- Audience: a person planning on a computer who needs to see several kinds of date ranges at once.
- Distinct value: a real, fictional-data YearMap calendar showing school breaks, work travel, and tentative trips with a visible clash and an alternative week. Explain what the overlap means and the steps to resolve it. Label example dates as illustrative, not an official school/holiday calendar.

Page outline:

1. Concise promise, actual calendar screenshot, Add to Chrome and quieter read-only-example link. State Chrome desktop requirement and new-tab behavior near installation.
2. Worked example: add fixed school breaks, add work commitments, compare two possible trip windows. Show why a year view changes this decision.
3. Short setup instructions using released controls: create categories, drag date ranges, add notes, inspect overlapping lanes and day totals.
4. Share a read-only snapshot with family; explain that recipients cannot edit and changes do not update an existing link. Anyone with the link can view it.
5. Export selected plans as ICS; explain file export rather than live Google/Apple calendar integration. Avoid promises of bookings, optimization, leave approval, reminders, or simultaneous editing.
6. Practical FAQs and final installation CTA.

Implementation requirements:

- Follow existing static page patterns; no framework or new dependency.
- Use actual product media, not an approximate illustration. The generic existing sample does not establish the proposed scenario; create and check a public fictional example before promising it.
- Preserve /sample/ and /view/ behavior. If a new example needs another route, keep it separate from the editorial landing page; never send its fragment or content to analytics.
- Reuse established Chrome Store CTA event and intentional UTM parameters. Use meaningful new locations for this page without renaming existing locations. Route tracking through the existing helper to both PostHog and GA.
- Add a contextual homepage link near the relevant planning example, link to the homepage and useful support/privacy content, and add the finished editorial URL to sitemap.xml. Do not manufacture five links on unrelated pages.
- Structured data only for facts and content actually present. No fabricated ratings, testimonials, or FAQ-rich-result promises.
- Check desktop/mobile navigation, CTAs, text wrapping, actual media, and console errors through a local HTTP origin. Verify new event names/properties in both providers without recording calendar content.

## Measurement and decisions

Primary outcome: more non-branded Search Console clicks and more search-referred store clickers, reported as counts alongside rates. Keep referral proxies labeled as proxies until channel/campaign attribution is checked.

Review weekly; compare 28-day periods and retain a 90-day view. Record production release dates, changes, queries, landing pages, entrants, and store clickers. Segment desktop/mobile when counts permit. Do not interpret one or two conversions as a winning topic or run a low-powered A/B test.

For a new page: verify response/canonical/indexability first, then indexing, then query impressions and relevance, then clicks and store intent. Lack of impressions can reflect indexing, demand, or competition; low clicks can reflect position or presentation. Diagnose before rewriting. No automatic page deletion, link purchases, bulk generation, or rigid waiting rules.

The next page is chosen from evidence about demand, fit, distinctive content, and realistic competing results, not from a mandatory publishing quota.


## Vacation page implementation and verification

- Added /vacation-planner/ with a worked 2027 school/work/trip comparison, actual viewer screenshot (1800 × 1229 JPEG, about 199 KB), setup workflow, sharing/export limitations, and FAQs.
- Added /vacation-planner/example/ as a noindex launcher. Its snapshot is generated locally using the existing version-1 UTF-8 JSON/base64url format; the schema and viewer code are unchanged. The existing viewer preserves sample-home and store CTAs.
- All guide example links use sample_calendar_cta_clicked with vacation-specific locations. Store links use chrome_store_cta_clicked and utm_campaign=vacation_planner. Existing event names and locations are unchanged.
- The launcher intentionally has no analytics script, so its dynamically generated fragment-bearing fallback link cannot be captured as a raw href. The destination viewer records the established shared_calendar_viewed event with source=vacation-planner in the sanitized query string. There is no new sample_calendar_opened event for this route; use guide click → shared view → create intent, not the generic sample-open funnel.
- Added one contextual homepage link and the editorial URL to the sitemap. The noindex launcher/viewer are excluded from the sitemap.
- Verification: all 15 repository tests pass, including UTF-8 snapshot round-trip/limits and both PostHog and gtag click paths for every guide example/store link. Browser checks on a local HTTP origin cover desktop, 390px mobile layout, loaded images, FAQ expansion, and example navigation. Mobile primary CTA is fully visible in the first viewport; no horizontal overflow on the guide and no console errors observed. Screenshot captured from the working viewer, not synthesized media.
- Publishing still requires the user's commit/push instruction. Record the actual release date, then verify the public editorial URL and sitemap and request indexing in Search Console. Keyword demand remains unquantified; no ranking or conversion uplift claimed.
