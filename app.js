(function () {
  const raw = localStorage.getItem('pluggis_user');
  let user = null;

  try { user = raw ? JSON.parse(raw) : null; } catch (e) { user = null; }

  const firstNameEl = document.getElementById('firstName');
  if (firstNameEl) {
    const name = (user && (user.given_name || user.firstName || user.name)) ? (user.given_name || user.firstName || user.name) : 'Elev';
    const first = String(name).trim().split(/\s+/)[0] || 'Elev';
    firstNameEl.textContent = first;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('pluggis_user');
      location.href = 'index.html';
    });
  }
})();