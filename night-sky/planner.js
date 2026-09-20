(function(root, factory) {
  const planner = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = planner;
  }

  root.YearMapNightSkyPlanner = planner;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';

  const snapshot = {
    v: 1,
    app: 'YearMap',
    year: 2026,
    createdAt: '2026-09-20T12:00:00.000Z',
    title: 'Night Sky Planner — Fall & Winter 2026',
    categories: [
      { id: 'meteor-showers', label: 'Meteor shower peak nights', color: '#ff6b6b' },
      { id: 'dark-sky', label: 'Dark-sky windows', color: '#4d9be6' },
      { id: 'full-moons', label: 'Full moons', color: '#f5a623' },
      { id: 'planet-oppositions', label: 'Planet oppositions', color: '#5cc7bd' },
      { id: 'season-markers', label: 'Season markers & guide', color: '#9b6bce' }
    ],
    ranges: [
      {
        id: 'planner-guide',
        categoryId: 'season-markers',
        startDate: '2026-09-20',
        endDate: '2026-09-20',
        note: 'Dates use UTC. Local dates and visibility vary by time zone, latitude, horizon, weather, and light pollution. Meteor-viewing guidance favors mid-northern latitudes.'
      },
      {
        id: 'september-equinox',
        categoryId: 'season-markers',
        startDate: '2026-09-23',
        endDate: '2026-09-23',
        note: 'September equinox at 00:05 UTC. Source: U.S. Naval Observatory.'
      },
      {
        id: 'neptune-opposition',
        categoryId: 'planet-oppositions',
        startDate: '2026-09-25',
        endDate: '2026-09-25',
        note: 'Neptune at opposition. A telescope and a location-specific sky chart are recommended. Source: NASA 2026 sky events.'
      },
      {
        id: 'september-full-moon',
        categoryId: 'full-moons',
        startDate: '2026-09-26',
        endDate: '2026-09-26',
        note: 'Full Moon at 16:49 UTC. Bright moonlight reduces contrast for faint targets. Source: U.S. Naval Observatory.'
      },
      {
        id: 'saturn-opposition',
        categoryId: 'planet-oppositions',
        startDate: '2026-10-04',
        endDate: '2026-10-04',
        note: 'Saturn at opposition and visible for much of the night. Source: NASA 2026 sky events.'
      },
      {
        id: 'october-dark-sky',
        categoryId: 'dark-sky',
        startDate: '2026-10-08',
        endDate: '2026-10-12',
        note: 'Practical five-night dark-sky window centered on the Oct 10 New Moon at 15:50 UTC. Source: U.S. Naval Observatory.'
      },
      {
        id: 'draconids',
        categoryId: 'meteor-showers',
        startDate: '2026-10-08',
        endDate: '2026-10-09',
        note: 'Draconids peak Oct 9 UTC. Best in the evening; typical ZHR 5 with favorable Moon conditions. Source: International Meteor Organization 2026 calendar.'
      },
      {
        id: 'orionids',
        categoryId: 'meteor-showers',
        startDate: '2026-10-21',
        endDate: '2026-10-22',
        note: 'Orionids peak Oct 21 UTC. Best after midnight; typical ZHR 20. First-quarter Moon may hide fainter meteors. Source: International Meteor Organization 2026 calendar.'
      },
      {
        id: 'october-full-moon',
        categoryId: 'full-moons',
        startDate: '2026-10-26',
        endDate: '2026-10-26',
        note: 'Full Moon at 04:12 UTC. Bright moonlight reduces contrast for faint targets. Source: U.S. Naval Observatory.'
      },
      {
        id: 'southern-taurids',
        categoryId: 'meteor-showers',
        startDate: '2026-11-04',
        endDate: '2026-11-05',
        note: 'Southern Taurids peak Nov 5 UTC. Slow fireballs are possible; typical ZHR 7 in a moon-free period. Source: International Meteor Organization 2026 calendar.'
      },
      {
        id: 'november-dark-sky',
        categoryId: 'dark-sky',
        startDate: '2026-11-07',
        endDate: '2026-11-11',
        note: 'Practical five-night dark-sky window centered on the Nov 9 New Moon at 07:02 UTC. Source: U.S. Naval Observatory.'
      },
      {
        id: 'northern-taurids',
        categoryId: 'meteor-showers',
        startDate: '2026-11-11',
        endDate: '2026-11-12',
        note: 'Northern Taurids peak Nov 12 UTC. Slow fireballs are possible; typical ZHR 5 in a moon-free period. Source: International Meteor Organization 2026 calendar.'
      },
      {
        id: 'leonids',
        categoryId: 'meteor-showers',
        startDate: '2026-11-17',
        endDate: '2026-11-18',
        note: 'Leonids peak Nov 17 UTC. Best before dawn; typical ZHR 15. First-quarter Moon may interfere. Source: International Meteor Organization 2026 calendar.'
      },
      {
        id: 'november-full-moon',
        categoryId: 'full-moons',
        startDate: '2026-11-24',
        endDate: '2026-11-24',
        note: 'Full Moon at 14:53 UTC. NASA highlights this as a supermoon. Source: U.S. Naval Observatory and NASA.'
      },
      {
        id: 'uranus-opposition',
        categoryId: 'planet-oppositions',
        startDate: '2026-11-25',
        endDate: '2026-11-25',
        note: 'Uranus at opposition. Binoculars or a telescope and a location-specific sky chart are recommended. Source: NASA 2026 sky events.'
      },
      {
        id: 'december-dark-sky',
        categoryId: 'dark-sky',
        startDate: '2026-12-07',
        endDate: '2026-12-11',
        note: 'Practical five-night dark-sky window centered on the Dec 9 New Moon at 00:52 UTC. Source: U.S. Naval Observatory.'
      },
      {
        id: 'geminids',
        categoryId: 'meteor-showers',
        startDate: '2026-12-13',
        endDate: '2026-12-14',
        note: 'Geminids peak Dec 14 UTC. A strong annual shower with typical ZHR 150; a waxing crescent gives favorable viewing. Source: International Meteor Organization 2026 calendar.'
      },
      {
        id: 'december-solstice',
        categoryId: 'season-markers',
        startDate: '2026-12-21',
        endDate: '2026-12-21',
        note: 'December solstice at 20:50 UTC. Source: U.S. Naval Observatory.'
      },
      {
        id: 'ursids',
        categoryId: 'meteor-showers',
        startDate: '2026-12-21',
        endDate: '2026-12-22',
        note: 'Ursids peak Dec 22 around 22:00 UTC. Typical ZHR 10; a bright Moon makes faint meteors difficult. Source: International Meteor Organization 2026 calendar.'
      },
      {
        id: 'december-full-moon',
        categoryId: 'full-moons',
        startDate: '2026-12-24',
        endDate: '2026-12-24',
        note: 'Full Moon at 01:28 UTC. NASA highlights this as a Christmas Eve supermoon. Source: U.S. Naval Observatory and NASA.'
      }
    ],
    settings: {
      weekendHighlight: true,
      alignWeekdays: true,
      showCategoryTotals: true
    }
  };

  function base64UrlEncode(value) {
    let base64;

    if (typeof Buffer !== 'undefined') {
      base64 = Buffer.from(value, 'utf8').toString('base64');
    } else {
      const bytes = new TextEncoder().encode(value);
      let binary = '';
      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });
      base64 = btoa(binary);
    }

    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function createSharePath() {
    const encoded = base64UrlEncode(JSON.stringify(snapshot));
    return `/view/?source=night-sky#ym1.json.${encoded}`;
  }

  return Object.freeze({
    createSharePath,
    snapshot
  });
});
