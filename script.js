
class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navLinks = document.querySelector('.nav-links');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.links = document.querySelectorAll('.nav-link');
    this.lastScrollY = window.scrollY;
    
    this.init();
  }

  init() {
    this.menuToggle?.addEventListener('click', () => this.toggleMobileMenu());
    
    this.links.forEach(link => {
      link.addEventListener('click', (e) => this.handleLinkClick(e, link));
    });

    window.addEventListener('scroll', () => this.handleScroll());
    
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
    window.addEventListener('scroll', () => this.updateActiveLink());
  }

  toggleMobileMenu() {
    this.navLinks.classList.toggle('show');
    const icon = this.menuToggle.querySelector('i');
    icon.className = this.navLinks.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars';
  }

  handleLinkClick(e, link) {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      const offset = 100; // Account for fixed navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
      
      this.navLinks.classList.remove('show');
      const icon = this.menuToggle.querySelector('i');
      icon.className = 'fas fa-bars';
    }
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
      this.navbar.style.transform = 'translateX(-50%) translateY(-100%)';
    } else {
      this.navbar.style.transform = 'translateX(-50%) translateY(0)';
    }
    
    if (currentScrollY > 50) {
      this.navbar.style.background = 'rgba(15, 15, 15, 0.95)';
    } else {
      this.navbar.style.background = 'rgba(15, 15, 15, 0.8)';
    }
    
    this.lastScrollY = currentScrollY;
  }

  handleOutsideClick(e) {
    if (!this.navbar.contains(e.target)) {
      this.navLinks.classList.remove('show');
      const icon = this.menuToggle.querySelector('i');
      icon.className = 'fas fa-bars';
    }
  }

  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`a[href="#${id}"]`);
      
      if (scrollPos >= top && scrollPos < bottom) {
        this.links.forEach(l => l.classList.remove('active'));
        link?.classList.add('active');
      }
    });
  }
}


class AnimationController {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    
    this.setupSkillBars();
    
    this.setupCounters();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    document.querySelectorAll('.fade-in, section, .stat-card, .skill-card, .timeline-item, .project-card').forEach(el => {
      observer.observe(el);
    });
  }

  setupSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = width;
          }, 500);
          skillObserver.unobserve(bar);
        }
      });
    }, this.observerOptions);

    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  setupCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
  }

  animateCounter(element) {
    const target = element.textContent;
    
    if (target === '∞' || isNaN(parseInt(target))) return;
    
    const targetNum = parseInt(target);
    const duration = 2000;
    const step = targetNum / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= targetNum) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + (target.includes('%') ? '%' : '');
      }
    }, 16);
  }
}

class Lightbox {
  constructor() {
    this.lightbox = document.querySelector('.lightbox');
    this.lightboxImg = document.querySelector('#lightbox-img');
    this.lightboxClose = document.querySelector('.lightbox-close');
    this.images = document.querySelectorAll('.project-img, .main-preview');
    
    this.init();
  }

  init() {
    this.images.forEach(img => {
      img.addEventListener('click', (e) => this.openLightbox(e));
    });

    this.lightboxClose?.addEventListener('click', () => this.closeLightbox());
    this.lightbox?.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.closeLightbox();
      }
    });
  }

  openLightbox(e) {
    const img = e.target.closest('.project-img, .main-preview')?.querySelector('img') || e.target;
    if (img && img.src) {
      this.lightboxImg.src = img.src;
      this.lightboxImg.alt = img.alt || '';
      this.lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      this.lightboxImg.src = '';
    }, 300);
  }
}

// =========================
// PROJECT GALLERY
// =========================
class ProjectGallery {
  constructor() {
    this.galleries = document.querySelectorAll('.project-gallery');
    this.init();
  }

  init() {
    this.galleries.forEach(gallery => {
      const mainPreview = gallery.querySelector('.main-preview img');
      const thumbnails = gallery.querySelectorAll('.thumbnail');
      
      thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
          if (mainPreview && thumb.src) {
            const tempSrc = mainPreview.src;
            const tempAlt = mainPreview.alt;
            
            mainPreview.src = thumb.src;
            mainPreview.alt = thumb.alt;
            
            thumb.src = tempSrc;
            thumb.alt = tempAlt;
          }
        });
      });
    });
  }
}

class ScrollIndicator {
  constructor() {
    this.indicator = document.querySelector('.scroll-indicator');
    this.init();
  }

  init() {
    this.indicator?.addEventListener('click', () => {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 100 && this.indicator) {
        this.indicator.style.opacity = '0';
        this.indicator.style.pointerEvents = 'none';
      }
    }, { once: true });
  }
}


class PerformanceUtils {
  static throttle(func, wait) {
    let timeout = null;
    let lastArgs;
    
    return function (...args) {
      lastArgs = args;
      if (!timeout) {
        func.apply(this, lastArgs);
        timeout = setTimeout(() => {
          timeout = null;
          if (lastArgs) {
            func.apply(this, lastArgs);
          }
        }, wait);
      }
    };
  }

  static debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  static preloadImages() {
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
      const imageElement = new Image();
      imageElement.src = img.src;
    });
  }
}

class ThemeSystem {
  constructor() {
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.init();
  }

  init() {
    this.prefersDark.addEventListener('change', (e) => {
      this.updateTheme(e.matches);
    });

    this.updateTheme(this.prefersDark.matches);
  }

  updateTheme(isDark) {

    document.documentElement.classList.toggle('dark-theme', isDark);
  }
}


class App {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      this.components.navigation = new Navigation();
      this.components.animations = new AnimationController();
      this.components.lightbox = new Lightbox();
      this.components.projectGallery = new ProjectGallery();
      this.components.scrollIndicator = new ScrollIndicator();
      this.components.themeSystem = new ThemeSystem();

      PerformanceUtils.preloadImages();

      console.log('Portfolio initialized successfully');
    } catch (error) {
      console.error('Error initializing portfolio:', error);
    }


  }
}