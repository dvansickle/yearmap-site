# YearMap Website Instructions

## Product Role

- This repository contains the public YearMap website, marketing pages, policy pages, changelog, support content, sample calendar, and read-only shared-calendar viewer.
- Keep the site direct, product-led, and consistent with the extension. The landing page should make the product and its year-at-a-glance interface clear in the first viewport.
- Preserve the primary conversion paths: homepage to Chrome Web Store, homepage to sample calendar, and shared calendar to Chrome Web Store.
- Use analytics and user feedback before making broad landing-page redesigns. Favor focused improvements with a clear conversion or comprehension goal.

## Technical Boundaries

- The site is static HTML, CSS, JavaScript, and media with no build step. Follow existing page patterns and avoid introducing a framework or dependency without discussing the operational tradeoff first.
- Reuse the current visual language: clean typography, restrained color, practical imagery, and compact responsive layouts. Avoid decorative redesigns that compete with the product.
- Keep policy, support, changelog, sample, and shared-viewer URLs stable.
- Optimize media intentionally. Do not replace product screenshots or videos with approximate stock imagery or decorative illustration.

## Analytics

- PostHog and Google Analytics are intentionally used on the website to understand engagement and conversion. This is separate from the extension's optional telemetry implementation.
- PostHog autocapture remains disabled. Prefer meaningful named events sent to both PostHog and GA through the existing analytics helper.
- Preserve established event names and location properties when changing tracked elements so dashboard trends and funnels remain comparable.
- Important events include Chrome Store CTA clicks, sample CTA/open/home actions, shared-calendar views and create actions, section views, scroll depth, FAQ toggles, and video plays.
- Collect only properties needed to answer a defined product or marketing question. Do not send shared-calendar payloads, calendar content, URL fragments, notes, or other sensitive user data.
- Chrome Web Store links used for campaigns should retain intentional UTM parameters.

## Shared Calendar Viewer

- `/view/` renders a read-only static snapshot encoded in the URL fragment; `/sample/` opens a sample snapshot.
- Keep snapshot decoding, validation, and payload limits compatible with `yearmap-app` sharing code.
- Reject malformed or oversized payloads safely and show a useful error state without exposing decoded content to analytics.
- Preserve the shared-calendar “Create your own YearMap” path and the sample-only “YearMap home” link.
- Changes to the snapshot schema, compression, limits, or privacy disclosure must be coordinated with the extension repository.

## Verification

- Serve the repository through a local HTTP server rather than opening pages through `file://`, because absolute paths, media, and browser APIs depend on an origin.
- Check changed pages at desktop and mobile sizes, including navigation, CTA visibility, text wrapping, media loading, and console errors.
- For analytics changes, verify the exact event name and properties in both the PostHog and `gtag` paths and confirm that no URL fragment or snapshot content is included.
- For `/view/` or `/sample/` changes, test valid, empty, malformed, and oversized snapshots.
- State clearly when browser-level verification was not performed.

## Git

- Do not commit or push unless the user requests it.
- The user often prefers small completed changes committed directly to `main`. Before a requested direct push, confirm the working tree, preserve unrelated changes, and synchronize with the remote so newer work is not overwritten.
