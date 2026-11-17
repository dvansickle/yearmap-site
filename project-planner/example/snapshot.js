(function(root, factory) {
  const example = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = example;
  root.YearMapProjectExample = example;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  function createSnapshot(plan = 'original') {
    const revised = plan === 'revised';
    return {
      v: 1, app: 'YearMap', year: 2027,
      title: revised ? 'Client projects — revised example' : 'Client projects — original example',
      createdAt: '2026-11-17T12:00:00.000Z',
      settings: { alignWeekdays: true, weekendHighlight: true },
      categories: [
        { id: 'atlas', label: 'Atlas brand work', color: '#4d9be6' },
        { id: 'birch', label: 'Birch website work', color: '#5cc7bd' },
        { id: 'cedar', label: 'Cedar proposal', color: '#f5a623' },
        { id: 'delivery', label: 'Delivery windows', color: '#ff6b6b' },
        { id: 'away', label: 'Time off', color: '#9b6bce' }
      ],
      ranges: [
        { id: 'atlas-spring', categoryId: 'atlas', startDate: '2027-01-11', endDate: '2027-02-19', note: 'Fictional client. Brand discovery and initial identity design.' },
        { id: 'atlas-spring-delivery', categoryId: 'delivery', startDate: '2027-02-15', endDate: '2027-02-19', note: 'Atlas identity review and handoff.' },
        { id: 'birch-spring', categoryId: 'birch', startDate: '2027-04-05', endDate: '2027-06-11', note: 'Fictional client. Website design and launch.' },
        { id: 'birch-spring-delivery', categoryId: 'delivery', startDate: '2027-06-07', endDate: '2027-06-11', note: 'Birch website launch and handoff.' },
        { id: 'summer-off', categoryId: 'away', startDate: '2027-07-19', endDate: '2027-07-30', note: 'Summer vacation. All example dates and client names are fictional.' },
        { id: 'atlas-work', categoryId: 'atlas', startDate: '2027-08-16', endDate: '2027-10-01', note: 'Atlas autumn campaign. A separate phase after the spring identity work; this span is not a daily hours estimate.' },
        { id: 'birch-work', categoryId: 'birch', startDate: '2027-09-06', endDate: '2027-10-15', note: 'Birch autumn website update and handoff.' },
        { id: 'cedar-work', categoryId: 'cedar', startDate: revised ? '2027-11-08' : '2027-09-27', endDate: revised ? '2027-12-17' : '2027-11-05', note: revised ? 'Proposed November start, subject to client agreement. Deliver before the winter break; confirm review availability.' : 'Proposed dates overlap autumn delivery windows and the October-November break.' },
        { id: 'atlas-delivery', categoryId: 'delivery', startDate: '2027-09-27', endDate: '2027-10-01', note: 'Atlas autumn campaign final review and delivery.' },
        { id: 'birch-delivery', categoryId: 'delivery', startDate: '2027-10-11', endDate: '2027-10-15', note: 'Birch autumn update final review and delivery.' },
        { id: 'cedar-delivery', categoryId: 'delivery', startDate: revised ? '2027-12-13' : '2027-11-01', endDate: revised ? '2027-12-17' : '2027-11-05', note: 'Cedar proposed final review and delivery.' },
        { id: 'time-off', categoryId: 'away', startDate: '2027-10-25', endDate: '2027-11-05', note: 'Planned autumn break.' },
        { id: 'winter-off', categoryId: 'away', startDate: '2027-12-20', endDate: '2027-12-31', note: 'Winter break. Confirm client reviews can finish before this period.' }
      ]
    };
  }
  function createPath(plan = 'original') {
    const snapshot = createSnapshot(plan);
    const encoded = btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(snapshot)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return '/view/?sample=1&source=project-planner#ym1.json.' + encoded;
  }
  return { createSnapshot, createPath };
});
