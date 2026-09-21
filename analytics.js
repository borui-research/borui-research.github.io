// Set this to the verified GoatCounter site URL before enabling statistics.
// Leave empty until the owner supplies their personal site's account.
const ANALYTICS_SITE_URL = '';

(() => {
  if (!ANALYTICS_SITE_URL) return;
  let site;
  try {
    site = new URL(ANALYTICS_SITE_URL);
    if (site.protocol !== 'https:' || !/^[a-z0-9-]+\.goatcounter\.com$/.test(site.hostname) || site.username || site.password || site.port) return;
  } catch { return; }

  const count = document.getElementById('page-view-count');
  const status = document.getElementById('statistics-status');
  const link = document.getElementById('analytics-link');
  if (link) {
    link.href = site.origin + '/';
    link.removeAttribute('aria-disabled');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  // Local previews never load the tracker or change real traffic counts.
  if (location.hostname !== 'borui-research.github.io') {
    if (status) status.textContent = 'Statistics are available on the live website.';
    return;
  }

  // Avoid counting a legacy homepage link before navigation.js redirects it.
  if ((!location.pathname || location.pathname === '/' || location.pathname === '/index.html') &&
      ['#research', '#publications', '#projects', '#teaching', '#contact'].includes(location.hash)) return;

  window.goatcounter = {
    path: p => p === '/index.html' ? '/' : p
  };
  const tracker = document.createElement('script');
  tracker.dataset.goatcounter = site.origin + '/count';
  tracker.src = 'https://gc.zgo.at/count.js';
  tracker.async = true;
  document.head.appendChild(tracker);

  if (!count) return;
  status.textContent = 'Loading statistics…';
  fetch(site.origin + '/counter/TOTAL.json', {credentials: 'omit', signal: AbortSignal.timeout(8000)})
    .then(response => {
      if (!response.ok) throw new Error('Counter unavailable');
      return response.json();
    })
    .then(data => {
      if (!/^[0-9][0-9, .]*$/.test(String(data.count))) throw new Error('Invalid count');
      count.textContent = String(data.count);
      count.parentElement.setAttribute('aria-label', 'Total page views: ' + data.count);
      status.hidden = true;
    })
    .catch(() => { status.textContent = 'Statistics are temporarily unavailable.'; });
})();
