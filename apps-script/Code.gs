/** @OnlyCurrentDoc */

/**
 * Cohen & Dabah · Formulario del sitio → Google Sheet + correo a las socias
 *
 * Instalación (una sola vez):
 * 1. Abra la hoja "Cohen & Dabah · Contactos del sitio" → Extensiones → Apps Script.
 * 2. Borre lo que haya, pegue este archivo completo y guarde.
 * 3. Ejecute la función `probar` una vez y acepte los permisos (hoja y correo).
 * 4. Implementar → Nueva implementación → tipo "Aplicación web":
 *      Ejecutar como: Yo · Quién tiene acceso: Cualquier persona → Implementar.
 * 5. Copie la URL que termina en /exec y péguela en `formEndpoint` dentro de script.js.
 *
 * Permisos: @OnlyCurrentDoc limita el acceso a esta hoja únicamente (no a otras hojas ni a Drive).
 * El script solo pide además "Enviar correo en su nombre".
 * Al cambiar el código: Implementar → Gestionar implementaciones → editar → Nueva versión (la URL no cambia).
 */

const RECIPIENTS = ["rebeca@cohendabah.com", "claris@cohendabah.com"];
const SPREADSHEET_ID = "1i3aNZreeJBr_E8hXqcHney9yLcpQCt1FDl-jley4Vf0"; // solo para el enlace en el correo
const HEADERS = ["Fecha", "Nombre", "Empresa", "Correo", "Teléfono", "Tema", "Mensaje", "Aviso de privacidad", "Página", "Estado"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Trampas para bots: campo oculto lleno o envío en menos de 3 segundos.
    if (data.sitio_web || (data.ms && Number(data.ms) < 3000)) return json_({ ok: true });

    const row = {
      nombre: clean_(data.nombre, 120),
      empresa: clean_(data.empresa, 160),
      correo: clean_(data.correo, 160),
      telefono: clean_(data.telefono, 40),
      tema: clean_(data.tema, 80) || "Sin tema",
      mensaje: clean_(data.mensaje, 5000),
      consentimiento: data.consentimiento ? "Aceptado" : "No aceptado",
      pagina: clean_(data.pagina, 200)
    };
    if (!row.nombre || !EMAIL_RE.test(row.correo) || !row.mensaje || !data.consentimiento) {
      return json_({ ok: false, error: "missing_fields" });
    }

    saveRow_(row);
    notify_(row);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: "server_error" });
  }
}

function doGet() {
  return json_({ ok: true, service: "cohen-dabah-contacto" });
}

function saveRow_(row) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([
      new Date(),
      safe_(row.nombre), safe_(row.empresa), safe_(row.correo), safe_(row.telefono),
      safe_(row.tema), safe_(row.mensaje), row.consentimiento, safe_(row.pagina), "Nuevo"
    ]);
  } finally {
    lock.releaseLock();
  }
}

function notify_(row) {
  const fields = [
    ["Nombre", row.nombre], ["Empresa", row.empresa || "—"], ["Correo", row.correo],
    ["Teléfono", row.telefono || "—"], ["Tema", row.tema]
  ];
  const text = fields.map(f => f[0] + ": " + f[1]).join("\n") +
    "\n\nMensaje:\n" + row.mensaje +
    "\n\nResponda a este correo para contestarle directamente." +
    "\nTodas las solicitudes: https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID;
  const html =
    '<div style="font-family:Arial,sans-serif;font-size:14px;color:#14213D;line-height:1.5">' +
    '<p style="margin:0 0 12px;font-size:16px"><b>Nueva solicitud desde cohendabah.com</b></p>' +
    '<table style="border-collapse:collapse">' +
    fields.map(f => '<tr><td style="padding:4px 16px 4px 0;color:#4A5468">' + f[0] + '</td><td style="padding:4px 0"><b>' + esc_(f[1]) + "</b></td></tr>").join("") +
    "</table>" +
    '<p style="margin:16px 0 4px;color:#4A5468">Mensaje</p>' +
    '<p style="margin:0;white-space:pre-wrap">' + esc_(row.mensaje) + "</p>" +
    '<p style="margin:20px 0 0;color:#4A5468;font-size:12px">Responda a este correo para contestarle directamente. ' +
    '<a href="https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '" style="color:#D81B72">Ver todas las solicitudes</a></p></div>';

  MailApp.sendEmail({
    to: RECIPIENTS.join(","),
    replyTo: row.correo,
    name: "Sitio Cohen & Dabah",
    subject: "Nueva solicitud: " + row.nombre + " · " + row.tema,
    body: text,
    htmlBody: html
  });
}

/** Ejecute esta función una vez desde el editor para autorizar y probar. */
function probar() {
  SpreadsheetApp.getActiveSpreadsheet().setSpreadsheetTimeZone("America/Mexico_City");
  const res = doPost({ postData: { contents: JSON.stringify({
    nombre: "Prueba del sitio", empresa: "—", correo: RECIPIENTS[0], telefono: "",
    tema: "Prueba", mensaje: "Mensaje de prueba. Puede borrar esta fila.", consentimiento: true,
    pagina: "editor de Apps Script", ms: 10000
  }) } });
  console.log(res.getContent());
}

function clean_(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}
// Evita que un texto que empieza con = + - @ se ejecute como fórmula en la hoja.
function safe_(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function esc_(v) {
  return String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
