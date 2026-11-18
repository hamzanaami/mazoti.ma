/* Small chart kit for the site. No dependencies.
   Bars, segmented bars and the waterfall are HTML with logical CSS properties, so they mirror
   in Arabic (RTL). Line charts are SVG with left-to-right numeric axes in every language.
   Colours are passed as CSS values such as "var(--s1)", so a theme switch needs no redraw.
   All labels go into the DOM with textContent. */
(function (C) {
  "use strict";
  var SVGNS = "http://www.w3.org/2000/svg";

  function div(cls, text) {
    var e = document.createElement("div");
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function span(cls, text) {
    var e = document.createElement("span");
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function svg(tag, attrs, parent) {
    var e = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(e);
    return e;
  }
  function pct(v) { return (v * 100).toFixed(4) + "%"; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* ---------- Tooltip ---------- */
  function tipEl() { return document.getElementById("tooltip"); }

  function showTip(content, x, y) {
    var tip = tipEl();
    if (!tip) return;
    tip.replaceChildren();
    if (content.title) tip.appendChild(div("tt-title", content.title));
    (content.rows || []).forEach(function (r) {
      var row = div("tt-row");
      var key = span(r.key === "line" ? "line-key" : "swatch");
      key.style.background = r.color;
      row.appendChild(key);
      row.appendChild(span("tt-value", r.value));
      if (r.label) row.appendChild(span("tt-label", r.label));
      tip.appendChild(row);
    });
    if (content.note) tip.appendChild(div("tt-note", content.note));
    tip.hidden = false;
    var pad = 10, rect = tip.getBoundingClientRect();
    var left = x + 14, top = y + 16;
    if (left + rect.width > window.innerWidth - pad) left = x - rect.width - 14;
    if (left < pad) left = pad;
    if (top + rect.height > window.innerHeight - pad) top = y - rect.height - 14;
    if (top < pad) top = pad;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }
  function hideTip() { var tip = tipEl(); if (tip) tip.hidden = true; }
  window.addEventListener("scroll", hideTip, { passive: true });

  function bindTip(node, contentFn) {
    node.addEventListener("pointerenter", function (e) { showTip(contentFn(), e.clientX, e.clientY); });
    node.addEventListener("pointermove", function (e) { showTip(contentFn(), e.clientX, e.clientY); });
    node.addEventListener("pointerleave", hideTip);
    node.addEventListener("focus", function () {
      var r = node.getBoundingClientRect();
      showTip(contentFn(), r.left + r.width / 2, r.bottom);
    });
    node.addEventListener("blur", hideTip);
  }

  /* ---------- Tall segmented bar: one whole split into parts ----------
     parts: [{key, label, value, color}]
     opts: {fmtValue(v), fmtShare(share) for inside labels, tipShare(share) for the tooltip} */
  C.segBar = function (host, parts, opts) {
    if (host._ro) host._ro.disconnect();
    host.replaceChildren();
    var total = parts.reduce(function (s, p) { return s + Math.max(0, p.value); }, 0);
    var bar = div("segbar");
    bar.setAttribute("role", "img");
    bar.setAttribute("aria-label", parts.map(function (p) {
      return p.label + " " + opts.fmtValue(p.value) + " (" + opts.fmtShare(p.value / total) + ")";
    }).join(", "));
    parts.forEach(function (p) {
      if (!(p.value > 0)) return;
      var part = div("segbar-part");
      part.style.flex = p.value + " 1 0px";
      part.style.background = p.color;
      part.tabIndex = 0;
      part.setAttribute("aria-label", p.label + ": " + opts.fmtValue(p.value));
      part.appendChild(span("seg-label", opts.fmtShare(p.value / total)));
      bindTip(part, function () {
        return {
          title: p.label,
          rows: [{ key: "rect", color: p.color, value: opts.fmtValue(p.value) }],
          note: opts.tipShare(p.value / total)
        };
      });
      bar.appendChild(part);
    });
    host.appendChild(bar);

    var legend = div("seg-legend");
    parts.forEach(function (p) {
      var k = span("key");
      var sw = span("swatch"); sw.style.background = p.color;
      k.appendChild(sw);
      k.appendChild(span(null, p.label));
      k.appendChild(span("amt", opts.fmtValue(p.value)));
      legend.appendChild(k);
    });
    host.appendChild(legend);

    function fit() {
      bar.querySelectorAll(".segbar-part").forEach(function (part) {
        var lab = part.firstChild;
        part.classList.toggle("is-narrow", lab.offsetWidth + 14 > part.clientWidth);
      });
    }
    requestAnimationFrame(fit);
    host._ro = new ResizeObserver(fit);
    host._ro.observe(bar);
  };

  /* ---------- Waterfall ----------
     rows: [{key, label, value, start, end, total, color, prov}]
     opts: {max, ticks, fmtValue(v), fmtTick(v), provChip(kind) -> Node, tip(row) -> content} */
  C.waterfall = function (host, rows, opts) {
    host.replaceChildren();
    var wf = div("wf");
    wf.setAttribute("role", "list");
    rows.forEach(function (r) {
      var row = div("wf-row" + (r.total ? " is-total" : ""));
      row.setAttribute("role", "listitem");
      row.tabIndex = 0;
      row.setAttribute("aria-label", r.label + ": " + opts.fmtValue(r.value));

      var lab = div("wf-label");
      lab.appendChild(span("name", r.label));
      if (r.prov && opts.provChip) {
        var chipWrap = span();
        chipWrap.appendChild(opts.provChip(r.prov));
        lab.appendChild(chipWrap);
      }
      row.appendChild(lab);

      var track = div("wf-track");
      opts.ticks.forEach(function (t) {
        var g = span("wf-grid");
        g.style.insetInlineStart = pct(t / opts.max);
        track.appendChild(g);
      });
      var b = span("wf-bar");
      b.style.insetInlineStart = pct(Math.min(r.start, r.end) / opts.max);
      b.style.width = pct(Math.max(0.004, Math.abs(r.end - r.start) / opts.max));
      b.style.background = r.color;
      track.appendChild(b);
      row.appendChild(track);

      row.appendChild(div("wf-value", opts.fmtValue(r.value)));
      bindTip(row, function () { return opts.tip(r); });
      wf.appendChild(row);
    });

    var axis = div("wf-axis");
    axis.appendChild(span());
    var at = div("wf-axis-track");
    opts.ticks.forEach(function (t) {
      var lab = span("wf-tick", opts.fmtTick(t));
      lab.style.insetInlineStart = pct(t / opts.max);
      at.appendChild(lab);
    });
    axis.appendChild(at);
    axis.appendChild(span());
    wf.appendChild(axis);
    host.appendChild(wf);
  };

  /* ---------- Grouped horizontal bars with a reference line ----------
     groups: [{label, bars: [{key, label, value, color, valueText}]}]
     opts: {max, ticks, fmtTick(v), ref: {value}} */
  C.hbars = function (host, groups, opts) {
    host.replaceChildren();
    var hb = div("hb");
    groups.forEach(function (g) {
      var grp = div("hb-group");
      grp.appendChild(div("hb-group-label", g.label));
      g.bars.forEach(function (b) {
        var row = div("hb-row");
        var track = div("hb-track");
        opts.ticks.forEach(function (t) {
          var gl = span("wf-grid");
          gl.style.insetInlineStart = pct(t / opts.max);
          track.appendChild(gl);
        });
        var bar = span("hb-bar");
        bar.style.width = pct(clamp(b.value / opts.max, 0, 1));
        bar.style.background = b.color;
        bar.tabIndex = 0;
        bar.setAttribute("role", "img");
        bar.setAttribute("aria-label", g.label + ", " + b.label + ": " + b.valueText);
        bindTip(bar, function () {
          return { title: g.label, rows: [{ key: "rect", color: b.color, value: b.valueText, label: b.label }] };
        });
        track.appendChild(bar);
        if (opts.ref) {
          var ref = span("hb-ref");
          ref.style.insetInlineStart = pct(opts.ref.value / opts.max);
          track.appendChild(ref);
        }
        row.appendChild(track);
        row.appendChild(span("hb-value", b.valueText));
        grp.appendChild(row);
      });
      hb.appendChild(grp);
    });
    var axis = div("hb-axis");
    opts.ticks.forEach(function (t) {
      var lab = span("hb-tick", opts.fmtTick(t));
      lab.style.insetInlineStart = pct(t / opts.max);
      axis.appendChild(lab);
    });
    hb.appendChild(axis);
    host.appendChild(hb);
  };

  /* ---------- Line chart (SVG) with crosshair and keyboard support ----------
     cfg: {height, x: {min, max, ticks, fmt, label}, y: {min, max, ticks, fmt},
           series: [{key, label, endLabel, color, points: [[x, y], ...]}]  (same x grid),
           marker: {x, y, color, label}, endLabels, zeroLine, ariaLabel,
           tipTitle(x), tipValue(y)} */
  C.lineChart = function (host, cfg) {
    if (host._ro) host._ro.disconnect();
    host.replaceChildren();
    var wrap = div("lc");
    host.appendChild(wrap);
    var xs = cfg.series[0].points.map(function (p) { return p[0]; });
    var W = 0, idx = null;

    function nearestIndex(xv) {
      var best = 0, bd = Infinity;
      xs.forEach(function (x, i) { var d = Math.abs(x - xv); if (d < bd) { bd = d; best = i; } });
      return best;
    }

    function draw() {
      var w = Math.floor(wrap.clientWidth);
      if (!w) return;
      W = w;
      var H = cfg.height || 240;
      var showEnd = cfg.endLabels && W >= 420;
      var m = { t: 18, r: showEnd ? (cfg.endPad || 92) : 16, b: cfg.x.label ? 46 : 28, l: 48 };
      var pw = W - m.l - m.r, ph = H - m.t - m.b;
      var X = function (v) { return m.l + (v - cfg.x.min) / (cfg.x.max - cfg.x.min) * pw; };
      var Y = function (v) { return m.t + (1 - (v - cfg.y.min) / (cfg.y.max - cfg.y.min)) * ph; };

      var root = svg("svg", { width: W, height: H, viewBox: "0 0 " + W + " " + H, role: "img", tabindex: 0 });
      root.setAttribute("aria-label", cfg.ariaLabel || "");

      cfg.y.ticks.forEach(function (tv) {
        var y = Y(tv);
        svg("line", { "class": "grid", x1: m.l, x2: W - m.r, y1: y, y2: y }, root);
        svg("text", { "class": "tick", x: m.l - 8, y: y + 4, "text-anchor": "end" }, root).textContent = cfg.y.fmt(tv);
      });
      if (cfg.zeroLine && cfg.y.min < 0 && cfg.y.max > 0) {
        svg("line", { "class": "zero", x1: m.l, x2: W - m.r, y1: Y(0), y2: Y(0) }, root);
      }
      svg("line", { "class": "baseline", x1: m.l, x2: W - m.r, y1: m.t + ph, y2: m.t + ph }, root);
      cfg.x.ticks.forEach(function (tv) {
        svg("text", { "class": "tick", x: X(tv), y: m.t + ph + 17, "text-anchor": "middle" }, root).textContent = cfg.x.fmt(tv);
      });
      if (cfg.x.label) {
        svg("text", { "class": "axis-label", x: m.l + pw / 2, y: H - 6, "text-anchor": "middle" }, root).textContent = cfg.x.label;
      }

      cfg.series.forEach(function (se) {
        var d = se.points.map(function (p, i) {
          return (i ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1);
        }).join("");
        var path = svg("path", { "class": "series", d: d }, root);
        path.style.stroke = se.color;
      });

      if (showEnd) {
        var ends = cfg.series.map(function (se) {
          var last = se.points[se.points.length - 1];
          return { se: se, x: X(last[0]), y: Y(last[1]) };
        }).sort(function (a, b) { return a.y - b.y; });
        var collide = ends.some(function (e, i) { return i > 0 && e.y - ends[i - 1].y < 15; });
        if (!collide) {
          ends.forEach(function (e) {
            svg("text", { "class": "end-label", x: e.x + 8, y: e.y + 4 }, root).textContent = e.se.endLabel || e.se.label;
          });
        }
      }

      if (cfg.marker) {
        var mx = X(cfg.marker.x), my = Y(cfg.marker.y);
        var c = svg("circle", { "class": "marker", cx: mx, cy: my, r: 6 }, root);
        c.style.fill = cfg.marker.color;
        if (cfg.marker.label) {
          var above = my - m.t > 26;
          svg("text", {
            "class": "marker-label", x: clamp(mx, m.l + 36, W - m.r - 36), y: above ? my - 13 : my + 22,
            "text-anchor": "middle"
          }, root).textContent = cfg.marker.label;
        }
      }

      var xh = svg("g", { visibility: "hidden" }, root);
      var xl = svg("line", { "class": "xhair", y1: m.t, y2: m.t + ph }, xh);
      var dots = cfg.series.map(function (se) {
        var d = svg("circle", { "class": "hover-dot", r: 4.5 }, xh);
        d.style.fill = se.color;
        return d;
      });
      var hit = svg("rect", { x: m.l, y: m.t, width: Math.max(0, pw), height: Math.max(0, ph), fill: "transparent" }, root);

      function showAt(i, cx, cy) {
        idx = i;
        var px = X(xs[i]);
        xl.setAttribute("x1", px); xl.setAttribute("x2", px);
        cfg.series.forEach(function (se, j) {
          dots[j].setAttribute("cx", px);
          dots[j].setAttribute("cy", Y(se.points[i][1]));
        });
        xh.setAttribute("visibility", "visible");
        var rows = cfg.series.map(function (se) {
          return { y: se.points[i][1], row: { key: "line", color: se.color, value: cfg.tipValue(se.points[i][1]), label: se.label } };
        }).sort(function (a, b) { return b.y - a.y; }).map(function (r) { return r.row; });
        showTip({ title: cfg.tipTitle(xs[i]), rows: rows }, cx, cy);
      }
      function hide() { xh.setAttribute("visibility", "hidden"); hideTip(); }
      function fromClient(e) {
        var r = root.getBoundingClientRect();
        var xv = cfg.x.min + (e.clientX - r.left - m.l) / pw * (cfg.x.max - cfg.x.min);
        showAt(nearestIndex(xv), e.clientX, e.clientY);
      }
      function fromIndex(i) {
        var r = root.getBoundingClientRect();
        showAt(i, r.left + X(xs[i]), r.top + m.t + 8);
      }
      hit.addEventListener("pointermove", fromClient);
      hit.addEventListener("pointerdown", fromClient);
      hit.addEventListener("pointerleave", hide);
      root.addEventListener("focus", function () {
        fromIndex(idx != null ? idx : (cfg.marker ? nearestIndex(cfg.marker.x) : Math.floor(xs.length / 2)));
      });
      root.addEventListener("blur", hide);
      root.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          var step = e.shiftKey ? 5 : 1;
          var i = (idx != null ? idx : 0) + (e.key === "ArrowRight" ? step : -step);
          fromIndex(clamp(i, 0, xs.length - 1));
        } else if (e.key === "Escape") {
          hide();
        }
      });
      wrap.replaceChildren(root);
    }

    draw();
    host._ro = new ResizeObserver(function () {
      if (Math.floor(wrap.clientWidth) !== W) draw();
    });
    host._ro.observe(wrap);
  };

  /* ---------- Data table (the accessible twin of every chart) ----------
     spec: {caption, head: [{text, num}], rows: [[string | Node]]} */
  C.table = function (host, spec) {
    host.replaceChildren();
    var tbl = document.createElement("table");
    if (spec.caption) tbl.createCaption().textContent = spec.caption;
    var hr = tbl.createTHead().insertRow();
    spec.head.forEach(function (hd) {
      var th = document.createElement("th");
      th.scope = "col";
      th.textContent = hd.text;
      if (hd.num) th.className = "num";
      hr.appendChild(th);
    });
    var tb = tbl.createTBody();
    spec.rows.forEach(function (r) {
      var tr = tb.insertRow();
      r.forEach(function (cell, i) {
        var td = tr.insertCell();
        if (cell instanceof Node) td.appendChild(cell);
        else td.textContent = cell == null ? "" : cell;
        if (spec.head[i] && spec.head[i].num) td.className = "num";
      });
    });
    host.appendChild(tbl);
  };

  C.showTip = showTip;
  C.hideTip = hideTip;
})(window.MazotiCharts = {});
