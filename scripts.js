// Typing effect for hero
const typingElement = document.querySelector('.typing');
const text = "Hej, jestem Antek. Jestem web developerem, mam 14 lat. Kliknij tutaj, jeśli chcesz wiedzieć więcej o mnie.";
let index = 0;

function typeWriter() {
    if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 100);
    } else {
        // After typing, start blinking cursor
        typingElement.style.borderRight = '2px solid #ffd700';
        setInterval(() => {
            typingElement.style.borderRight = typingElement.style.borderRight === 'none' ? '2px solid #ffd700' : 'none';
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    typeWriter();
});

document.addEventListener('DOMContentLoaded',function(){
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');
  if(navToggle && nav){
    navToggle.addEventListener('click',function(){
      if(nav.style.display === 'flex' || nav.classList.contains('open')){
        nav.style.display = '';
        nav.classList.remove('open');
      } else {
        nav.style.display = 'flex';
        nav.classList.add('open');
      }
    });
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var href = this.getAttribute('href');
      if(href.length>1){
        var el = document.querySelector(href);
        if(el){
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth'});
          if(nav && nav.classList.contains('open')){nav.style.display='';nav.classList.remove('open')}
        }
      }
    });
  });

  // Reveal on scroll using IntersectionObserver
  try {
    // add small stagger delays
    document.querySelectorAll('.reveal-on-scroll').forEach((el, i) => { el.style.transitionDelay = (i * 80) + 'ms'; });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => obs.observe(el));
  } catch (e) { /* older browsers fallback: just add reveal */ document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('reveal')); }

  // subtle parallax on hero mouse move
  const hero = document.querySelector('.hero');
  const heroImg = document.querySelector('.hero-image');
  // detect low-end devices
  const deviceMemory = navigator.deviceMemory || 4;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 760;
  const isLowEnd = deviceMemory <= 1.5 || isMobile;
  if(isLowEnd){
    document.body.classList.add('reduced-performance');
  }

  if(!isLowEnd && hero && heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    // throttle with rAF
    let rafId = null;
    let lastX=0, lastY=0;
    hero.addEventListener('mousemove', (e) => {
      lastX = e.clientX; lastY = e.clientY;
      if(rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = hero.getBoundingClientRect();
        const x = (lastX - rect.left) / rect.width - 0.5;
        const y = (lastY - rect.top) / rect.height - 0.5;
        heroImg.style.transform = `translate(${x * 6}px, ${y * 4}px) scale(1.02)`;
      });
    });
    hero.addEventListener('mouseleave', () => { heroImg.style.transform = ''; });
  }

  // Gallery lightbox logic + lazy load images
  const galleryImgs = document.querySelectorAll('.gallery-thumb');
  const imageModal = document.getElementById('image-modal');
  const imageOverlay = document.getElementById('image-overlay');
  const imageClose = document.getElementById('image-close');
  const imageView = document.getElementById('image-view');

  function openImage(src, alt){
    if(!imageModal || !imageView) return;
    imageView.src = src;
    imageView.alt = alt || '';
    imageModal.classList.remove('hidden');
    imageModal.setAttribute('aria-hidden','false');
  }
  function closeImage(){
    if(!imageModal || !imageView) return;
    imageView.src = '';
    imageModal.classList.add('hidden');
    imageModal.setAttribute('aria-hidden','true');
  }

  // Lazy-load images (gallery) with IntersectionObserver
  try{
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        if(el.classList.contains('gallery-thumb')){
          const real = el.getAttribute('data-src');
          if(real){ el.src = real; el.removeAttribute('data-src'); }
          observer.unobserve(el);
        }
      });
    }, {rootMargin: '200px 0px'});

    galleryImgs.forEach(img => { io.observe(img); img.addEventListener('click', () => openImage(img.src || img.getAttribute('data-src'), img.alt)); });
  } catch (e){
    // fallback: eager load
    galleryImgs.forEach(img => { const real = img.getAttribute('data-src'); if(real) img.src = real; img.addEventListener('click', () => openImage(img.src, img.alt)); });
  }

  if(imageOverlay) imageOverlay.addEventListener('click', closeImage);
  if(imageClose) imageClose.addEventListener('click', closeImage);
  document.addEventListener('keydown', (e) => { if(e.key==='Escape') closeImage(); });

  // Project preview modal logic
  var modal = document.getElementById('project-modal');
  var modalOverlay = document.getElementById('modal-overlay');
  var modalClose = document.getElementById('modal-close');
  var iframe = document.getElementById('project-iframe');

  function openProjectPreview(src){
    if(!modal || !iframe) return;
    iframe.src = src;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
  }
  function closeProjectPreview(){
    if(!modal || !iframe) return;
    iframe.src = '';
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
  }

  document.querySelectorAll('.project-preview .open-project').forEach(function(btn){
    btn.addEventListener('click',function(e){
      var card = e.target.closest('.project-preview');
      if(!card) return;
      var src = card.getAttribute('data-src');
      if(src){
        openProjectPreview(src);
      }
    });
  });

  if(modalOverlay) modalOverlay.addEventListener('click', closeProjectPreview);
  if(modalClose) modalClose.addEventListener('click', closeProjectPreview);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeProjectPreview(); });

});
