import { useState, useEffect } from "react";

/**
 * Renderiza un control de color mejorado - cada control en su propia fila
 */
export default function ColorControl(id, label, value, onChange) {
  const [hexInput, setHexInput] = useState(value);

  // Si el valor externo cambia (por el color picker), actualizamos el input
  useEffect(() => {
    setHexInput(value);
  }, [value]);

  const handleHexColorChange = (hexValue) => {
    setHexInput(hexValue);

    // Solo actualiza el color global si es válido
    if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
      onChange(hexValue);
    }
    if (hexValue === "") {
      onChange("#000000");
    }
  };

  return (
    <div className="form-control w-full" key={id}>
      <div htmlFor={id} className="label w-full">
        <span className="label-text font-medium text-center w-full">
          {label}
        </span>
      </div>
      <div className="flex flex-row gap-3 items-center">
        {/* Picker */}
        <input
          type="color"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-16 rounded-lg border-2 border-base-300 cursor-pointer hover:border-base-400 transition-colors flex-shrink-0"
        />
        {/* Hex manual */}
        <input
          type="text"
          value={hexInput}
          onChange={(e) => handleHexColorChange(e.target.value)}
          className="input input-bordered w-full font-mono text-sm flex-1"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
}