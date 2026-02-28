import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker } from "react-colorful";
import MobileEyeDropper from "./MobileEyeDropper";

export default function ColorControl(id, label, value, onChange) {
  const [hexInput, setHexInput] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [recentColors, setRecentColors] = useState([]);
  const [showMobileEyeDropper, setShowMobileEyeDropper] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  const loadRecentColors = () => {
    try {
      const saved = localStorage.getItem("card_lab_recentColors");
      if (saved) setRecentColors(JSON.parse(saved));
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    loadRecentColors();
    const handleStorageChange = () => loadRecentColors();
    window.addEventListener("recentColorsUpdated", handleStorageChange);
    return () => window.removeEventListener("recentColorsUpdated", handleStorageChange);
  }, []);

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  // Cálculo anti-recorte y posicionamiento inteligente
  const calculatePosition = useCallback(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 220; // Ancho fijo del popup
      const popoverHeight = 310; // Alto aproximado del popup con los 10 recientes
      const gap = 8; // Distancia desde el botón

      let newLeft = rect.left + rect.width / 2 - popoverWidth / 2;
      let newTop = rect.bottom + gap + window.scrollY;

      // Anti-Recorte Horizontal
      if (newLeft < 10) {
        newLeft = 10;
      } else if (newLeft + popoverWidth > window.innerWidth - 10) {
        newLeft = window.innerWidth - popoverWidth - 10;
      }

      // Anti-Recorte Vertical (Si choca por abajo, abrir por arriba del botón)
      if (rect.bottom + gap + popoverHeight > window.innerHeight) {
        newTop = rect.top - popoverHeight - gap + window.scrollY;
      }

      setPopoverPosition({ top: newTop, left: newLeft });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      window.addEventListener("scroll", calculatePosition, true);
      window.addEventListener("resize", calculatePosition);
    }
    return () => {
      window.removeEventListener("scroll", calculatePosition, true);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [isOpen, calculatePosition]);

  const addRecentColor = useCallback((color) => {
    setRecentColors((prev) => {
      if (prev[0] === color) return prev; // Evita loop innecesario si no cambió
      const newColors = [color, ...prev.filter((c) => c !== color)].slice(0, 10);
      localStorage.setItem("card_lab_recentColors", JSON.stringify(newColors));
      window.dispatchEvent(new Event("recentColorsUpdated"));
      return newColors;
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        // Guardar automáticamente el color actual al cerrar haciendo click fuera
        if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
          addRecentColor(hexInput);
        }
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, hexInput, addRecentColor]);

  const closeDrawer = () => {
    const drawerToggle = document.getElementById("my-drawer-4");
    if (drawerToggle && window.innerWidth < 1024) {
      drawerToggle.checked = false;
    }
  };

  const handleApplyColor = (color) => {
    setHexInput(color);
    onChange(color);
    addRecentColor(color);
  };

  const handleHexInputChange = (val) => {
    setHexInput(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      onChange(val);
    }
  };

  const handleHexInputBlur = () => {
    if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
      addRecentColor(hexInput);
    } else {
      setHexInput(value);
    }
  };

  const handleEyeDropperClick = async () => {
    setIsOpen(false);
    closeDrawer();

    // Si el navegador soporta la API nativa (escritorio), usarla
    if (window.EyeDropper) {
      try {
        await new Promise((r) => setTimeout(r, 350));
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        handleApplyColor(result.sRGBHex);
      } catch (e) {
        // cancelado
      }
    } else {
      // Móvil: usar cuentagotas personalizado con canvas
      await new Promise((r) => setTimeout(r, 400));
      setShowMobileEyeDropper(true);
    }
  };

  return (
    <div className="form-control w-full" key={id}>
      <div className="label w-full pb-1 px-1">
        <span className="label-text font-medium text-center w-full truncate text-[13px]">{label}</span>
      </div>

      <div className="flex flex-row gap-2 items-center w-full">
        {/* Trigger del Picker con Portal */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-md border border-base-300 cursor-pointer shadow-sm hover:border-base-content/50 transition-colors shrink-0"
          style={{ backgroundColor: value }}
          title="Abrir selector de color"
        />

        {/* Input Text Hex Wrapper relative */}
        <div className="relative flex flex-1 min-w-0 items-center">
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexInputChange(e.target.value)}
            onBlur={handleHexInputBlur}
            className="input input-bordered input-sm w-full font-mono uppercase text-[11px] shadow-sm pl-2 pr-8 text-left"
            placeholder="#000000"
            maxLength={7}
          />

          {/* Cuentagotas Native en línea - Absoluto a la derecha */}
          <button
            type="button"
            onClick={handleEyeDropperClick}
            className="absolute right-1 w-6 h-6 flex items-center justify-center rounded text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors"
            title="Usar cuentagotas"
          >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m2 22 1-1h3l9-9"/>
                <path d="M3 21v-3l9-9"/>
                <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/>
              </svg>
            </button>
        </div>
      </div>

      {/* Modal PORTAL del Color Picker completo */}
      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed p-4 bg-base-100/95 backdrop-blur-md rounded-xl shadow-2xl border border-base-300 z-[9999] w-[220px] flex flex-col gap-4 animate-fade-in origin-top"
            style={{ top: popoverPosition.top, left: popoverPosition.left }}
          >
            <HexColorPicker
              color={value}
              onChange={(color) => {
                setHexInput(color);
                onChange(color);
              }}
              style={{ width: "100%", height: "160px" }}
            />

            <div>
              <span className="text-[10px] text-base-content/60 font-bold uppercase mb-2 block tracking-wider text-center">
                Recientes
              </span>
              <div className="grid grid-cols-5 gap-2 place-items-center">
                {recentColors.map((color) => (
                  <button
                    key={`${id}-modal-${color}`}
                    type="button"
                    className="w-6 h-6 rounded-full border shadow-sm border-base-300 hover:scale-110 active:scale-95 transition-all"
                    style={{ backgroundColor: color }}
                    onClick={() => handleApplyColor(color)}
                    title={color}
                  />
                ))}
                {/* Cuadros vacios para rellenar la grilla de 10 */}
                {Array.from({ length: Math.max(0, 10 - recentColors.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-5 h-5 rounded-full border border-base-300 border-dashed opacity-30" />
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm w-full font-bold mt-1"
              onClick={() => {
                setIsOpen(false);
                if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
                  addRecentColor(hexInput);
                }
              }}
            >
              Listo
            </button>
          </div>,
          document.body
        )}
      {/* Cuentagotas móvil */}
      {showMobileEyeDropper && (
        <MobileEyeDropper
          onColorPick={(color) => {
            setShowMobileEyeDropper(false);
            handleApplyColor(color);
          }}
          onCancel={() => setShowMobileEyeDropper(false)}
        />
      )}
    </div>
  );
}