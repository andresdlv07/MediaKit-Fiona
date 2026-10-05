// Contenido editable. Las cifras son de muestra hasta recibir Insights reales.
export const storageKey = 'fiona-media-kit-v1';
export const defaultContent = {
  photos: {
    hero: 'assets/photos/portrait.webp',
    detail: 'assets/photos/lip-detail.webp',
    smile: 'assets/photos/smile.webp',
    skincare: 'assets/photos/skincare.webp',
    makeup: 'assets/photos/makeup.webp',
    products: 'assets/photos/products.webp',
    brilla: 'assets/photos/brilla.webp',
  },
  reels: [
    { id:'mascara', category:'beauty', src:'assets/videos/mascara.mp4', poster:'assets/videos/mascara-poster.jpg', url:'https://www.instagram.com/reel/DU6tfD8D3HR/', title:{es:'Una rizadora y un buen rímel',en:'A lash curler & a good mascara'}, description:{es:'Una demostración de maquillaje creada para mi tienda, Brilla.',en:'A makeup demonstration created for my own store, Brilla.'}, owner:'@brillastore.ve' },
    { id:'favoritos', category:'recommendations', src:'assets/videos/favoritos.mp4', poster:'assets/videos/favoritos-poster.jpg', url:'https://www.instagram.com/reel/DYCkYNQOSoJ/', title:{es:'Mis favoritos de Farmatodo',en:'My Farmatodo favorites'}, description:{es:'Mis productos favoritos, compartidos desde mi cuenta personal.',en:'My favorite products, shared on my personal account.'}, owner:'@soyfionamarcela' },
    { id:'foticos', category:'vlogs', src:'assets/videos/foticos.mp4', poster:'assets/videos/foticos-poster.jpg', url:'https://www.instagram.com/reel/DNPCipTtIvj/', title:{es:'Un domingo de foticos',en:'A Sunday behind the camera'}, description:{es:'Un vistazo detrás de la sesión de fotos de Brilla.',en:'A peek behind the scenes of the Brilla photo shoot.'}, owner:'@brillastore.ve' },
  ],
  metrics: { status:'sample', period:'', source:'', instagram:777, publicFollowers:true, publicDate:'2026-10-04', reach:48000, engagement:5.8 },
  contact: { instagram:'https://www.instagram.com/soyfionamarcela/', tiktok:'https://www.tiktok.com/@soyfionamarcela', whatsapp:'https://wa.me/584120603827', handle:'@soyfionamarcela', phone:'04120603827' },
};

export function safeMediaUrl(value) {
  if (typeof value !== 'string') return '';
  if (/^assets\/[a-zA-Z0-9/_\-.]+$/.test(value)) return value;
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
}

export function loadContent() {
  const result = structuredClone(defaultContent);
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (!saved || typeof saved !== 'object') return result;
    for (const key of Object.keys(result.photos)) {
      const url = safeMediaUrl(saved.photos?.[key]);
      if (url) result.photos[key] = url;
    }
    for (const reel of result.reels) {
      const change = saved.reels?.find(r => r.id === reel.id);
      for (const key of ['src','poster']) {
        const url = safeMediaUrl(change?.[key]);
        if (url) reel[key] = url;
      }
    }
    for (const key of ['instagram','reach','engagement']) {
      const number = saved.metrics?.[key];
      if (typeof number === 'number' && Number.isFinite(number) && number >= 0 && (key !== 'engagement' || number <= 100)) result.metrics[key] = number;
    }
    if (saved.metrics?.publicFollowers === false || result.metrics.instagram !== defaultContent.metrics.instagram) result.metrics.publicFollowers = false;
    if (saved.metrics?.status === 'hidden') result.metrics.status = 'hidden';
    // Las cifras editadas no se certifican. Solo la consulta de perfil registrada es pública.
  } catch { /* Una preferencia local dañada no impide ver el portafolio. */ }
  return result;
}

export const archive = [
  {category:'vlogs',code:'DQUN-SHEYH-'},{category:'vlogs',code:'Db4LsdavZo_'},{category:'vlogs',code:'DXpENl9DiYr'},
  {category:'beauty',code:'DXu_SJko3Ur'},{category:'beauty',code:'DX-ZFovtGLU'},{category:'beauty',code:'DY7PygIx44k'},
  {category:'beauty',code:'DcR7eYrqRSC'},{category:'beauty',code:'Dchd68hKVTU'},{category:'beauty',code:'Dc9tV7SqQU8'},
];

export const copy = {
  es: {
    skip:'Saltar al contenido', work:'Ver contenido', about:'Sobre mí', contact:'Hablemos', menu:'Abrir menú', closeMenu:'Cerrar menú',
    greeting:'Holiss, soy', heroLine:'Maquillaje, skincare y un poco de mi vida.', location:'Maracaibo, Venezuela', scroll:'Hay más de mí aquí abajo',
    filmTitle:'Dale play.', filmAccent:'Conóceme creando.', all:'Todo', beauty:'Beauty', recommendations:'Recomendaciones', vlogs:'Vlogs',
    play:'Reproducir', preview:'Vista previa', stopPreview:'Detener vista previa', original:'Ver en Instagram', archive:'Más de mis videos',archiveSource:'En mi Instagram',archivePrevious:'Portadas anteriores',archiveNext:'Más portadas',archiveOpen:'Ver uno de mis videos en Instagram',ribbonPause:'Pausar cinta',ribbonResume:'Activar cinta',galleryPause:'Pausar fotos',galleryResume:'Activar fotos',
    quoteStart:'El maquillaje resalta',quoteEnd:'lo que hay en mí.', quoteBody:'Así lo siento yo. Me gusta probar, compartir y recomendar con confianza.',
    brillaStart:'Mi historia empezó',brillaEnd:'con Brilla.', brillaBody:'Mi tienda de maquillaje fue mi primer espacio para crear. Ahí comenzó mucho de lo que hoy comparto como Fiona.', brillaLink:'Visita mi tienda', project:'Mi proyecto propio',
    servicesStart:'Tu marca,', servicesEnd:'mi manera de contarla.',
    services:[['Contenido UGC','Creo videos y fotos para los canales de tu marca.'],['Reels & TikToks','Comparto tutoriales, GRWM y recomendaciones en video.'],['Historias & vlogs','Integro tu producto en una historia de mi día a día.'],['Fotografía','Fotografío maquillaje, skincare y detalles de producto.']],
    serviceNote:'Cada colaboración se cotiza según el proyecto. También estoy abierta a canjes.',
    metricStart:'Mi comunidad',metricEnd:'en cifras.',metricNotice:'Datos de muestra · Cifras ficticias para esta propuesta. Insights reales pendientes.',metricNoticePublic:'Seguidores consultados en el perfil público. Alcance e interacción ficticios; Insights pendientes.',publicProfile:'Perfil público',demo:'DEMO · Dato ficticio',instagramMetric:'Seguidores en Instagram',reachMetric:'Alcance en 30 días',engagementMetric:'Interacción promedio',
    contactStart:'¿Hacemos algo',contactEnd:'bonito?', contactBody:'Cuéntame qué tienes en mente.', message:'Escríbeme', rights:'Fotos de Walery Fotografía · Mi contenido y el de Brilla',
    photo:'Ver fotografía',close:'Cerrar',next:'Siguiente foto',previous:'Foto anterior',motionPause:'Pausar animaciones',motionResume:'Activar animaciones',
    videoError:'No se pudo cargar este video. Puedes verlo en Instagram.',photoError:'No se pudo cargar la imagen.',translationNote:'Video original en español',videoCollection:'Mis videos',
  },
  en: {
    skip:'Skip to content',work:'Watch my work',about:'About me',contact:'Let’s talk',menu:'Open menu',closeMenu:'Close menu',
    greeting:'Holiss, I’m',heroLine:'Makeup, skincare & a little of my everyday life.',location:'Maracaibo, Venezuela',scroll:'There’s more of me below',
    filmTitle:'Press play.',filmAccent:'Meet me through my work.',all:'All',beauty:'Beauty',recommendations:'Recommendations',vlogs:'Vlogs',
    play:'Play',preview:'Preview',stopPreview:'Stop preview',original:'Watch on Instagram',archive:'More of my videos',archiveSource:'On my Instagram',archivePrevious:'Previous covers',archiveNext:'More covers',archiveOpen:'Watch one of my videos on Instagram',ribbonPause:'Pause ribbon',ribbonResume:'Enable ribbon',galleryPause:'Pause photos',galleryResume:'Enable photos',
    quoteStart:'Makeup brings out',quoteEnd:'what’s already in me.',quoteBody:'That’s how I see it. I love trying things, sharing them and recommending with confidence.',
    brillaStart:'My story began',brillaEnd:'with Brilla.',brillaBody:'My makeup store was my first space to create. So much of what I share as Fiona began there.',brillaLink:'Visit my store',project:'My own project',
    servicesStart:'Your brand,',servicesEnd:'my way of telling its story.',
    services:[['UGC content','I create videos and photos for your brand’s channels.'],['Reels & TikToks','I share tutorials, GRWM and recommendations in video.'],['Stories & vlogs','I make your product part of a story from my everyday life.'],['Photography','I photograph makeup, skincare and product details.']],
    serviceNote:'Each collaboration is quoted for the project. I’m also open to product exchanges.',
    metricStart:'My community',metricEnd:'in numbers.',metricNotice:'Sample data · Fictional figures for this proposal. Actual Insights pending.',metricNoticePublic:'Followers checked on the public profile. Reach and engagement are fictional; actual Insights pending.',publicProfile:'Public profile',demo:'DEMO · Fictional data',instagramMetric:'Instagram followers',reachMetric:'Reach over 30 days',engagementMetric:'Average engagement',
    contactStart:'Shall we create',contactEnd:'something lovely?',contactBody:'Tell me what you have in mind.',message:'Message me',rights:'Photos by Walery Fotografía · My content and Brilla’s',
    photo:'View photograph',close:'Close',next:'Next photo',previous:'Previous photo',motionPause:'Pause animations',motionResume:'Enable animations',
    videoError:'This video could not load. You can watch it on Instagram.',photoError:'This image could not load.',translationNote:'Original video in Spanish',videoCollection:'My videos',
  },
};
