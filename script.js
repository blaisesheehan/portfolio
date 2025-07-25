// script.js

// Toggle mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Fade-in on scroll with intersection observer
const faders = document.querySelectorAll('.fade-in');
const options = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, options);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// Smooth scroll
const smoothLinks = document.querySelectorAll('a[href^="#"]');
smoothLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    navLinks.classList.remove('show');
  });
});


document.addEventListener("DOMContentLoaded", () => {
  // Function to wrap digits in a span with class "num"
  const wrapDigits = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Replace digits with wrapped span version
      const replacedText = node.textContent.replace(/(\d+)/g, '<span class="num">$1</span>');
      if (replacedText !== node.textContent) {
        const wrapper = document.createElement('span');
        wrapper.innerHTML = replacedText;
        node.replaceWith(wrapper);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
      node.childNodes.forEach(child => wrapDigits(child));
    }
  };

  wrapDigits(document.body);
});
