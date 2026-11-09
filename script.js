// Cohen & Dabah — formulario de contacto
// ---------------------------------------------------------------
// Ajustes del sitio.
const SITE = {
  // Quienes reciben las solicitudes (también se usan si el formulario no puede enviarse).
  recipients: ["rebeca@cohendabah.com", "claris@cohendabah.com"],
  // URL de la aplicación web de Google Apps Script (termina en /exec).
  // Guarda cada solicitud en la hoja "Cohen & Dabah · Contactos del sitio" y envía el correo a las socias.
  // Vacío = el botón abre el correo de la persona con el mensaje ya escrito.
  formEndpoint: "https://script.google.com/macros/s/AKfycbxXXajmJh0DcS9e-xq6CJMUl79ocIZXVT8y9AYGG_L7yMmmrEO5eew1DmO0VCcJShov/exec"
};
// ---------------------------------------------------------------

(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const btn = form.querySelector('button[type="submit"]');
  const loadedAt = Date.now();
  const contactLine = SITE.recipients.join(" o ");

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.classList.toggle("is-error", kind === "error");
    status.classList.toggle("is-ok", kind === "ok");
  }

  function validate() {
    let firstBad = null;
    ["f-name", "f-email", "f-msg"].forEach((id) => {
      const el = document.getElementById(id);
      const ok = el.value.trim() !== "" && (el.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      el.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok && !firstBad) firstBad = el;
    });
    const consent = document.getElementById("f-consent");
    if (!firstBad && !consent.checked) firstBad = consent;
    return firstBad;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const bad = validate();
    if (bad) {
      setStatus(bad.id === "f-consent"
        ? "Para enviar, marque la casilla del aviso de privacidad."
        : "Revise nombre, correo y mensaje; son necesarios para responderle.", "error");
      bad.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    data.consentimiento = document.getElementById("f-consent").checked;
    data.pagina = location.href;
    data.ms = Date.now() - loadedAt;

    if (SITE.formEndpoint) {
      btn.disabled = true;
      setStatus("Enviando…");
      try {
        // Sin encabezados propios: Apps Script no acepta la verificación previa (CORS) de un JSON.
        const res = await fetch(SITE.formEndpoint, { method: "POST", body: JSON.stringify(data) });
        const out = await res.json();
        if (!out.ok) throw new Error(out.error || "error");
        form.reset();
        setStatus("Mensaje enviado. Le escribiremos para agendar la reunión.", "ok");
      } catch (err) {
        setStatus("No se pudo enviar. Escríbanos directamente a " + contactLine + ".", "error");
      } finally {
        btn.disabled = false;
      }
      return;
    }

    if (data.sitio_web) return; // trampa para bots
    const body = [
      "Nombre: " + data.nombre,
      data.empresa ? "Empresa: " + data.empresa : null,
      "Correo: " + data.correo,
      data.telefono ? "Teléfono: " + data.telefono : null,
      "Tema: " + data.tema,
      "",
      data.mensaje
    ].filter((l) => l !== null).join("\n");
    window.location.href = "mailto:" + SITE.recipients.join(",") +
      "?subject=" + encodeURIComponent("Contacto desde el sitio: " + data.tema) +
      "&body=" + encodeURIComponent(body);
    setStatus("Se abrió su correo con el mensaje listo para enviar. Si no se abrió, escríbanos a " + contactLine + ".");
  });
})();
