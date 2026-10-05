import { loadContent, copy, archive } from './content.js';
const content = loadContent();
const params = new URLSearchParams(location.search);
let lang = params.get('lang') === 'en' ? 'en' : 'es';
let filter = ['beauty','recommendations','vlogs'].includes(params.get('category')) ? params.get('category') : 'all';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reducedMotion.matches;
let activeReel = null;
let photoIndex = 0;
let ribbonPaused=false, galleryPaused=false, galleryVisible=false;
let galleryTimer;
const touchLayout=matchMedia('(max-width: 767px), (hover: none)');
let servicesObserver,servicesStarted=false,servicesCompleted=false;
const serviceTimers=new Set();
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const icon = id => `<svg class="icon" aria-hidden="true"><use href="#${id}"/></svg>`;
const escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const animations = new Set();
let previewGeneration=0;
let previewTimer;
function animate(element, frames, options) {
  if (motionPaused) return;
  const a = element.animate(frames,options); animations.add(a); a.finished.catch(()=>{}).finally(()=>animations.delete(a));
}
function updateUrl() {
  const url = new URL(location.href);
  lang === 'en' ? url.searchParams.set('lang','en') : url.searchParams.delete('lang');
  filter !== 'all' ? url.searchParams.set('category',filter) : url.searchParams.delete('category');
  history.replaceState({},'',url);
}
function stopPreviews() {
  previewGeneration++;
  clearTimeout(previewTimer);
  $$('.reel-card').forEach(card=>{
    card.querySelector('video')?.pause(); card.classList.remove('is-previewing');
    const button=card.querySelector('.preview-toggle');
    button?.setAttribute('aria-pressed','false');
    if(button){button.setAttribute('aria-label',`${copy[lang].preview}: ${card.querySelector('h3').textContent}`);button.innerHTML=icon('play');}
  });
}
function renderReels() {
  stopPreviews();
  const items = content.reels.filter(r=>filter === 'all' || r.category === filter);
  const c = copy[lang];
  $('#reel-grid').classList.toggle('filtered',filter !== 'all');
  $('#reel-grid').innerHTML = items.map(reel=>`<article class="reel-card" data-reel="${reel.id}"><div class="reel-visual"><video muted playsinline preload="none" aria-hidden="true" tabindex="-1" src="${escape(reel.src)}"></video><img src="${escape(reel.poster)}" alt="${escape(reel.title[lang])}" width="540" height="960" loading="lazy"><button type="button" class="reel-open" aria-label="${c.play}: ${escape(reel.title[lang])}"><span>${c.play}</span><span class="play-circle">${icon('play')}</span></button></div><div class="reel-caption"><div><h3>${escape(reel.title[lang])}</h3><p translate="no">${escape(reel.owner)}</p></div><button type="button" class="preview-toggle" aria-label="${c.preview}: ${escape(reel.title[lang])}" aria-pressed="false">${icon('play')}</button></div></article>`).join('');
  $('.filter-count').textContent = `${items.length} ${lang === 'es' ? (items.length === 1 ? 'video' : 'videos') : (items.length === 1 ? 'video' : 'videos')}`;
  $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
  $$('.reel-card').forEach(card=>{
    const reel = content.reels.find(r=>r.id===card.dataset.reel);
    const video = card.querySelector('video');
    card.querySelector('.reel-open').addEventListener('click',()=>openVideo(reel));
    const preview = card.querySelector('.preview-toggle');
    const start = async (manual=false) => {
      if(motionPaused || card.classList.contains('is-previewing')) return;
      stopPreviews();const generation=previewGeneration;video.currentTime=0;
      try { await video.play();if(generation!==previewGeneration){video.pause();return;}card.classList.add('is-previewing');preview.setAttribute('aria-pressed','true');preview.setAttribute('aria-label',`${c.stopPreview}: ${reel.title[lang]}`);preview.innerHTML=icon('pause');
        previewTimer=setTimeout(()=>stopPreviews(),manual?10000:4500);
      } catch { if(generation===previewGeneration)stopPreviews(); }
    };
    preview.addEventListener('click',()=>card.classList.contains('is-previewing') ? stopPreviews() : start(true));
    if(matchMedia('(hover:hover)').matches){card.querySelector('.reel-visual').addEventListener('pointerenter',()=>start());card.querySelector('.reel-visual').addEventListener('pointerleave',stopPreviews);}
    animate(card,[{opacity:.3,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.16,1,.3,1)'});
  });
}
const videoDialog=$('#video-dialog'),fullVideo=$('#full-video'),photoDialog=$('#photo-dialog');
function openVideo(reel) {
  stopPreviews(); activeReel=reel;
  $('#video-title').textContent=reel.title[lang];$('#video-description').textContent=reel.description[lang];$('#video-original').href=reel.url;
  $('.video-error').hidden=true;fullVideo.src=reel.src;fullVideo.poster=reel.poster;
  videoDialog.showModal(); document.body.style.overflow='hidden';syncGallery(); fullVideo.play().catch(()=>{});
}
fullVideo.addEventListener('error',()=>{$('.video-error').textContent=copy[lang].videoError;$('.video-error').hidden=false;});
videoDialog.addEventListener('close',()=>{fullVideo.pause();fullVideo.removeAttribute('src');fullVideo.load();document.body.style.overflow='';activeReel=null;syncGallery();});
photoDialog.addEventListener('close',()=>{document.body.style.overflow='';syncGallery();});
$$('.dialog-close').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
[videoDialog,photoDialog].forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));

const photoCycle=['brilla','makeup','skincare'];
const photoDescriptions={
  es:{hero:'Fiona sonríe sosteniendo un labial rosa, en la sesión de Brilla',detail:'Fiona muestra cuatro labiales rosados a la cámara',smile:'Fiona sonríe con un producto de skincare de Brilla',skincare:'Fiona aplica un producto de skincare en su mejilla',makeup:'Fiona muestra productos para las pestañas',products:'Fiona sostiene distintos productos de maquillaje de Brilla',brilla:'Fiona muestra una máscara de pestañas y una rizadora de Brilla'},
  en:{hero:'Fiona smiles holding a pink lip product at the Brilla photo shoot',detail:'Fiona holds four pink lip products up to the camera',smile:'Fiona smiles with a skincare product from Brilla',skincare:'Fiona applies a skincare product to her cheek',makeup:'Fiona shows products for lashes',products:'Fiona holds a selection of Brilla makeup products',brilla:'Fiona shows a mascara and a lash curler from Brilla'}
};
async function gallery(direction) {
  const generation=photoIndex;
  const nextIndex=(photoIndex+direction+photoCycle.length)%photoCycle.length;
  const key=photoCycle[nextIndex];
  const prepared=new Image();prepared.src=content.photos[key];
  try{await prepared.decode();}catch{return;}
  if(generation!==photoIndex||motionPaused||galleryPaused||document.hidden||photoDialog.open||videoDialog.open)return;
  photoIndex=(photoIndex+direction+photoCycle.length)%photoCycle.length;
  const img=$('.brilla-photo img');img.src=prepared.src;img.alt=photoDescriptions[lang][key];$('.brilla-photo').setAttribute('aria-label',`${copy[lang].photo}: ${img.alt}`);
  $('.brilla-photo').dataset.photo=key;
  animate(img,[{opacity:.5,transform:'translateX(6%) scale(1.04)'},{opacity:1,transform:'translateX(0) scale(1)'}],{duration:850,easing:'cubic-bezier(.16,1,.3,1)'});
}
function syncGallery(){
  clearInterval(galleryTimer);
  if(galleryVisible&&!galleryPaused&&!motionPaused&&!document.hidden&&!photoDialog.open&&!videoDialog.open)galleryTimer=setInterval(()=>gallery(1),4600);
}
function updateLoopLabels(){
  const c=copy[lang],ribbonStopped=ribbonPaused||motionPaused,galleryStopped=galleryPaused||motionPaused;
  $('.ribbon').classList.toggle('is-paused',ribbonStopped);
  for(const [selector,stopped,pause,resume] of [['.ribbon-toggle',ribbonStopped,c.ribbonPause,c.ribbonResume],['.gallery-toggle',galleryStopped,c.galleryPause,c.galleryResume]]){
    const button=$(selector);button.setAttribute('aria-label',stopped?resume:pause);button.setAttribute('aria-pressed',String(stopped));button.querySelector('use').setAttribute('href',stopped?'#play':'#pause');
  }
}
$('.ribbon-toggle').addEventListener('click',()=>{if(motionPaused){motionPaused=false;ribbonPaused=false;updateMotionLabel();}else{ribbonPaused=!ribbonPaused;updateLoopLabels();}});
$('.gallery-toggle').addEventListener('click',()=>{if(motionPaused){motionPaused=false;galleryPaused=false;updateMotionLabel();}else{galleryPaused=!galleryPaused;updateLoopLabels();syncGallery();}});
new IntersectionObserver(entries=>{galleryVisible=entries[0].isIntersecting;syncGallery();},{threshold:.2}).observe($('.brilla-gallery'));
new IntersectionObserver(entries=>$('.ribbon').classList.toggle('offscreen',!entries[0].isIntersecting),{threshold:0}).observe($('.ribbon'));
$$('[data-image]').forEach(img=>{img.src=content.photos[img.dataset.image];img.addEventListener('error',()=>{img.alt=copy[lang].photoError;});});
$$('.photo-open').forEach(button=>button.addEventListener('click',()=>{
  const img=button.querySelector('img'), full=$('#full-photo');full.src=content.photos[button.dataset.photo];full.alt=img.alt;
  $('.photo-error').hidden=true;photoDialog.showModal();document.body.style.overflow='hidden';syncGallery();
}));
$('#full-photo').addEventListener('error',()=>{$('.photo-error').textContent=copy[lang].photoError;$('.photo-error').hidden=false;});

function openService(details){
  if(details.open)return;
  details.open=true;
  animate(details.querySelector('p'),[{opacity:.3,transform:'translateY(-6px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'cubic-bezier(.16,1,.3,1)'});
}
function revealServices(){
  servicesStarted=true;
  const rows=$$('#service-list details');
  if(motionPaused){rows.forEach(row=>row.open=true);servicesCompleted=true;return;}
  rows.forEach((row,i)=>{const timer=setTimeout(()=>{serviceTimers.delete(timer);openService(row);if(i===rows.length-1)servicesCompleted=true;},i*650);serviceTimers.add(timer);});
}
function renderServices(){
  servicesObserver?.disconnect();serviceTimers.forEach(clearTimeout);serviceTimers.clear();
  $('#service-list').innerHTML=copy[lang].services.map(([title,description])=>`<details><summary><span>${title}</span>${icon('plus')}</summary><p>${description}</p></details>`).join('');
  const rows=$$('#service-list details');
  if(touchLayout.matches){
    rows.forEach(row=>row.querySelector('summary').addEventListener('click',e=>{e.preventDefault();openService(row);}));
    if(servicesCompleted||servicesStarted||motionPaused){rows.forEach(row=>row.open=true);servicesCompleted=true;}
    else{servicesObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){servicesObserver.disconnect();revealServices();}},{threshold:.15});servicesObserver.observe($('#service-list'));}
  }else{
    rows.forEach(row=>{
      let hovered=false,pinned=false;
      row.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;hovered=true;openService(row);});
      row.addEventListener('pointerleave',()=>{hovered=false;if(!pinned&&!row.contains(document.activeElement))row.open=false;});
      row.addEventListener('focusin',()=>openService(row));
      row.addEventListener('focusout',()=>{if(!hovered&&!pinned)row.open=false;});
      row.querySelector('summary').addEventListener('click',e=>{e.preventDefault();pinned=!pinned;row.open=pinned||hovered;});
    });
  }
}
touchLayout.addEventListener('change',renderServices);
function revealRemainingServices(){
  if(!touchLayout.matches)return;
  servicesObserver?.disconnect();serviceTimers.forEach(clearTimeout);serviceTimers.clear();
  $$('#service-list details').forEach(row=>row.open=true);servicesStarted=servicesCompleted=true;
}
for(const [id,direction] of [['archive-previous',-1],['archive-next',1]]){
  $(`#${id}`).addEventListener('click',()=>$('#archive-links').scrollBy({left:direction*$('#archive-links').clientWidth*.75,behavior:motionPaused?'instant':'smooth'}));
}

function renderLanguage() {
  const c=copy[lang];document.documentElement.lang=lang;
  $$('[data-copy]').forEach(el=>{if(typeof c[el.dataset.copy]==='string')el.textContent=c[el.dataset.copy];});
  $$('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
  $('.main-nav').setAttribute('aria-label',lang==='es'?'Principal':'Main navigation');$('.filters').setAttribute('aria-label',lang==='es'?'Filtrar videos':'Filter videos');
  $('.menu-toggle').setAttribute('aria-label',c.menu);$('#archive-previous').setAttribute('aria-label',c.archivePrevious);$('#archive-next').setAttribute('aria-label',c.archiveNext);
  $$('.dialog-close').forEach(b=>b.setAttribute('aria-label',c.close));
  $$('.photo-open').forEach(button=>{const img=button.querySelector('img');img.alt=photoDescriptions[lang][button.dataset.photo];button.setAttribute('aria-label',`${c.photo}: ${img.alt}`);});
  $('#photo-dialog').setAttribute('aria-label',lang==='es'?'Fotografía de Fiona':'Photograph of Fiona');$('.site-header .wordmark').setAttribute('aria-label',lang==='es'?'Fiona Marcela, inicio':'Fiona Marcela, home');
  renderServices();
  $('#archive-links').innerHTML=archive.map((r,i)=>`<a class="archive-film" href="https://www.instagram.com/reel/${r.code}/" target="_blank" rel="noopener noreferrer" aria-label="${c.archiveOpen}: ${c[r.category]}, ${i+1}"><div class="archive-frame"><img src="assets/archive/${r.code}.jpg" alt="" width="360" height="480" loading="lazy"><span class="archive-play">${icon('play')}</span></div><span class="archive-caption"><span>${c[r.category]}</span>${icon('arrow-up-right')}</span></a>`).join('');
  const n = new Intl.NumberFormat(lang==='es'?'es-VE':'en-US',{notation:'compact',maximumFractionDigits:1});
  const pct = new Intl.NumberFormat(lang==='es'?'es-VE':'en-US',{style:'percent',maximumFractionDigits:1});
  $('#metrics').hidden=content.metrics.status==='hidden';
  const publicLabel=content.metrics.publicFollowers?`${c.publicProfile} · ${new Intl.DateTimeFormat(lang==='es'?'es-VE':'en-US',{dateStyle:'medium'}).format(new Date(`${content.metrics.publicDate}T12:00:00Z`))}`:c.demo;
  $('.metric-notice').textContent=content.metrics.publicFollowers?c.metricNoticePublic:c.metricNotice;
  $('#metric-values').innerHTML=[[n.format(content.metrics.instagram),c.instagramMetric,publicLabel],[n.format(content.metrics.reach),c.reachMetric,c.demo],[pct.format(content.metrics.engagement/100),c.engagementMetric,c.demo]].map(([value,label,evidence])=>`<div class="metric"><strong>${value}</strong><span>${label}</span><small>${evidence}</small></div>`).join('');
  if(activeReel){$('#video-title').textContent=activeReel.title[lang];$('#video-description').textContent=activeReel.description[lang];}
  renderReels();updateMotionLabel();updateUrl();
}
$$('[data-lang]').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;renderLanguage();}));
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;renderReels();updateUrl();}));
const menu=$('.menu-toggle');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',copy[lang].menu);$('.main-nav').classList.remove('is-open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='false';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',copy[lang][open?'closeMenu':'menu']);$('.main-nav').classList.toggle('is-open',open);});
$$('.main-nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
function updateMotionLabel(){document.documentElement.classList.toggle('motion-paused',motionPaused);$('#motion-toggle span').textContent=copy[lang][motionPaused?'motionResume':'motionPause'];$('#motion-toggle').setAttribute('aria-pressed',String(motionPaused));$('#motion-toggle use').setAttribute('href',motionPaused?'#play':'#pause');updateLoopLabels();syncGallery();}
$('#motion-toggle').addEventListener('click',()=>{motionPaused=!motionPaused;if(motionPaused){animations.forEach(a=>a.cancel());stopPreviews();revealRemainingServices();}updateMotionLabel();});
reducedMotion.addEventListener('change',e=>{motionPaused=e.matches;if(motionPaused){animations.forEach(a=>a.cancel());stopPreviews();revealRemainingServices();}updateMotionLabel();});
document.addEventListener('visibilitychange',()=>{document.documentElement.classList.toggle('tab-hidden',document.hidden);if(document.hidden){stopPreviews();fullVideo.pause();}syncGallery();});
renderLanguage();
const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  observer.unobserve(entry.target);
  animate(entry.target,[{opacity:.45,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:900,easing:'cubic-bezier(.16,1,.3,1)'});
}),{threshold:.16});
$$('.about-copy,.brilla-copy,.services h2,.contact h2').forEach(el=>observer.observe(el));
animate($('.hero-copy'),[{opacity:.3,transform:'translateY(28px)'},{opacity:1,transform:'translateY(0)'}],{duration:1100,easing:'cubic-bezier(.16,1,.3,1)'});
const portrait=$('.hero-portrait');
animate(portrait,[{opacity:.35,transform:'translate(24px,35px) rotate(-9deg)'},{opacity:1,transform:getComputedStyle(portrait).transform}],{duration:1000,easing:'cubic-bezier(.16,1,.3,1)'});
animate($('.hero-detail'),[{opacity:.3,transform:'translate(40px,50px) rotate(20deg)'},{opacity:1,transform:'translate(0,0) rotate(8deg)'}],{duration:900,delay:180,easing:'cubic-bezier(.16,1,.3,1)'});
let scheduled=false;
function onScroll(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{
  const height=document.documentElement.scrollHeight-innerHeight;
  document.documentElement.style.setProperty('--progress',height>0?scrollY/height:0);
  if(!motionPaused && innerWidth>767){const bounds=$('.about').getBoundingClientRect();document.documentElement.style.setProperty('--shift',`${Math.max(-22,Math.min(22,(bounds.top-innerHeight*.35)*.04))}px`);}
  scheduled=false;
});}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)e.target.pause();}),{threshold:.1}).observe($('#full-video'));
