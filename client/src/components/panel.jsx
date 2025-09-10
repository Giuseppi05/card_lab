import { FiSettings, FiZap, FiImage, FiDownload } from 'react-icons/fi';

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

  /**
   * Maneja el cambio de color desde el input hex y actualiza el color picker
   */
  const handleHexColorChange = (hexValue, colorChangeHandler) => {
    if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
      colorChangeHandler(hexValue);
    }
  };

  /**
   * Renderiza un control de color mejorado - cada control en su propia fila
   */
  const renderColorControl = (id, label, value, onChange) => (
    <div className="form-control w-full" key={id}>
      <label htmlFor={id} className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="flex flex-row gap-3 items-center">
        <input
          type="color"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-16 rounded-lg border-2 border-base-300 cursor-pointer hover:border-base-400 transition-colors flex-shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleHexColorChange(e.target.value, onChange)}
          className="input input-bordered w-full font-mono text-sm flex-1"
          placeholder="#000000"
          pattern="^#[0-9A-F]{6}$"
          maxLength={7}
        />
      </div>
    </div>
  );

  /**
   * Renderiza un control de selección mejorado
   */
  const renderSelectControl = (label, options, value, onChange, id) => (
    <div className="form-control w-full">
      <label htmlFor={id} className="label">
        <span className="label-text font-medium text-base-content">{label}</span>
      </label>
      <select
        id={id}
        className="select select-bordered w-full focus:select-primary"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-base-200 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-2">Panel de Configuración</h2>
        <p className="text-base-content/70 text-center">Personaliza tu carta de One Piece</p>
      </div>

      {/* Acordeón de configuración */}
      <div className="join join-vertical bg-base-100 w-full shadow-lg rounded-lg overflow-hidden mb-20">
        
        {/* Sección General */}
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="checkbox" name="config-accordion" />
          <div className="collapse-title text-xl font-semibold">
            <div className="flex items-center gap-3">
              <FiSettings className="w-5 h-5" />
              <span>Configuración General</span>
            </div>
          </div>
          <div className="collapse-content">
            <div className="pt-6 space-y-6">
              
              {/* Sub-acordeón de Colores */}
              <div className="collapse collapse-plus border-b border-base-300">
                <input type="checkbox" name="colors-accordion" />
                <div className="collapse-title text-lg font-medium px-0">
                  <span>Colores</span>
                </div>
                <div className="collapse-content px-0">
                  <div className="pt-4 space-y-6">
                    {renderColorControl(
                      "backgroundColor",
                      "Color de fondo",
                      bgColor,
                      onColorChange
                    )}
                    {renderColorControl(
                      "borderColor",
                      "Color del borde",
                      borderColor,
                      onBorderColor
                    )}
                    {renderColorControl(
                      "imageBorderColor",
                      "Color del borde de imagen",
                      imageBorderColor,
                      onImageBorderColor
                    )}
                    {renderColorControl(
                      "textColor",
                      "Color del texto",
                      textColor,
                      onTextColor
                    )}
                  </div>
                </div>
              </div>

              {/* Sub-acordeón de Texturas */}
              <div className="collapse collapse-plus border-b border-base-300">
                <input type="checkbox" name="textures-accordion" />
                <div className="collapse-title text-lg font-medium px-0">
                  <span>Texturas</span>
                </div>
                <div className="collapse-content px-0">
                  <div className="pt-4">
                    <div className="max-w-md">
                      {renderSelectControl(
                        "Textura de fondo",
                        TEXTURES.map(t => ({ label: t.name, value: t.url })),
                        texture,
                        onTextureChange,
                        "texture-select"
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Sección Movimientos */}
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="checkbox" name="config-accordion" />
          <div className="collapse-title text-xl font-semibold">
            <div className="flex items-center gap-3">
              <FiZap className="w-5 h-5" />
              <span>Movimientos</span>
            </div>
          </div>
          <div className="collapse-content">
            <div className="pt-6 space-y-6">
              
              {/* Sub-acordeón Movimiento Uno */}
              <div className="collapse collapse-plus border-b border-base-300">
                <input type="checkbox" name="movement-one-accordion" />
                <div className="collapse-title text-lg font-medium px-0">
                  <span>Movimiento Uno</span>
                </div>
                <div className="collapse-content px-0">
                  <div className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderSelectControl(
                        "Tipo de movimiento",
                        MOVEMENT_TYPES,
                        typeMovementOne,
                        onMovementOneChange,
                        "movement-one-type"
                      )}
                      {renderSelectControl(
                        "Nivel de movimiento",
                        MOVEMENT_LEVELS,
                        levelMovementOne,
                        onLevelMovementOneChange,
                        "movement-one-level"
                      )}
                    </div>
                  </div>
                </div>
              </div>
                
              {/* Sub-acordeón Movimiento Dos */}
              <div className="collapse collapse-plus border-b border-base-300">
                <input type="checkbox" name="movement-two-accordion" />
                <div className="collapse-title text-lg font-medium px-0">
                  <span>Movimiento Dos</span>
                </div>
                <div className="collapse-content px-0">
                  <div className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderSelectControl(
                        "Tipo de movimiento",
                        MOVEMENT_TYPES,
                        typeMovementTwo,
                        onMovementTwoChange,
                        "movement-two-type"
                      )}
                      {renderSelectControl(
                        "Nivel de movimiento",
                        MOVEMENT_LEVELS,
                        levelMovementTwo,
                        onLevelMovementTwoChange,
                        "movement-two-level"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Logos */}
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="checkbox" name="config-accordion" />
          <div className="collapse-title text-xl font-semibold">
            <div className="flex items-center gap-3">
              <FiImage className="w-5 h-5" />
              <span>Logos y Símbolos</span>
            </div>
          </div>
          <div className="collapse-content">
            <div className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSelectControl(
                  "Logo de generación",
                  GEN_LOGO,
                  genLogo,
                  onGenLogoChange,
                  "gen-logo-select"
                )}
                {renderSelectControl(
                  "Logo largo",
                  LONG_LOGO,
                  longLogo,
                  onLongLogoChange,
                  "long-logo-select"
                )}
                {renderSelectControl(
                  "Logo de clase",
                  CLASSES,
                  classLogo,
                  onClassLogoChange,
                  "class-logo-select"
                )}
                {renderSelectControl(
                  "Logo de afiliación",
                  AFILIATIONS,
                  affiliationLogo,
                  onAffiliationLogoChange,
                  "affiliation-logo-select"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de descarga flotante */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={onDownloadCard}
          className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          aria-label="Descargar carta en PNG"
        >
          <FiDownload className="w-5 h-5" />
          Descargar PNG
        </button>
      </div>
    </div>
  );
}

export default Panel;