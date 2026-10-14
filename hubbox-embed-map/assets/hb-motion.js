/*
  HubBox motion kit — shared, seek-safe helpers used by every scene.
  Loaded once from index.html, so every sub-composition can call window.HB.*.

  Everything is deterministic: "random" orders come from a seeded PRNG, never Math.random().
  Tune the feel of the whole film from EASE / TIMING below.
*/
(function () {
  // Smooth, natural curves. Entrances decelerate gently; moves ease in and out.
  const EASE = {
    enter: "expo.out", // things arriving (text, cards)
    move: "power3.inOut", // things travelling (cursor, packets, camera)
    soft: "sine.inOut", // ambient drift, pulses
    cellIn: "power2.out", // pixel cells appearing
    cellOut: "power2.inOut", // pixel cells clearing
  };

  // Default durations (seconds). Raise these to slow the whole film down.
  const TIMING = {
    words: 1.0, // per-word blur rise
    wordStagger: 0.085,
    wipe: 0.9,
    rise: 0.9,
    pixelCell: 0.32, // a single pixel's fade
    pixelSpread: 0.5, // time for the pixel wave to cross the card
    pixelHold: 0.06, // fully-covered beat before the card shows through
  };

  function css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function seeded(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function el(target, scope) {
    if (typeof target !== "string") return target;
    return (scope || document).querySelector(target);
  }

  // Normalised 0..1 delay per cell for a sweep direction.
  function cellOrder(cols, rows, from, origin, rand, jitter) {
    const raw = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = cols > 1 ? c / (cols - 1) : 0;
        const y = rows > 1 ? r / (rows - 1) : 0;
        let d;
        if (from === "left") d = x;
        else if (from === "right") d = 1 - x;
        else if (from === "top") d = y;
        else if (from === "bottom") d = 1 - y;
        else if (from === "random") d = 0;
        else if (from === "radial") {
          const ox = origin ? origin[0] : 0.5;
          const oy = origin ? origin[1] : 0.5;
          d = Math.hypot((x - ox) * (cols / rows), y - oy);
        } else d = x * 0.62 + y * 0.38; // "diag" (default)
        raw.push(d + rand() * jitter);
      }
    }
    const min = Math.min.apply(null, raw);
    const max = Math.max.apply(null, raw);
    return raw.map((v) => (max - min > 0 ? (v - min) / (max - min) : 0));
  }

  function buildGrid(host, cols, rows, seed, palette, radius) {
    const grid = document.createElement("div");
    grid.className = "px-grid";
    grid.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";
    grid.style.gridTemplateRows = "repeat(" + rows + ", 1fr)";
    if (radius != null) {
      grid.style.borderRadius = radius + "px";
      grid.style.overflow = "hidden";
    }
    const rand = seeded(seed * 7 + 3);
    const cells = [];
    for (let i = 0; i < cols * rows; i++) {
      const cell = document.createElement("div");
      cell.className = "px-cell";
      cell.style.background = palette[Math.floor(rand() * palette.length)];
      grid.appendChild(cell);
      cells.push(cell);
    }
    host.appendChild(grid);
    return cells;
  }

  /*
    Pixel reveal for a UI shape.
    Markup: <div class="px-host"> <div class="px-target">…card…</div> </div>
    The card is built out of blue pixels in a sweep, then the pixels dissolve to show it.
  */
  function pixelReveal(tl, host, at, opts) {
    const o = Object.assign(
      {
        cols: 14,
        rows: 10,
        from: "diag",
        origin: null,
        seed: 1,
        radius: 28,
        jitter: 0.35,
        cell: TIMING.pixelCell,
        spread: TIMING.pixelSpread,
        hold: TIMING.pixelHold,
        palette: null,
      },
      opts || {},
    );
    host = el(host);
    const target = host.querySelector(".px-target") || host.firstElementChild;
    const palette = o.palette || [
      css("--hb-blue-tint"),
      css("--hb-blue-tint"),
      css("--hb-blue-tint"),
      css("--hb-blue-light"),
      css("--hb-blue-light"),
      css("--hb-blue"),
    ];
    const cells = buildGrid(host, o.cols, o.rows, o.seed, palette, o.radius);
    const order = cellOrder(o.cols, o.rows, o.from, o.origin, seeded(o.seed), o.jitter);
    const stagger = (i) => order[i] * o.spread;
    const covered = at + o.spread + o.cell + o.hold;

    tl.fromTo(
      cells,
      { opacity: 0, scale: 0.4 },
      { opacity: 1, scale: 1, duration: o.cell, ease: EASE.cellIn, stagger: stagger },
      at,
    );
    tl.fromTo(
      target,
      { opacity: 0, scale: 0.985 },
      { opacity: 1, scale: 1, duration: 0.5, ease: EASE.enter },
      covered - 0.12,
    );
    tl.fromTo(
      cells,
      { opacity: 1, scale: 1 },
      {
        opacity: 0,
        scale: 0.55,
        duration: o.cell + 0.06,
        ease: EASE.cellOut,
        stagger: stagger,
        immediateRender: false,
      },
      covered,
    );
    return covered + o.spread + o.cell; // time the card is fully clear
  }

  /* Pixel dissolve that swaps one small element for another (e.g. a status pill). */
  function pixelSwap(tl, host, outEl, inEl, at, opts) {
    const o = Object.assign({ cols: 8, rows: 3, seed: 5, radius: 999, from: "left" }, opts || {});
    host = el(host);
    const palette = [css("--hb-blue-light"), css("--hb-blue"), css("--hb-blue-tint")];
    const cells = buildGrid(host, o.cols, o.rows, o.seed, palette, o.radius);
    const order = cellOrder(o.cols, o.rows, o.from, null, seeded(o.seed), 0.4);
    const stagger = (i) => order[i] * 0.22;
    tl.fromTo(cells, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: EASE.cellIn, stagger }, at);
    tl.fromTo(el(outEl), { opacity: 1 }, { opacity: 0, duration: 0.01 }, at + 0.42);
    tl.fromTo(el(inEl), { opacity: 0 }, { opacity: 1, duration: 0.01 }, at + 0.42);
    tl.fromTo(
      cells,
      { opacity: 1 },
      { opacity: 0, duration: 0.24, ease: EASE.cellOut, stagger, immediateRender: false },
      at + 0.46,
    );
  }

  /* Splits a headline into words and blur-rises them one by one. Accent spans keep their gradient. */
  function words(tl, target, at, opts) {
    const o = Object.assign({ duration: TIMING.words, stagger: TIMING.wordStagger }, opts || {});
    const root = el(target);
    const out = [];
    function walk(node, accent) {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) {
              frag.appendChild(document.createTextNode(" "));
              return;
            }
            const w = document.createElement("span");
            w.className = "hb-word" + (accent ? " hb-accent" : "");
            w.textContent = p;
            frag.appendChild(w);
            out.push(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          const isAccent = child.classList.contains("hb-accent");
          if (isAccent) child.classList.remove("hb-accent");
          walk(child, accent || isAccent);
        }
      });
    }
    walk(root, false);
    const size = parseFloat(getComputedStyle(root).fontSize) || 80;
    tl.fromTo(
      out,
      { opacity: 0, y: size * 0.42, filter: "blur(12px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: o.duration,
        ease: EASE.enter,
        stagger: o.stagger,
      },
      at,
    );
    return at + o.duration + o.stagger * (out.length - 1);
  }

  /* Soft rise with a touch of blur — kickers, sublines, small UI. */
  function rise(tl, target, at, opts) {
    const o = Object.assign({ y: 26, duration: TIMING.rise, blur: 8, stagger: 0.1 }, opts || {});
    tl.fromTo(
      target,
      { opacity: 0, y: o.y, filter: "blur(" + o.blur + "px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: o.duration,
        ease: EASE.enter,
        stagger: o.stagger,
      },
      at,
    );
  }

  /* Clip-path wipe — code lines, rows, bars. */
  function wipe(tl, target, at, opts) {
    const o = Object.assign({ duration: TIMING.wipe, from: "left", stagger: 0.12 }, opts || {});
    const start =
      o.from === "left"
        ? "inset(0% 100% 0% 0%)"
        : o.from === "right"
          ? "inset(0% 0% 0% 100%)"
          : o.from === "top"
            ? "inset(0% 0% 100% 0%)"
            : "inset(100% 0% 0% 0%)";
    tl.fromTo(
      target,
      { clipPath: start, opacity: 0.001 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        duration: o.duration,
        ease: EASE.move,
        stagger: o.stagger,
      },
      at,
    );
  }

  /* Gentle scale pop for pins, badges and checks. */
  function pop(tl, target, at, opts) {
    const o = Object.assign({ duration: 0.8, stagger: 0.12, from: 0.4 }, opts || {});
    tl.fromTo(
      target,
      { opacity: 0, scale: o.from },
      { opacity: 1, scale: 1, duration: o.duration, ease: "back.out(1.5)", stagger: o.stagger },
      at,
    );
  }

  /* Cursor glide to a point (px, relative to the cursor's positioned parent) with optional click. */
  function cursorTo(tl, cursor, at, x, y, opts) {
    const o = Object.assign({ duration: 1.0, click: false }, opts || {});
    tl.to(cursor, { x: x, y: y, duration: o.duration, ease: EASE.move }, at);
    if (o.click) {
      const t = at + o.duration;
      tl.to(cursor, { scale: 0.84, duration: 0.12, ease: "power2.out" }, t);
      tl.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" }, t + 0.12);
    }
    return at + o.duration;
  }

  /* Background glows drift slowly for the life of a scene. */
  function drift(tl, scope, duration) {
    const a = scope.querySelector(".hb-glow.a");
    const b = scope.querySelector(".hb-glow.b");
    if (a) tl.fromTo(a, { x: 0, y: 0 }, { x: 140, y: 80, duration, ease: "none" }, 0);
    if (b) tl.fromTo(b, { x: 0, y: 0 }, { x: -160, y: -60, duration, ease: "none" }, 0);
  }

  const CURSOR_SVG =
    '<svg viewBox="0 0 24 24" width="44" height="44"><path d="M4 2.5 L4 19.5 L8.6 15.4 L11.6 22 L14.6 20.7 L11.7 14.2 L18 14.2 Z" fill="#0E1B33" stroke="#FFFFFF" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  const PIN_SVG =
    '<svg viewBox="0 0 40 52" width="100%" height="100%"><path d="M20 51C20 51 37 32.5 37 19.5C37 9.8 29.4 2 20 2C10.6 2 3 9.8 3 19.5C3 32.5 20 51 20 51Z" fill="currentColor" stroke="#FFFFFF" stroke-width="3"/><circle cx="20" cy="19.5" r="6.5" fill="#FFFFFF"/></svg>';

  /* Stylised street map in the brand blues (900 × 560 viewBox, scales to fill). */
  function mapSVG() {
    const tint = css("--hb-blue-tint");
    const surface = css("--hb-surface");
    const water = "#d6e6ff";
    const park = "#e2edfd";
    const casing = "#dbe5f4";
    const major = [
      "M-20 150 C 200 120, 420 210, 640 170 S 880 120, 940 140",
      "M-20 420 C 180 400, 360 470, 560 430 S 820 380, 940 400",
      "M300 -20 C 280 140, 330 300, 300 580",
      "M650 -20 C 660 160, 610 330, 640 580",
    ];
    const minor = [
      "M-20 290 L 940 300",
      "M120 -20 L 150 580",
      "M470 -20 L 480 580",
      "M800 -20 L 790 580",
      "M0 520 L 940 500",
      "M0 40 L 940 60",
      "M210 150 L 300 290",
      "M560 300 L 650 420",
    ];
    const road = (d, w, c) =>
      '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"/>';
    return (
      '<svg viewBox="0 0 900 560" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">' +
      '<rect width="900" height="560" fill="' +
      surface +
      '"/>' +
      '<rect x="330" y="190" width="120" height="90" rx="18" fill="' +
      park +
      '"/>' +
      '<rect x="680" y="440" width="140" height="80" rx="18" fill="' +
      park +
      '"/>' +
      '<rect x="20" y="330" width="90" height="70" rx="16" fill="' +
      park +
      '"/>' +
      '<path d="M-20 250 C 140 220, 220 330, 380 330 S 640 240, 940 260" fill="none" stroke="' +
      water +
      '" stroke-width="34" stroke-linecap="round"/>' +
      minor.map((d) => road(d, 12, casing)).join("") +
      minor.map((d) => road(d, 7, "#ffffff")).join("") +
      major.map((d) => road(d, 24, casing)).join("") +
      major.map((d) => road(d, 17, "#ffffff")).join("") +
      '<rect width="900" height="560" fill="none" stroke="' +
      tint +
      '" stroke-width="2"/>' +
      "</svg>"
    );
  }

  window.HB = {
    EASE,
    TIMING,
    css,
    seeded,
    pixelReveal,
    pixelSwap,
    words,
    rise,
    wipe,
    pop,
    cursorTo,
    drift,
    mapSVG,
    CURSOR_SVG,
    PIN_SVG,
  };
})();
