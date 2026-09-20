(function(root, factory) {
  const contract = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = contract;
  }

  root.YearMapSnapshotTitle = contract;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';

  const MAX_TITLE_CHARS = 80;

  function validateSnapshotTitle(snapshot) {
    if (!Object.prototype.hasOwnProperty.call(snapshot, 'title')) return;

    if (
      typeof snapshot.title !== 'string' ||
      snapshot.title.length === 0 ||
      snapshot.title.length > MAX_TITLE_CHARS ||
      snapshot.title.trim() !== snapshot.title
    ) {
      throw new Error('Invalid title');
    }
  }

  function getSnapshotPresentation(snapshot, formatCreatedDate) {
    const sharedDate = snapshot.createdAt
      ? `Read-only calendar shared ${formatCreatedDate(snapshot.createdAt)}`
      : 'Read-only calendar shared from YearMap';

    if (snapshot.title !== undefined) {
      return {
        documentTitle: `${snapshot.title} — YearMap`,
        pageTitle: snapshot.title,
        pageSubhead: `${snapshot.year} · ${sharedDate}`
      };
    }

    return {
      documentTitle: `YearMap ${snapshot.year}`,
      pageTitle: `YearMap ${snapshot.year}`,
      pageSubhead: sharedDate
    };
  }

  function renderSnapshotHeader(documentRef, snapshot, formatCreatedDate) {
    const presentation = getSnapshotPresentation(snapshot, formatCreatedDate);
    documentRef.title = presentation.documentTitle;
    documentRef.getElementById('page-title').textContent = presentation.pageTitle;
    documentRef.getElementById('page-subhead').textContent = presentation.pageSubhead;
  }

  return Object.freeze({
    MAX_TITLE_CHARS,
    getSnapshotPresentation,
    renderSnapshotHeader,
    validateSnapshotTitle
  });
});
