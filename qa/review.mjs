import { chromium } from 'file:///C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],checks=[];
function record(name,value){checks.push({name,pass:!!value});if(!value)console.log('FAIL',name);}
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
await page.goto('http://localhost:4173');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1700);
await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>i.decode().catch(()=>{})));});
record('three actual videos',await page.locator('.reel-card').count()===3);
await page.screenshot({path:'qa/desktop.png'});await page.screenshot({path:'qa/desktop-full.png',fullPage:true});
for(const category of ['beauty','recommendations','vlogs']){
  await page.locator(`[data-filter="${category}"]`).click();record(`filter ${category}`,await page.locator('.reel-card').count()===1);
  await page.locator('.reel-open').click();await page.waitForFunction(()=>document.querySelector('#full-video').currentTime>.1,{timeout:10000});
  record(`video ${category} plays`,await page.locator('#full-video').evaluate(v=>v.duration>10&&!v.paused));
  record(`video ${category} audio track`,await page.locator('#full-video').evaluate(v=>v.webkitAudioDecodedByteCount>0));
  await page.keyboard.press('Escape');record('video closes',await page.locator('#video-dialog').evaluate(d=>!d.open));
}
await page.locator('[data-filter="all"]').click();
await page.locator('[data-lang="en"]').click();record('English',await page.locator('html').getAttribute('lang')==='en'&&(await page.locator('.hero-greeting').innerText())==='Holiss, I’m');
await page.waitForTimeout(650);await page.screenshot({path:'qa/english-full.png',fullPage:true});
await page.locator('[data-lang="es"]').click();
await page.locator('.brilla-gallery').scrollIntoViewIfNeeded();const original=await page.locator('.brilla-photo img').getAttribute('src');await page.waitForTimeout(5500);
record('photo carousel',await page.locator('.brilla-photo img').getAttribute('src')!==original);
await page.locator('.hero-portrait').click();record('photo opens',await page.locator('#photo-dialog').evaluate(d=>d.open));await page.keyboard.press('Escape');
record('photo closes and restores focus',await page.locator('#photo-dialog').evaluate(d=>!d.open)&&await page.locator('.hero-portrait').evaluate(el=>el===document.activeElement));
await page.locator('.service-list summary').first().click();record('service disclosure',await page.locator('.service-list details').first().getAttribute('open')!==null);
for(const [id,url] of [['instagram-link','https://www.instagram.com/soyfionamarcela/'],['tiktok-link','https://www.tiktok.com/@soyfionamarcela'],['whatsapp-link','https://wa.me/584120603827']])record(`${id} destination`,await page.locator(`#${id}`).getAttribute('href')===url);
for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:width<768?844:1000});await page.goto('http://localhost:4173');await page.waitForTimeout(1700);
  record(`no document overflow ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';}await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>i.decode().catch(()=>{})));});
  record(`photos load ${width}`,await page.evaluate(()=>[...document.images].filter(i=>i.getAttribute('src')).every(i=>i.naturalWidth>0)));
  if(width===390){await page.screenshot({path:'qa/mobile.png'});await page.screenshot({path:'qa/mobile-full.png',fullPage:true});await page.locator('.menu-toggle').click();record('mobile menu opens',await page.locator('.main-nav').isVisible());await page.locator('.main-nav a').first().click();record('mobile menu closes',await page.locator('.menu-toggle').getAttribute('aria-expanded')==='false');}
}
await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://localhost:4173');
record('reduced motion',await page.locator('html').evaluate(e=>e.classList.contains('motion-paused')));
record('reduced motion no animations',await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length===0));
await page.goto('http://localhost:4173/editor.html');await page.screenshot({path:'qa/editor.png',fullPage:true});
await page.locator('[name="metric-instagram"]').fill('15300');await page.getByRole('button',{name:'Guardar cambios'}).click();
await page.goto('http://localhost:4173');record('editor persists sample metrics',await page.locator('#metric-values').innerText().then(t=>t.includes('15,3')&&t.includes('Dato ficticio')));
await page.goto('http://localhost:4173/editor.html');await page.locator('[name="metrics-hidden"]').check();await page.getByRole('button',{name:'Guardar cambios'}).click();
await page.goto('http://localhost:4173');record('editor hides metrics',await page.locator('#metrics').isHidden());
await page.goto('http://localhost:4173/editor.html');await page.locator('#reset').click();
await page.goto('http://localhost:4173');record('editor reset restores public follower count',await page.locator('#metrics').isVisible()&&await page.locator('#metric-values').innerText().then(t=>t.includes('777')&&t.includes('Perfil público')));
record('no runtime or resource errors',errors.length===0);
await writeFile('qa/results.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({passed:checks.filter(c=>c.pass).length,total:checks.length,errors}));
await browser.close();
