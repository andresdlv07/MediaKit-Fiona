import { defaultContent, loadContent, storageKey, safeMediaUrl } from './content.js';
const form = document.querySelector('#editor-form');
const status = document.querySelector('#editor-status');
const names = {hero:'Retrato de portada',detail:'Detalle de labios',smile:'Retrato sonriente',skincare:'Skincare',makeup:'Maquillaje',products:'Productos',brilla:'Brilla'};
let previousSelection = null;
function render() {
  const data = loadContent();
  document.querySelector('#photo-fields').replaceChildren();
  for(const [key,name] of Object.entries(names)) {
    const field = document.createElement('div');field.className='photo-field';
    const img=document.createElement('img');img.src=data.photos[key];img.alt=name;img.width=80;img.height=100;
    const label=document.createElement('label');label.textContent=name;
    const input=document.createElement('input');input.name=`photo-${key}`;input.value=data.photos[key];input.required=true;input.spellcheck=false;input.autocomplete='off';
    input.addEventListener('input',()=>{input.setCustomValidity('');const url=safeMediaUrl(input.value.trim());if(url)img.src=url;});
    label.append(input);field.append(img,label);document.querySelector('#photo-fields').append(field);
  }
  document.querySelector('#video-fields').replaceChildren();
  for(const reel of data.reels) {
    const field=document.createElement('div');field.className='video-field';
    const img=document.createElement('img');img.src=reel.poster;img.alt=reel.title.es;img.width=140;img.height=195;
    const body=document.createElement('div');body.className='video-inputs';
    const title=document.createElement('h3');title.textContent=reel.title.es;body.append(title);
    for(const [key,name] of [['src','Video MP4'],['poster','Imagen de portada']]) {
      const label=document.createElement('label');label.textContent=name;
      const input=document.createElement('input');input.name=`reel-${reel.id}-${key}`;input.value=reel[key];input.required=true;input.spellcheck=false;input.autocomplete='off';
      input.addEventListener('input',()=>{input.setCustomValidity('');if(key==='poster'){const url=safeMediaUrl(input.value.trim());if(url)img.src=url;}});
      label.append(input);body.append(label);
    }
    field.append(img,body);document.querySelector('#video-fields').append(field);
  }
  for(const key of ['instagram','reach','engagement'])form.elements[`metric-${key}`].value=data.metrics[key];
  form.elements['metrics-hidden'].checked=data.metrics.status==='hidden';
}
function selection() {
  const result={photos:{},reels:[],metrics:{status:form.elements['metrics-hidden'].checked?'hidden':'sample',publicFollowers:false}};
  for(const key of Object.keys(names))result.photos[key]=form.elements[`photo-${key}`].value.trim();
  for(const reel of defaultContent.reels)result.reels.push({id:reel.id,src:form.elements[`reel-${reel.id}-src`].value.trim(),poster:form.elements[`reel-${reel.id}-poster`].value.trim()});
  for(const key of ['instagram','reach','engagement'])result.metrics[key]=Number(form.elements[`metric-${key}`].value);
  return result;
}
function validate() {
  for(const input of form.querySelectorAll('input:not([type=number]):not([type=checkbox])')) {
    input.setCustomValidity(safeMediaUrl(input.value.trim())?'':'Usa un enlace HTTPS directo o una ruta dentro de assets/.');
  }
  return form.reportValidity();
}
form.addEventListener('submit',e=>{
  e.preventDefault();if(!validate())return;
  try{localStorage.setItem(storageKey,JSON.stringify(selection()));document.querySelector('#undo').hidden=true;status.textContent='Cambios guardados en este navegador. Recarga la propuesta para verlos.';}
  catch{status.textContent='El navegador no permitió guardar. Puedes exportar la selección.';}
});
document.querySelector('#export').addEventListener('click',()=>{
  if(!validate())return;
  const url=URL.createObjectURL(new Blob([JSON.stringify(selection(),null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='fiona-seleccion.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  status.textContent='Selección exportada. Los datos de muestra siguen pendientes de verificación.';
});
document.querySelector('#reset').addEventListener('click',()=>{
  try{previousSelection=localStorage.getItem(storageKey);localStorage.removeItem(storageKey);render();document.querySelector('#undo').hidden=!previousSelection;status.textContent='Propuesta inicial restaurada. Recarga el media kit para verla.';}
  catch{status.textContent='El navegador no permitió restaurar los cambios.';}
});
document.querySelector('#undo').addEventListener('click',()=>{
  try{if(previousSelection)localStorage.setItem(storageKey,previousSelection);render();document.querySelector('#undo').hidden=true;status.textContent='Selección anterior recuperada.';}
  catch{status.textContent='El navegador no permitió recuperar la selección.';}
});
render();
