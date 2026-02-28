import { useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Cuentagotas móvil con lupa.
 * Sin captura de pantalla. Usa elementFromPoint para leer colores
 * y muestrea una cuadrícula de puntos para la lupa.
 * Para <img> lee el píxel real del canvas temporal.
 */
export default function MobileEyeDropper({ onColorPick, onCancel }) {
  const [currentColor, setCurrentColor] = useState(null);
  const [touchPos, setTouchPos] = useState(null);
  const overlayRef = useRef(null);
  const loupeCanvasRef = useRef(null);
  const tempCanvas = useRef(document.createElement("canvas"));
  const imgCacheRef = useRef({ src: null, ctx: null, natW: 0, natH: 0 });

  const LOUPE_SIZE = 110;
  const GRID = 9; // 9×9 puntos muestreados
  const SAMPLE_SPACING = 3; // px entre cada punto de muestreo

  const rgbToHex = (r, g, b) =>
    `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  const parseRgb = (rgb) => {
    if (!rgb || rgb === "transparent" || rgb === "rgba(0, 0, 0, 0)") return null;
    const m = rgb.match(/\d+/g);
    return m && m.length >= 3 ? rgbToHex(+m[0], +m[1], +m[2]) : null;
  };

  // Leer píxel de una imagen (con caché para no redibujar cada frame)
  const getPixelFromImage = useCallback((img, cx, cy) => {
    try {
      const rect = img.getBoundingClientRect();
      const natW = img.naturalWidth || img.width;
      const natH = img.naturalHeight || img.height;
      const px = Math.round(((cx - rect.left) / rect.width) * natW);
      const py = Math.round(((cy - rect.top) / rect.height) * natH);
      if (px < 0 || py < 0 || px >= natW || py >= natH) return null;

      // Cachear el canvas si es la misma imagen
      const cache = imgCacheRef.current;
      if (cache.src !== img.src) {
        const c = tempCanvas.current;
        c.width = natW;
        c.height = natH;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, natW, natH);
        cache.src = img.src;
        cache.ctx = ctx;
        cache.natW = natW;
        cache.natH = natH;
      }

      const p = cache.ctx.getImageData(px, py, 1, 1).data;
      if (p[3] === 0) return null;
      return rgbToHex(p[0], p[1], p[2]);
    } catch {
      return null;
    }
  }, []);

  // Obtener color de un punto (sin tocar el overlay)
  const samplePoint = useCallback((x, y) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return "#f0f0f0";

    // Si es imagen, leer píxel real
    if (el.tagName === "IMG") {
      const c = getPixelFromImage(el, x, y);
      if (c) return c;
    }

    // Si es canvas
    if (el.tagName === "CANVAS") {
      try {
        const rect = el.getBoundingClientRect();
        const sx = Math.round((x - rect.left) * (el.width / rect.width));
        const sy = Math.round((y - rect.top) * (el.height / rect.height));
        const ctx = el.getContext("2d", { willReadFrequently: true });
        const p = ctx.getImageData(sx, sy, 1, 1).data;
        if (p[3] > 0) return rgbToHex(p[0], p[1], p[2]);
      } catch {}
    }

    // CSS: subir por el DOM buscando un background sólido
    let node = el;
    while (node && node !== document.documentElement) {
      if (node.style?.backgroundColor) {
        const h = parseRgb(node.style.backgroundColor);
        if (h) return h;
      }
      const h = parseRgb(window.getComputedStyle(node).backgroundColor);
      if (h) return h;
      node = node.parentElement;
    }
    return "#ffffff";
  }, [getPixelFromImage]);

  // Muestrear cuadrícula y dibujar lupa
  const updateLoupe = useCallback((cx, cy) => {
    const loupeCanvas = loupeCanvasRef.current;
    const overlay = overlayRef.current;
    if (!loupeCanvas || !overlay) return;

    const lCtx = loupeCanvas.getContext("2d");
    loupeCanvas.width = LOUPE_SIZE;
    loupeCanvas.height = LOUPE_SIZE;
    const cell = LOUPE_SIZE / GRID;
    const half = Math.floor(GRID / 2);

    // Ocultar overlay UNA vez para muestrear todos los puntos
    overlay.style.pointerEvents = "none";
    overlay.style.visibility = "hidden";

    const colors = [];
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        const sx = cx + (col - half) * SAMPLE_SPACING;
        const sy = cy + (row - half) * SAMPLE_SPACING;
        colors.push(samplePoint(sx, sy));
      }
    }

    overlay.style.pointerEvents = "auto";
    overlay.style.visibility = "visible";

    // Dibujar colores en la lupa
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        lCtx.fillStyle = colors[row * GRID + col];
        lCtx.fillRect(col * cell, row * cell, cell, cell);
      }
    }

    // Cuadrícula sutil
    lCtx.strokeStyle = "rgba(255,255,255,0.15)";
    lCtx.lineWidth = 0.5;
    for (let i = 1; i < GRID; i++) {
      lCtx.beginPath(); lCtx.moveTo(i * cell, 0); lCtx.lineTo(i * cell, LOUPE_SIZE); lCtx.stroke();
      lCtx.beginPath(); lCtx.moveTo(0, i * cell); lCtx.lineTo(LOUPE_SIZE, i * cell); lCtx.stroke();
    }

    // Pixel central resaltado
    const cc = half * cell;
    lCtx.strokeStyle = "#fff";
    lCtx.lineWidth = 2.5;
    lCtx.strokeRect(cc, cc, cell, cell);
    lCtx.strokeStyle = "#000";
    lCtx.lineWidth = 1;
    lCtx.strokeRect(cc - 1, cc - 1, cell + 2, cell + 2);
  }, [samplePoint]);

  const handleInteraction = useCallback(
    (x, y) => {
      // Color central
      const overlay = overlayRef.current;
      if (!overlay) return;
      overlay.style.pointerEvents = "none";
      overlay.style.visibility = "hidden";
      const color = samplePoint(x, y);
      overlay.style.pointerEvents = "auto";
      overlay.style.visibility = "visible";

      setCurrentColor(color);
      setTouchPos({ x, y });
      updateLoupe(x, y);
    },
    [samplePoint, updateLoupe]
  );

  const handleTouch = useCallback(
    (e) => { e.preventDefault(); const t = e.touches[0]; handleInteraction(t.clientX, t.clientY); },
    [handleInteraction]
  );

  const handleTouchEnd = useCallback(
    (e) => { e.preventDefault(); if (currentColor) onColorPick(currentColor); },
    [currentColor, onColorPick]
  );

  const handleClick = useCallback(
    (e) => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      overlay.style.pointerEvents = "none";
      overlay.style.visibility = "hidden";
      const c = samplePoint(e.clientX, e.clientY);
      overlay.style.pointerEvents = "auto";
      overlay.style.visibility = "visible";
      if (c) onColorPick(c);
    },
    [samplePoint, onColorPick]
  );

  const handleMouseMove = useCallback(
    (e) => handleInteraction(e.clientX, e.clientY),
    [handleInteraction]
  );

  // Posición de lupa
  const loupeStyle = (() => {
    if (!touchPos) return { display: "none" };
    let left = touchPos.x - LOUPE_SIZE / 2;
    let top = touchPos.y - LOUPE_SIZE - 40;
    if (left < 8) left = 8;
    if (left + LOUPE_SIZE > window.innerWidth - 8) left = window.innerWidth - LOUPE_SIZE - 8;
    if (top < 8) top = touchPos.y + 50;
    return { left, top };
  })();

  return createPortal(
    <div
      ref={overlayRef}
      data-eyedropper-overlay="true"
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        touchAction: "none",
        cursor: "crosshair",
        background: "transparent",
      }}
    >
      {/* Lupa (siempre visible al tocar) */}
      {touchPos && (
        <div
          style={{
            position: "fixed",
            ...loupeStyle,
            width: LOUPE_SIZE,
            height: LOUPE_SIZE,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.3)",
            pointerEvents: "none",
          }}
        >
          <canvas
            ref={loupeCanvasRef}
            width={LOUPE_SIZE}
            height={LOUPE_SIZE}
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
        </div>
      )}

      {/* Barra inferior */}
      <div
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          paddingBottom: "max(10px, env(safe-area-inset-bottom))",
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: "2px solid rgba(255,255,255,0.4)",
              background: currentColor || "transparent",
              transition: "background 0.05s",
            }}
          />
          <span
            style={{
              color: "#fff",
              fontFamily: "monospace",
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {currentColor || "—"}
          </span>
        </div>

        <span
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 11,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Arrastra y suelta
        </span>

        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "system-ui, sans-serif",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
