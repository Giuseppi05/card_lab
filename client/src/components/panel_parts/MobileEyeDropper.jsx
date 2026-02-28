import { useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Cuentagotas móvil instantáneo (híbrido).
 * - Para elementos normales: lee el color CSS con getComputedStyle
 * - Para imágenes (<img>): dibuja en canvas temporal y lee el píxel exacto
 * - Para <canvas>: lee el píxel directamente
 * Sin captura de pantalla completa → instantáneo.
 */
export default function MobileEyeDropper({ onColorPick, onCancel }) {
  const [currentColor, setCurrentColor] = useState(null);
  const overlayRef = useRef(null);
  const tempCanvasRef = useRef(document.createElement("canvas"));

  const rgbToHex = (r, g, b) =>
    `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  const parseRgbString = (rgb) => {
    if (!rgb || rgb === "transparent" || rgb === "rgba(0, 0, 0, 0)") return null;
    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return null;
    return rgbToHex(Number(m[0]), Number(m[1]), Number(m[2]));
  };

  // Leer color del píxel de una <img> en (clientX, clientY)
  const getColorFromImage = useCallback((img, clientX, clientY) => {
    try {
      const rect = img.getBoundingClientRect();
      // Posición relativa dentro de la imagen visible
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;

      // Dimensiones naturales de la imagen
      const natW = img.naturalWidth || img.width;
      const natH = img.naturalHeight || img.height;

      // Mapear coordenadas de display a coordenadas naturales
      const pixelX = Math.round((relX / rect.width) * natW);
      const pixelY = Math.round((relY / rect.height) * natH);

      if (pixelX < 0 || pixelY < 0 || pixelX >= natW || pixelY >= natH) return null;

      const canvas = tempCanvasRef.current;
      canvas.width = natW;
      canvas.height = natH;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, natW, natH);

      const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
      // Si el píxel es totalmente transparente, no devolver color
      if (pixel[3] === 0) return null;
      return rgbToHex(pixel[0], pixel[1], pixel[2]);
    } catch {
      // CORS o error al leer la imagen
      return null;
    }
  }, []);

  // Leer color de un <canvas> en (clientX, clientY)
  const getColorFromCanvas = useCallback((canvas, clientX, clientY) => {
    try {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const px = Math.round((clientX - rect.left) * scaleX);
      const py = Math.round((clientY - rect.top) * scaleY);

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const pixel = ctx.getImageData(px, py, 1, 1).data;
      if (pixel[3] === 0) return null;
      return rgbToHex(pixel[0], pixel[1], pixel[2]);
    } catch {
      return null;
    }
  }, []);

  // Obtener color CSS subiendo por el DOM
  const getColorFromCSS = useCallback((el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      // Inline style primero (más específico)
      if (node.style?.backgroundColor) {
        const hex = parseRgbString(node.style.backgroundColor);
        if (hex) return hex;
      }
      // Computed style
      const bg = window.getComputedStyle(node).backgroundColor;
      const hex = parseRgbString(bg);
      if (hex) return hex;
      node = node.parentElement;
    }
    return "#ffffff";
  }, []);

  // Función principal: obtener color en posición (x, y)
  const getColorAt = useCallback(
    (x, y) => {
      const overlay = overlayRef.current;
      if (!overlay) return null;

      // Ocultar overlay brevemente para ver qué hay debajo
      overlay.style.pointerEvents = "none";
      overlay.style.visibility = "hidden";

      const el = document.elementFromPoint(x, y);

      overlay.style.pointerEvents = "auto";
      overlay.style.visibility = "visible";

      if (!el) return null;

      // 1. ¿Es una imagen?
      if (el.tagName === "IMG") {
        const color = getColorFromImage(el, x, y);
        if (color) return color;
      }

      // 2. ¿Es un canvas?
      if (el.tagName === "CANVAS") {
        const color = getColorFromCanvas(el, x, y);
        if (color) return color;
      }

      // 3. ¿Tiene una imagen de fondo CSS?
      const bgImage = window.getComputedStyle(el).backgroundImage;
      if (bgImage && bgImage !== "none") {
        // Intentar encontrar una <img> hija o el propio background
        const img = el.querySelector("img");
        if (img) {
          const color = getColorFromImage(img, x, y);
          if (color) return color;
        }
      }

      // 4. Fallback: color CSS del elemento o sus padres
      return getColorFromCSS(el);
    },
    [getColorFromImage, getColorFromCanvas, getColorFromCSS]
  );

  const handleTouch = useCallback(
    (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const color = getColorAt(touch.clientX, touch.clientY);
      if (color) setCurrentColor(color);
    },
    [getColorAt]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      e.preventDefault();
      if (currentColor) onColorPick(currentColor);
    },
    [currentColor, onColorPick]
  );

  const handleClick = useCallback(
    (e) => {
      const color = getColorAt(e.clientX, e.clientY);
      if (color) onColorPick(color);
    },
    [getColorAt, onColorPick]
  );

  const handleMouseMove = useCallback(
    (e) => {
      const color = getColorAt(e.clientX, e.clientY);
      if (color) setCurrentColor(color);
    },
    [getColorAt]
  );

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
      {/* Barra inferior con preview */}
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
