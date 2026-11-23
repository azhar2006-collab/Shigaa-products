/* SHIGAA cinematic hero — framework-free, progressively enhanced, local dependencies. */
(() => {
  'use strict';
  const root = document.querySelector('.shigaa-site');
  const hero = root?.querySelector('[data-shigaa-hero]');
  if (!hero) return;
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const gs = window.gsap;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1101px)');
  const mobile = window.matchMedia('(max-width: 700px)');
  const assetURL = new URL('assets/', document.currentScript?.src || location.href);
  // Editorial descriptions summarize ingredients on the exact source pages.
  // Prices checked 2026-11-23; original packaging files are unmodified.
  const products = [
    {id:'107',name:'Refoll Hair Growth Oil', title:'Refoll Hair <br>Growth Oil', category:'HAIR CARE · 100 ML', price:150, previous:200, description:'A herbal hair oil with hibiscus, amla, sesame oil and coconut oil.', image:'refoll-28.jpg', alt:'Original SHIGAA Refoll Hair Growth Oil bottle', aura:'#a9d9d4', warm:'#e7e7c9', kind:'bottle'},
    {id:'97',name:'Facial Pack', title:'Facial <br>Pack', category:'BEAUTY CARE · 100 GM', price:250, previous:350, description:'A herbal facial pack with multani mitti, kasturi manjal, beetroot and carrot.', image:'product-97.jpg', alt:'Original SHIGAA Shine Facial Pack jar', aura:'#d8dbb2', warm:'#ecddbd', kind:'jar'},
    {id:'98',name:'Face Glow Cream', title:'Face Glow <br>Cream', category:'BEAUTY CARE · CREAM', price:170, previous:250, description:'A Siddha-based face cream with aloe vera and vitamin E, for your daily care ritual.', image:'product-98.jpg', alt:'Original SHIGAA Face Glow Cream jar', aura:'#c4d9c4', warm:'#e9dfc3', kind:'jar'}
  ];
  const selectors = $$('.sg-selector');
  const imageEl = $('.sg-main-product');
  const visual = $('.sg-product-visual');
  const cardContent = $('.sg-card-content');
  const loader = $('.sg-preloader');
  const floatTweens = [];
  let active = 0, queued = null, switching = false, switchTimeline;
  let entrance, scrollContext, inView = true, userPaused = false, started = false, floatingReady = false, raf = 0;
  let x = 0, y = 0, targetX = 0, targetY = 0;
  const motionAllowed = () => !reduced.matches && !userPaused;
  const continuousAllowed = () => motionAllowed() && inView && !document.hidden;
  const money = value => `₹${value}`;
  const imageCache = products.map(p => {const img = new Image(); img.src = new URL(p.image, assetURL).href; return img;});
  const updateTabs = () => {
    selectors.forEach((button, i) => {button.classList.toggle('is-active', i === active);button.setAttribute('aria-selected', String(i === active));button.tabIndex = i === active ? 0 : -1;});
    $('.sg-product-card').setAttribute('aria-labelledby', `sg-selector-${active}`);
  };
  function applyProduct(index) {
    const p = products[index];
    active = index;
    imageEl.src = new URL(p.image, assetURL).href;
    imageEl.alt = p.alt;
    imageEl.width = p.kind === 'bottle' ? 1200 : 600;
    imageEl.height = p.kind === 'bottle' ? 1400 : 600;
    imageEl.classList.toggle('sg-is-bottle', p.kind === 'bottle');
    imageEl.classList.toggle('sg-is-jar', p.kind === 'jar');
    $('.sg-product-category').textContent = p.category;
    $('.sg-product-title').innerHTML = p.title.split(/\s*<br>\s*/).map(line => `<span>${line}</span>`).join(' '); // static, authored data only
    $('.sg-product-description').textContent = p.description;
    $('.sg-product-price').textContent = money(p.price);
    $('.sg-product-old-price').textContent = money(p.previous);
    $('.sg-product-old-price').setAttribute('aria-label', `Previous price ${p.previous} rupees`);
    $('#sg-add-active').dataset.cartAdd = p.id;
    $('#sg-add-active').setAttribute('aria-label', `Add ${p.name} to your bag for ${money(p.price)}`);
    updateTabs();
    $('#sg-announcement').textContent = `${p.name}, ${money(p.price)}. ${p.description}`;
  }
  function finishSwitch() {
    switching = false;
    $('.sg-product-card').removeAttribute('aria-busy');
    if (queued !== null) {const next = queued; queued = null; selectProduct(next);}
  }
  async function selectProduct(index) {
    if (switching) {queued = index; return;}
    if (index === active) return;
    switching = true;
    $('.sg-product-card').setAttribute('aria-busy','true');
    try {if (imageCache[index].decode) await imageCache[index].decode();} catch (_) { /* image remains an accessible original asset */ }
    const p = products[index];
    if (!gs || !motionAllowed()) {
      applyProduct(index);
      hero.style.setProperty('--sg-aura',p.aura); hero.style.setProperty('--sg-warm',p.warm);
      finishSwitch(); return;
    }
    switchTimeline = gs.timeline({onComplete:finishSwitch});
    switchTimeline.to(visual,{opacity:0,y:20,rotateY:-16,scale:.94,duration:.3,ease:'power2.in'},0)
      .to(cardContent,{opacity:0,y:8,duration:.22},0)
      .to(hero,{'--sg-aura':p.aura,'--sg-warm':p.warm,duration:1.1,ease:'power2.inOut'},.12)
      .call(() => applyProduct(index),null,.31)
      .set(visual,{y:32,rotateY:16,scale:.9},.32)
      .to(visual,{opacity:1,y:0,rotateY:0,scale:1,duration:.9,ease:'expo.out'},.33)
      .to(cardContent,{opacity:1,y:0,duration:.55,ease:'power3.out'},.4)
      .fromTo('.sg-plant-parallax',{rotation:-2},{rotation:0,duration:1,ease:'power3.out'},.32);
  }
  selectors.forEach((button,index) => {
    button.addEventListener('click',() => selectProduct(index));
    button.addEventListener('keydown',event => {
      const current = selectors.indexOf(event.currentTarget);
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (current+1)%products.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (current-1+products.length)%products.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = products.length-1;
      if (next !== undefined) {event.preventDefault(); selectors[next].focus(); selectProduct(next);}
    });
  });
  const updateOrientation = () => $('.sg-selectors').setAttribute('aria-orientation',mobile.matches ? 'horizontal':'vertical');
  updateOrientation(); mobile.addEventListener('change',updateOrientation);

  const cartLayer = $('[data-cart-layer]');
  const cartPanel = $('.sg-cart-panel');
  const cartItems = $('[data-cart-items]');
  const cartForm = $('[data-checkout-form]');
  const cart = new Map();
  const cartKey = 'shigaa-cart-v1';
  let returnFocus = null;
  try {
    const saved = JSON.parse(localStorage.getItem(cartKey) || '{}');
    for (const [id, rawQuantity] of Object.entries(saved)) {
      const quantity = Number(rawQuantity);
      if (products.some(product => product.id === id) && Number.isInteger(quantity) && quantity > 0 && quantity <= 99) cart.set(id, quantity);
    }
  } catch (_) { /* The cart still works for this visit if storage is unavailable. */ }
  function saveCart() {
    try { localStorage.setItem(cartKey, JSON.stringify(Object.fromEntries(cart))); } catch (_) { /* Keep in-memory cart state. */ }
  }
  function renderCart() {
    const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
    const badge = $('[data-cart-count]');
    badge.textContent = String(count);
    badge.hidden = count === 0;
    $('[data-cart-heading-count]').textContent = `(${count})`;
    $('.sg-cart-trigger').setAttribute('aria-label', `Open shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`);
    $('[data-cart-empty]').hidden = count > 0;
    $('[data-cart-content]').hidden = count === 0;
    cartItems.innerHTML = [...cart.entries()].map(([id, quantity]) => {
      const product = products.find(item => item.id === id);
      const image = new URL(product.image, assetURL).href;
      return `<article class="sg-cart-item">
        <div class="sg-cart-item-image"><img src="${image}" alt=""></div>
        <div class="sg-cart-item-info"><h3>${product.name}</h3><p>${money(product.price)} each</p>
          <div class="sg-quantity-controls"><button type="button" data-cart-step="-1" data-cart-id="${id}" aria-label="Decrease ${product.name} quantity">−</button><span>Qty ${quantity}</span><button type="button" data-cart-step="1" data-cart-id="${id}" aria-label="Increase ${product.name} quantity">+</button></div>
        </div>
        <div class="sg-cart-item-total"><strong>${money(product.price * quantity)}</strong><button type="button" class="sg-remove-item" data-cart-remove="${id}">Remove</button></div>
      </article>`;
    }).join('');
    const subtotal = [...cart.entries()].reduce((sum, [id, quantity]) => sum + products.find(item => item.id === id).price * quantity, 0);
    $('[data-cart-subtotal]').textContent = money(subtotal);
  }
  function openCart() {
    returnFocus = document.activeElement;
    cartLayer.hidden = false;
    document.body.classList.add('sg-cart-open');
    requestAnimationFrame(() => cartLayer.classList.add('is-open'));
    cartPanel.focus();
  }
  function closeCart(restore = true) {
    if (cartLayer.hidden) return;
    cartLayer.classList.remove('is-open');
    document.body.classList.remove('sg-cart-open');
    window.setTimeout(() => { if (!cartLayer.classList.contains('is-open')) cartLayer.hidden = true; }, 280);
    if (restore && returnFocus instanceof HTMLElement) returnFocus.focus();
  }
  function addToCart(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    cart.set(id, Math.min(99, (cart.get(id) || 0) + 1));
    saveCart();
    renderCart();
    $('[data-checkout-status]').textContent = '';
    $('[data-cart-announcement]').textContent = `${product.name} added to your bag.`;
    openCart();
  }
  renderCart();
  root.addEventListener('click', event => {
    const addButton = event.target.closest('[data-cart-add]');
    if (addButton) { event.preventDefault(); addToCart(addButton.dataset.cartAdd); return; }
    const openButton = event.target.closest('[data-cart-open]');
    if (openButton) { openCart(); return; }
    const closeButton = event.target.closest('[data-cart-close]');
    if (closeButton) { closeCart(closeButton.tagName !== 'A'); return; }
    const removeButton = event.target.closest('[data-cart-remove]');
    if (removeButton) {
      cart.delete(removeButton.dataset.cartRemove); saveCart(); renderCart();
      $('[data-checkout-status]').textContent = '';
      return;
    }
    const stepButton = event.target.closest('[data-cart-step]');
    if (stepButton) {
      const id = stepButton.dataset.cartId;
      const quantity = (cart.get(id) || 0) + Number(stepButton.dataset.cartStep);
      if (quantity <= 0) cart.delete(id); else cart.set(id, Math.min(99, quantity));
      saveCart(); renderCart();
      $('[data-checkout-status]').textContent = '';
    }
  });
  cartForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!cart.size || !cartForm.reportValidity()) return;
    const name = new FormData(cartForm).get('name').trim();
    $('[data-checkout-status]').textContent = `Thanks, ${name}. Your delivery details are ready. This site preview does not send orders or process payments yet.`;
  });
  cartForm.addEventListener('input', () => { $('[data-checkout-status]').textContent = ''; });
  document.addEventListener('keydown', event => {
    if (cartLayer.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closeCart(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...cartPanel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled])')].filter(element => !element.closest('[hidden]'));
    if (!focusable.length) { event.preventDefault(); cartPanel.focus(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  function frame() {
    if (!continuousAllowed() || !pointer.matches) {raf=0;return;}
    x += (targetX-x)*.055; y += (targetY-y)*.055;
    $('.sg-product-parallax').style.transform = `translate3d(${x*10}px,${y*7}px,0) rotateY(${x*2}deg) rotateX(${-y*1.3}deg)`;
    $('.sg-orbit-wrap').style.transform = `translate3d(${x*5}px,${y*4}px,0)`;
    $('.sg-card-parallax').style.transform = `translate3d(${x*-4}px,${y*-3}px,0)`;
    $$('.sg-plant-parallax').forEach((leaf,i) => {leaf.style.translate=`${x*(i ? 15:-9)}px ${y*(i ? 10:-6)}px`;});
    raf=requestAnimationFrame(frame);
  }
  hero.addEventListener('pointermove',event => {
    if (!pointer.matches || !continuousAllowed()) return;
    const rect=hero.getBoundingClientRect();
    targetX=((event.clientX-rect.left)/rect.width-.5)*2;
    targetY=((event.clientY-rect.top)/rect.height-.5)*2;
  },{passive:true});
  hero.addEventListener('pointerleave',() => {targetX=targetY=0;});
  function resetPointer() {
    cancelAnimationFrame(raf); raf=0; x=y=targetX=targetY=0;
    for(const selector of ['.sg-product-parallax','.sg-orbit-wrap','.sg-card-parallax']) $(selector).style.transform='';
    $$('.sg-plant-parallax').forEach(leaf => {leaf.style.translate='';});
  }
  function buildScroll() {
    if (!gs || !window.ScrollTrigger || !motionAllowed() || scrollContext) return;
    gs.registerPlugin(window.ScrollTrigger);
    scrollContext=gs.matchMedia();
    scrollContext.add('(min-width: 1101px)',() => {
      const timeline=gs.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
      timeline.to('.sg-editorial',{y:-65,opacity:.5,ease:'none'},0)
        .to('.sg-product-scroll',{y:55,scale:.94,ease:'none'},0)
        .to('.sg-plant-front',{y:-90,ease:'none'},0)
        .to('.sg-plant-back',{y:-45,ease:'none'},0)
        .to('.sg-backdrop',{opacity:.6,ease:'none'},0);
    });
  }
  function syncMotion() {
    const enabled=motionAllowed();
    if(enabled && started && gs && !floatingReady) {beginFloating();return;}
    root.classList.toggle('sg-motion-paused',!enabled);
    $('.sg-motion-toggle').setAttribute('aria-pressed',String(!enabled));
    $('.sg-motion-toggle').setAttribute('aria-label',reduced.matches ? 'Reduced motion is enabled in your device settings' : enabled ? 'Pause decorative motion' : 'Resume decorative motion');
    $('.sg-motion-text').textContent=reduced.matches ? 'REDUCED MOTION' : enabled ? 'PAUSE MOTION' : 'RESUME MOTION';
    $('.sg-motion-icon').textContent=enabled ? 'Ⅱ' : '▷';
    $('.sg-motion-toggle').disabled=reduced.matches;
    floatTweens.forEach(t => continuousAllowed() ? t.resume() : t.pause());
    if (!enabled) {
      if (entrance && entrance.progress()<1) entrance.progress(1);
      if (switchTimeline && switching) switchTimeline.progress(1);
      if (scrollContext) {scrollContext.revert();scrollContext=null;}
      resetPointer();
    } else if(started) buildScroll();
    if(continuousAllowed() && pointer.matches && !raf) raf=requestAnimationFrame(frame);
    else if(!continuousAllowed() || !pointer.matches) resetPointer();
  }
  function beginFloating() {
    started=true;
    if(gs && !floatingReady) {
      floatingReady=true;
      floatTweens.push(gs.to('.sg-product-float',{y:-11,rotation:1.1,duration:4.8,ease:'sine.inOut',yoyo:true,repeat:-1}));
      floatTweens.push(gs.to('.sg-plant-front svg',{rotation:3,y:-7,duration:6.2,ease:'sine.inOut',yoyo:true,repeat:-1}));
      floatTweens.push(gs.to('.sg-plant-back svg',{rotation:-2.5,y:7,duration:7.4,ease:'sine.inOut',yoyo:true,repeat:-1}));
      floatTweens.push(gs.to('.sg-loose-leaf',{y:-13,rotation:'+=5',duration:5.5,ease:'sine.inOut',yoyo:true,repeat:-1}));
      floatTweens.push(gs.to('.sg-product-shadow',{scaleX:.88,opacity:.65,duration:4.8,ease:'sine.inOut',yoyo:true,repeat:-1}));
    }
    syncMotion();
  }
  $('.sg-motion-toggle').addEventListener('click',() => {userPaused=!userPaused;syncMotion();});
  reduced.addEventListener('change',syncMotion);pointer.addEventListener('change',syncMotion);
  document.addEventListener('visibilitychange',syncMotion);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;syncMotion();},{threshold:0}).observe(hero);
  $$('.sg-button[data-magnetic]').forEach(button => {
    button.addEventListener('pointermove',event=>{
      if (!gs || !pointer.matches || !motionAllowed()) return;
      const rect=button.getBoundingClientRect();
      gs.to(button,{x:(event.clientX-rect.left-rect.width/2)*.1,y:(event.clientY-rect.top-rect.height/2)*.14,duration:.45,ease:'power3.out',overwrite:'auto'});
    });
    button.addEventListener('pointerleave',()=>{if(gs)gs.to(button,{x:0,y:0,duration:.55,ease:'power3.out'});});
  });

  // A two-second preloader, then the specified entrance offsets.
  if (gs && motionAllowed()) {
    gs.set('.sg-backdrop',{opacity:0});
    entrance=gs.timeline({delay:2,onComplete:()=>{loader?.remove();window.ScrollTrigger?.refresh();}});
    entrance.to(loader,{yPercent:-101,duration:.75,ease:'expo.inOut'},0)
      .to('.sg-backdrop',{opacity:1,duration:1.2,ease:'power3.out'},.65)
      .from('.sg-editorial .sg-eyebrow',{y:18,opacity:0,duration:.9,ease:'power3.out'},.85)
      .from('.sg-line>span',{yPercent:112,opacity:0,rotation:2,duration:1.15,stagger:.1,ease:'expo.out'},1.05)
      .from('.sg-description',{y:18,opacity:0,duration:.8,ease:'power3.out'},1.35)
      .from('.sg-actions',{y:22,opacity:0,duration:.85,ease:'power3.out'},1.55)
      .from('.sg-product-visual',{scale:.85,opacity:0,y:30,rotateY:-12,duration:1.4,ease:'expo.out'},1.75)
      .from('.sg-orbit-wrap',{opacity:0,scale:.95,duration:1.2,ease:'power3.out'},1.75)
      .from('.sg-plant,.sg-loose-leaf,.sg-botanical-note',{opacity:0,scale:.9,duration:1.1,stagger:.08,ease:'power3.out'},1.95)
      .from('.sg-details-wrap',{x:30,opacity:0,duration:1.1,ease:'expo.out'},2.15)
      .from('.sg-selector-wrap,.sg-hero-bottom,.sg-product-caption',{y:12,opacity:0,duration:1,ease:'power3.out'},2.25)
      .call(beginFloating,null,2.35);
  } else {loader?.remove();started=true;syncMotion();}

  const menuButton=$('.sg-menu-toggle'), nav=$('.sg-navigation');
  function closeMenu(){if(!nav || !menuButton)return;nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');}
  menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape' && nav?.classList.contains('is-open')){closeMenu();menuButton.focus();}});
  document.addEventListener('click',event=>{if(!nav?.contains(event.target)&&!menuButton?.contains(event.target))closeMenu();});
  mobile.addEventListener('change',()=>{if(!mobile.matches)closeMenu();});
})();
