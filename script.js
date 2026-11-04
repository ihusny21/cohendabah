// Cohen & Dabah — sitio v1
// ---------------------------------------------------------------
// Ajustes del sitio. Cambie estos tres valores y listo.
const SITE = {
  email: "contacto@tudominio.mx",
  whatsapp: "5215500000000",        // formato wa.me: 52 + 1 + 10 dígitos, sin espacios
  // Si contratan un servicio de formularios (Formspree, Basin, etc.), pegue aquí su URL.
  // Vacío = el formulario abre el correo de la persona con el mensaje ya escrito.
  formEndpoint: ""
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

  function setStatus(msg, isError) {
    status.textContent = msg;
    status.classList.toggle("is-error", !!isError);
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
        : "Revise nombre, correo y mensaje; son necesarios para responderle.", true);
      bad.focus();
      return;
    }
    if (document.getElementById("f-web").value) return; // trampa para bots

    const data = Object.fromEntries(new FormData(form).entries());
    delete data.sitio_web;

    if (SITE.formEndpoint) {
      btn.disabled = true;
      setStatus("Enviando…");
      try {
        const res = await fetch(SITE.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        setStatus("Mensaje enviado. Le escribiremos para agendar la reunión.");
      } catch (err) {
        setStatus("No se pudo enviar. Escríbanos directamente a " + SITE.email + ".", true);
      } finally {
        btn.disabled = false;
      }
      return;
    }

    const body = [
      "Nombre: " + data.nombre,
      data.empresa ? "Empresa: " + data.empresa : "",
      "Correo: " + data.correo,
      data.telefono ? "Teléfono: " + data.telefono : "",
      "Tema: " + data.tema,
      "",
      data.mensaje
    ].filter((l, i) => l !== "" || i === 5).join("\n");
    const href = "mailto:" + SITE.email +
      "?subject=" + encodeURIComponent("Contacto desde el sitio: " + data.tema) +
      "&body=" + encodeURIComponent(body);
    window.location.href = href;
    setStatus("Se abrió su correo con el mensaje listo para enviar. Si no se abrió, escríbanos a " + SITE.email + ".");
  });
})();
