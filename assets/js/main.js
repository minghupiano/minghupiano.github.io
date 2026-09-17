'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');
const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('span').textContent = 'Menu';
  menuButton.querySelector('i').className = 'bi bi-list';
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? 'Close' : 'Menu';
  menuButton.querySelector('i').className = open ? 'bi bi-x-lg' : 'bi bi-list';
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});
for (const link of navigation.querySelectorAll('a')) link.addEventListener('click', closeMenu);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const sections = Array.from(document.querySelectorAll('main > section[id]'));
const markCurrentSection = () => {
  document.querySelector('.site-header').classList.toggle('is-scrolled', window.scrollY > 20);
  let current = sections[0].id;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= window.innerHeight * .35) current = section.id;
  }
  for (const link of navigation.querySelectorAll('a')) {
    const active = link.hash === `#${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
};
let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => { markCurrentSection(); scrollQueued = false; });
}, {passive: true});
markCurrentSection();

const dialog = document.querySelector('.video-dialog');
const videoContainer = dialog.querySelector('.video-container');
for (const link of document.querySelectorAll('[data-video]')) {
  link.addEventListener('click', event => {
    // Preserve the ordinary YouTube link for modifier clicks and older browsers.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.showModal) return;
    event.preventDefault();
    const title = link.dataset.title;
    dialog.querySelector('#video-dialog-title').textContent = title;
    dialog.querySelector('#video-external').href = link.href;
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${link.dataset.video}?autoplay=1&rel=0`;
    frame.title = title;
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    videoContainer.replaceChildren(frame);
    document.body.classList.add('video-open');
    dialog.showModal();
  });
}
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  videoContainer.replaceChildren();
  document.body.classList.remove('video-open');
});
document.querySelector('#copyright-year').textContent = new Date().getFullYear();

// Keep native validation and ordinary form submission, including without JavaScript.
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', event => {
  for (const field of contactForm.querySelectorAll('[required]')) field.value = field.value.trim();
  if (!contactForm.reportValidity()) event.preventDefault();
});
