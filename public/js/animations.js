/**
 * Tekora Homepage Animations
 * - Counter animation (0 → số)
 * - Fade-in / slide-up khi scroll vào viewport
 * - Hover effects
 */

(function () {
  'use strict';

  /* ===== INTERSECTION OBSERVER HELPER ===== */
  function onVisible(selector, callback, options) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          callback(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, Object.assign({ threshold: 0.2 }, options));
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ===== COUNTER ANIMATION ===== */
  function animateCounter(el) {
    if (el.dataset.counted) return; // tránh chạy lại
    el.dataset.counted = '1';

    const text = el.textContent.trim();
    // Tách prefix số và suffix ("+", "%", ...)
    const match = text.match(/^([\d,\.]+)(.*)$/);
    if (!match) return;
    const target   = parseFloat(match[1].replace(/,/g, '')) || 0;
    const suffix   = match[2] || '';
    const duration = 2000;
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = easeOutQuart(progress);
      const current  = Math.round(ease * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* ===== FADE + SLIDE UP ===== */
  function addFadeClass(el) {
    el.classList.add('anim-visible');
  }

  /* ===== INIT ===== */
  document.addEventListener('DOMContentLoaded', function () {

    // 1. Counter — stats numbers
    onVisible('.stat-number, .kh-stat__num, .about-stat__num', animateCounter, { threshold: 0.4 });

    // 2. Fade-in slide-up cho các section cards
    const fadeSelectors = [
      '.brand-card',
      '.vision-card',
      '.value-card',
      '.advantage-card',
      '.pricing-card',
      '.blog-card',
      '.kh-testi-card',
      '.kh-project-card',
      '.about-value-card',
      '.about-team-card',
      '.sv-item',
      '.process-row',
      '.contact-info__item',
    ];

    fadeSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        el.classList.add('anim-fade');
        el.style.transitionDelay = (i % 4) * 80 + 'ms';
      });
    });

    onVisible(fadeSelectors.join(','), addFadeClass, { threshold: 0.1 });

    // 3. Section headings slide-in
    const headingSelectors = [
      '.brand-heading h2',
      '.values-heading h2',
      '.pricing-heading h2',
      '.kh-section__heading h2',
      '.about-section__heading h2',
      '.home-blog__heading h2',
      '.sv-hero h1',
      '.blog-hero h1',
      '.contact-hero h1',
    ];

    headingSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('anim-slide-up');
      });
    });

    onVisible(headingSelectors.join(','), addFadeClass, { threshold: 0.3 });

    // 4. Stats section — trigger counter khi section vào view (đã có guard data-counted)
    onVisible('.stats-section, .kh-stats, .about-stats', function (section) {
      section.querySelectorAll('.stat-number, .kh-stat__num, .about-stat__num').forEach(animateCounter);
    }, { threshold: 0.2 });

    // 5. Process cubes — bounce khi vào view
    onVisible('.process-step__cube', function (el) {
      el.classList.add('anim-bounce');
    }, { threshold: 0.5 });

    // 6. Hero slideshow text overlay (nếu có)
    onVisible('.slideshow', function (el) {
      el.classList.add('anim-visible');
    });

  });

})();
