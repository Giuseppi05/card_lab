import "./App.css";
import Card from "./components/card";
import Panel from "./components/panel";
import { useState, useRef, useEffect } from "react";
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
    characterName: "Character Name",
    hp: 100,
    movements: {
      one: { type: "active-attack", level: "none", name: "Movement Name", desc: "Description Movement", dmg: 100 },
      two: { type: "active-attack", level: "none", name: "Movement Name", desc: "Description Movement", dmg: 100 },
    },
    logos: {
      gen: "logos/g5.png",
      long: "logos/animated_logo.png",
      class: "classes/piratas.png",
      affiliation: "",
      mark: false
    },
    image: "placeholder_image.png",
  };

  // Funciones para LocalStorage
  const loadState = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`card_lab_${key}`);
      return saved !== null ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Error loading state ${key}`, e);
      return fallback;
    }
  };

  const saveState = (key, value) => {
    try {
      localStorage.setItem(`card_lab_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving state ${key}`, e);
    }
  };

  // Estados para colores
  const [bgColor, setBgColor] = useState(() => loadState("bgColor", INITIAL_STATE.colors.bg));
  const [borderColor, setBorderColor] = useState(() => loadState("borderColor", INITIAL_STATE.colors.border));
  const [imageBorderColor, setImageBorderColor] = useState(() => loadState("imageBorderColor", INITIAL_STATE.colors.imageBorder));
  const [textColor, setTextColor] = useState(() => loadState("textColor", INITIAL_STATE.colors.text));

  // Estado para textura
  const [texture, setTexture] = useState(() => loadState("texture", INITIAL_STATE.texture));

  // Estados para movimientos
  const [typeMovementOne, setTypeMovementOne] = useState(() => loadState("typeMovementOne", INITIAL_STATE.movements.one.type));
  const [levelMovementOne, setLevelMovementOne] = useState(() => loadState("levelMovementOne", INITIAL_STATE.movements.one.level));
  const [typeMovementTwo, setTypeMovementTwo] = useState(() => loadState("typeMovementTwo", INITIAL_STATE.movements.two.type));
  const [levelMovementTwo, setLevelMovementTwo] = useState(() => loadState("levelMovementTwo", INITIAL_STATE.movements.two.level));

  // Estados para textos
  const [characterName, setCharacterName] = useState(() => loadState("characterName", INITIAL_STATE.characterName));
  const [hp, setHp] = useState(() => loadState("hp", INITIAL_STATE.hp));
  const [movementOneName, setMovementOneName] = useState(() => loadState("movementOneName", INITIAL_STATE.movements.one.name));
  const [movementOneDesc, setMovementOneDesc] = useState(() => loadState("movementOneDesc", INITIAL_STATE.movements.one.desc));
  const [movementOneDmg, setMovementOneDmg] = useState(() => loadState("movementOneDmg", INITIAL_STATE.movements.one.dmg));
  const [movementTwoName, setMovementTwoName] = useState(() => loadState("movementTwoName", INITIAL_STATE.movements.two.name));
  const [movementTwoDesc, setMovementTwoDesc] = useState(() => loadState("movementTwoDesc", INITIAL_STATE.movements.two.desc));
  const [movementTwoDmg, setMovementTwoDmg] = useState(() => loadState("movementTwoDmg", INITIAL_STATE.movements.two.dmg));

  // Estado para logos
  const [genLogo, setGenLogo] = useState(() => loadState("genLogo", INITIAL_STATE.logos.gen));
  const [longLogo, setLongLogo] = useState(() => loadState("longLogo", INITIAL_STATE.logos.long));
  const [classLogo, setClassLogo] = useState(() => loadState("classLogo", INITIAL_STATE.logos.class));
  const [affiliationLogo, setAffiliationLogo] = useState(() => loadState("affiliationLogo", INITIAL_STATE.logos.affiliation));
  const [mark, setMark] = useState(() => loadState("mark", INITIAL_STATE.logos.mark));

  //Estado para imagen
  const [image, setImage] = useState(() => loadState("image", INITIAL_STATE.image));

  // Guardar cambios en el localStorage automáticamente
  useEffect(() => saveState("bgColor", bgColor), [bgColor]);
  useEffect(() => saveState("borderColor", borderColor), [borderColor]);
  useEffect(() => saveState("imageBorderColor", imageBorderColor), [imageBorderColor]);
  useEffect(() => saveState("textColor", textColor), [textColor]);
  useEffect(() => saveState("texture", texture), [texture]);
  useEffect(() => saveState("typeMovementOne", typeMovementOne), [typeMovementOne]);
  useEffect(() => saveState("levelMovementOne", levelMovementOne), [levelMovementOne]);
  useEffect(() => saveState("typeMovementTwo", typeMovementTwo), [typeMovementTwo]);
  useEffect(() => saveState("levelMovementTwo", levelMovementTwo), [levelMovementTwo]);
  useEffect(() => saveState("characterName", characterName), [characterName]);
  useEffect(() => saveState("hp", hp), [hp]);
  useEffect(() => saveState("movementOneName", movementOneName), [movementOneName]);
  useEffect(() => saveState("movementOneDesc", movementOneDesc), [movementOneDesc]);
  useEffect(() => saveState("movementOneDmg", movementOneDmg), [movementOneDmg]);
  useEffect(() => saveState("movementTwoName", movementTwoName), [movementTwoName]);
  useEffect(() => saveState("movementTwoDesc", movementTwoDesc), [movementTwoDesc]);
  useEffect(() => saveState("movementTwoDmg", movementTwoDmg), [movementTwoDmg]);
  useEffect(() => saveState("genLogo", genLogo), [genLogo]);
  useEffect(() => saveState("longLogo", longLogo), [longLogo]);
  useEffect(() => saveState("classLogo", classLogo), [classLogo]);
  useEffect(() => saveState("affiliationLogo", affiliationLogo), [affiliationLogo]);
  useEffect(() => saveState("mark", mark), [mark]);
  // Nota: No es recomendable guardar la imagen base64 completa en localStorage siempre por su límite de 5MB,
  // pero lo haremos para esta demostración. Puede requerir compresión de imagen si es muy pesada.
  useEffect(() => {
    try {
      saveState("image", image);
    } catch {
       console.log("Image might be too large for localstorage!");
    }
  }, [image]);

  const resetToDefault = () => {
    if(confirm("¿Estás seguro de que deseas limpiar la carta a los ajustes de fábrica?")) {
      setBgColor(INITIAL_STATE.colors.bg);
      setBorderColor(INITIAL_STATE.colors.border);
      setImageBorderColor(INITIAL_STATE.colors.imageBorder);
      setTextColor(INITIAL_STATE.colors.text);
      setTexture(INITIAL_STATE.texture);
      setTypeMovementOne(INITIAL_STATE.movements.one.type);
      setLevelMovementOne(INITIAL_STATE.movements.one.level);
      setTypeMovementTwo(INITIAL_STATE.movements.two.type);
      setLevelMovementTwo(INITIAL_STATE.movements.two.level);
      setCharacterName(INITIAL_STATE.characterName);
      setHp(INITIAL_STATE.hp);
      setMovementOneName(INITIAL_STATE.movements.one.name);
      setMovementOneDesc(INITIAL_STATE.movements.one.desc);
      setMovementOneDmg(INITIAL_STATE.movements.one.dmg);
      setMovementTwoName(INITIAL_STATE.movements.two.name);
      setMovementTwoDesc(INITIAL_STATE.movements.two.desc);
      setMovementTwoDmg(INITIAL_STATE.movements.two.dmg);
      setGenLogo(INITIAL_STATE.logos.gen);
      setLongLogo(INITIAL_STATE.logos.long);
      setClassLogo(INITIAL_STATE.logos.class);
      setAffiliationLogo(INITIAL_STATE.logos.affiliation);
      setMark(INITIAL_STATE.logos.mark);
      setImage(INITIAL_STATE.image);
      localStorage.clear();
    }
  };

  // Estado para el loader de descarga
  const [isDownloading, setIsDownloading] = useState(false);

  const cardRef = useRef(null);

  // Luego reemplaza handleDownload con esta versión:
  const handleDownload = async () => {
    if (cardRef.current === null || isDownloading) return;
    setIsDownloading(true);

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
          document.body.appendChild(link); // Añadir al DOM para iOS/Mobile
          link.click();
          document.body.removeChild(link); // Remover del DOM
          // 2. Darle margen de tiempo al navegador para procesar la descarga antes de limpiar la memoria
          setTimeout(() => {
            URL.revokeObjectURL(url);
            setIsDownloading(false);
          }, 100);
        },
        "image/png",
        1.0
      );
    } catch (err) {
      console.error("Error exportando la carta:", err);
      alert("Error al descargar la imagen. Intenta de nuevo.");
      setIsDownloading(false);
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
    mark,
    image,
    onImageChange: setImage,
    characterName,
    onCharacterNameChange: setCharacterName,
    hp,
    onHpChange: setHp,
    movementOneName,
    onMovementOneNameChange: setMovementOneName,
    movementOneDesc,
    onMovementOneDescChange: setMovementOneDesc,
    movementOneDmg,
    onMovementOneDmgChange: setMovementOneDmg,
    movementTwoName,
    onMovementTwoNameChange: setMovementTwoName,
    movementTwoDesc,
    onMovementTwoDescChange: setMovementTwoDesc,
    movementTwoDmg,
    onMovementTwoDmgChange: setMovementTwoDmg,
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
    onMarkChange: setMark,

    // Logo values
    genLogo,
    longLogo,
    classLogo,
    affiliationLogo,
    mark,

    // Handler Image
    onDownloadCard: handleDownload,
    isDownloading,

    // Handler Reset
    onResetData: resetToDefault,
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