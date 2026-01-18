(function () {
  const btn = document.getElementById('googleLoginBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    localStorage.setItem('pluggis_user', JSON.stringify({
      given_name: 'Aya',
      name: 'Aya',
      email: 'aya@example.com'
    }));
    location.href = 'home.html';
  });
})();