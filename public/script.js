const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const backToTop = document.getElementById('backToTop');
const year = document.getElementById('year');

if (year) year.textContent = new Date().getFullYear();

menuToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '✕' : '☰';
});

document.querySelectorAll('#navMenu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.textContent = '☰';
  });
});

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 10);
  backToTop?.classList.toggle('show', y > 500);
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
