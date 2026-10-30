(function(root, factory) {
  const example = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = example;
  root.YearMapVacationExample = example;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const snapshot = {
    v: 1,
    app: 'YearMap',
    year: 2027,
    title: 'Family vacation planning — fictional example',
    createdAt: '2026-10-30T12:00:00.000Z',
    settings: { alignWeekdays: true, weekendHighlight: true },
    categories: [
      { id: 'school', label: 'School breaks', color: '#4d9be6' },
      { id: 'work', label: 'Work travel', color: '#ff6b6b' },
      { id: 'option-a', label: 'Trip option A', color: '#f5a623' },
      { id: 'option-b', label: 'Trip option B', color: '#5cc7bd' }
    ],
    ranges: [
      { id: 'spring', categoryId: 'school', startDate: '2027-03-22', endDate: '2027-03-28', note: 'Fictional spring break. Check your own school calendar.' },
      { id: 'summer', categoryId: 'school', startDate: '2027-06-19', endDate: '2027-08-22', note: 'Fictional summer break.' },
      { id: 'winter', categoryId: 'school', startDate: '2027-12-20', endDate: '2027-12-31', note: 'Fictional winter break.' },
      { id: 'conference', categoryId: 'work', startDate: '2027-07-12', endDate: '2027-07-16', note: 'Work conference conflicts with trip option A.' },
      { id: 'onsite', categoryId: 'work', startDate: '2027-10-04', endDate: '2027-10-08', note: 'Client visit.' },
      { id: 'a', categoryId: 'option-a', startDate: '2027-07-10', endDate: '2027-07-18', note: 'Nine calendar days. Overlaps work travel July 12–16.' },
      { id: 'b', categoryId: 'option-b', startDate: '2027-08-07', endDate: '2027-08-15', note: 'Nine calendar days within the fictional school break; no work travel shown. Confirm leave and other commitments before booking.' }
    ]
  };
  function createPath() {
    const encoded = btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(snapshot)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return '/view/?sample=1&source=vacation-planner#ym1.json.' + encoded;
  }
  return { snapshot, createPath };
});
