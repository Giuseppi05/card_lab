import "./App.css";
import Card from "./components/card";
import Panel from "./components/panel";
import { useState, useRef } from "react";
import { toCanvas } from "html-to-image";

/**
 * Componente principal de la aplicación
 * Maneja el estado global para la personalización de cartas de personajes
 */
function App() {
  // Configuración inicial del estado
  const INITIAL_STATE = {
    colors: {
      bg: "#fbbf24",
      border: "#fbbf24",
      imageBorder: "#fbbf24",
      text: "#000",
    },
    texture: "",
    movements: {
      one: { type: "active-attack", level: "none" },
      two: { type: "active-attack", level: "none" },
    },
    logos: {
      gen: "logos/g4_post.png",
      long: "logos/animated_logo.png",
      class: "classes/piratas.png",
      affiliation: "",
    },
    image: "placeholder_image.png",
  };

  // Estados para colores
  const [bgColor, setBgColor] = useState(INITIAL_STATE.colors.bg);
  const [borderColor, setBorderColor] = useState(INITIAL_STATE.colors.border);
  const [imageBorderColor, setImageBorderColor] = useState(
    INITIAL_STATE.colors.imageBorder
  );
  const [textColor, setTextColor] = useState(INITIAL_STATE.colors.text);

  // Estado para textura
  const [texture, setTexture] = useState(INITIAL_STATE.texture);

  // Estados para movimientos
  const [typeMovementOne, setTypeMovementOne] = useState(
    INITIAL_STATE.movements.one.type
  );
  const [levelMovementOne, setLevelMovementOne] = useState(
    INITIAL_STATE.movements.one.level
  );
  const [typeMovementTwo, setTypeMovementTwo] = useState(
    INITIAL_STATE.movements.two.type
  );
  const [levelMovementTwo, setLevelMovementTwo] = useState(
    INITIAL_STATE.movements.two.level
  );

  // Estado para logos
  const [genLogo, setGenLogo] = useState(INITIAL_STATE.logos.gen);
  const [longLogo, setLongLogo] = useState(INITIAL_STATE.logos.long);
  const [classLogo, setClassLogo] = useState(INITIAL_STATE.logos.class);
  const [affiliationLogo, setAffiliationLogo] = useState(
    INITIAL_STATE.logos.affiliation
  );

  //Estado para imagen
  const [image, setImage] = useState(INITIAL_STATE.image);

  const cardRef = useRef(null);

  // Luego reemplaza handleDownload con esta versión:
  const handleDownload = async () => {
    if (cardRef.current === null) return;

    try {
      const originalElement = cardRef.current;
      // Buscar el input del nombre dentro del elemento
      const nameInput = originalElement.querySelector('input[name="name"]');
      const cardName = nameInput?.value || "carta";

      const rect = originalElement.getBoundingClientRect();

      const options = {
        cacheBust: true,
        pixelRatio: 2,
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height),
        style: {
          margin: "0",
          padding: "0",
          boxSizing: "border-box",
        },
      };

      const canvas = await toCanvas(originalElement, options);

      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          // Limpiar el nombre para que sea válido como nombre de archivo
          const fileName = cardName
            .replace(/[^a-z0-9\s]/gi, "") // Remover caracteres especiales
            .replace(/\s+/g, "_") // Reemplazar espacios con guiones bajos
            .toLowerCase();
          link.download = `${fileName}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        },
        "image/png",
        1.0
      );
    } catch (err) {
      console.error("Error exportando la carta:", err);
      alert("Error al descargar la imagen. Intenta de nuevo.");
    }
  };

  // Props agrupadas para Card
  const cardProps = {
    backgroundColor: bgColor,
    borderColor,
    imageBorderColor,
    textColor,
    texture,
    typeMovementOne,
    typeMovementTwo,
    levelMovementOne,
    levelMovementTwo,
    genLogo,
    longLogo,
    classLogo,
    affiliationLogo,
    image,
    onImageChange: setImage,
  };

  // Props agrupadas para Panel
  const panelProps = {
    // Color handlers
    onColorChange: setBgColor,
    onBorderColor: setBorderColor,
    onImageBorderColor: setImageBorderColor,
    onTextColor: setTextColor,

    // Color values
    bgColor,
    borderColor,
    imageBorderColor,
    textColor,

    // Texture handlers and values
    onTextureChange: setTexture,
    texture,

    // Movement handlers
    onMovementOneChange: setTypeMovementOne,
    onMovementTwoChange: setTypeMovementTwo,
    onLevelMovementOneChange: setLevelMovementOne,
    onLevelMovementTwoChange: setLevelMovementTwo,

    // Movement values
    typeMovementOne,
    typeMovementTwo,
    levelMovementOne,
    levelMovementTwo,

    // Logo Handlers
    onGenLogoChange: setGenLogo,
    onLongLogoChange: setLongLogo,
    onClassLogoChange: setClassLogo,
    onAffiliationLogoChange: setAffiliationLogo,

    // Logo values
    genLogo,
    longLogo,
    classLogo,
    affiliationLogo,

    // Handler Image
    onDownloadCard: handleDownload,
  };

  /**
   * Renderiza el componente Card con todas sus props
   * @returns {JSX.Element} Componente Card configurado
   */
  const renderCard = () => <Card ref={cardRef} {...cardProps} />;

  /**
   * Renderiza el componente Panel con todas sus props
   * @returns {JSX.Element} Componente Panel configurado
   */
  const renderPanel = () => <Panel {...panelProps} />;

  return (
    <div className="h-screen w-screen flex">
      {/* Sidebar fijo para pantallas grandes */}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header con botón hamburguesa para móvil */}
        <div className="lg:hidden flex justify-between items-center p-4 bg-base-100 border-b">
          <h1 className="text-xl font-semibold">Mi App</h1>
          <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </div>

        {/* Área del contenido principal centrado */}
        <div className="flex h-full">
          
          <div className="flex-1 flex justify-center items-center p-4">
            {renderCard()}
          </div>

          <div className="hidden lg:flex lg:w-120 lg:flex-shrink-0">
            <div className="w-full text-base-content overflow-y-auto">
              {renderPanel()}
            </div>
          </div>

        </div>
      </div>

      {/* Drawer para móvil */}
      <div className="drawer drawer-end lg:hidden">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu bg-base-200 min-h-full w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Menú</h2>
              <label
                htmlFor="my-drawer-4"
                className="btn btn-square btn-ghost btn-sm text-2xl"
              >
                ✕
              </label>
            </div>
            {renderPanel()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
