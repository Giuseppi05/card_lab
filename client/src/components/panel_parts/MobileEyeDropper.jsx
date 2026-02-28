import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { toCanvas } from "html-to-image";

/**
 * Cuentagotas móvil con lupa.
 * Captura el viewport como canvas en segundo plano mientras
 * el overlay ya es interactivo. Una vez listo el canvas,
 * lee píxeles con precisión y muestra una lupa.
 */
export default function MobileEyeDropper({ onColorPick, onCancel }) {
  const [currentColor, setCurrentColor] = useState(null);
  const [touchPos, setTouchPos] = useState(null);
  const overlayRef = useRef(null);
  const loupeCanvasRef = useRef(null);
  const screenshotRef = useRef(null); // canvas capturado
  const screenshotCtxRef = useRef(null);

  const LOUPE_SIZE = 110;
  const GRID_PIXELS = 11;

  // Capturar la página en segundo plano al montar
  useEffect(() => {
    let cancelled = false;

    const capture = async () => {
      try {
        const overlay = overlayRef.current;
        if (overlay) {
          overlay.style.display = "none";
        }

        const target = document.body;
        const canvas = await toCanvas(target, {
          cacheBust: true,
          pixelRatio: 1,
          width: window.innerWidth,
          height: window.innerHeight,
          style: { margin: "0", padding: "0" },
          filter: (node) => {
            if (node.dataset?.eyedropperOverlay) return false;
            return true;
          },
        });

        if (overlay) {
          overlay.style.display = "";
        }

        if (cancelled) return;

        // Recortar al viewport visible
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = window.innerWidth;
        finalCanvas.height = window.innerHeight;
        const ctx = finalCanvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(
          canvas,
          0, window.scrollY, window.innerWidth, window.innerHeight,
          0, 0, window.innerWidth, window.innerHeight
        );

        screenshotRef.current = finalCanvas;
        screenshotCtxRef.current = ctx;
      } catch (err) {
        console.error("Eyedropper capture error:", err);
      }
    };

    // Pequeño delay para que animaciones de cierre del drawer terminen
    const t = setTimeout(capture, 50);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  const rgbToHex = (r, g, b) =>
    `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  const parseRgb = (rgb) => {
    if (!rgb || rgb === "transparent" || rgb === "rgba(0, 0, 0, 0)") return null;
    const m = rgb.match(/\d+/g);
    return m && m.length >= 3 ? rgbToHex(+m[0], +m[1], +m[2]) : null;
  };

  // Leer color de la captura (pixel-perfect)
  const getColorFromScreenshot = useCallback((x, y) => {
    const ctx = screenshotCtxRef.current;
    if (!ctx) return null;
    try {
      const p = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
      if (p[3] === 0) return null;
      return rgbToHex(p[0], p[1], p[2]);
    } catch { return null; }
  }, []);

  // Fallback CSS
  const getColorFromCSS = useCallback((x, y) => {
    const overlay = overlayRef.current;
    if (!overlay) return null;
    overlay.style.pointerEvents = "none";
    overlay.style.visibility = "hidden";
    const el = document.elementFromPoint(x, y);
    overlay.style.pointerEvents = "auto";
    overlay.style.visibility = "visible";
    if (!el) return "#ffffff";

    let node = el;
    while (node && node !== document.documentElement) {
      if (node.style?.backgroundColor) {
        const h = parseRgb(node.style.backgroundColor);
        if (h) return h;
      }
      const bg = window.getComputedStyle(node).backgroundColor;
      const h = parseRgb(bg);
      if (h) return h;
      node = node.parentElement;
    }
    return "#ffffff";
  }, []);

  // Obtener color: priorizar captura, fallback a CSS
  const getColorAt = useCallback(
    (x, y) => {
      const fromScreenshot = getColorFromScreenshot(x, y);
      if (fromScreenshot) return fromScreenshot;
      return getColorFromCSS(x, y);
    },
    [getColorFromScreenshot, getColorFromCSS]
  );

  // Dibujar lupa
  const drawLoupe = useCallback((x, y) => {
    const loupeCanvas = loupeCanvasRef.current;
    const ctx = screenshotCtxRef.current;
    if (!loupeCanvas || !ctx) return;

    const lCtx = loupeCanvas.getContext("2d");
    loupeCanvas.width = LOUPE_SIZE;
    loupeCanvas.height = LOUPE_SIZE;

    const cell = LOUPE_SIZE / GRID_PIXELS;
    const half = Math.floor(GRID_PIXELS / 2);
    const sx = Math.round(x);
    const sy = Math.round(y);
    const sw = screenshotRef.current.width;
    const sh = screenshotRef.current.height;

    for (let row = 0; row < GRID_PIXELS; row++) {
      for (let col = 0; col < GRID_PIXELS; col++) {
        const px = sx + (col - half);
        const py = sy + (row - half);
        let color = "#000";
        if (px >= 0 && px < sw && py >= 0 && py < sh) {
          const p = ctx.getImageData(px, py, 1, 1).data;
          color = `rgb(${p[0]},${p[1]},${p[2]})`;
        }
        lCtx.fillStyle = color;
        lCtx.fillRect(col * cell, row * cell, cell, cell);
      }
    }

    // Cuadrícula
    lCtx.strokeStyle = "rgba(255,255,255,0.12)";
    lCtx.lineWidth = 0.5;
    for (let i = 1; i < GRID_PIXELS; i++) {
      lCtx.beginPath(); lCtx.moveTo(i * cell, 0); lCtx.lineTo(i * cell, LOUPE_SIZE); lCtx.stroke();
      lCtx.beginPath(); lCtx.moveTo(0, i * cell); lCtx.lineTo(LOUPE_SIZE, i * cell); lCtx.stroke();
    }

    // Pixel central
    const cx = half * cell, cy = half * cell;
    lCtx.strokeStyle = "#fff";
    lCtx.lineWidth = 2;
    lCtx.strokeRect(cx, cy, cell, cell);
    lCtx.strokeStyle = "#000";
    lCtx.lineWidth = 1;
    lCtx.strokeRect(cx - 1, cy - 1, cell + 2, cell + 2);
  }, []);

  const handleInteraction = useCallback(
    (x, y) => {
      const color = getColorAt(x, y);
      if (color) setCurrentColor(color);
      setTouchPos({ x, y });
      if (screenshotCtxRef.current) drawLoupe(x, y);
    },
    [getColorAt, drawLoupe]
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
    (e) => { const c = getColorAt(e.clientX, e.clientY); if (c) onColorPick(c); },
    [getColorAt, onColorPick]
  );

  const handleMouseMove = useCallback(
    (e) => handleInteraction(e.clientX, e.clientY),
    [handleInteraction]
  );

  // Posición de la lupa (encima del dedo)
  const loupePos = (() => {
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
      {/* Lupa */}
      {touchPos && screenshotCtxRef.current && (
        <div
          style={{
            position: "fixed",
            ...loupePos,
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
