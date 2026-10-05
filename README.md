# Fiona · Primera propuesta

Versión local ES/EN con fotos reales, tres videos, composición editorial y contactos directos.

## Repositorio

Repositorio privado: https://github.com/andresdlv07/MediaKit-Fiona. Rama principal: `main`.

Incluye código, medios locales, documentación, skills y evidencia de pruebas. Las dependencias instaladas y los metadatos temporales de descarga se excluyen mediante `.gitignore`. Para instalar las herramientas de desarrollo: `npm ci`.

## Abrir

Ejecutar `npm run dev` en esta carpeta.

- Propuesta: http://localhost:4173
- Editor: http://localhost:4173/editor.html

El servidor funciona solo en este equipo; no hay publicación en internet.

## Edición

El editor guarda medios y cifras en el navegador actual. Recargar el media kit para ver los cambios. Exportar selección genera un JSON para incorporarlo permanentemente en `content.js`; no se aplica automáticamente. Restaurar ofrece Deshacer.

Usar rutas dentro de `assets/` o enlaces HTTPS directos. Un video necesita MP4 y portada; un enlace a un Reel no sustituye el MP4. Textos ES/EN, contactos y contenido inicial están en `content.js`.

## Datos y pendientes

777 seguidores de Instagram: consulta pública del 4 de octubre de 2026, con fecha visible. Alcance de 48.000 e interacción de 5,8 %: ficticios, rotulados DEMO. Guardar cifras en el editor las mantiene ficticias. Antes de publicar, incorporar Insights con período o esconder métricas.

Fiona revisará paleta, textos y selección; confirmar derechos de publicación y condiciones comerciales. Preparar subtítulos completos revisados: los videos conservan audio español y descripción, no transcripción completa ni subtítulos ingleses.

## Verificación y diseño

Taste e Impeccable: composición y movimiento. Humanizer: textos. Web Design Guidelines: accesibilidad y controles. `DESIGN.md` documenta la propuesta; `context.md`, las fuentes; `memory.md`, los pendientes.

Playwright en Chrome: 37/37 comprobaciones aprobadas, sin errores de recursos/JavaScript. Se probaron videos/audio, filtros, ES/EN, galería, Escape/foco, servicios, enlaces, fotos, movimiento reducido y editor. Sin desbordamiento a 360/390/768/1440 px. Tamaños móviles emulados; sin teléfono físico ni Safari. Evidencia en `qa/`. No se afirma conformidad WCAG completa.

Instagram, TikTok y destino de WhatsApp también se abrieron en el navegador interno.

## Revisión de la experiencia
La cinta corre en loop hacia la izquierda y las fotos de Brilla pasan solas mientras están visibles; cada una tiene pausa discreta. Se quitaron las flechas y el contador de Brilla. Los servicios se abren con hover/foco en escritorio; en móvil se despliegan una vez y permanecen abiertos. El portafolio adicional usa nueve portadas reales enlazadas, con la voz en primera persona y menos espacio entre secciones. Se incorporó el logo observado en el perfil de Brilla. Revisión adicional: 24/24 comprobaciones aprobadas en Chrome, incluidos cinco anchos de pantalla.
