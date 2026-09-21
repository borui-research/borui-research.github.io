// Preserve links to sections of the former single-page homepage.
const legacyPages = {
  research: 'research.html', publications: 'publications.html',
  projects: 'projects.html', teaching: 'teaching.html', contact: 'contact.html'
};
function redirectLegacySection() {
  const file = location.pathname.split('/').pop();
  if (file && file !== 'index.html') return;
  const target = legacyPages[location.hash.slice(1)];
  if (target) location.replace(target);
}
redirectLegacySection();
window.addEventListener('hashchange', redirectLegacySection);
