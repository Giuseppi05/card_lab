export default function Movement({ type, level = "none", movName, onNameChange, desc, onDescChange, dmg, onDmgChange }) {
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

  const renderTypeIcon = () => TYPE_ICONS[type] || "";
  const renderLevelIcon = () => LEVEL_ICONS[level] || "";

  const renderRightSide = () => {
    return RIGHT_SIDE_CONTENT[type] || (
      <input
        type="number"
        value={dmg}
        min={0}
        max={10000}
        step={25}
        className="text-right max-w-15"
        onChange={(e) => onDmgChange(Number(e.target.value))}
      />
    );
  };

  return (
    <div className="rounded-lg mb-3">

      {/* Cabecera del movimiento */}
      <div className="flex items-center gap-2 mb-1 w-full">

        {/* Renderizado de iconos */}
        <p className="text-xl">{renderTypeIcon()}</p>
        {renderLevelIcon()}

        {/* Input para el nombre del movimiento */}
        <input
          type="text"
          name="name"
          id="name"
          value={movName}
          className="outline-none min-w-0 w-5/6 font-bold"
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      
      {/* Cuerpo del movimiento */}
      <div className="flex justify-between">
        
        {/* Descripcion del movimiento */}
        <div className="flex flex-col flex-1 mr-4">
          <textarea
            name="descripcion"
            value={desc}
            className="text-xs outline-none resize-none min-h-11 leading-tight ms-2 overflow-hidden"
            onChange={(e) => onDescChange(e.target.value)}
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