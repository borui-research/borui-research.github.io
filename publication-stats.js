// Count the papers listed on this page and load the latest valid Scholar snapshot.
const total = document.getElementById('publication-total');
if (total) total.textContent = document.querySelectorAll('.publication-list > li').length.toLocaleString('en-US');
async function loadScholarStats() {
  const count = document.getElementById('scholar-citation-total');
  const status = document.getElementById('citation-status');
  try {
    const response = await fetch('data/scholar-stats.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Statistics unavailable');
    const data = await response.json();
    if (data.author_id !== 'eAPEMPQAAAAJ' || !Number.isInteger(data.citations) || data.citations < 0) throw new Error('Invalid statistics');
    count.textContent = data.citations.toLocaleString('en-US');
    const date = new Date(data.retrieved_at);
    status.textContent = 'Google Scholar citations · Updated ' + date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    status.textContent = 'Citation statistics unavailable. View Google Scholar for the latest count.';
  }
}
loadScholarStats();
