/* mazoti.ma showcase: wires the model data (site_data.js), the text (i18n.js, content.js),
   the JS model copy (model.js) and the chart kit (charts.js) into the page. */
(function () {
  "use strict";
  var D = window.MAZOTI_DATA, S = window.MAZOTI_STRINGS, K = window.MAZOTI_CONTENT;
  var M = window.MazotiModel, C = window.MazotiCharts;

  if (!D) {
    var warn = document.createElement("p");
    warn.style.cssText = "margin:0;padding:12px 16px;background:#fbe3e3;color:#7a1d1d;font-family:system-ui";
    warn.textContent = "site/data/site_data.js is missing. Run: python scripts/build_site_data.py";
    document.body.prepend(warn);
    return;
  }

  var LANGS = ["ar", "fr", "en"];
  var LOCALES = { ar: "ar-MA-u-nu-latn", fr: "fr-MA", en: "en-GB" };
  var PRODUCTS = ["gasoil", "ssp"];
  var GROUPS = ["product_cost", "taxes", "margins"];
  var GROUP_OF = {
    cif: "product_cost", approach: "product_cost", tic: "taxes", vat: "taxes",
    gross_margin: "margins", station_margin: "margins"
  };
  var GROUP_COLOR = { product_cost: "var(--s1)", taxes: "var(--s2)", margins: "var(--s3)" };
  var SUBTOTAL_COLOR = "var(--neutral-mark)";
  /* Which label each figure carries: CC-reported, model-implied, press/legal, illustrative. */
  var PROV = {
    cif: "cc", approach: "model", tic: "press", gross_margin: "cc", station_margin: "model", vat: "press",
    purchase_cost: "cc", cession_price: "cc", ex_vat: "model", pump: "cc"
  };
  var PROV_ICON = { cc: "●", model: "◐", press: "○", illus: "◇" };
  var ST_ICON = { verified: "✓", seen: "○", secondary: "◐", to_verify: "?", from_memory: "…", illustrative: "◇" };
  var SRC_CATS = ["cc", "official", "tax", "market", "proxy", "prior", "academic"];
  var STATUSES = ["verified", "seen", "secondary", "to_verify", "from_memory"];
  var VAT = D.constants.vat_rate.value;

  var langNow = document.documentElement.lang;
  var state = {
    lang: LANGS.indexOf(langNow) >= 0 ? langNow : "ar",
    s1Product: "gasoil",
    bProduct: "gasoil",
    b: null,
    conv: null,
    stockDays: D.inventory.default_stock_days,
    rule: "replacement",
    calc: { dcif: D.pass_through.gasoil.delta_cif, dpump: D.pass_through.gasoil.delta_pump },
    srcStatus: "all",
    srcQuery: "",
    openTables: {}
  };
  var check = M.selfCheck(D.reference_cases);
  if (check.failed.length) console.warn("JS model differs from Python on:", check.failed);

  /* ---------- Text and number helpers ---------- */
  function t(key, args) {
    var e = S[key], s;
    if (!e) { console.warn("missing string:", key); s = key; }
    else s = e[state.lang] != null ? e[state.lang] : e.en;
    if (args) s = s.replace(/\{(\w+)\}/g, function (m, k) { return k in args ? args[k] : m; });
    return s;
  }
  function L(obj) { return obj ? (obj[state.lang] || obj.en) : ""; }

  var nfCache = {};
  function nf(opts) {
    var k = state.lang + JSON.stringify(opts);
    if (!nfCache[k]) nfCache[k] = new Intl.NumberFormat(LOCALES[state.lang], opts);
    return nfCache[k];
  }
  /* Arabic number formats carry bidi marks (U+061C, U+200E/F) around signs and percent
     signs. Strip them, then isolate each number as a left-to-right run so "+2,92" and
     "31,4%" keep their order inside Arabic text. */
  function clean(s) { return s.replace(/[؜‎‏]/g, ""); }
  function iso(s) { return "⁦" + s + "⁩"; }
  function num(v, d) { if (d == null) d = 2; return clean(nf({ minimumFractionDigits: d, maximumFractionDigits: d }).format(v)); }
  function N(v, d) { return iso(num(v, d)); }
  function signedN(v, d) {
    if (d == null) d = 2;
    return iso(clean(nf({ minimumFractionDigits: d, maximumFractionDigits: d, signDisplay: "exceptZero" }).format(v)));
  }
  function pctPlain(v, d) { if (d == null) d = 1; return clean(nf({ style: "percent", minimumFractionDigits: d, maximumFractionDigits: d }).format(v)); }
  function P(v, d) { return iso(pctPlain(v, d)); }
  function mad(v, d) { return t("unit.madl", { x: N(v, d) }); }
  function madSigned(v, d) { return t("unit.madl", { x: signedN(v, d) }); }
  function madAmt(v, d) { return t("unit.mad", { x: N(v, d) }); }
  function fmtDate(s) {
    if (!s || !/^\d{4}-\d{2}(-\d{2})?$/.test(s)) return s;
    var p = s.split("-").map(Number);
    var dt = new Date(Date.UTC(p[0], p[1] - 1, p[2] || 1));
    var opts = p[2] ? { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
      : { month: "long", year: "numeric", timeZone: "UTC" };
    return new Intl.DateTimeFormat(LOCALES[state.lang], opts).format(dt);
  }
  function range(a, b, step) {
    var out = [], n = Math.round((b - a) / step);
    for (var i = 0; i <= n; i++) out.push(+(a + i * step).toFixed(6));
    return out;
  }
  function niceBounds(values, step, includeZero) {
    var lo = Math.min.apply(null, values), hi = Math.max.apply(null, values);
    if (includeZero) { lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
    lo = Math.floor(lo / step + 1e-9) * step;
    hi = Math.ceil(hi / step - 1e-9) * step;
    if (hi - lo < step) hi = lo + step;
    return { min: lo, max: hi, ticks: range(lo, hi, step) };
  }

  /* ---------- DOM helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function h(tag, attrs) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = v; /* only for our own i18n strings */
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    });
    for (var i = 2; i < arguments.length; i++) {
      [].concat(arguments[i]).forEach(function (c) {
        if (c == null || c === false) return;
        e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
    }
    return e;
  }
  function provChip(kind) {
    return h("span", { "class": "prov prov-" + kind, title: t("prov." + kind + ".desc") },
      h("span", { "class": "prov-icon", "aria-hidden": "true", text: PROV_ICON[kind] }), t("prov." + kind));
  }
  function badge(status) {
    var hasDesc = !!S["st." + status + ".desc"];
    return h("span", { "class": "badge badge-" + status, title: hasDesc ? t("st." + status + ".desc") : null },
      h("span", { "aria-hidden": "true", text: ST_ICON[status] || "•" }), t("st." + status));
  }
  /* A source is a URL, a URL followed by a note, or plain text (e.g. a docs path). */
  function srcLink(source) {
    var m = source && source.match(/https?:\/\/[^\s'")]+/);
    if (!m) return h("span", { "class": "src-text", dir: "ltr", text: source || t("s8.nolink") });
    var url = m[0], host;
    try { host = new URL(url).hostname.replace(/^www\./, ""); } catch (e) { host = url; }
    var link = h("a", { href: url, target: "_blank", rel: "noopener noreferrer", dir: "ltr", title: url }, host);
    var note = source.replace(url, "").trim();
    if (!note) return link;
    return h("span", { dir: "ltr" }, link, " ", h("span", { "class": "src-text", text: note }));
  }
  function sourceLine(host, items) {
    var nodes = [h("span", { text: t("common.source") + ":" })];
    items.forEach(function (it, i) {
      if (i) nodes.push(h("span", { "aria-hidden": "true", text: "·" }));
      nodes.push(srcLink(it.source));
      if (it.status) nodes.push(badge(it.status));
      if (it.as_of && /^\d{4}-\d{2}/.test(it.as_of)) nodes.push(h("span", { text: t("common.as_of", { d: fmtDate(it.as_of) }) }));
    });
    host.replaceChildren.apply(host, nodes);
  }
  function figure(host, value, unitText) {
    host.replaceChildren(document.createTextNode(N(value)), h("span", { "class": "unit", text: unitText }));
  }
  function legendItems(host, items) {
    host.replaceChildren.apply(host, items.map(function (it) {
      var key = it.kind === "line" ? h("span", { "class": "line-key" })
        : it.kind === "dot" ? h("span", { "class": "swatch", style: "border-radius:50%" })
        : it.kind === "ref" ? h("span", { "class": "ref-key" })
        : h("span", { "class": "swatch" });
      if (it.color) key.style.background = it.color;
      return h("span", { "class": "key" }, key, it.label);
    }));
  }
  function tableToggle(slotId, specFn) {
    var slot = $(slotId);
    var open = !!state.openTables[slotId];
    var btn = h("button", {
      type: "button", "class": "table-toggle", "aria-expanded": String(open),
      text: t(open ? "common.hide_table" : "common.show_table")
    });
    var box = h("div", { "class": "table-scroll" });
    if (open) C.table(box, specFn()); else box.hidden = true;
    btn.addEventListener("click", function () {
      state.openTables[slotId] = !state.openTables[slotId];
      tableToggle(slotId, specFn);
      $(slotId).querySelector(".table-toggle").focus();
    });
    slot.replaceChildren(btn, box);
  }
  function groupParts(groups) {
    return GROUPS.map(function (g) { return { key: g, label: t("grp." + g), value: groups[g], color: GROUP_COLOR[g] }; });
  }
  function segOpts() {
    return {
      fmtValue: function (v) { return mad(v); },
      fmtShare: function (v) { return pctPlain(v, 0); },
      tipShare: function (v) { return t("common.share_of_pump", { x: P(v) }); }
    };
  }

  /* ---------- Static text ---------- */
  function applyStatic() {
    var root = document.documentElement;
    root.lang = state.lang;
    root.dir = state.lang === "ar" ? "rtl" : "ltr";
    document.title = t("doc.title");
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", t("doc.description"));
    document.querySelectorAll("[data-i18n]").forEach(function (e) { e.textContent = t(e.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-html]").forEach(function (e) { e.innerHTML = t(e.getAttribute("data-i18n-html")); });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (e) {
      e.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        e.setAttribute(bits[0], t(bits[1]));
      });
    });
    document.querySelectorAll("[data-prov]").forEach(function (e) { e.replaceChildren(provChip(e.getAttribute("data-prov"))); });
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === state.lang));
    });
  }

  function syncSegControls() {
    document.querySelectorAll(".seg-control[data-control]").forEach(function (g) {
      var v = state[g.getAttribute("data-control")];
      g.querySelectorAll("button[data-value]").forEach(function (b) {
        var on = b.getAttribute("data-value") === v;
        b.setAttribute("aria-checked", String(on));
        b.tabIndex = on ? 0 : -1;
      });
    });
  }

  /* ---------- Hero and context ---------- */
  function renderHero() {
    var s = D.structure.gasoil;
    figure($("heroPump"), s.reported.pump, t("unit.madl.short"));
    C.segBar($("heroSeg"), groupParts(s.groups), segOpts());
  }

  function renderContext() {
    var c = D.context;
    var tiles = [
      { value: fmtDate(c.liberalisation.value), label: t("ctx.liberalisation"), fact: c.liberalisation },
      { value: t("ctx.revisions.value"), label: t("ctx.revisions"), fact: c.revisions },
      { value: t("unit.bn_mad", { x: N(c.settlement.value / 1e9, 2) }), label: t("ctx.settlement"), fact: c.settlement },
      { value: N(c.distributors_followed.value, 0), label: t("ctx.distributors"), fact: c.distributors_followed }
    ];
    $("contextGrid").replaceChildren.apply($("contextGrid"), tiles.map(function (x) {
      return h("div", { "class": "ctx-tile" },
        h("div", { "class": "ctx-value", text: x.value }),
        h("div", { "class": "ctx-label", text: x.label }),
        h("div", { "class": "ctx-meta" }, badge(x.fact.status), srcLink(x.fact.source)));
    }));
  }

  /* ---------- 1. Structure ---------- */
  function structureRows(s) {
    var c = s.components, sub = s.subtotals, run = 0;
    function step(key) {
      var r = { key: key, label: t("comp." + key), value: c[key], start: run, end: run + c[key],
        color: GROUP_COLOR[GROUP_OF[key]], prov: PROV[key], desc: t("comp." + key + ".desc") };
      run += c[key];
      return r;
    }
    function total(key) {
      return { key: key, label: t("sub." + key), value: sub[key], start: 0, end: sub[key], total: true,
        color: SUBTOTAL_COLOR, prov: PROV[key], desc: t("sub.desc") };
    }
    return [step("cif"), step("approach"), step("tic"), total("purchase_cost"), step("gross_margin"),
      total("cession_price"), step("station_margin"), total("ex_vat"), step("vat"), total("pump")];
  }

  function renderStructure() {
    var s = D.structure[state.s1Product];
    var pump = s.reported.pump;
    figure($("s1Pump"), pump, t("unit.madl.short"));
    C.segBar($("s1Seg"), groupParts(s.groups), segOpts());
    $("s1Points").replaceChildren(
      h("li", { html: t("s1.point.taxes", { x: P(s.tax_share) }) }),
      h("li", { text: t("s1.point.tic", { x: mad(s.components.tic) }) }),
      h("li", { text: t("s1.point.implied") }),
      h("li", { "class": "small", text: t("s1.note.margin", { a: mad(s.components.gross_margin), b: mad(s.reported.weighted_gross_margin) }) })
    );

    legendItems($("s1Legend"), GROUPS.map(function (g) { return { color: GROUP_COLOR[g], label: t("grp." + g) }; })
      .concat([{ color: SUBTOTAL_COLOR, label: t("grp.subtotal") }]));

    var rows = structureRows(s);
    var max = 14, ticks = range(0, max, 2);
    C.waterfall($("s1Waterfall"), rows, {
      max: max, ticks: ticks,
      fmtValue: function (v) { return N(v); },
      fmtTick: function (v) { return num(v, 0); },
      provChip: provChip,
      tip: function (r) {
        return {
          title: r.label,
          rows: [{ key: "rect", color: r.color, value: mad(r.value), label: t("common.share_of_pump", { x: P(r.value / pump) }) }],
          note: r.desc + " · " + t("prov." + r.prov)
        };
      }
    });
    tableToggle("s1Table", function () {
      return {
        caption: t("s1.waterfall_title") + " · " + t("product." + state.s1Product),
        head: [{ text: t("common.component") }, { text: t("unit.madl.short"), num: true }, { text: t("common.share"), num: true }, { text: t("common.label") }],
        rows: rows.map(function (r) { return [r.label, N(r.value), P(r.value / pump), t("prov." + r.prov)]; })
      };
    });
    sourceLine($("s1Source"), [{ source: s.source, status: s.status, as_of: s.as_of },
      { source: D.constants["tic_" + state.s1Product].source, status: D.constants["tic_" + state.s1Product].status }]);
  }

  /* ---------- 2. Builder ---------- */
  var SLIDERS = [
    { key: "cif", comp: "cif", min: 2, max: 10, step: 0.01 },
    { key: "approach", comp: "approach", min: 0, max: 0.5, step: 0.01 },
    { key: "gm", comp: "gross_margin", min: 0, max: 3, step: 0.01 },
    { key: "sm", comp: "station_margin", min: 0, max: 1.5, step: 0.01 }
  ];
  function resetBuilder() {
    var c = D.structure[state.bProduct].components;
    state.b = { cif: c.cif, approach: c.approach, gm: c.gross_margin, sm: c.station_margin };
    state.conv = { quote: D.converter_example.quote_usd_per_t, fx: D.converter_example.usdmad,
      density: D.constants["density_" + state.bProduct].value };
  }
  function builderStructure() {
    var b = state.b;
    return M.buildUp(b.cif, D.constants["tic_" + state.bProduct].value, b.approach, b.gm, b.sm, VAT);
  }

  function renderBuilder() {
    if (!state.b) resetBuilder();
    var host = $("bSliders");
    host.replaceChildren.apply(host, SLIDERS.map(function (sl) {
      var id = "slider-" + sl.key;
      var out = h("output", { "class": "slider-value", "for": id, id: id + "-out" });
      var input = h("input", { type: "range", id: id, min: sl.min, max: sl.max, step: sl.step, value: state.b[sl.key] });
      input.addEventListener("input", function () {
        state.b[sl.key] = parseFloat(input.value);
        out.textContent = mad(state.b[sl.key]);
        updateBuilder();
      });
      out.textContent = mad(state.b[sl.key]);
      return h("div", { "class": "slider-row" },
        h("div", { "class": "slider-head" }, h("label", { "for": id }, t("comp." + sl.comp), provChip(PROV[sl.comp])), out),
        input,
        h("p", { "class": "slider-desc", text: t("comp." + sl.comp + ".desc") }));
    }));

    var tic = D.constants["tic_" + state.bProduct];
    $("bFixed").replaceChildren(
      h("span", { "class": "fixed-title", text: t("s2.fixed") + ":" }),
      h("span", { "class": "fixed-pill" }, t("comp.tic") + " ", h("strong", { text: mad(tic.value) }), badge(tic.status)),
      h("span", { "class": "fixed-pill" }, t("comp.vat") + " ", h("strong", { text: P(VAT, 0) }), badge(D.constants.vat_rate.status))
    );
    $("bRule").innerHTML = t("s2.rule", { a: madAmt(1), b: madAmt(M.fullPassThrough(1, VAT)) });
    renderConverter();
    updateBuilder();
  }

  function renderConverter() {
    var cv = state.conv;
    function field(key, label, unit, step) {
      var input = h("input", { type: "number", inputmode: "decimal", step: step, value: cv[key], id: "conv-" + key });
      input.addEventListener("input", function () {
        var v = parseFloat(input.value);
        if (isFinite(v)) { cv[key] = v; updateConv(); }
      });
      return h("label", { "class": "field", "for": "conv-" + key }, label + " (" + unit + ")", input);
    }
    var result = h("strong", { id: "convResult" });
    var useBtn = h("button", { type: "button", "class": "btn", text: t("s2.convert.use") });
    useBtn.addEventListener("click", function () {
      var cif = M.quoteToMadPerL(cv.quote, cv.fx, cv.density);
      state.b.cif = Math.max(2, Math.min(10, cif));
      var input = $("slider-cif");
      input.value = state.b.cif;
      $("slider-cif-out").textContent = mad(state.b.cif);
      updateBuilder();
    });
    $("bConverter").replaceChildren(
      h("div", { "class": "conv-grid" },
        field("quote", t("s2.convert.quote"), t("unit.usd_t"), "1"),
        field("fx", t("s2.convert.fx"), t("unit.mad_usd"), "0.01"),
        field("density", t("s2.convert.density"), t("unit.kg_l"), "0.001")),
      h("div", { "class": "math", "data-tex": "c = Q \\times X \\times \\frac{d}{1000}" }),
      h("div", { "class": "conv-result" }, h("span", { text: "=" }), result, useBtn),
      h("p", { "class": "small muted", text: t("s2.convert.note") })
    );
    updateConv();
  }
  function updateConv() {
    var cv = state.conv;
    var el = $("convResult");
    if (el) el.textContent = mad(M.quoteToMadPerL(cv.quote, cv.fx, cv.density));
  }

  function updateBuilder() {
    var s = builderStructure();
    var ref = D.structure[state.bProduct].reported.pump;
    figure($("bPump"), s.pump, t("unit.madl.short"));
    var d = s.pump - ref;
    $("bDelta").textContent = Math.abs(d) < 0.005 ? t("s2.same_as_ref") : t("s2.vs_ref", { x: madSigned(d) });
    $("bShare").textContent = t("s2.tax_share", { x: P(s.tax_share) });
    C.segBar($("bSeg"), groupParts({
      product_cost: s.cif + s.approach, taxes: s.tic + s.vat, margins: s.gross_margin + s.station_margin
    }), segOpts());
    renderBuilderChart(s);
  }

  function renderBuilderChart(cur) {
    var p = state.bProduct, other = p === "gasoil" ? "ssp" : "gasoil", b = state.b;
    var co = D.structure[other].components;
    var ticP = D.constants["tic_" + p].value, ticO = D.constants["tic_" + other].value;
    var xs = range(2, 10, 0.1);
    var sel = xs.map(function (x) { return [x, M.buildUp(x, ticP, b.approach, b.gm, b.sm, VAT).tax_share]; });
    var oth = xs.map(function (x) { return [x, M.buildUp(x, ticO, co.approach, co.gross_margin, co.station_margin, VAT).tax_share]; });
    var ys = sel.concat(oth).map(function (q) { return q[1]; });
    var yb = niceBounds(ys, 0.1, false);
    var selLabel = t("product." + p), othLabel = t("s2.chart.other", { x: t("product." + other) });
    legendItems($("bChartLegend"), [
      { kind: "line", color: "var(--s2)", label: selLabel },
      { kind: "line", color: "var(--emph-gray)", label: othLabel },
      { kind: "dot", color: "var(--s2)", label: t("s2.chart.you") }
    ]);
    C.lineChart($("bChart"), {
      height: 270,
      x: { min: 2, max: 10, ticks: [2, 4, 6, 8, 10], fmt: function (v) { return num(v, 0); }, label: t("s2.chart.x") },
      y: { min: yb.min, max: yb.max, ticks: yb.ticks, fmt: function (v) { return pctPlain(v, 0); } },
      series: [
        { key: "other", label: othLabel, endLabel: t("product." + other), color: "var(--emph-gray)", points: oth },
        { key: "sel", label: selLabel, endLabel: selLabel, color: "var(--s2)", points: sel }
      ],
      marker: { x: b.cif, y: cur.tax_share, color: "var(--s2)", label: t("s2.chart.you") },
      endLabels: true,
      endPad: 84,
      ariaLabel: t("s2.chart.title"),
      tipTitle: function (x) { return t("comp.cif") + ": " + mad(x); },
      tipValue: function (y) { return P(y); }
    });
    tableToggle("bChartTable", function () {
      return {
        caption: t("s2.chart.title"),
        head: [{ text: t("comp.cif") + " (" + t("unit.madl.short") + ")", num: true }, { text: selLabel, num: true }, { text: othLabel, num: true }],
        rows: xs.filter(function (_, i) { return i % 10 === 0; }).map(function (x) {
          var i = Math.round((x - 2) / 0.1);
          return [N(x), P(sel[i][1]), P(oth[i][1])];
        })
      };
    });
  }

  /* ---------- 3. Pass-through ---------- */
  function renderPassThrough() {
    var pt = D.pass_through;
    var rawLabel = t("s3.series.raw"), adjLabel = t("s3.series.adj");
    var maxVal = Math.max.apply(null, PRODUCTS.map(function (p) { return Math.max(pt[p].raw, pt[p].adjusted); }));
    var max = Math.max(1.2, Math.ceil(maxVal * 5) / 5);
    legendItems($("ptLegend"), [
      { color: "var(--emph-gray)", label: rawLabel },
      { color: "var(--s1)", label: adjLabel },
      { kind: "ref", label: t("s3.full") + " = " + P(1, 0) }
    ]);
    C.hbars($("ptChart"), PRODUCTS.map(function (p) {
      return {
        label: t("product." + p),
        bars: [
          { key: "raw", label: rawLabel, value: pt[p].raw, color: "var(--emph-gray)", valueText: P(pt[p].raw) },
          { key: "adj", label: adjLabel, value: pt[p].adjusted, color: "var(--s1)", valueText: P(pt[p].adjusted) }
        ]
      };
    }), { max: max, ticks: range(0, max, 0.2), fmtTick: function (v) { return pctPlain(v, 0); }, ref: { value: 1 } });
    tableToggle("ptTable", function () {
      return {
        caption: t("s3.chart.title"),
        head: [{ text: t("s5.col.product") }, { text: t("s3.calc.dcif"), num: true }, { text: t("s3.calc.dpump"), num: true },
          { text: t("s3.calc.raw"), num: true }, { text: t("s3.calc.adj"), num: true }],
        rows: PRODUCTS.map(function (p) {
          return [t("product." + p), signedN(pt[p].delta_cif), signedN(pt[p].delta_pump), P(pt[p].raw), P(pt[p].adjusted)];
        })
      };
    });
    $("ptEpisodes").replaceChildren.apply($("ptEpisodes"), PRODUCTS.map(function (p) {
      return h("li", { html: t("s3.episode", { p: t("product." + p), a: madSigned(pt[p].delta_cif), b: madSigned(pt[p].delta_pump) }) });
    }));
    $("ptHypothesis").textContent = t("s3.hypothesis", { x: P(pt.gasoil.raw) });
    sourceLine($("ptSource"), [{ source: pt.gasoil.source, status: pt.gasoil.status, as_of: pt.gasoil.as_of }]);
    renderCalc();
  }

  function renderCalc() {
    var cs = state.calc;
    function field(key, label) {
      var input = h("input", { type: "number", inputmode: "decimal", step: "0.01", value: cs[key], id: "calc-" + key });
      input.addEventListener("input", function () {
        var v = parseFloat(input.value);
        cs[key] = isFinite(v) ? v : NaN;
        updateCalc();
      });
      return h("label", { "class": "field", "for": "calc-" + key }, label + " (" + t("unit.madl.short") + ")", input);
    }
    function stat(id, label) {
      return h("div", { "class": "calc-stat" }, h("div", { "class": "label", text: label }), h("div", { "class": "value", id: id }));
    }
    $("ptCalc").replaceChildren(
      h("div", { "class": "conv-grid" }, field("dcif", t("s3.calc.dcif")), field("dpump", t("s3.calc.dpump"))),
      h("div", { "class": "calc-out" }, stat("calcRaw", t("s3.calc.raw")), stat("calcAdj", t("s3.calc.adj"))),
      h("p", { "class": "small muted", id: "calcFull", "aria-live": "polite" })
    );
    updateCalc();
  }
  function updateCalc() {
    var cs = state.calc;
    var ok = isFinite(cs.dcif) && isFinite(cs.dpump) && Math.abs(cs.dcif) > 1e-9;
    $("calcRaw").textContent = ok ? P(M.passThroughRate(cs.dpump, cs.dcif, VAT, false)) : "–";
    $("calcAdj").textContent = ok ? P(M.passThroughRate(cs.dpump, cs.dcif, VAT, true)) : "–";
    $("calcFull").textContent = ok ? t("s3.calc.full", { x: madSigned(M.fullPassThrough(cs.dcif, VAT)) }) : t("s3.calc.invalid");
  }

  /* ---------- 4. Stocks ---------- */
  function stockSeries() {
    var inv = D.inventory;
    var k = inv.cif_path.map(function (c) { return c + inv.approach + inv.tic; });
    var w = M.wacWeight(state.stockDays, inv.period_days);
    var A = M.weightedAverageCost(k, w);
    var S2 = (state.rule === "replacement" ? k : A).map(function (v) { return v + inv.gross_margin; });
    return {
      w: w, k: k, A: A,
      mBook: S2.map(function (s, i) { return s - A[i]; }),
      mRepl: S2.map(function (s, i) { return s - k[i]; })
    };
  }

  function renderStocks() {
    var id = "stock-days";
    var out = h("output", { "class": "slider-value", "for": id });
    var weight = h("p", { "class": "slider-desc" });
    var input = h("input", { type: "range", id: id, min: 0, max: 90, step: 5, value: state.stockDays });
    function label() {
      out.textContent = t("unit.days", { x: N(state.stockDays, 0) });
      weight.textContent = t("s4.weight", { x: P(M.wacWeight(state.stockDays, D.inventory.period_days), 0) });
    }
    input.addEventListener("input", function () {
      state.stockDays = parseInt(input.value, 10);
      label();
      drawStockCharts();
    });
    label();
    $("stDays").replaceChildren(
      h("div", { "class": "slider-head" }, h("label", { "class": "control-label", "for": id, text: t("s4.days") }), out),
      input, weight);

    var f = D.inventory.stock_facts;
    var facts = $("stFacts");
    facts.replaceChildren(
      document.createTextNode(t("s4.facts", {
        a: t("unit.days", { x: N(f.legal_minimum_days.value, 0) }),
        b: t("unit.days", { x: N(f.reported_days.value.gasoil, 0) }),
        c: t("unit.days", { x: N(f.reported_days.value.ssp, 0) })
      }) + " "),
      srcLink(f.reported_days.source)
    );
    drawStockCharts();
  }

  function drawStockCharts() {
    var s = stockSeries();
    var xs = s.k.map(function (_, i) { return i + 1; });
    function pts(arr) { return arr.map(function (v, i) { return [xs[i], v]; }); }
    var xTicks = [1, 6, 12, 18, 24];
    var tipTitle = function (x) { return t("common.fortnight_n", { x: N(x, 0) }); };
    var tipValue = function (y) { return mad(y); };
    var repl = t("s4.series.replacement"), book = t("s4.series.book");
    var mRepl = t("s4.series.m_repl"), mBook = t("s4.series.m_book");

    legendItems($("stLegend1"), [{ kind: "line", color: "var(--s1)", label: repl }, { kind: "line", color: "var(--s2)", label: book }]);
    var yb1 = niceBounds(s.k.concat(s.A), 0.5, false);
    C.lineChart($("stChart1"), {
      height: 240,
      x: { min: 1, max: 24, ticks: xTicks, fmt: function (v) { return num(v, 0); }, label: t("s4.x") },
      y: { min: yb1.min, max: yb1.max, ticks: yb1.ticks, fmt: function (v) { return num(v, 1); } },
      series: [
        { key: "repl", label: repl, color: "var(--s1)", points: pts(s.k) },
        { key: "book", label: book, color: "var(--s2)", points: pts(s.A) }
      ],
      ariaLabel: t("s4.chart1.title"), tipTitle: tipTitle, tipValue: tipValue
    });

    legendItems($("stLegend2"), [{ kind: "line", color: "var(--s1)", label: mRepl }, { kind: "line", color: "var(--s2)", label: mBook }]);
    var yb2 = niceBounds(s.mRepl.concat(s.mBook), 0.5, true);
    C.lineChart($("stChart2"), {
      height: 240,
      x: { min: 1, max: 24, ticks: xTicks, fmt: function (v) { return num(v, 0); }, label: t("s4.x") },
      y: { min: yb2.min, max: yb2.max, ticks: yb2.ticks, fmt: function (v) { return num(v, 1); } },
      series: [
        { key: "mrepl", label: mRepl, color: "var(--s1)", points: pts(s.mRepl) },
        { key: "mbook", label: mBook, color: "var(--s2)", points: pts(s.mBook) }
      ],
      zeroLine: true,
      ariaLabel: t("s4.chart2.title"), tipTitle: tipTitle, tipValue: tipValue
    });

    function spec(title, aLabel, a, bLabel, b) {
      return function () {
        return {
          caption: title + " (" + t("unit.madl.short") + ")",
          head: [{ text: t("s4.x"), num: true }, { text: aLabel, num: true }, { text: bLabel, num: true }],
          rows: xs.map(function (x, i) { return [N(x, 0), N(a[i]), N(b[i])]; })
        };
      };
    }
    tableToggle("stTable1", spec(t("s4.chart1.title"), repl, s.k, book, s.A));
    tableToggle("stTable2", spec(t("s4.chart2.title"), mRepl, s.mRepl, mBook, s.mBook));
  }

  /* ---------- 5. Validation ---------- */
  function renderValidation() {
    var badges = [];
    if (D.tests && D.tests.ok) {
      badges.push(h("span", { "class": "check-badge ok" }, h("span", { "aria-hidden": "true", text: "✓" }),
        t("s5.tests", { n: N(D.tests.passed, 0), d: fmtDate(D.tests.run_on) })));
    } else {
      badges.push(h("span", { "class": "check-badge neutral", text: t("s5.tests.none") }));
    }
    if (check.failed.length === 0) {
      badges.push(h("span", { "class": "check-badge ok" }, h("span", { "aria-hidden": "true", text: "✓" }), t("s5.js.ok", { n: N(check.total, 0) })));
    } else {
      badges.push(h("span", { "class": "check-badge bad" }, h("span", { "aria-hidden": "true", text: "!" }),
        t("s5.js.fail", { n: N(check.failed.length, 0), m: N(check.total, 0) })));
    }
    $("vBadges").replaceChildren.apply($("vBadges"), badges);

    var rows = D.validation.map(function (r) {
      var isShare = r.quantity === "tax_share";
      var fmt = isShare ? function (v) { return P(v); } : function (v) { return mad(v); };
      var ref;
      if (r.quantity === "approach" || r.quantity === "station_margin") ref = t("s5.range", { a: N(r.low), b: mad(r.high) });
      else if (r.quantity === "gross_margin") ref = t("s5.weighted", { x: mad(r.reference_value) });
      else if (isShare) ref = t("s5.range", { a: P(r.low, 0), b: P(r.high, 0) });
      else ref = mad(r.reference_value);
      var result = r.passed === null ? badge("info") : r.passed ? badge("pass") : badge("fail");
      return [t("product." + r.product), t("s5.q." + r.quantity), fmt(r.model_value), ref, result];
    });
    C.table($("vTable"), {
      head: [{ text: t("s5.col.product") }, { text: t("s5.col.check") }, { text: t("s5.col.model"), num: true },
        { text: t("s5.col.reference") }, { text: t("s5.col.result") }],
      rows: rows
    });

    var g = D.structure.gasoil, sp = D.structure.ssp;
    $("vShows").replaceChildren(
      h("li", { text: t("s5.shows.1", { a: mad(g.components.approach), b: mad(sp.components.approach) }) }),
      h("li", { text: t("s5.shows.2", { a: P(g.tax_share), b: P(sp.tax_share) }) }),
      h("li", { text: t("s5.shows.3", { a: mad(g.components.station_margin), b: mad(sp.components.station_margin) }) })
    );
    var q24 = g.reported_tax_share_q4_2024;
    sourceLine($("vSource"), [{ source: g.source, status: g.status, as_of: g.as_of }, { source: q24.source, status: q24.status, as_of: q24.as_of }]);
  }
  /* pass / fail / info badges reuse the status styles */
  S["st.pass"] = S["s5.pass"]; S["st.fail"] = S["s5.fail"]; S["st.info"] = S["s5.info"];
  ST_ICON.pass = "✓"; ST_ICON.fail = "✗"; ST_ICON.info = "i";

  /* ---------- 6. Method ---------- */
  function renderMethod() {
    $("mLadder").replaceChildren.apply($("mLadder"), K.models.map(function (m) {
      return h("li", {},
        h("div", { "class": "ladder-id", text: m.id }),
        h("div", {},
          h("h4", {}, L(m.name), h("span", { "class": "badge badge-info", text: t("s6.planned") })),
          h("p", { text: L(m.desc) }),
          m.tex ? h("div", { "class": "math", "data-tex": m.tex }) : null));
    }));
    $("mHyp").replaceChildren.apply($("mHyp"), K.hypotheses.map(function (x) {
      return h("div", { "class": "hyp" },
        h("span", { "class": "hyp-id", text: x.id }),
        h("p", { text: L(x.text) }),
        x.tex ? h("div", { "class": "math", "data-tex": x.tex }) : null);
    }));
  }

  /* ---------- 7. Roadmap ---------- */
  function renderRoadmap() {
    $("rPhases").replaceChildren.apply($("rPhases"), K.phases.map(function (ph) {
      return h("li", { "class": "tl-item " + ph.status },
        h("div", { "class": "tl-dot", text: ph.status === "done" ? "✓" : String(ph.n) }),
        h("div", { "class": "tl-body" },
          h("div", { "class": "tl-head" },
            h("h3", { text: t("s7.phase", { x: N(ph.n, 0) }) + " · " + L(ph.name) }),
            h("span", { "class": "badge " + (ph.status === "done" ? "badge-pass" : ph.status === "active" ? "badge-secondary" : "badge-info"),
              text: t("s7.status." + ph.status) })),
          h("p", { text: L(ph.desc) }),
          ph.exit ? h("p", { "class": "tl-exit" }, h("strong", { text: t("s7.exit") + ": " }), L(ph.exit)) : null));
    }));
    $("rTasks").replaceChildren.apply($("rTasks"), K.tasks.map(function (x) {
      return h("li", {}, h("span", { "class": "task-id", text: x.id }), h("span", { text: L(x.text) }));
    }));
    $("rDecisions").replaceChildren.apply($("rDecisions"), K.decisions.map(function (x) {
      return h("li", {},
        x.settled ? h("span", { "class": "badge badge-pass", "aria-hidden": "true", text: "✓" })
          : h("span", { "class": "badge badge-info", text: t("s7.open") }),
        h("span", {}, h("span", { "class": "q", text: L(x.q) }),
          x.settled ? h("span", { "class": "settled", text: t("s7.decided") + ": " + L(x.settled) }) : null));
    }));
    C.table($("rRisks"), {
      head: [{ text: t("s7.risk") }, { text: t("s7.mitigation") }],
      rows: K.risks.map(function (r) { return [L(r.risk), L(r.fix)]; })
    });
  }

  /* ---------- 8. Sources ---------- */
  function constValue(c) {
    if (c.unit === "ratio") return P(c.value, 0);
    if (c.unit === "MAD/L") return mad(c.value);
    if (c.unit === "kg/L") return N(c.value, 3) + " " + t("unit.kg_l");
    return N(c.value) + " " + c.unit;
  }
  function renderSources() {
    C.table($("srcConstants"), {
      head: [{ text: t("s8.col.name") }, { text: t("common.value"), num: true }, { text: t("s8.col.status") },
        { text: t("common.source") }, { text: t("s8.col.asof") }],
      rows: Object.keys(D.constants).map(function (k) {
        var c = D.constants[k];
        return [t("const." + k), constValue(c), badge(c.status), srcLink(c.source), /^\d{4}(-\d{2})?$/.test(c.as_of) ? (c.as_of.length === 4 ? c.as_of : fmtDate(c.as_of)) : c.as_of];
      })
    });

    $("srcStatusLegend").replaceChildren.apply($("srcStatusLegend"), STATUSES.map(function (st) {
      return h("div", {}, badge(st), h("span", { text: t("st." + st + ".desc") }));
    }));

    var present = STATUSES.filter(function (st) { return K.sources.some(function (s) { return s.status === st; }); });
    var chips = ["all"].concat(present).map(function (st) {
      var n = st === "all" ? K.sources.length : K.sources.filter(function (s) { return s.status === st; }).length;
      var b = h("button", { type: "button", "class": "chip", "aria-pressed": String(state.srcStatus === st) },
        (st === "all" ? t("s8.filter.all") : t("st." + st)) + " · " + num(n, 0));
      b.addEventListener("click", function () {
        state.srcStatus = st;
        $("srcFilters").querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
        renderSourceList();
      });
      return b;
    });
    $("srcFilters").replaceChildren.apply($("srcFilters"), chips);
    var search = $("srcSearch");
    search.value = state.srcQuery;
    if (!search._bound) {
      search.addEventListener("input", function () { state.srcQuery = search.value; renderSourceList(); });
      search._bound = true;
    }
    renderSourceList();

    C.table($("srcGlossary"), {
      head: [{ text: "العربية" }, { text: "Français" }, { text: "English" }],
      rows: K.glossary.map(function (g) {
        return [h("span", { lang: "ar", dir: "rtl", text: g[2] }), h("span", { lang: "fr", dir: "ltr", text: g[1] }), h("span", { lang: "en", dir: "ltr", text: g[0] })];
      })
    });
  }

  function renderSourceList() {
    var q = state.srcQuery.trim().toLowerCase();
    var list = K.sources.filter(function (s) {
      if (state.srcStatus !== "all" && s.status !== state.srcStatus) return false;
      if (!q) return true;
      return (s.title + " " + L(s.desc) + " " + s.url).toLowerCase().indexOf(q) >= 0;
    });
    $("srcCount").textContent = t("s8.count", { x: N(list.length, 0) });
    if (!list.length) {
      $("srcList").replaceChildren(h("p", { "class": "muted", text: t("s8.none") }));
      return;
    }
    $("srcList").replaceChildren.apply($("srcList"), SRC_CATS.map(function (cat) {
      var items = list.filter(function (s) { return s.cat === cat; });
      if (!items.length) return null;
      return h("div", { "class": "src-group" },
        h("h4", { text: t("cat." + cat) }),
        h("ul", { "class": "src-list" }, items.map(function (s) {
          var title = s.url
            ? h("a", { href: s.url, target: "_blank", rel: "noopener noreferrer", text: s.title })
            : h("span", { text: s.title + " (" + t("s8.nolink") + ")" });
          return h("li", { "class": "src-item" },
            h("div", { "class": "src-top" }, h("span", { "class": "src-title", dir: "auto" }, title), badge(s.status)),
            h("p", { "class": "src-desc", text: L(s.desc) }));
        })));
    }).filter(Boolean));
  }

  /* ---------- Footer and maths ---------- */
  function renderFooter() {
    $("footBuild").textContent = t("foot.build", { d: fmtDate(D.generated_on), v: D.model_version });
  }
  function renderMath() {
    document.querySelectorAll(".math[data-tex]").forEach(function (e) {
      if (e.getAttribute("data-done")) return;
      var tex = e.getAttribute("data-tex");
      if (window.katex) {
        try {
          /* MathML output: rendered by the browser, so no KaTeX stylesheet or fonts needed. */
          window.katex.render(tex, e, { displayMode: true, throwOnError: false, output: "mathml" });
          e.setAttribute("data-done", "1");
          return;
        } catch (err) { /* fall through to plain text */ }
      }
      e.textContent = tex;
      e.classList.add("fallback");
      e.setAttribute("data-done", "1");
    });
  }

  /* ---------- Controls ---------- */
  var RENDER_ON = { s1Product: renderStructure, bProduct: renderBuilder, rule: drawStockCharts };
  function setControl(name, value) {
    if (state[name] === value) return;
    state[name] = value;
    if (name === "bProduct") resetBuilder();
    syncSegControls();
    RENDER_ON[name]();
    renderMath();
  }
  function bindControls() {
    document.querySelectorAll(".seg-control[data-control]").forEach(function (g) {
      var name = g.getAttribute("data-control");
      g.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-value]");
        if (b) setControl(name, b.getAttribute("data-value"));
      });
      g.addEventListener("keydown", function (e) {
        var keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
        if (keys.indexOf(e.key) < 0) return;
        e.preventDefault();
        var btns = [].slice.call(g.querySelectorAll("button[data-value]"));
        var i = btns.findIndex(function (b) { return b.getAttribute("data-value") === state[name]; });
        var forwardKey = document.documentElement.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
        var fwd = e.key === "ArrowDown" || e.key === forwardKey;
        var next = btns[(i + (fwd ? 1 : -1) + btns.length) % btns.length];
        setControl(name, next.getAttribute("data-value"));
        next.focus();
      });
    });

    $("bReset").addEventListener("click", function () { resetBuilder(); renderBuilder(); renderMath(); });

    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });

    $("themeToggle").addEventListener("click", function () {
      var root = document.documentElement;
      var cur = root.getAttribute("data-theme") ||
        (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = cur === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("mazoti.theme", next); } catch (e) { /* storage unavailable */ }
    });

    /* Highlight the nav link of the section in view. */
    if ("IntersectionObserver" in window) {
      var links = {};
      document.querySelectorAll(".site-nav a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          Object.keys(links).forEach(function (k) { links[k].classList.toggle("is-active", k === en.target.id); });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(links).forEach(function (k) { var s = $(k); if (s) io.observe(s); });
    }
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) < 0 || lang === state.lang) return;
    state.lang = lang;
    try { localStorage.setItem("mazoti.lang", lang); } catch (e) { /* storage unavailable */ }
    renderAll();
  }

  function renderAll() {
    C.hideTip();
    applyStatic();
    syncSegControls();
    renderHero();
    renderContext();
    renderStructure();
    renderBuilder();
    renderPassThrough();
    renderStocks();
    renderValidation();
    renderMethod();
    renderRoadmap();
    renderSources();
    renderFooter();
    renderMath();
  }

  resetBuilder();
  bindControls();
  renderAll();
})();
