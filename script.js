/* ============================================================
   @JUJUBLENDZ — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── DOM References ─────────────────────────────────────── */
  const navbar     = document.getElementById('navbar');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');
  const backToTop  = document.getElementById('backToTop');
  const allNavLinks = document.querySelectorAll('.nav-link, .nav-logo, .footer-logo');
  const reveals    = document.querySelectorAll('.reveal');

  /* ── Navbar: scroll state ───────────────────────────────── */
  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ── Back-to-top visibility ─────────────────────────────── */
  function handleBackToTopVisibility() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  /* ── Scroll handler (debounced via rAF) ─────────────────── */
  let scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        handleNavbarScroll();
        handleBackToTopVisibility();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Run once on load
  handleNavbarScroll();
  handleBackToTopVisibility();

  /* ── Mobile Navigation Toggle ───────────────────────────── */
  function openMenu() {
    navLinks.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /* Close menu when a link is clicked */
  navLinks.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (link) {
      closeMenu();
    }
  });

  /* Close menu on outside click */
  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* Close menu on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ── Smooth Scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });

  /* ── Back to Top click ───────────────────────────────────── */
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Intersection Observer: reveal animations ───────────── */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger siblings inside a grid/list
          const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
          let delay = 0;
          siblings.forEach(function (sibling) {
            if (!sibling.classList.contains('visible')) {
              setTimeout(function () {
                sibling.classList.add('visible');
              }, delay);
              delay += 80;
            }
          });
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ── Active nav link on scroll ───────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* Inject active link style */
  const style = document.createElement('style');
  style.textContent = '.nav-link.active { color: #fff; background: rgba(52,152,219,0.18); }';
  document.head.appendChild(style);

  /* ── Service card hover sound effect (subtle) ─────────────
     Adds a class on mouse-enter to each service card for
     the CSS :hover transition — already handled via CSS.
     This block adds a small tilt effect for depth.          */
  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const tiltX = ((y - midY) / midY) * 4;
      const tiltY = ((x - midX) / midX) * -4;
      card.style.transform =
        'translateY(-6px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── Gallery item click to lightbox-style zoom ───────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img = item.querySelector('img');
      if (!img) return;

      // Create overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:9999',
        'background:rgba(10,14,20,0.95)',
        'display:flex', 'align-items:center', 'justify-content:center',
        'cursor:zoom-out', 'padding:24px',
        'animation:fadeIn 0.25s ease both',
      ].join(';');

      const bigImg = document.createElement('img');
      bigImg.src = img.src.replace(/w=\d+/, 'w=1200');
      bigImg.alt = img.alt;
      bigImg.style.cssText = [
        'max-width:90vw', 'max-height:88vh', 'object-fit:contain',
        'border-radius:12px', 'box-shadow:0 20px 80px rgba(0,0,0,0.6)',
      ].join(';');

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      closeBtn.style.cssText = [
        'position:fixed', 'top:20px', 'right:24px',
        'width:42px', 'height:42px', 'border-radius:50%',
        'background:rgba(255,255,255,0.12)', 'border:none',
        'color:#fff', 'font-size:1.1rem', 'cursor:pointer',
        'display:flex', 'align-items:center', 'justify-content:center',
        'transition:background 0.2s',
      ].join(';');
      closeBtn.addEventListener('mouseenter', function () {
        closeBtn.style.background = 'rgba(255,255,255,0.22)';
      });
      closeBtn.addEventListener('mouseleave', function () {
        closeBtn.style.background = 'rgba(255,255,255,0.12)';
      });

      function close() {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      }

      overlay.addEventListener('click', close);
      closeBtn.addEventListener('click', close);
      document.addEventListener('keydown', function handler(e) {
        if (e.key === 'Escape') {
          close();
          document.removeEventListener('keydown', handler);
        }
      });

      overlay.appendChild(bigImg);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
    });
  });

  /* ── Scroll-to-section: hero "Scroll" indicator ──────────── */
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.style.cursor = 'pointer';
    scrollIndicator.addEventListener('click', function () {
      const services = document.getElementById('services');
      if (services) {
        const navHeight = navbar.offsetHeight;
        const pos = services.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  }

  /* ── Lazy-load polyfill for older browsers ────────────────── */
  if ('loading' in HTMLImageElement.prototype === false) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const lazyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          lazyObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(function (img) {
      lazyObserver.observe(img);
    });
  }

  /* ── Console branding ────────────────────────────────────── */
  console.log(
    '%c@JUJUBLENDZ %c| Clifton\'s Blending Specialist ',
    'background:#2C3E50;color:#3498DB;font-size:14px;font-weight:900;padding:6px 8px;',
    'background:#111820;color:#ECF0F1;font-size:12px;padding:6px 8px;'
  );

})();
