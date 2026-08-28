(() => {
  const POSTHOG_TOKEN = 'phc_pUqH8ixDgGpn2HLugzCheC6PXPNTFvFy8abTvkdjuxgn';
  const POSTHOG_HOST = 'https://us.i.posthog.com';

  !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="ki Ci init qi Hi pr ji zi Di capture calculateEventProperties Qi register register_once register_for_session unregister unregister_for_session Ki getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync Xi identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags reset setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty Ji Gi createPersonProfile setInternalOrTestUser Yi Ai rn opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Vi debug mr it getPageViewId captureTraceFeedback captureTraceMetric Oi".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  posthog.init(POSTHOG_TOKEN, {
    api_host: POSTHOG_HOST,
    defaults: '2026-05-30',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
    disable_capture_url_hashes: true,
    before_send(event) {
      if (!event?.properties) return event;

      [
        '$current_url',
        '$initial_current_url',
        '$session_entry_url',
        '$referrer',
        '$initial_referrer'
      ].forEach((property) => {
        const value = event.properties[property];
        if (typeof value === 'string') {
          event.properties[property] = value.split('#', 1)[0];
        }
      });

      return event;
    },
    loaded(instance) {
      instance.register({
        site: 'yearmap.app',
        page_kind: document.body?.dataset.analyticsPage || 'page'
      });
    }
  });

  function track(eventName, properties = {}) {
    if (window.posthog) {
      posthog.capture(eventName, properties);
    }

    if (typeof window.gtag === 'function') {
      const { href, ...eventParams } = properties;
      window.gtag('event', eventName, {
        ...eventParams,
        link_url: href || undefined,
        page_location: `${window.location.origin}${window.location.pathname}${window.location.search}`
      });
    }
  }

  window.YearMapAnalytics = { track };

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
    if (link) {
      track(eventNameForLink(link), linkProperties(link));
      return;
    }

    const button = event.target.closest?.('button[data-analytics-event]');
    if (button) {
      track(button.dataset.analyticsEvent, {
        button_text: button.textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
        button_location: button.dataset.analyticsLocation || null
      });
    }
  });

  document.addEventListener('toggle', (event) => {
    if (event.target.tagName !== 'DETAILS') return;
    track('faq_item_toggled', {
      open: event.target.open,
      summary: event.target.querySelector('summary')?.textContent.trim().slice(0, 120) || null
    });
  }, true);

  document.addEventListener('play', (event) => {
    if (event.target.tagName !== 'VIDEO') return;
    track('video_played', {
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
        track('section_viewed', {
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
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const depth = Math.round((window.scrollY / scrollable) * 100);
    scrollMarks.forEach((mark) => {
      if (depth < mark || reachedScrollMarks.has(mark)) return;
      reachedScrollMarks.add(mark);
      track('scroll_depth_reached', {
        depth_percent: mark,
        page_kind: document.body?.dataset.analyticsPage || 'page'
      });
    });
  }

  window.addEventListener('scroll', captureScrollDepth, { passive: true });

})();
