import { FiSettings, FiZap, FiImage, FiDownload } from "react-icons/fi";

// Imports de data
import TEXTURES from "../data/textures.js";
import GEN_LOGO from "../data/genLogo.js";
import LONG_LOGO from "../data/longLogo.js";
import CLASSES from "../data/classesLogo.js";
import AFILIATIONS from "../data/afiliations.js";
import MOVEMENT_TYPES from "../data/movementTypes.js";
import MOVEMENT_LEVELS from "../data/movementLevels.js";

// Imports de componentes
import colorControl from "./panel_parts/colorControl.jsx";
import selectGridControl from "./panel_parts/SelectGridControl.jsx";
import selectControl from "./panel_parts/selectControl.jsx";

// Configuraciones de secciones para reducir repetición
const ACCORDION_SECTIONS = {
  general: {
    icon: FiSettings,
    title: "Configuración General",
    name: "config-accordion",
  },
  movements: {
    icon: FiZap,
    title: "Movimientos",
    name: "config-accordion",
  },
  logos: {
    icon: FiImage,
    title: "Logos y Símbolos",
    name: "config-accordion",
  },
};

const MOVEMENT_CONFIG = [
  {
    name: "movement-one",
    title: "Movimiento Uno",
    typeValue: "typeMovementOne",
    levelValue: "levelMovementOne",
    onTypeChange: "onMovementOneChange",
    onLevelChange: "onLevelMovementOneChange",
  },
  {
    name: "movement-two",
    title: "Movimiento Dos",
    typeValue: "typeMovementTwo",
    levelValue: "levelMovementTwo",
    onTypeChange: "onMovementTwoChange",
    onLevelChange: "onLevelMovementTwoChange",
  },
];

const LOGO_CONFIG = [
  {
    label: "Logo de generación",
    data: GEN_LOGO,
    value: "genLogo",
    handler: "onGenLogoChange",
    id: "gen-logo-select",
  },
  {
    label: "Logo largo",
    data: LONG_LOGO,
    value: "longLogo",
    handler: "onLongLogoChange",
    id: "long-logo-select",
  },
  {
    label: "Logo de clase",
    data: CLASSES,
    value: "classLogo",
    handler: "onClassLogoChange",
    id: "class-logo-select",
  },
  {
    label: "Logo de afiliación",
    data: AFILIATIONS,
    value: "affiliationLogo",
    handler: "onAffiliationLogoChange",
    id: "affiliation-logo-select",
  },
];

/**
 * Componente Panel - Panel de configuración para personalizar colores, texturas y movimientos
 */
function Panel({
  // HANDLER DE COLOR
  onColorChange,
  onBorderColor,
  onImageBorderColor,
  onTextColor,
  // Handler de texturas
  onTextureChange,
  // Handlers de movimientos
  onMovementOneChange,
  onMovementTwoChange,
  onLevelMovementOneChange,
  onLevelMovementTwoChange,
  // Handlers de logos
  onGenLogoChange,
  onLongLogoChange,
  onClassLogoChange,
  onAffiliationLogoChange,
  // Valores de color
  bgColor,
  borderColor,
  imageBorderColor,
  textColor,
  // Valor de textura
  texture,
  // Valores de movimientos
  typeMovementOne,
  typeMovementTwo,
  levelMovementOne,
  levelMovementTwo,
  // Valores de logos
  genLogo,
  longLogo,
  classLogo,
  affiliationLogo,
  // Handler Image
  onDownloadCard,
}) {
  // Mapeo de valores para facilitar acceso dinámico
  const values = {
    typeMovementOne,
    typeMovementTwo,
    levelMovementOne,
    levelMovementTwo,
    genLogo,
    longLogo,
    classLogo,
    affiliationLogo,
  };

  const handlers = {
    onMovementOneChange,
    onMovementTwoChange,
    onLevelMovementOneChange,
    onLevelMovementTwoChange,
    onGenLogoChange,
    onLongLogoChange,
    onClassLogoChange,
    onAffiliationLogoChange,
  };

  // Función para renderizar encabezado de acordeón
  const renderAccordionHeader = (section) => (
    <div className="flex items-center gap-3">
      <section.icon className="w-5 h-5" />
      <span>{section.title}</span>
    </div>
  );

  // Función para renderizar sub-acordeón
  const renderSubAccordion = (name, title, children) => (
    <div key={name} className="collapse collapse-plus border-b border-base-300">
      <input type="checkbox" name={`${name}-accordion`} />
      <div className="collapse-title text-lg font-medium px-0">
        <span>{title}</span>
      </div>
      <div className="collapse-content px-0">
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );

  // Función para renderizar movimientos
  const renderMovementSection = (config) => {
    const typeValue = values[config.typeValue];
    const levelValue = values[config.levelValue];
    const onTypeChange = handlers[config.onTypeChange];
    const onLevelChange = handlers[config.onLevelChange];

    return renderSubAccordion(
      config.name,
      config.title,
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectControl(
          "Tipo de movimiento",
          MOVEMENT_TYPES,
          typeValue,
          onTypeChange,
          `${config.name}-type`
        )}
        {selectControl(
          "Nivel de movimiento",
          MOVEMENT_LEVELS,
          levelValue,
          onLevelChange,
          `${config.name}-level`
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-base-200 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Panel de Configuración</h2>
        <p className="text-base-content/70">
          Personaliza tu carta de One Piece
        </p>
      </div>

      {/* Acordeón de configuración */}
      <div className="join join-vertical bg-base-100 w-full shadow-lg rounded-lg overflow-hidden mb-20">
        {/* Sección General */}
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="checkbox" name={ACCORDION_SECTIONS.general.name} />
          <div className="collapse-title text-xl font-semibold">
            {renderAccordionHeader(ACCORDION_SECTIONS.general)}
          </div>
          <div className="collapse-content">
            <div className="pt-6 space-y-6">
              {/* Sub-acordeón de Colores */}
              {renderSubAccordion(
                "colors",
                "Colores",
                <div className="space-y-6 grid grid-cols-2 gap-5 m-2">
                  {colorControl(
                    "backgroundColor",
                    "Color de fondo",
                    bgColor,
                    onColorChange
                  )}
                  {colorControl(
                    "borderColor",
                    "Color del borde",
                    borderColor,
                    onBorderColor
                  )}
                  {colorControl(
                    "imageBorderColor",
                    "Color del borde de imagen",
                    imageBorderColor,
                    onImageBorderColor
                  )}
                  {colorControl(
                    "textColor",
                    "Color del texto",
                    textColor,
                    onTextColor
                  )}
                </div>
              )}

              {/* Sub-acordeón de Texturas */}
              {renderSubAccordion(
                "textures",
                "Texturas",
                <div className="max-w-md">
                  {selectGridControl(
                    "Textura de fondo",
                    TEXTURES.map((t) => ({ label: t.name, value: t.url })),
                    texture,
                    onTextureChange,
                    "texture-select"
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección Movimientos */}
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="checkbox" name={ACCORDION_SECTIONS.movements.name} />
          <div className="collapse-title text-xl font-semibold">
            {renderAccordionHeader(ACCORDION_SECTIONS.movements)}
          </div>
          <div className="collapse-content">
            <div className="pt-6 space-y-6">
              {MOVEMENT_CONFIG.map((config) => renderMovementSection(config))}
            </div>
          </div>
        </div>

        {/* Sección Logos */}
        {/* Sección Logos */}
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="checkbox" name={ACCORDION_SECTIONS.logos.name} />
          <div className="collapse-title text-xl font-semibold">
            {renderAccordionHeader(ACCORDION_SECTIONS.logos)}
          </div>
          <div className="collapse-content">
            <div className="pt-6 space-y-6">
              {LOGO_CONFIG.map((logo) => {
                const logoValue = values[logo.value];
                const onLogoChange = handlers[logo.handler];

                return (
                  <div key={logo.id}>
                    {renderSubAccordion(
                      logo.id,
                      logo.label,
                      <div className="max-w-md">
                        {selectGridControl(
                          logo.label,
                          logo.data, // ✅ ya tiene { label, value }
                          logoValue,
                          onLogoChange,
                          logo.id
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
