(function () {
  'use strict';

  function pathNorm(p) {
    if (!p) return '/';
    var x = p.replace(/\/$/, '');
    return x || '/';
  }

  function highlightActive() {
    var path = pathNorm(window.location.pathname);
    document.querySelectorAll('.admin-sidebar__nav a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      try {
        var u = new URL(href, window.location.origin);
        var p = pathNorm(u.pathname);
        if (p === path) {
          a.classList.add('active');
          var subLi = a.closest('.admin-sidebar__sub li');
          if (subLi) subLi.classList.add('active');
          var details = a.closest('.admin-sidebar__details');
          if (details) details.open = true;
        }
      } catch (e) {
        /* ignore */
      }
    });
  }

  highlightActive();

  var refreshBtn = document.getElementById('admin-topbar-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      window.location.reload();
    });
  }

  /* Ctrl+/ focus ô tìm kiếm */
  var search = document.getElementById('admin-global-search');
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      if (search) {
        search.focus();
        search.select();
      }
    }
  });
})();
