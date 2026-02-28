import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { toCanvas } from "html-to-image";

/**
 * MobileEyeDropper – Cuentagotas personalizado para móviles.
 * Captura la página visible como canvas y permite al usuario tocar
 * para seleccionar un color, con una lupa para mayor precisión.
 */
export default function MobileEyeDropper({ onColorPick, onCancel }) {
  const canvasRef = useRef(null);
  const loupeCanvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [touchPos, setTouchPos] = useState(null);
  const pixelDataRef = useRef(null); // Canvas 2D context guardado

  const LOUPE_SIZE = 120; // Tamaño de la lupa en px
  const LOUPE_ZOOM = 6;   // Nivel de zoom
  const GRID_PIXELS = 11; // Cuántos pixeles caben en la lupa (impar para centrar)

  // Capturar la página completa como canvas al montar
  useEffect(() => {
    let cancelled = false;

    const capture = async () => {
      try {
        // Capturar el body completo
        const target = document.body;
        const rect = target.getBoundingClientRect();

        const canvas = await toCanvas(target, {
          cacheBust: true,
          pixelRatio: 1,
          width: Math.ceil(rect.width),
          height: Math.ceil(rect.height),
          style: {
            margin: "0",
            padding: "0",
          },
          // Filtrar nuestro propio overlay para que no se capture a sí mismo
          filter: (node) => {
            if (node.dataset && node.dataset.eyedropperOverlay) return false;
            return true;
          },
        });

        if (cancelled) return;

        const displayCanvas = canvasRef.current;
        if (!displayCanvas) return;

        // Ajustar el canvas al tamaño de la pantalla
        displayCanvas.width = window.innerWidth;
        displayCanvas.height = window.innerHeight;

        const ctx = displayCanvas.getContext("2d");
        // Dibujar el screenshot escalado a la pantalla
        ctx.drawImage(
          canvas,
          0,
          window.scrollY,
          window.innerWidth,
          window.innerHeight,
          0,
          0,
          window.innerWidth,
          window.innerHeight
        );

        pixelDataRef.current = ctx;
        setReady(true);
      } catch (err) {
        console.error("Error capturando pantalla para cuentagotas:", err);
        onCancel();
      }
    };

    // Pequeño delay para que el drawer se cierre completamente
    const timer = setTimeout(capture, 100);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [onCancel]);

  // Obtener color del pixel en la posición (x, y)
  const getColorAtPosition = useCallback((x, y) => {
    const ctx = pixelDataRef.current;
    if (!ctx) return null;

    const pixel = ctx.getImageData(
      Math.round(x * (canvasRef.current.width / canvasRef.current.clientWidth)),
      Math.round(y * (canvasRef.current.height / canvasRef.current.clientHeight)),
      1,
      1
    ).data;

    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }, []);

  // Dibujar la lupa
  const drawLoupe = useCallback(
    (x, y) => {
      const loupeCanvas = loupeCanvasRef.current;
      const srcCtx = pixelDataRef.current;
      if (!loupeCanvas || !srcCtx) return;

      const loupeCtx = loupeCanvas.getContext("2d");
      const halfGrid = Math.floor(GRID_PIXELS / 2);

      loupeCanvas.width = LOUPE_SIZE;
      loupeCanvas.height = LOUPE_SIZE;

      const cellSize = LOUPE_SIZE / GRID_PIXELS;

      // Ratio de pantalla a canvas
      const scaleX = canvasRef.current.width / canvasRef.current.clientWidth;
      const scaleY = canvasRef.current.height / canvasRef.current.clientHeight;

      const srcX = Math.round(x * scaleX);
      const srcY = Math.round(y * scaleY);

      // Dibujar cada pixel ampliado
      for (let row = 0; row < GRID_PIXELS; row++) {
        for (let col = 0; col < GRID_PIXELS; col++) {
          const px = srcX + (col - halfGrid);
          const py = srcY + (row - halfGrid);

          let color = "#000";
          if (
            px >= 0 &&
            px < canvasRef.current.width &&
            py >= 0 &&
            py < canvasRef.current.height
          ) {
            const pixel = srcCtx.getImageData(px, py, 1, 1).data;
            color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
          }

          loupeCtx.fillStyle = color;
          loupeCtx.fillRect(
            col * cellSize,
            row * cellSize,
            cellSize,
            cellSize
          );
        }
      }

      // Dibujar cuadrícula sutil
      loupeCtx.strokeStyle = "rgba(255,255,255,0.15)";
      loupeCtx.lineWidth = 0.5;
      for (let i = 1; i < GRID_PIXELS; i++) {
        loupeCtx.beginPath();
        loupeCtx.moveTo(i * cellSize, 0);
        loupeCtx.lineTo(i * cellSize, LOUPE_SIZE);
        loupeCtx.stroke();
        loupeCtx.beginPath();
        loupeCtx.moveTo(0, i * cellSize);
        loupeCtx.lineTo(LOUPE_SIZE, i * cellSize);
        loupeCtx.stroke();
      }

      // Resaltar pixel central (el seleccionado)
      const centerX = halfGrid * cellSize;
      const centerY = halfGrid * cellSize;
      loupeCtx.strokeStyle = "#fff";
      loupeCtx.lineWidth = 2;
      loupeCtx.strokeRect(centerX, centerY, cellSize, cellSize);
      loupeCtx.strokeStyle = "#000";
      loupeCtx.lineWidth = 1;
      loupeCtx.strokeRect(
        centerX - 1,
        centerY - 1,
        cellSize + 2,
        cellSize + 2
      );
    },
    [LOUPE_SIZE, GRID_PIXELS]
  );

  // Handler del touch/move
  const handleInteraction = useCallback(
    (clientX, clientY) => {
      const color = getColorAtPosition(clientX, clientY);
      if (color) {
        setCurrentColor(color);
        setTouchPos({ x: clientX, y: clientY });
        drawLoupe(clientX, clientY);
      }
    },
    [getColorAtPosition, drawLoupe]
  );

  const handleTouchStart = useCallback(
    (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleInteraction(touch.clientX, touch.clientY);
    },
    [handleInteraction]
  );

  const handleTouchMove = useCallback(
    (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleInteraction(touch.clientX, touch.clientY);
    },
    [handleInteraction]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      e.preventDefault();
      if (currentColor) {
        onColorPick(currentColor);
      }
    },
    [currentColor, onColorPick]
  );

  // Click (para pruebas en escritorio también)
  const handleClick = useCallback(
    (e) => {
      const color = getColorAtPosition(e.clientX, e.clientY);
      if (color) {
        onColorPick(color);
      }
    },
    [getColorAtPosition, onColorPick]
  );

  const handleMouseMove = useCallback(
    (e) => {
      handleInteraction(e.clientX, e.clientY);
    },
    [handleInteraction]
  );

  // Calcular posición de la lupa (por encima del dedo, centrada)
  const getLoupePosition = () => {
    if (!touchPos) return { display: "none" };
    const offsetY = -LOUPE_SIZE - 40; // Encima del dedo
    let left = touchPos.x - LOUPE_SIZE / 2;
    let top = touchPos.y + offsetY;

    // Asegurar que no se salga de la pantalla
    if (left < 8) left = 8;
    if (left + LOUPE_SIZE > window.innerWidth - 8)
      left = window.innerWidth - LOUPE_SIZE - 8;
    if (top < 8) top = touchPos.y + 60; // Si no cabe arriba, mostrar abajo

    return { left, top };
  };

  return createPortal(
    <div
      data-eyedropper-overlay="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        touchAction: "none",
        cursor: "crosshair",
      }}
    >
      {/* Indicador de carga */}
      {!ready && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            fontSize: 16,
            fontFamily: "system-ui, sans-serif",
            gap: 12,
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              border: "3px solid rgba(255,255,255,0.3)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              animation: "eyedropper-spin 0.8s linear infinite",
            }}
          />
          Capturando pantalla...
        </div>
      )}

      {/* Canvas con la captura */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: ready ? "block" : "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      />

      {/* Lupa */}
      {ready && touchPos && (
        <div
          style={{
            position: "fixed",
            ...getLoupePosition(),
            width: LOUPE_SIZE,
            height: LOUPE_SIZE,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #fff",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.3)",
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

      {/* Barra inferior con preview de color y botones */}
      {ready && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            paddingBottom: "max(12px, env(safe-area-inset-bottom))",
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            gap: 12,
          }}
        >
          {/* Preview del color */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "2px solid rgba(255,255,255,0.4)",
                background: currentColor || "transparent",
                transition: "background 0.1s",
              }}
            />
            <span
              style={{
                color: "#fff",
                fontFamily: "monospace",
                fontSize: 15,
                fontWeight: 600,
                textTransform: "uppercase",
                minWidth: 80,
              }}
            >
              {currentColor || "—"}
            </span>
          </div>

          {/* Instrucción */}
          <span
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontFamily: "system-ui, sans-serif",
              textAlign: "center",
              flex: 1,
            }}
          >
            Toca para seleccionar un color
          </span>

          {/* Botón cancelar */}
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Animación de spinner */}
      <style>{`
        @keyframes eyedropper-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  );
}
