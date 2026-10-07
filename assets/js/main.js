(function () {
  'use strict';

  var STATUSES = {
    wip: { label: 'En dev' },
    almost: { label: 'Presque fini' },
    done: { label: 'Terminé' },
    abandoned: { label: 'Abandonné' },
  };

  var ICONS = {
    github:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>',
    arrow:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M8 7h9v9"/></svg>',
  };

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderCard(p) {
    var status = STATUSES[p.status] || { label: p.status };
    var actions = p.url
      ? '<a class="btn btn-primary card-link" href="' + escapeHtml(p.url) + '" target="_blank" rel="noopener" ' +
        'data-track="jouer" data-projet="' + escapeHtml(p.id) + '">' +
        escapeHtml(p.linkLabel || 'Voir le projet') + ICONS.arrow + '</a>'
      : '<span class="btn btn-disabled">' + (p.status === 'wip' ? 'Lien à venir' : 'Pas de version en ligne') + '</span>';
    if (p.repo) {
      actions +=
        '<a class="btn-icon" href="' + escapeHtml(p.repo) + '" target="_blank" rel="noopener" ' +
        'data-track="github" data-projet="' + escapeHtml(p.id) + '" ' +
        'title="Code source sur GitHub" aria-label="Code source de ' + escapeHtml(p.title) + ' sur GitHub">' +
        ICONS.github + '</a>';
    }
    var hint = p.url && p.render
      ? '<p class="card-hint">Hébergement gratuit : le premier chargement peut prendre jusqu\'à une minute.</p>'
      : '';

    return (
      '<article class="card' + (p.featured ? ' card--featured' : '') + '" data-status="' + escapeHtml(p.status) +
      '" style="--accent:' + escapeHtml(p.accent || 'var(--brand)') + '">' +
      '<div class="card-media">' +
      '<img src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(p.imageAlt || '') + '" loading="lazy" width="960" height="600">' +
      '<span class="status status--' + escapeHtml(p.status) + '">' + escapeHtml(status.label) + '</span>' +
      '</div>' +
      '<div class="card-body">' +
      '<p class="card-kicker">' + escapeHtml(p.kind || '') + '</p>' +
      '<h3 class="card-title">' + escapeHtml(p.title) + '</h3>' +
      '<p class="card-desc">' + escapeHtml(p.description) + '</p>' +
      '<ul class="tags">' + (p.tags || []).map(function (t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') + '</ul>' +
      '<div class="card-actions">' + actions + '</div>' + hint +
      '</div>' +
      '</article>'
    );
  }

  function renderFilters(projects, container) {
    var counts = {};
    projects.forEach(function (p) { counts[p.status] = (counts[p.status] || 0) + 1; });
    var html = '<button type="button" class="chip" data-filter="all" aria-pressed="true">Tous <span>' + projects.length + '</span></button>';
    Object.keys(STATUSES).forEach(function (key) {
      if (!counts[key]) return;
      html += '<button type="button" class="chip chip--' + key + '" data-filter="' + key + '" aria-pressed="false">' +
        STATUSES[key].label + ' <span>' + counts[key] + '</span></button>';
    });
    container.innerHTML = html;
  }

  function setupFilters(filters, grid) {
    filters.addEventListener('click', function (event) {
      var chip = event.target.closest('.chip');
      if (!chip) return;
      var filter = chip.getAttribute('data-filter');
      filters.querySelectorAll('.chip').forEach(function (c) {
        c.setAttribute('aria-pressed', String(c === chip));
      });
      grid.classList.toggle('is-filtered', filter !== 'all');
      grid.querySelectorAll('.card').forEach(function (card) {
        card.hidden = filter !== 'all' && card.getAttribute('data-status') !== filter;
      });
    });
  }

  function setupReveal(grid) {
    var cards = grid.querySelectorAll('.card');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var card = entry.target;
          card.classList.add('is-visible');
          observer.unobserve(card);
          // Le décalage ne sert qu'à l'apparition : on le retire pour ne pas ralentir le survol
          setTimeout(function () { card.style.transitionDelay = ''; }, 800);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    cards.forEach(function (card, i) {
      card.classList.add('reveal');
      card.style.transitionDelay = (i % 3) * 70 + 'ms';
      observer.observe(card);
    });
  }

  // Clics suivis dans PostHog (si le script est chargé) : liens des projets et réseaux
  function setupClickTracking() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('[data-track]');
      if (!link || !window.posthog || !window.posthog.capture) return;
      var type = link.getAttribute('data-track');
      if (type === 'reseau') {
        window.posthog.capture('clic_reseau', { reseau: link.getAttribute('data-reseau') });
      } else {
        window.posthog.capture('clic_projet', { projet: link.getAttribute('data-projet'), type: type });
      }
    });
  }

  function setupTheme() {
    var root = document.documentElement;
    var toggle = document.getElementById('theme-toggle');
    try {
      var saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
    } catch (e) { /* stockage indisponible : on suit le thème du système */ }
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignoré */ }
    });
  }

  var projects = window.PROJECTS || [];
  var grid = document.getElementById('projects-grid');
  var filters = document.getElementById('filters');

  grid.innerHTML = projects.map(renderCard).join('');
  renderFilters(projects, filters);
  setupFilters(filters, grid);
  setupReveal(grid);
  setupTheme();
  setupClickTracking();

  document.getElementById('stat-projects').textContent = projects.length;
  document.getElementById('stat-online').textContent = projects.filter(function (p) { return p.url; }).length;
  document.getElementById('year').textContent = new Date().getFullYear();
})();
