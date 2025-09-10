/**
 * Componente Panel - Panel de configuración para personalizar colores, texturas y movimientos
 * @param {function} onColorChange - Callback para cambio de color de fondo
 * @param {function} onBorderColor - Callback para cambio de color de borde
 * @param {function} onImageBorderColor - Callback para cambio de color de borde de imagen
 * @param {function} onTextColor - Callback para cambio de color de texto
 * @param {function} onTextureChange - Callback para cambio de textura
 * @param {function} onMovementOneChange - Callback para cambio de tipo del movimiento uno
 * @param {function} onMovementTwoChange - Callback para cambio de tipo del movimiento dos
 * @param {function} onLevelMovementOneChange - Callback para cambio de nivel del movimiento uno
 * @param {function} onLevelMovementTwoChange - Callback para cambio de nivel del movimiento dos
 * @param {function} onGenLogoChange - Callback para cambio de logo de generación
 * @param {function} onLongLogoChange - Callback para cambio de logo largo
 * @param {function} onClassLogoChange - Callback para cambio de logo de clase
 * @param {function} onAffiliationLogoChange - Callback para cambio de logo de afiliación
 * @param {string} bgColor - Color de fondo actual
 * @param {string} borderColor - Color de borde actual
 * @param {string} imageBorderColor - Color de borde de imagen actual
 * @param {string} textColor - Color de texto actual
 * @param {string} texture - Textura actual seleccionada
 */
function Panel({
  //HANDLER DE COLOR
  onColorChange,
  onBorderColor,
  onImageBorderColor,
  onTextColor,

  //Handler de texturas
  onTextureChange,

  //Handlers de moviimientos
  onMovementOneChange,
  onMovementTwoChange,
  onLevelMovementOneChange,
  onLevelMovementTwoChange,

  //Handlers de logos
  onGenLogoChange,
  onLongLogoChange,
  onClassLogoChange,
  onAffiliationLogoChange,

  //Valores de color
  bgColor,
  borderColor,
  imageBorderColor,
  textColor,

  //Valor de textura
  texture,

  //Valores de movimientos
  typeMovementOne,
  typeMovementTwo,
  levelMovementOne,
  levelMovementTwo,

  //Valores de logos
  genLogo,
  longLogo,
  classLogo,
  affiliationLogo,

  //Handler Image
  onImageChange,
  onDownloadCard
}) {
  // Configuración de texturas disponibles
  const TEXTURES = [
    { name: "Ninguna", url: "" },
    { name: "Ladrillos", url: "textures/brick-texture.png" },
    { name: "Madera", url: "textures/wood-texture.png" },
    { name: "Metal", url: "textures/metallic-texture.png" },
    { name: "Papel", url: "textures/paper-texture.png" },
    { name: "Plastico", url: "textures/plastic-texture.png" },
    { name: "Rugosa", url: "textures/rough-texture.png" },
    { name: "Lana", url: "textures/wool-texture.png" },
    { name: "Octogonal", url: "textures/octogonal-texture.png" },
    { name: "Comic", url: "textures/comic-texture.png" },
    { name: "Nubes", url: "textures/cloud-texture.png" },
    { name: "Mar", url: "textures/sea-texture.png" },
  ];

  // Configuracion de logos de generacion
  const GEN_LOGO = [
    { label: "G1", value: "logos/g1.png" },
    { label: "G4 Pre", value: "logos/g4_pre.png" },
    { label: "G4 Post", value: "logos/g4_post.png" },
  ];

  // Configuración de logo largo
  const LONG_LOGO = [
    { label: "Default", value: "logos/animated_logo.png" },
    { label: "Live Action", value: "logos/live_action.png" },
  ];

  // Configuración de clases
  const CLASSES = [
    { label: "Piratas", value: "classes/piratas.png" },
    { label: "Marines", value: "classes/marines.png" },
    { label: "Animales", value: "classes/animales.png" },
    { label: "Bandidos", value: "classes/bandidos.png" },
    { label: "Civiles", value: "classes/civiles.png" },
    { label: "Gobierno Mundial", value: "classes/gobierno_mundial.png" },
    { label: "Objetos", value: "classes/objetos.png" },
    {
      label: "Ejercito Revolucionario",
      value: "classes/ejercito_revolucionario.png",
    },
    { label: "Entidad Paranormal", value: "classes/entidad_paranormal.png" },
    { label: "Ejercito de Dios", value: "classes/ejercito_de_Dios.png" },
  ];

  // Configuración de afiliaciones
  const AFILIATIONS = [
    { label: "Ninguna", value: "" },
    { label: "Piratas Mugiwara", value: "afiliaciones/piratas_mugiwara.png" },
    { label: "Piratas Buggy", value: "afiliaciones/piratas_buggy.png" },
    { label: "Alianza Saruyama", value: "afiliaciones/alianza_saruyama.png" },
    { label: "Franky Family", value: "afiliaciones/franky_family.png" },
    {
      label: "Nuevos Piratas Gyojin",
      value: "afiliaciones/nuevos_piratas_gyojin.png",
    },
    { label: "Piarats Bonnie", value: "afiliaciones/piarats_bonnie.png" },
    { label: "Piratas Apoo", value: "afiliaciones/piratas_apoo.png" },
    { label: "Piratas Arlong", value: "afiliaciones/piratas_arlong.png" },
    { label: "Piratas Bege", value: "afiliaciones/piratas_bege.png" },
    { label: "Piratas Bellamy", value: "afiliaciones/piratas_bellamy.png" },
    {
      label: "Piratas Blackbeard",
      value: "afiliaciones/piratas_blackbeard.png",
    },
    {
      label: "Piratas Doflamingo",
      value: "afiliaciones/piratas_Doflamingo.png",
    },
    { label: "Piratas Foxy", value: "afiliaciones/piratas_foxy.png" },
    { label: "Piratas Hawkins", value: "afiliaciones/piratas_hawkins.png" },
    { label: "Piratas Law", value: "afiliaciones/piratas_law.png" },
    { label: "Piratas Moria", value: "afiliaciones/piratas_moria.png" },
    { label: "Piratas Roshio", value: "afiliaciones/piratas_roshio.png" },
    { label: "Piratas Sol", value: "afiliaciones/piratas_sol.png" },
    { label: "Piratas Uroge", value: "afiliaciones/piratas_uroge.png" },
    { label: "Piratas World", value: "afiliaciones/piratas_world.png" },
    { label: "Piratas X-Drake", value: "afiliaciones/piratas_X-Drake.png" },
  ];

  // Opciones de tipos de movimiento
  const MOVEMENT_TYPES = [
    { value: "active-attack", label: "Ataque Activo" },
    { value: "pasive-attack", label: "Ataque Pasivo" },
    { value: "active-hab", label: "Habilidad Activa" },
    { value: "pasive-hab", label: "Habilidad Pasiva" },
  ];

  // Opciones de niveles de movimiento
  const MOVEMENT_LEVELS = [
    { value: "none", label: "Ninguno" },
    { value: "level-up", label: "Level Up" },
    { value: "level-down", label: "Level Down" },
    { value: "level-change", label: "Level Change" },
  ];

  // Configuración de controles de color
  const COLOR_CONTROLS = [
    {
      id: "backgroundColor",
      label: "Seleccione el color de fondo",
      value: bgColor,
      onChange: onColorChange,
    },
    {
      id: "borderColor",
      label: "Seleccione el color del borde",
      value: borderColor,
      onChange: onBorderColor,
    },
    {
      id: "imageBorderColor",
      label: "Seleccione el color del borde de la imagen",
      value: imageBorderColor,
      onChange: onImageBorderColor,
    },
    {
      id: "textColor",
      label: "Seleccione el color del texto",
      value: textColor,
      onChange: onTextColor,
    },
  ];

  // Configuración de controles de movimiento
  const MOVEMENT_CONTROLS = [
    {
      label: "Seleccione el tipo del movimiento uno",
      options: MOVEMENT_TYPES,
      onChange: onMovementOneChange,
      value: typeMovementOne,
    },
    {
      label: "Seleccione el level del movimiento uno",
      options: MOVEMENT_LEVELS,
      onChange: onLevelMovementOneChange,
      value: levelMovementOne,
    },
    {
      label: "Seleccione el tipo del movimiento dos",
      options: MOVEMENT_TYPES,
      onChange: onMovementTwoChange,
      value: typeMovementTwo,
    },
    {
      label: "Seleccione el level del movimiento dos",
      options: MOVEMENT_LEVELS,
      onChange: onLevelMovementTwoChange,
      value: levelMovementTwo,
    },
  ];

  const LOGOS_CONTROLS = [
    {
      label: "Seleccione el logo de la generacion",
      options: GEN_LOGO,
      onChange: onGenLogoChange,
      value: genLogo,
    },
    {
      label: "Seleccione el logo largo",
      options: LONG_LOGO,
      onChange: onLongLogoChange,
      value: longLogo,
    },
    {
      label: "Seleccione el logo de clase",
      options: CLASSES,
      onChange: onClassLogoChange,
      value: classLogo,
    },
    {
      label: "Seleccione el logo de Afiliacion",
      options: AFILIATIONS,
      onChange: onAffiliationLogoChange,
      value: affiliationLogo,
    },
  ];

  /**
   * Renderiza un control de color
   * @param {Object} control - Configuración del control de color
   * @returns {JSX.Element} Control de color
   */
  const renderColorControl = (control) => (
    <div className="form-group" key={control.id}>
      <label htmlFor={control.id} className="mr-2">
        {control.label}
      </label>

      <input
        type="color"
        id={control.id}
        value={control.value}
        onChange={(e) => control.onChange(e.target.value)}
      />
    </div>
  );

  /**
   * Renderiza un control de selección
   * @param {Object} control - Configuración del control de selección
   * @param {number} index - Índice para key único
   * @param {string} prefix - Prefijo para la key (por defecto 'select')
   * @returns {JSX.Element} Control de selección
   */
  const renderSelectControl = (control, index, prefix = "select") => (
    <div className="form-group" key={`${prefix}-${index}`}>
      <label className="mr-2">{control.label}</label>
      <select
        value={control.value || ""}
        onChange={(e) => control.onChange(e.target.value)}
      >
        {control.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-1/3 flex justify-center items-center p-3 flex-col">
      {/* Controles de color */}
      {COLOR_CONTROLS.map(renderColorControl)}

      {/* Control de textura */}
      <div className="form-group">
        <label htmlFor="texture" className="mr-2">
          Seleccione la textura de fondo
        </label>

        <select
          id="texture"
          value={texture}
          onChange={(e) => onTextureChange(e.target.value)}
        >
          {TEXTURES.map((t) => (
            <option key={t.url} value={t.url}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <input
          type="file"
          onChange={handleFileChange}
          className="text-sm text-stone-500 
          file:mr-5 file:py-1 file:px-3 file:border-[1px]
          file:text-xs file:font-medium
        file:bg-stone-50 file:text-stone-700
          hover:file:cursor-pointer hover:file:bg-blue-50
        hover:file:text-blue-700"
        />
      </div>

      {/* Controles de movimiento */}
      {MOVEMENT_CONTROLS.map((control, index) =>
        renderSelectControl(control, index, "movement")
      )}

      {/* Controles de logos */}
      {LOGOS_CONTROLS.map((control, index) =>
        renderSelectControl(control, index, "logo")
      )}

      <button
        onClick={onDownloadCard}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Descargar carta en PNG
      </button>
    </div>
  );
}

export default Panel;