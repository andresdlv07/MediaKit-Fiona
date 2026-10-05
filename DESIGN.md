# Primera dirección visual: Fiona en primer plano

Estado: propuesta navegable para revisar con Fiona. El usuario autorizó avanzar con los medios disponibles y cifras de muestra, sin una pausa previa de selección.

## Mundo visual
Editorial de belleza con fotografía real y humor cercano. La composición tiene aire, pero cambia de ritmo mediante retratos, detalles de producto, videos verticales y palabras grandes. La marca personal ocupa la apertura; Brilla aparece como proyecto propio más adelante.

## Color
- Papel claro: `#F4EFE8` para lectura y fotografía.
- Morado principal: `#422454` para títulos y cierre.
- Lila: `#E3D3ED` para superficies y contraste de ritmo.
- Marrón: `#523626` para texto, detalles y base de la sección Brilla.
- Marfil: `#FFF9F2` para texto sobre fondos oscuros.
Estos valores son una propuesta basada en morado/marrón confirmados y los fondos cálidos de la sesión; no son colores previamente establecidos por Fiona.

## Tipografía y formas
Instrument Serif regular e italic en titulares y frases clave; DM Sans 400/500/600 en controles, servicios y textos cortos. La cursiva se reserva para un gesto de voz por sección. Imágenes rectangulares; botones de reproducción circulares; controles de navegación y filtros con bordes rectos y líneas. Esas funciones definen la mezcla de formas.

## Recorrido y movimiento
1. Apertura: «Holiss, soy Fiona» con retrato y contacto/portafolio al alcance.
2. Portafolio: videos reales filtrados por beauty, recomendaciones y vlogs; vista previa silenciada al interactuar y reproducción con controles al abrir.
3. Su mirada: frase breve basada en su respuesta sobre el maquillaje y fotos de la sesión.
4. Brilla: primer espacio de creación, con una secuencia visual que se puede cambiar.
5. Formatos: oferta breve y explorable, sin comprometer plazos ni tarifas.
6. Comunidad: cifras de muestra claramente marcadas y reemplazables.
7. Contacto: Instagram, TikTok y WhatsApp visibles y enlazados.

La apertura anima de forma finita; el desplazamiento de fotos depende del scroll y se reduce para móvil. Las vistas previas no se reproducen solas por más de cinco segundos; un botón permite iniciar/detener. `prefers-reduced-motion` conserva imágenes estáticas y lectura completa. El idioma también ajusta etiquetas, composición y accesibilidad.

## Ajustes
El contenido se concentra en `content.js`; `editor.html` permite cambiar medios disponibles y métricas en la vista local, exportar los cambios y restaurar la propuesta. Ningún dato de muestra se convierte automáticamente en dato real.

## Revisión solicitada: 4 de octubre de 2026
- Cinta en loop continuo de derecha a izquierda, sin salto, con pausa discreta y variante estática para movimiento reducido.
- Galería de Brilla automática cada 4,6 segundos mientras está visible. Pausa al ocultar la pestaña, abrir foto/video o detener movimiento. Sin flechas ni contador; solo pausa. Encuadre ajustado para conservar el rostro.
- Servicios por hover o foco en escritorio. En móvil se abren una vez, secuencialmente al entrar en pantalla, y quedan abiertos. Movimiento reducido: todos visibles desde el inicio.
- Más de mis videos: nueve portadas reales en una tira horizontal con navegación accesible, sin lista numerada. Primera persona también en inglés.
- Logo real de Brilla obtenido de su perfil, con su composición y color originales.
- Espacio base entre secciones: padding de 110 a 68 px en escritorio y de 70 a 45 px en móvil; ajustes específicos para las composiciones.
