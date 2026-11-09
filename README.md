# Cohen & Dabah · sitio web v1

Sitio estático (HTML + CSS + JS, sin build). Se sube tal cual a Vercel.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Página principal |
| `aviso-de-privacidad.html` | Aviso de privacidad (se abre en `/aviso-de-privacidad`) |
| `styles.css` | Estilos y paleta de marca |
| `script.js` | Formulario de contacto. **Aquí están los ajustes del sitio (correo, WhatsApp, formulario).** |
| `fonts/` | DM Sans, servida desde el propio sitio (sin Google Fonts) |
| `favicon.svg`, `apple-touch-icon.png`, `og-image.png` | Ícono del navegador, del iPhone y la imagen al compartir el link |
| `vercel.json` | URLs limpias, cabeceras de seguridad y caché |
| `robots.txt`, `sitemap.xml` | Para Google |

## Antes de publicar: reemplazar datos

1. **Dominio.** Ya configurado: `cohendabah.com`.
2. **Correo.** `contacto@cohendabah.com`. Si usarán otra dirección, cambiarla en `index.html`, `script.js` y `aviso-de-privacidad.html`.
3. **WhatsApp.** En `index.html` y `script.js`, cambiar `5215500000000` y `+52 55 0000 0000`.
4. **Aviso de privacidad.** Completar `[Razón social del despacho]` y `[domicilio completo]`, y revisar el texto completo. Es un borrador.
5. **Socias.** Revisar las dos semblanzas; la de Claris está corta a propósito para completarla.

## Formulario de contacto

Sin configurar nada, el botón **Enviar mensaje** abre el correo de la persona con el mensaje ya escrito.
Para recibir los mensajes directo en su bandeja sin que la persona abra su correo, creen una cuenta en un servicio de formularios (Formspree, Basin u otro), copien la URL que les dan y péguenla en `formEndpoint` dentro de `script.js`.

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
