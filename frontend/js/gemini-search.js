const searchInput = document.getElementById('searchInput');
const aiResult = document.getElementById('aiResult');

if (searchInput && aiResult) {
  searchInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (!query) return;
      aiResult.textContent = 'Thinking...';
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      aiResult.textContent = data.answer || 'No answer.';
    }
  });
}
