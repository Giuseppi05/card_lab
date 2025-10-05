import { useMemo, useCallback } from "react";

export default function Header({ genLogo }) {
  // Configuración de inputs optimizada
  const INPUT_CONFIG = useMemo(
    () => ({
      name: {
        className: "text-xl w-full bg-transparent border-none outline-none",
        type: "text",
        name: "name",
        id: "name",
        defaultValue: "Character Name",
      },
      hp: {
        className:
          "w-16 text-right bg-transparent border-none outline-none hp-input me-1",
        type: "number",
        defaultValue: 100,
        min: 0,
        max: 10000,
        step: 25,
      },
    }),
    []
  );

  const renderInput = useCallback(
    (configKey) => <input {...INPUT_CONFIG[configKey]} />,
    [INPUT_CONFIG]
  );

  return (
    <div className="flex justify-between items-center p-3 pb-1">
      <div className="flex-1 mr-2">{renderInput("name")}</div>
      <div className="flex items-center text-xl">
        {renderInput("hp")}
        <span className="font-bold">HP</span>
        <div className="w-15 h-15 ml-1 flex items-center justify-center">
          <img src={genLogo} alt="logo" />
        </div>
      </div>
    </div>
  );
}