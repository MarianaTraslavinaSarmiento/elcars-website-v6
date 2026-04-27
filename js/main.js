/* ═══════════════════════════════════════════════════
   ELCAR'S — main.js
   Nav · Reveal · Modal · Viewer
═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Nav scroll (sidebar — no scroll border needed) ──── */

  /* ── Mobile burger ────────────────────────── */
  var burger  = document.querySelector('.nav__burger');
  var drawer  = document.querySelector('.nav__drawer');
  var overlay = document.querySelector('.drawer-overlay');

  function closeMobile() {
    if (!burger) return;
    burger.classList.remove('open');
    if (drawer)  drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (burger) {
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('open');
      if (drawer)  drawer.classList.toggle('open', open);
      if (overlay) overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  if (overlay) overlay.addEventListener('click', closeMobile);
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobile);
    });
  }

  /* ── Scroll reveal ────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ── Image fade-in ────────────────────────── */
  document.querySelectorAll('.card img, .mosaic__tile__bg img').forEach(function (img) {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function () { img.classList.add('loaded'); });
    }
  });

  /* ── PROJECT MODAL ────────────────────────── */
  var modalBd   = document.getElementById('modal');
  var mPhotos   = document.getElementById('modal-photos');
  var mTitle    = document.getElementById('modal-title');
  var mChips    = document.getElementById('modal-chips');
  var mDesc     = document.getElementById('modal-desc');
  var mBack     = document.getElementById('modal-back');
  var mClose    = document.getElementById('modal-close');

  function openModal(card) {
    if (!modalBd) return;
    var title  = card.getAttribute('data-title')  || '';
    var tags   = card.getAttribute('data-tags')   || '';
    var desc   = card.getAttribute('data-desc')   || '';
    var photos = [];
    try { photos = JSON.parse(card.getAttribute('data-photos') || '[]'); } catch (e) {}

    mTitle.textContent = title;
    mDesc.textContent  = desc;

    mChips.innerHTML = '';
    tags.split(',').forEach(function (t) {
      t = t.trim(); if (!t) return;
      var s = document.createElement('span');
      s.className = 'modal-chip';
      s.textContent = t;
      mChips.appendChild(s);
    });

    mPhotos.innerHTML = '';
    if (!photos.length) {
      var p = document.createElement('p');
      p.style.cssText = 'grid-column:1/-1;padding:32px;color:#bbb;font-size:13px;';
      p.textContent = 'Project photos coming soon.';
      mPhotos.appendChild(p);
    } else {
      photos.forEach(function (src, i) {
        var div = document.createElement('div');
        div.className = 'modal-photo' + (i === 0 ? ' modal-photo--hero' : '');
        var img = document.createElement('img');
        img.src = src; img.alt = title; img.loading = 'lazy';
        div.addEventListener('click', function () { openViewer(src); });
        div.appendChild(img);
        mPhotos.appendChild(div);
      });
    }

    modalBd.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalBd.scrollTop = 0;
  }

  function closeModal() {
    if (!modalBd) return;
    modalBd.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('click', function () { openModal(card); });
  });

  if (mBack)  mBack.addEventListener('click',  closeModal);
  if (mClose) mClose.addEventListener('click', closeModal);
  if (modalBd) modalBd.addEventListener('click', function (e) {
    if (e.target === modalBd) closeModal();
  });

  /* ── Fullscreen viewer ────────────────────── */
  var viewer  = document.getElementById('viewer');
  var vImg    = document.getElementById('viewer-img');
  var vClose  = document.getElementById('viewer-close');
  var vLabel  = document.getElementById('viewer-label');

  function openViewer(src, label) {
    if (!viewer) return;
    vImg.src = src;
    if (vLabel) vLabel.textContent = label || '';
    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeViewer() {
    if (!viewer) return;
    viewer.classList.remove('open');
    vImg.src = '';
    document.body.style.overflow = '';
  }

  if (vClose) vClose.addEventListener('click', closeViewer);
  if (viewer) viewer.addEventListener('click', function (e) {
    if (e.target === viewer) closeViewer();
  });

  /* ── Before & After image lightbox ───────── */
  document.querySelectorAll('.ba-half').forEach(function (half) {
    half.addEventListener('click', function () {
      var img = half.querySelector('img');
      if (!img) return;
      var pill = half.querySelector('.ba-pill');
      var label = pill ? pill.textContent : '';
      // Find project title from parent ba-card
      var card = half.closest('.ba-card');
      if (card) {
        var titleEl = card.querySelector('.ba-title');
        var cityEl  = card.querySelector('.ba-city');
        if (titleEl) label += ' — ' + titleEl.textContent;
        if (cityEl)  label += ', ' + cityEl.textContent;
      }
      openViewer(img.src, label);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeViewer(); closeModal(); closeMobile(); }
  });

})();
