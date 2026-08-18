(function(){
  "use strict";
  document.getElementById('year').textContent = new Date().getFullYear();

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced){ document.documentElement.classList.add('reduced-motion'); }

  /* LOADER */
  var loader = document.getElementById('loader');
  window.addEventListener('load', function(){
    setTimeout(function(){ loader.classList.add('is-done'); }, prefersReduced ? 0 : 850);
  });

  /* NAV TOGGLE */
  var navToggle = document.getElementById('navToggle');
  var navOverlay = document.getElementById('navOverlay');
  navToggle.addEventListener('click', function(){
    var open = navOverlay.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.nav-overlay a').forEach(function(link){
    link.addEventListener('click', function(){
      navOverlay.classList.remove('is-open');
      navToggle.classList.remove('is-open');
    });
  });

  /* PROGRESS BAR */
  var progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', function(){
    var h = document.documentElement;
    var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = pct + '%';
  }, { passive:true });

  /* CUSTOM CURSOR */
  var hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(hasFinePointer && !prefersReduced && typeof gsap !== 'undefined'){
    document.body.classList.add('has-custom-cursor');
    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    gsap.set([dot, ring], { xPercent:-50, yPercent:-50 });
    var ringX = gsap.quickTo(ring, "x", { duration:.5, ease:"power3" });
    var ringY = gsap.quickTo(ring, "y", { duration:.5, ease:"power3" });
    var dotX = gsap.quickTo(dot, "x", { duration:.1, ease:"power3" });
    var dotY = gsap.quickTo(dot, "y", { duration:.1, ease:"power3" });
    window.addEventListener('mousemove', function(e){
      ringX(e.clientX); ringY(e.clientY); dotX(e.clientX); dotY(e.clientY);
    });
    document.querySelectorAll('a, button, .polaroid').forEach(function(el){
      el.addEventListener('mouseenter', function(){ ring.classList.add('is-active'); });
      el.addEventListener('mouseleave', function(){ ring.classList.remove('is-active'); });
    });
  }

  /* GSAP SCROLL REVEALS */
  if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReduced){
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-eyebrow', { opacity:0, y:20, duration:1, delay:.3, ease:'power3.out' });
    gsap.from('.hero-name', { opacity:0, y:40, duration:1.1, delay:.45, ease:'power3.out' });
    gsap.from('.hero-tagline', { opacity:0, y:20, duration:1.1, delay:.7, ease:'power3.out' });
    gsap.from('.hero-sub', { opacity:0, y:20, duration:1, delay:.95, ease:'power3.out' });
    gsap.from('.hero-badge', { opacity:0, scale:.5, duration:.8, delay:1.1, ease:'back.out(2)' });
    gsap.from('.hero-tape', { opacity:0, y:-20, duration:.8, delay:1.2 });

    // simple fade/rise reveal for headings & text blocks
    gsap.utils.toArray('.about-heading,.about-body,.about-edit-note,.chapter-tab,.chapter-heading,.chapter-sub,.contents-heading,.process-heading,.contact-heading,.contact-sub').forEach(function(el){
      gsap.fromTo(el, { opacity:0, y:30 }, { opacity:1, y:0, duration:.9, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 88%' } });
    });

    // rotated pop-in for polaroids — rotation values mirror the CSS nth-child rules
    // above, and are set explicitly on every frame so GSAP's y/scale writes don't
    // wipe out the resting tilt (animating any transform prop resets the others
    // unless you state them all)
    document.querySelectorAll('.chapter-grid').forEach(function(grid){
      var rotations = [-4,3,-2,5];
      grid.querySelectorAll('.polaroid').forEach(function(el,i){
        var rest = rotations[i % rotations.length];
        var start = rest + (Math.random()*10-5);
        gsap.set(el, { opacity:0, y:36, scale:.88, rotation:start });
        gsap.to(el, {
          opacity:1, y:0, scale:1, rotation:rest, duration:.8, ease:'back.out(1.5)',
          clearProps:'transform',
          scrollTrigger:{ trigger:el, start:'top 90%' }
        });
      });
    });

    // stickers: staggered pop-in, rotation mirrors CSS
    (function(){
      var rotations = [-6,4,-3];
      document.querySelectorAll('.stickers-row .sticker').forEach(function(el,i){
        var rest = rotations[i % rotations.length];
        var start = rest + (Math.random()*10-5);
        gsap.set(el, { opacity:0, scale:.6, rotation:start });
        gsap.to(el, {
          opacity:1, scale:1, rotation:rest, duration:.7, ease:'back.out(2)', delay:i*.1,
          scrollTrigger:{ trigger:'.stickers-row', start:'top 90%' }
        });
      });
    })();

    // process cards: rotation mirrors CSS nth-child(odd/even)
    document.querySelectorAll('.process-row .process-card').forEach(function(el,i){
      var rest = (i % 2 === 0) ? -2 : 2;
      var start = rest + (Math.random()*10-5);
      gsap.set(el, { opacity:0, y:36, scale:.9, rotation:start });
      gsap.to(el, {
        opacity:1, y:0, scale:1, rotation:rest, duration:.8, ease:'back.out(1.5)',
        scrollTrigger:{ trigger:el, start:'top 90%' }
      });
    });

    // contents list stagger
    gsap.fromTo('.contents-item', { opacity:0, x:-20 }, {
      opacity:1, x:0, duration:.6, ease:'power2.out', stagger:.08,
      scrollTrigger:{ trigger:'.contents-list', start:'top 85%' }
    });

    // photo -> portrait scroll morph
    var morphShape = document.getElementById('morphShape');
    if(morphShape){
      gsap.to(morphShape, {
        clipPath:'inset(0 0% 0 0)', ease:'none',
        scrollTrigger:{ trigger:'.about', start:'top 55%', end:'bottom 45%', scrub:.6 }
      });
    }
  }

})();
