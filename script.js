// =========================
// NAV MENU TOGGLE
// =========================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// =========================
// FADE-IN ON SCROLL (IntersectionObserver)
// =========================
const faders = document.querySelectorAll('.fade-in');
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

faders.forEach(fader => appearOnScroll.observe(fader));

// =========================
// SMOOTH SCROLL LINKS
// =========================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      navLinks.classList.remove('show');
    }
  });
});

// =========================
// WRAP DIGITS
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const wrapDigits = node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const replaced = node.textContent.replace(/(\d+)/g, '<span class="num">$1</span>');
      if (replaced !== node.textContent) {
        const span = document.createElement('span');
        span.innerHTML = replaced;
        node.replaceWith(span);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach(wrapDigits);
    }
  };
  wrapDigits(document.body);
});

// =========================
// CAROUSEL + LIGHTBOX
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.carousel-slide');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const indicators = document.querySelectorAll('.indicator');
  const carousel = document.querySelector('.carousel-container');

  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const imageItems = document.querySelectorAll('.image-item');

  if (!slides.length) return;

  let current = 0;
  let autoPlayInterval;
  let isTransitioning = false;

  const showSlide = index => {
    if (isTransitioning) return;
    isTransitioning = true;
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));
    setTimeout(() => isTransitioning = false, 400);
  };

  const nextSlide = () => { current = (current + 1) % slides.length; showSlide(current); };
  const prevSlide = () => { current = (current - 1 + slides.length) % slides.length; showSlide(current); };

  const startAutoPlay = () => { autoPlayInterval = setInterval(nextSlide, 5000); };
  const resetAutoPlay = () => { clearInterval(autoPlayInterval); startAutoPlay(); };

  nextBtn?.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
  prevBtn?.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

  indicators.forEach((ind, i) => {
    ind.addEventListener('click', () => {
      if (i !== current) { current = i; showSlide(current); resetAutoPlay(); }
    });
  });

  // swipe
  let startX = 0;
  carousel?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  carousel?.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
    resetAutoPlay();
  });

  carousel?.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  carousel?.addEventListener('mouseleave', startAutoPlay);

  // Lightbox
  imageItems.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => lightboxImg.src = '', 200);
  };
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox(); });

  showSlide(current);
  startAutoPlay();
});

// =========================
// NAVBAR SCROLL BEHAVIOR
// =========================
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;
window.addEventListener('scroll', throttle(() => {
  const y = window.scrollY;
  if (y > 100) {
    navbar.style.background = 'rgba(18,18,23,0.9)';
    navbar.style.backdropFilter = 'blur(10px)';
  } else {
    navbar.style.background = 'transparent';
    navbar.style.backdropFilter = 'none';
  }
  if (y > lastScrollY && y > 200) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollY = y;
}, 50));


// =========================
// HELPER: THROTTLE
// =========================
function throttle(func, wait) {
  let timeout = null;
  let lastArgs;
  return function (...args) {
    lastArgs = args;
    if (!timeout) {
      func.apply(this, lastArgs);
      timeout = setTimeout(() => {
        timeout = null;
        if (lastArgs) func.apply(this, lastArgs);
      }, wait);
    }
  };
}
