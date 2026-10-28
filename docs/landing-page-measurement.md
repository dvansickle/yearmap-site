# Landing page follow-up

Prepared October 28, 2026. These changes are local; record the actual production release date before comparing results.

## Conversion baseline

Use PostHog or GA to record the following for a representative period before release and a comparable period after release. Segment by mobile versus desktop and traffic source/campaign. Exclude internal and local testing traffic. Record visitor counts alongside rates; do not interpret small changes without enough traffic.

- Homepage visitors who click `chrome_store_cta_clicked`, divided by homepage visitors. Keep the established `link_location` breakdown (`hero`, `site-header`, `reviews`, `details`, `footer`). This measures store intent, not completed installation.
- Homepage visitors who click `sample_calendar_cta_clicked`, segmented by `link_location`. The `featured-calendar-night-sky` location is a separate example journey.
- Sample visitors who proceed to `shared_calendar_create_cta_clicked`, segmented by the existing sample page properties. Check actual reporting properties and session continuity before building the funnel; do not assume a store click proves installation.
- Reach of `how-it-works`, `reviews`, `featured-calendar`, `faq`, and `details` using `section_viewed`.
- FAQ opens using `faq_item_toggled` with `open=true` and `summary`.
- User-started demo plays using the existing `video_played` event and `video_id=hero-video`.

Do not add calendar content, shared URL fragments, notes, or snapshot payloads to reporting.

## Changes in measurement meaning

The release changes section exposure from 45% visibility to intersection with the viewport. Long mobile sections can now register. Before/after section-view rates are not directly comparable; establish a fresh baseline after release.

The demo no longer autoplays. `video_played` now reflects a visitor starting playback. Compare this separately from historical autoplay events.

The homepage now uses expandable FAQs, enabling the existing FAQ event. Optional content disclosures are excluded from FAQ tracking. Their enclosed sections register exposure only when visible.

## Testimonial provenance

Existing quotes attributed to Jenna L., Priya R., and Ravi N. were retained from the original homepage. No independent source links or publication-consent records were found in this repository. Confirm the original source, wording, attribution, and permission before publishing; do not describe them as verified reviews until confirmed.

## Available evidence

No connected PostHog or GA reporting tool was available during this work. No traffic counts, conversion baseline, or uplift estimate has been claimed. Complete the baseline in the existing dashboards before evaluating the release.
