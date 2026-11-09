# Cohen & Dabah · sitio web v1

Sitio estático (HTML + CSS + JS, sin build). Se sube tal cual a Vercel.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Página principal |
| `aviso-de-privacidad.html` | Aviso de privacidad (se abre en `/aviso-de-privacidad`) |
| `styles.css` | Estilos y paleta de marca |
| `script.js` | Formulario de contacto. **Aquí están los ajustes: destinatarios y URL del formulario (`formEndpoint`).** |
| `motion.js` | Animaciones al hacer scroll y diagrama de estructura |
| `apps-script/Code.gs` | Código que guarda cada solicitud en Google Sheets y la envía por correo a las socias (no se publica en el sitio) |
| `404.html` | Página para enlaces rotos |
| `fonts/` | DM Sans, servida desde el propio sitio (sin Google Fonts) |
| `favicon.svg`, `apple-touch-icon.png`, `og-image.png` | Ícono del navegador, del iPhone y la imagen al compartir el link |
| `vercel.json` | URLs limpias, cabeceras de seguridad y caché |
| `robots.txt`, `sitemap.xml` | Para Google |

## Antes de publicar: reemplazar datos

1. **Dominio.** Ya configurado: `cohendabah.com`.
2. **Correos.** Las solicitudes llegan a `rebeca@cohendabah.com` y `claris@cohendabah.com` (en `script.js`, `apps-script/Code.gs`, `index.html` y el aviso de privacidad).
3. **Formulario.** Instalar `apps-script/Code.gs` en la hoja "Cohen & Dabah · Contactos del sitio" (pasos al inicio del archivo) y pegar la URL en `formEndpoint` de `script.js`.
4. **Aviso de privacidad.** Completar `[Razón social del despacho]` y `[domicilio completo]`, y revisar el texto completo. Es un borrador.
5. **Preguntas frecuentes.** Revisar las cinco respuestas de la sección de preguntas; también están en los datos estructurados del `<head>` y deben coincidir.
6. **Socias.** Revisar las dos semblanzas; la de Claris está corta a propósito para completarla.

## Formulario de contacto

Cada solicitud se guarda como una fila nueva en la hoja de Google "Cohen & Dabah · Contactos del sitio" y llega por correo a las dos socias. Al responder ese correo, la respuesta va directo a la persona que escribió. La columna **Estado** sirve para marcar el seguimiento (Nuevo, Contactado, Propuesta enviada…).

Mientras `formEndpoint` esté vacío, el botón **Enviar mensaje** abre el correo de la persona con el mensaje ya escrito y dirigido a las dos socias.

## SEO

- Título, descripción, datos estructurados (despacho, socias, sitio y preguntas frecuentes), Open Graph, `sitemap.xml` y `robots.txt` ya están configurados.
- Pendiente fuera del código: dar de alta el dominio en Google Search Console (verificación por registro TXT en IONOS) y enviar `https://cohendabah.com/sitemap.xml`. Opcional: perfil de empresa en Google con zona de servicio Ciudad de México.

## Publicar en Vercel

1. Subir esta carpeta a un repositorio nuevo de GitHub (privado está bien).
2. En vercel.com → **Add New → Project** → importar el repositorio.
3. Framework Preset: **Other**. Build command y Output directory: vacíos. **Deploy**.
4. En el proyecto → **Settings → Domains** → agregar el dominio (y `www.` si lo quieren).
5. Vercel muestra los registros DNS a crear (normalmente un registro A para el dominio raíz y un CNAME para `www`). Crearlos en el panel del proveedor donde compraron el dominio. La propagación tarda de minutos a unas horas; Vercel emite el certificado HTTPS solo.

Cada cambio que se suba a GitHub se publica automáticamente.

**Plan de Vercel:** el plan gratuito (Hobby) es solo para uso personal no comercial. El sitio de un despacho cuenta como comercial, así que corresponde el plan Pro.

## Marca

- Azul medianoche `#14213D` · Rosa mexicano `#D81B72` · Marfil `#FAF5EC` · Gris azulado `#4A5468`
- Tipografía: DM Sans en todo el sitio (Bold para el nombre, Medium para títulos, Regular para texto)
- Símbolo: opción 9b, "C | D con pilar". C en azul (marfil sobre fondo azul), D y pilar en rosa.
