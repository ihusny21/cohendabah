// Cohen & Dabah — movimiento del sitio
// Todo lo que se mueve va del desorden al orden: el diagrama, el símbolo, las sociedades y los pasos.
(function () {
  "use strict";
  window.__motionReady = true;

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var motion = root.classList.contains("motion") && !reduce;

  var clamp = function (v, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return Math.min(b, Math.max(a, v)); };
  var span = function (t, a, b) { return clamp((t - a) / (b - a)); };
  var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  /* ---------- 1. Revelado al hacer scroll ---------- */
  document.querySelectorAll("[data-reveal-stagger]").forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (el, i) { el.style.setProperty("--d", i * 80 + "ms"); });
  });
  var revealEls = document.querySelectorAll("[data-reveal], [data-reveal-stagger] > *");
  var onceIO = null;
  if (motion && "IntersectionObserver" in window) {
    onceIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        if (e.target._onIn) e.target._onIn();
        onceIO.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { onceIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- 2. Caso: 20 sociedades que se llenan y el contador ---------- */
  var ledger = document.querySelector(".ledger");
  var counter = document.querySelector("[data-count]");
  if (ledger) {
    ledger.querySelectorAll("i").forEach(function (cell, i) { cell.style.setProperty("--d", i * 60 + "ms"); });
    if (onceIO) {
      var target = counter ? parseInt(counter.getAttribute("data-count"), 10) : 0;
      if (counter) counter.textContent = "0";
      ledger._onIn = function () {
        if (!counter) return;
        var start = performance.now(), dur = 20 * 60 + 300;
        (function tick(now) {
          var p = clamp((now - start) / dur);
          counter.textContent = String(Math.round(target * p));
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      };
      onceIO.observe(ledger);
    } else {
      ledger.classList.add("is-in");
    }
  }

  /* ---------- 3. Diagrama: del enredo a la estructura ---------- */
  var ICONS = {
    person: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5.4" r="2.6"/><path d="M3 14c.5-2.8 2.4-4.4 5-4.4s4.5 1.6 5 4.4"/></svg>',
    company: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 14V2.5h7V14M10 6.5h3V14M1.8 14h12.4M5.3 5h2.4M5.3 7.8h2.4M5.3 10.6h2.4"/></svg>',
    property: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 7.6 8 2.8l6 4.8"/><path d="M3.7 6.5V13.5h8.6V6.5"/><path d="M6.8 13.5v-3.3h2.4v3.3"/></svg>',
    doc: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 1.8h6l3 3v9.4h-9z"/><path d="M9.5 1.8v3h3M6 8.2h4.5M6 10.8h4.5"/></svg>',
    holding: ""
  };

  // Posiciones en % del lienzo. b = hoy, a = con estructura.
  var NODES = [
    { id: "fundador", kind: "person", label: "Fundador",
      wide: { b: [13, 21], a: [34, 11] }, tall: { b: [24, 15], a: [28, 7] } },
    { id: "hija", kind: "person", label: "Hija",
      wide: { b: [33, 85], a: [56, 11] }, tall: { b: [26, 87], a: [70, 7] } },
    { id: "exsocio", kind: "person", label: "Exsocio", only: "b", flag: "Aún tiene poderes",
      wide: { b: [87, 14], a: [97, 6] }, tall: { b: [79, 10], a: [96, 2] } },
    { id: "operadora", kind: "company", label: "Operadora", sub: "S.A. de C.V.", flag: "Actas sin protocolizar", check: true,
      wide: { b: [55, 25], a: [17, 66] }, tall: { b: [60, 30], a: [16, 58] } },
    { id: "comercial", kind: "company", label: "Comercializadora", short: "Comercial", sub: "S.A. de C.V.", check: true,
      wide: { b: [15, 56], a: [45, 66] }, tall: { b: [21, 52], a: [47, 58] } },
    { id: "bodega", kind: "property", label: "Bodega", flag: "A nombre del fundador",
      wide: { b: [80, 53], a: [62, 89] }, tall: { b: [76, 57], a: [59, 86] } },
    { id: "local", kind: "property", label: "Local comercial", short: "Local",
      wide: { b: [62, 82], a: [84, 89] }, tall: { b: [62, 77], a: [86, 86] } },
    { id: "holding", kind: "holding", label: "Holding familiar", short: "Holding", sub: "S.A. de C.V.", only: "a",
      wide: { b: [45, 38], a: [45, 38] }, tall: { b: [49, 32], a: [49, 32] } },
    { id: "inmobiliaria", kind: "company", label: "Inmobiliaria", sub: "S.A. de C.V.", only: "a", check: true,
      wide: { b: [73, 66], a: [73, 66] }, tall: { b: [80, 58], a: [80, 58] } },
    { id: "protocolo", kind: "doc", label: "Protocolo familiar", short: "Protocolo", only: "a",
      wide: { b: [80, 11], a: [80, 11] }, tall: { b: [83, 32], a: [83, 32] } }
  ];
  // Hoy: líneas cruzadas. Clase "risk" = problema; "dash" = uso sin papeles.
  var EDGES_B = [
    ["fundador", "operadora", "", 0.12], ["fundador", "comercial", "", -0.18], ["hija", "operadora", "", 0.1],
    ["hija", "comercial", "", 0.16], ["fundador", "bodega", "risk", -0.12], ["hija", "local", "risk", 0.2],
    ["exsocio", "operadora", "risk dash", 0.15], ["operadora", "bodega", "dash", 0.22], ["comercial", "local", "dash", -0.14]
  ];
  // Con estructura: árbol ortogonal.
  var EDGES_A = [
    ["fundador", "holding", "elbow"], ["hija", "holding", "elbow"], ["protocolo", "hija", "vh dash"],
    ["holding", "operadora", "elbow"], ["holding", "comercial", "elbow"], ["holding", "inmobiliaria", "elbow"],
    ["inmobiliaria", "bodega", "elbow"], ["inmobiliaria", "local", "elbow"]
  ];
  var CAPTIONS = [
    "Hoy: las acciones y los inmuebles están a nombre de distintas personas, hay actas pendientes y un exsocio que aún tiene poderes.",
    "Con estructura: la familia arriba con reglas claras, una holding al centro y cada empresa e inmueble en su lugar, al día."
  ];

  var structure = document.getElementById("structure");
  var S = null;
  if (structure) {
    S = {
      el: structure,
      sticky: structure.querySelector(".structure-sticky"),
      stage: structure.querySelector(".structure-stage"),
      svg: structure.querySelector(".structure-lines"),
      caption: document.getElementById("str-caption"),
      before: document.getElementById("str-before"),
      after: document.getElementById("str-after"),
      meter: structure.querySelector(".structure-meter"),
      nodes: {}, pathsB: [], pathsA: [],
      W: 0, H: 0, mode: "wide", t: motion ? 0 : 1, manual: !motion, stuck: true
    };
    var NS = "http://www.w3.org/2000/svg";
    NODES.forEach(function (n) {
      var el = document.createElement("div");
      el.className = "node node--" + n.kind;
      el.setAttribute("aria-hidden", "true");
      el.innerHTML = ICONS[n.kind] +
        '<span class="node-text"><span class="node-label"></span>' + (n.sub ? '<span class="node-sub">' + n.sub + "</span>" : "") + "</span>" +
        (n.flag ? '<span class="node-flag">' + n.flag + "</span>" : "") +
        (n.check ? '<span class="node-check"></span>' : "");
      S.stage.appendChild(el);
      S.nodes[n.id] = { def: n, el: el, label: el.querySelector(".node-label"), x: 0, y: 0 };
    });
    EDGES_B.forEach(function (e) {
      var p = document.createElementNS(NS, "path");
      p.setAttribute("class", "e-b " + e[2]);
      S.svg.appendChild(p); S.pathsB.push({ def: e, el: p });
    });
    EDGES_A.forEach(function (e) {
      var p = document.createElementNS(NS, "path");
      p.setAttribute("class", "e-a " + (e[2].indexOf("dash") > -1 ? "dash" : ""));
      S.svg.appendChild(p); S.pathsA.push({ def: e, el: p });
    });

    var goTo = function (state) {
      if (S.manual || !S.stuck) { S.t = state; renderStructure(); return; }
      var r = S.el.getBoundingClientRect();
      var top = window.scrollY + r.top - S.stickyTop;
      var y = state ? top + (S.el.offsetHeight - S.sticky.offsetHeight) : top;
      window.scrollTo({ top: Math.round(y), behavior: "smooth" });
    };
    S.before.addEventListener("click", function () { goTo(0); });
    S.after.addEventListener("click", function () { goTo(1); });
  }

  function headerHeight() {
    var h = document.querySelector(".site-header");
    return h ? h.getBoundingClientRect().height : 0;
  }

  function layoutStructure() {
    if (!S) return;
    var vh = window.innerHeight;
    var W = S.stage.clientWidth;
    S.mode = W < 620 ? "tall" : "wide";
    S.stage.classList.toggle("is-tall", S.mode === "tall");
    var hh = headerHeight();
    var chrome = 150; // botones + pie del diagrama
    var ideal = S.mode === "tall" ? W / 0.74 : W / 1.62;
    var maxH = vh - hh - chrome;
    var H = Math.round(Math.max(S.mode === "tall" ? 400 : 420, Math.min(ideal, maxH)));
    S.stage.style.height = H + "px";
    S.W = W; S.H = H;
    S.svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    NODES.forEach(function (n) {
      var node = S.nodes[n.id];
      node.label.textContent = S.mode === "tall" && n.short ? n.short : n.label;
    });

    var stickyH = S.sticky.offsetHeight;
    S.stuck = !S.manual && stickyH < vh - hh - 8;
    if (S.stuck) {
      S.stickyTop = Math.round(Math.max(hh + 12, hh + (vh - hh - stickyH) / 2));
      S.sticky.style.position = "";
      S.sticky.style.top = S.stickyTop + "px";
      S.el.style.height = Math.round(stickyH + vh * 0.85) + "px";
    } else {
      S.sticky.style.position = "static";
      S.el.style.height = "";
    }
  }

  function pos(n, t) {
    var L = n.def[S.mode];
    var m = ease(span(t, 0.08, 0.62));
    var x, y;
    if (n.def.only === "b") { var g = span(t, 0.08, 0.5); x = lerp(L.b[0], L.a[0], g); y = lerp(L.b[1], L.a[1], g); }
    else if (n.def.only === "a") { x = L.a[0]; y = L.a[1]; }
    else { x = lerp(L.b[0], L.a[0], m); y = lerp(L.b[1], L.a[1], m); }
    n.x = x / 100 * S.W; n.y = y / 100 * S.H;
  }

  function renderStructure() {
    if (!S || !S.W) return;
    var t = S.t;
    NODES.forEach(function (d) {
      var n = S.nodes[d.id];
      pos(n, t);
      var o = 1, sc = 1;
      if (d.only === "b") o = 1 - span(t, 0.12, 0.45);
      if (d.only === "a") { o = span(t, 0.38, 0.62); sc = 0.85 + 0.15 * o; }
      n.el.style.transform = "translate(" + n.x.toFixed(1) + "px," + n.y.toFixed(1) + "px) translate(-50%,-50%) scale(" + sc.toFixed(3) + ")";
      n.el.style.opacity = o.toFixed(3);
      if (d.flag) n.el.style.setProperty("--flag", (1 - span(t, 0.02, 0.3)).toFixed(3));
      if (d.check) n.el.style.setProperty("--check", span(t, 0.86, 1).toFixed(3));
    });
    var ob = 1 - span(t, 0.04, 0.42);
    S.pathsB.forEach(function (p) {
      var a = S.nodes[p.def[0]], b = S.nodes[p.def[1]];
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, k = p.def[3];
      var cx = mx - dy * k, cy = my + dx * k;
      p.el.setAttribute("d", "M" + a.x.toFixed(1) + " " + a.y.toFixed(1) + " Q" + cx.toFixed(1) + " " + cy.toFixed(1) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1));
      p.el.style.opacity = ob.toFixed(3);
    });
    S.pathsA.forEach(function (p, i) {
      var a = S.nodes[p.def[0]], b = S.nodes[p.def[1]], d, len;
      if (p.def[2].indexOf("vh") === 0) {
        d = "M" + a.x + " " + a.y + " V" + b.y + " H" + b.x;
        len = Math.abs(b.y - a.y) + Math.abs(b.x - a.x);
      } else {
        var ym = (a.y + b.y) / 2;
        d = "M" + a.x + " " + a.y + " V" + ym + " H" + b.x + " V" + b.y;
        len = Math.abs(b.y - a.y) + Math.abs(b.x - a.x);
      }
      p.el.setAttribute("d", d);
      var s0 = 0.55 + i * 0.03, q = span(t, s0, s0 + 0.18);
      if (p.def[2].indexOf("dash") > -1) {
        p.el.style.opacity = q.toFixed(3);
      } else {
        p.el.style.strokeDasharray = len.toFixed(1) + " " + (len + 2).toFixed(1);
        p.el.style.strokeDashoffset = (len * (1 - q)).toFixed(1);
        p.el.style.opacity = q > 0 ? "1" : "0";
      }
    });
    var after = t >= 0.5;
    S.before.setAttribute("aria-pressed", String(!after));
    S.after.setAttribute("aria-pressed", String(after));
    S.meter.style.setProperty("--t", t.toFixed(3));
    var text = CAPTIONS[after ? 1 : 0];
    if (S.caption.textContent !== text) S.caption.textContent = text;
  }

  function scrubStructure(vh) {
    if (!S || S.manual) return;
    var r = S.el.getBoundingClientRect();
    var p;
    if (S.stuck) {
      var range = S.el.offsetHeight - S.sticky.offsetHeight;
      p = clamp((S.stickyTop - r.top) / range);
    } else {
      var sr = S.stage.getBoundingClientRect();
      p = clamp((vh * 0.75 - sr.top) / (vh * 0.6));
    }
    var t = span(p, 0.1, 0.9);
    if (Math.abs(t - S.t) > 0.0005 || !S.drawn) { S.t = t; S.drawn = true; renderStructure(); }
  }

  /* ---------- 4. Práctica: la C y la D se unen al pilar ---------- */
  var mark = document.querySelector(".practice-mark");
  var markParts = mark ? { c: mark.querySelector(".c"), d: mark.querySelector(".d"), pillar: mark.querySelector(".pillar") } : null;
  var practice = document.querySelector(".practice");
  var rule = document.querySelector(".pillar-rule");

  function scrubPractice(vh) {
    if (!mark) return;
    var r = mark.getBoundingClientRect();
    var p = ease(clamp((vh * 0.92 - r.top) / (vh * 0.42)));
    markParts.c.style.transform = "translateX(" + (-(1 - p) * 70).toFixed(1) + "px)";
    markParts.d.style.transform = "translateX(" + ((1 - p) * 70).toFixed(1) + "px)";
    markParts.c.style.opacity = markParts.d.style.opacity = (0.15 + 0.85 * p).toFixed(3);
    markParts.pillar.style.transform = "scaleY(" + (0.05 + 0.95 * clamp(p * 1.4)).toFixed(3) + ")";
    if (practice && rule) {
      var g = practice.getBoundingClientRect();
      rule.style.setProperty("--grow", clamp((vh * 0.8 - g.top) / (g.height * 0.9 || 1)).toFixed(3));
    }
  }

  /* ---------- 5. Pasos: la línea se llena paso por paso ---------- */
  var steps = Array.prototype.slice.call(document.querySelectorAll(".steps li"));
  function scrubSteps(vh) {
    var rowTop = null, col = 0;
    steps.forEach(function (li) {
      var r = li.getBoundingClientRect();
      if (rowTop === null || Math.abs(r.top - rowTop) > 4) { rowTop = r.top; col = 0; } else { col++; }
      var f = clamp((vh * 0.9 - r.top) / (vh * 0.22) - col * 0.45);
      li.style.setProperty("--fill", f.toFixed(3));
      li.classList.toggle("is-dim", f < 0.98);
    });
  }

  /* ---------- 6. Encabezado y fondo del hero ---------- */
  var header = document.querySelector(".site-header");
  var hero = document.querySelector(".hero");
  function scrubChrome(vh) {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - vh;
    if (header) header.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : "0");
    if (hero && y < hero.offsetHeight + 200) hero.style.setProperty("--hero-shift", (y * 0.3).toFixed(1));
  }

  /* ---------- Bucle ---------- */
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    scrubChrome(vh);
    if (!motion) return;
    scrubStructure(vh);
    scrubPractice(vh);
    scrubSteps(vh);
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  function relayout() { layoutStructure(); if (S) renderStructure(); request(); }
  relayout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener("scroll", request, { passive: true });
  var rt = null;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(relayout, 120); });
})();
