/**
 * Componente Movement - Renderiza un elemento de movimiento con diferentes tipos y niveles
 * @param {string} type - Tipo de movimiento: "active-attack", "pasive-attack", "active-hab", "pasive-hab"
 * @param {string} level - Nivel del movimiento: "level-up", "level-down", "level-change", "none"
 */
export default function Movement({ type, level = "none" }) {
  // Mapeo de iconos por tipo
  const TYPE_ICONS = {
    "active-attack": "☆",
    "pasive-attack": "⊙"
  };

  // Mapeo de iconos por nivel
  const LEVEL_ICONS = {
    "level-up": (
      <div style={{ transform: "rotate(180deg)" }}>
        <p className="text-xl">↯</p>
      </div>
    ),
    "level-down": <p className="text-xl">↯</p>,
    "level-change": <p className="text-xl">⇄</p>
  };

  // Mapeo de contenido del lado derecho por tipo
  const RIGHT_SIDE_CONTENT = {
    "active-hab": <p className="text-2xl">☆</p>,
    "pasive-hab": <p className="text-2xl">⊙</p>
  };

  /**
   * Renderiza el icono correspondiente al tipo
   * @returns {string} Icono del tipo
   */
  const renderTypeIcon = () => TYPE_ICONS[type] || "";

  /**
   * Renderiza el icono correspondiente al nivel
   * @returns {JSX.Element|string} Componente del nivel o string vacío
   */
  const renderLevelIcon = () => LEVEL_ICONS[level] || "";

  /**
   * Renderiza el contenido del lado derecho según el tipo
   * @returns {JSX.Element} Componente correspondiente al tipo o input por defecto
   */
  const renderRightSide = () => {
    return RIGHT_SIDE_CONTENT[type] || (
      <input
        type="number"
        defaultValue={100}
        min={0}
        max={10000}
        step={25}
        className="text-right max-w-15"
      />
    );
  };

  return (
    <div className="rounded-lg mb-3">

      {/* Cabecera del movimiento */}
      <div className="flex items-center gap-2 mb-1 w-full">

        {/* Renderizado de iconos */}
        <p className="text-xl font-bold">{renderTypeIcon()}</p>
        {renderLevelIcon()}

        {/* Input para el nombre del movimiento */}
        <input
          type="text"
          name="name"
          id="name"
          defaultValue="Movement Name"
          className="outline-none min-w-0 w-5/6 font-bold"
        />
      </div>
      
      {/* Cuerpo del movimiento */}
      <div className="flex justify-between">
        
        {/* Descripcion del movimiento */}
        <div className="flex flex-col flex-1 mr-4">
          <textarea
            name="descripcion"
            defaultValue="Description Movement"
            className="text-xs outline-none resize-none min-h-11 leading-tight ms-2 overflow-hidden"
          />
        </div>
        
        {/* Lado derecho del movimiento, renderiza el input o simbolo */}
        <div className="flex items-center justify-center text-center">
          {renderRightSide()}
        </div>
     
      </div>
    </div>
  );
}