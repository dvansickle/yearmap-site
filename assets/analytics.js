(() => {
  const POSTHOG_TOKEN = 'phc_pUqH8ixDgGpn2HLugzCheC6PXPNTFvFy8abTvkdjuxgn';
  const POSTHOG_HOST = 'https://us.i.posthog.com';

  function loadPostHog(t, e) {
    let o;
    let n;
    let p;
    let r;
    if (e.__SV || (window.posthog && window.posthog.__loaded)) return;
    window.posthog = e;
    e._i = [];
    e.init = function init(i, s, a) {
      function g(t, e) {
        const o = e.split('.');
        if (o.length === 2) {
          t = t[o[0]];
          e = o[1];
        }
        t[e] = function call() {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }
      p = t.createElement('script');
      p.type = 'text/javascript';
      p.crossOrigin = 'anonymous';
      p.async = true;
      p.src = s.api_host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js';
      r = t.getElementsByTagName('script')[0];
      r.parentNode.insertBefore(p, r);
      let u = e;
      if (a !== undefined) {
        u = e[a] = [];
      } else {
        a = 'posthog';
      }
      u.people = u.people || [];
      u.toString = function toString(t) {
        let e = 'posthog';
        if (a !== 'posthog') e += `.${a}`;
        if (!t) e += ' (stub)';
        return e;
      };
      u.people.toString = function peopleToString() {
        return `${u.toString(1)}.people (stub)`;
      };
      o = 'capture register register_once register_for_session unregister unregister_for_session get_distinct_id get_session_id reset set_config opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing'.split(' ');
      for (n = 0; n < o.length; n += 1) g(u, o[n]);
      e._i.push([i, s, a]);
    };
    e.__SV = 1;
  }

  loadPostHog(document, window.posthog || []);

  posthog.init(POSTHOG_TOKEN, {
    api_host: POSTHOG_HOST,
    defaults: '2026-05-30',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
    disable_session_recording: true,
    loaded(instance) {
      instance.register({
        site: 'yearmap.app',
        page_kind: document.body?.dataset.analyticsPage || 'page'
      });
    }
  });

  function eventNameForLink(link) {
    const label = link.dataset.analyticsEvent;
    if (label) return label;

    const href = link.getAttribute('href') || '';
    if (href.includes('chromewebstore.google.com')) return 'chrome_store_cta_clicked';
    if (href.startsWith('mailto:')) return 'support_email_clicked';
    if (href.includes('buymeacoffee.com')) return 'donation_link_clicked';
    if (href.startsWith('#')) return 'anchor_nav_clicked';
    if (href.startsWith('/')) return 'internal_link_clicked';
    return 'outbound_link_clicked';
  }

  function linkProperties(link) {
    const href = link.getAttribute('href') || '';
    return {
      link_text: link.textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
      href,
      link_location: link.dataset.analyticsLocation || link.closest('[data-analytics-section]')?.dataset.analyticsSection || null,
      is_external: /^https?:\/\//.test(href) && !href.startsWith(window.location.origin)
    };
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (link && window.posthog) {
      posthog.capture(eventNameForLink(link), linkProperties(link));
      return;
    }

    const button = event.target.closest?.('button[data-analytics-event]');
    if (button && window.posthog) {
      posthog.capture(button.dataset.analyticsEvent, {
        button_text: button.textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
        button_location: button.dataset.analyticsLocation || null
      });
    }
  });

  document.addEventListener('toggle', (event) => {
    if (event.target.tagName !== 'DETAILS' || !window.posthog) return;
    posthog.capture('faq_item_toggled', {
      open: event.target.open,
      summary: event.target.querySelector('summary')?.textContent.trim().slice(0, 120) || null
    });
  }, true);

  document.addEventListener('play', (event) => {
    if (event.target.tagName !== 'VIDEO' || !window.posthog) return;
    posthog.capture('video_played', {
      video_id: event.target.id || null,
      video_src: event.target.currentSrc || event.target.getAttribute('src') || null
    });
  }, true);

  const seenSections = new Set();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = entry.target.dataset.analyticsSection;
        if (!section || seenSections.has(section)) return;
        seenSections.add(section);
        posthog.capture('section_viewed', {
          section,
          page_kind: document.body?.dataset.analyticsPage || 'page'
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.45 });

    document.querySelectorAll('[data-analytics-section]').forEach((element) => observer.observe(element));
  }

  const scrollMarks = [25, 50, 75, 90];
  const reachedScrollMarks = new Set();
  function captureScrollDepth() {
    if (!window.posthog) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const depth = Math.round((window.scrollY / scrollable) * 100);
    scrollMarks.forEach((mark) => {
      if (depth < mark || reachedScrollMarks.has(mark)) return;
      reachedScrollMarks.add(mark);
      posthog.capture('scroll_depth_reached', {
        depth_percent: mark,
        page_kind: document.body?.dataset.analyticsPage || 'page'
      });
    });
  }

  window.addEventListener('scroll', captureScrollDepth, { passive: true });

})();
