import "../styles/card.css";
import Movement from "./movement";
import { useState, useEffect, useRef, useCallback, useMemo, forwardRef } from "react";

/**
 * Componente Card - Carta de personaje con imagen, HP, nombre y movimientos
 * @param {Object} props - Props del componente
 * @param {string} props.backgroundColor - Color de fondo de la carta
 * @param {string} props.borderColor - Color del borde principal de la carta
 * @param {string} props.imageBorderColor - Color del borde de la imagen del personaje
 * @param {string} props.textColor - Color del texto
 * @param {string} props.texture - URL de la textura de fondo
 * @param {string} props.typeMovementOne - Tipo del primer movimiento
 * @param {string} props.typeMovementTwo - Tipo del segundo movimiento
 * @param {string} props.levelMovementOne - Nivel del primer movimiento
 * @param {string} props.levelMovementTwo - Nivel del segundo movimiento
 * @param {string} props.genLogo - Logo de generación
 * @param {string} props.classLogo - Logo de clase
 * @param {string} props.longLogo - Logo largo
 * @param {string} props.affiliationLogo - Logo de afiliación
 * @param {string} props.image - Imagen del personaje (por defecto: "character.png")
 * @param {function} props.onImageChange - Callback para cambio de imagen
 * @param {React.Ref} ref - Referencia para capturar el componente
 */
const Card = forwardRef(({
  backgroundColor,
  borderColor,
  imageBorderColor,
  textColor,
  texture,
  typeMovementOne,
  typeMovementTwo,
  levelMovementOne,
  levelMovementTwo,
  genLogo,
  classLogo,
  longLogo,
  affiliationLogo,
  image,
  onImageChange,
}, ref) => {
  // Estados del componente
  const [isEditing, setIsEditing] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [minScale, setMinScale] = useState(1);
  const [clickTimeout, setClickTimeout] = useState(null);

  // Referencias
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  /**
   * Utilidad para limitar un valor entre un mínimo y máximo
   * @param {number} value - Valor a limitar
   * @param {number} min - Valor mínimo
   * @param {number} max - Valor máximo
   * @returns {number} Valor limitado
   */
  const clamp = useCallback((value, min, max) => Math.min(Math.max(value, min), max), []);

  /**
   * Actualiza la posición de la imagen con límites
   * @param {number} newX - Nueva posición X
   * @param {number} newY - Nueva posición Y
   */
  const updatePosition = useCallback((newX, newY) => {
    if (!isEditing) return;

    // Solo aplicar límites si la imagen es más grande que el contenedor
    if (containerRef.current && imgRef.current && scale > minScale) {
      const contWidth = containerRef.current.offsetWidth;
      const contHeight = containerRef.current.offsetHeight;
      const imgWidth = imgRef.current.naturalWidth * scale;
      const imgHeight = imgRef.current.naturalHeight * scale;

      const maxX = Math.max(0, (imgWidth - contWidth) / 2);
      const maxY = Math.max(0, (imgHeight - contHeight) / 2);

      setPosition({
        x: clamp(newX, -maxX, maxX),
        y: clamp(newY, -maxY, maxY),
      });
    } else {
      // Si la imagen no es más grande, mantener centrada
      setPosition({ x: 0, y: 0 });
    }
  }, [isEditing, scale, minScale, clamp]);

  /**
   * Maneja eventos de movimiento del mouse/touch
   * @param {number} clientX - Posición X del evento
   * @param {number} clientY - Posición Y del evento
   */
  const handleMove = useCallback((clientX, clientY) => {
    if (!isEditing || !dragging) return;
    const dx = clientX - lastPos.x;
    const dy = clientY - lastPos.y;
    updatePosition(position.x + dx, position.y + dy);
    setLastPos({ x: clientX, y: clientY });
  }, [isEditing, dragging, lastPos, position, updatePosition]);

  /**
   * Inicia el arrastre con las coordenadas proporcionadas
   * @param {number} clientX - Posición X inicial
   * @param {number} clientY - Posición Y inicial
   */
  const startDrag = useCallback((clientX, clientY) => {
    if (!isEditing) return;
    setDragging(true);
    setLastPos({ x: clientX, y: clientY });
  }, [isEditing]);

  /**
   * Finaliza el arrastre
   */
  const endDrag = useCallback(() => {
    setDragging(false);
    setLastPos({});
  }, []);

  /**
   * Maneja el cambio de archivo de imagen
   * @param {Event} e - Evento del input file
   */
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file && onImageChange) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = '';
  }, [onImageChange]);

  /**
   * Maneja el click en la imagen (single click = subir imagen, double click = modo editor)
   * @param {Event} e - Evento del click
   */
  const handleImageClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (clickTimeout) {
      // Es un doble click - activar modo editor
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      setIsEditing(!isEditing);
    } else {
      // Es un single click - esperar para ver si hay doble click
      const timeout = setTimeout(() => {
        // Solo single click - abrir selector de archivo
        if (!isEditing && fileInputRef.current) {
          fileInputRef.current.click();
        }
        setClickTimeout(null);
      }, 250); // 250ms para detectar doble click
      
      setClickTimeout(timeout);
    }
  }, [clickTimeout, isEditing]);

  // Calcular escala mínima cuando cambia la imagen
  useEffect(() => {
    if (containerRef.current && imgRef.current) {
      const contWidth = containerRef.current.offsetWidth;
      const contHeight = containerRef.current.offsetHeight;
      const imgWidth = imgRef.current.naturalWidth;
      const imgHeight = imgRef.current.naturalHeight;

      if (imgWidth > 0 && imgHeight > 0) {
        // Calcular la escala para que cubra completamente (como object-cover)
        const scaleX = contWidth / imgWidth;
        const scaleY = contHeight / imgHeight;
        const coverScale = Math.max(scaleX, scaleY);

        setMinScale(coverScale);
        setScale(coverScale);
        setPosition({ x: 0, y: 0 });
      }
    }
  }, [image]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);

  // Handlers de eventos optimizados
  const handleWheel = useCallback((e) => {
    if (!isEditing) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const newScale = Math.max(minScale, scale + delta);
    setScale(newScale);
    updatePosition(position.x, position.y);
  }, [isEditing, minScale, scale, position, updatePosition]);

  const handleMouseDown = useCallback((e) => {
    if (isEditing) {
      startDrag(e.clientX, e.clientY);
    }
  }, [isEditing, startDrag]);

  const handleMouseMove = useCallback((e) => handleMove(e.clientX, e.clientY), [handleMove]);

  const handleTouchStart = useCallback((e) => {
    if (!isEditing || e.touches.length !== 1) return;
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, [isEditing, startDrag]);

  const handleTouchMove = useCallback((e) => {
    if (!isEditing) return;
    
    if (e.touches.length === 1 && dragging) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      // Pinch zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (!lastPos.dist) {
        setLastPos((prev) => ({ ...prev, dist }));
      } else {
        const delta = (dist - lastPos.dist) / 200;
        setScale((prev) => Math.max(minScale, prev + delta));
        setLastPos((prev) => ({ ...prev, dist }));
      }
    }
  }, [isEditing, dragging, handleMove, lastPos.dist, minScale]);

  // Estilos memoizados para optimizar renders
  const cardStyles = useMemo(() => ({
    backgroundColor,
    borderColor,
    color: textColor,
    backgroundImage: `url(${texture})`,
    backgroundBlendMode: "multiply",
    backgroundSize: "cover",
    boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)",
  }), [backgroundColor, borderColor, textColor, texture]);

  const imageStyles = useMemo(() => ({
    boxShadow: "0 4px 8px 1px rgba(0,0,0,0.3),inset 0 0 10px rgba(0,0,0,0.5)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderColor: imageBorderColor,
    overflow: "hidden",
    position: "relative",
    cursor: isEditing ? (dragging ? 'grabbing' : 'grab') : 'pointer',
  }), [imageBorderColor, isEditing, dragging]);

  const imageTransformStyle = useMemo(() => ({
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    transition: dragging ? "none" : "transform 0.1s ease-out",
    touchAction: "none",
    transformOrigin: "center center",
    maxWidth: "none",
    maxHeight: "none",
  }), [position.x, position.y, scale, dragging]);

  // Configuración de inputs optimizada
  const INPUT_CONFIG = useMemo(() => ({
    name: {
      className: "text-xl w-full bg-transparent border-none outline-none",
      type: "text",
      name: "name",
      id: "name",
      defaultValue: "Character Name",
    },
    hp: {
      className: "w-16 text-right bg-transparent border-none outline-none hp-input me-1",
      type: "number",
      defaultValue: 100,
      min: 0,
      max: 10000,
      step: 25,
    },
  }), []);

  /**
   * Renderiza un input con la configuración especificada
   * @param {string} configKey - Clave de configuración del input
   * @returns {JSX.Element} Input configurado
   */
  const renderInput = useCallback((configKey) => (
    <input {...INPUT_CONFIG[configKey]} />
  ), [INPUT_CONFIG]);

  /**
   * Renderiza la sección de cabecera con nombre, HP y logo
   * @returns {JSX.Element} Cabecera de la carta
   */
  const renderHeader = useCallback(() => (
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
  ), [renderInput, genLogo]);

  /**
   * Renderiza la imagen principal del personaje
   * @returns {JSX.Element} Contenedor de la imagen principal
   */
  const renderMainImage = useCallback(() => (
    <div className="w-full h-2/5 flex justify-center items-center">
      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <div
        ref={containerRef}
        className="border-5 w-5/6 h-full bg-white overflow-hidden flex items-center justify-center"
        style={imageStyles}
        onClick={handleImageClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={endDrag}
      >
        <img
          ref={imgRef}
          src={image}
          alt="Character"
          className="card-image select-none"
          style={imageTransformStyle}
          draggable={false}
        />
        {isEditing && (
          <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded pointer-events-none">
            Editando (scroll/pinch = zoom, arrastra = mover, doble click = salir)
          </div>
        )}
      </div>
    </div>
  ), [imageStyles, handleImageClick, handleWheel, handleMouseDown, handleMouseMove, endDrag, 
      handleTouchStart, handleTouchMove, image, imageTransformStyle, isEditing, handleFileChange]);

  /**
   * Renderiza la sección de movimientos
   * @returns {JSX.Element} Sección con los movimientos del personaje
   */
  const renderMovements = useCallback(() => (
    <div className="flex flex-col p-3 pb-0 px-5">
      <Movement type={typeMovementOne} level={levelMovementOne} />
      <Movement type={typeMovementTwo} level={levelMovementTwo} />
    </div>
  ), [typeMovementOne, levelMovementOne, typeMovementTwo, levelMovementTwo]);

  /**
   * Renderiza la línea divisoria inferior
   * @returns {JSX.Element} Línea divisoria
   */
  const renderDivider = useCallback(() => (
    <div className="flex items-center justify-center">
      <div className="bg-black w-9/10 h-0.5 rounded-2xl" />
    </div>
  ), []);

  /**
   * Renderiza el footer con los logos
   * @returns {JSX.Element} Footer de la carta
   */
  const renderFooter = useCallback(() => (
    <div className="flex items-center justify-center h-20 p-3 gap-2">
      <div className="w-1/5 flex items-center justify-center">
        <img
          src={classLogo}
          alt=""
          className="max-h-full max-w-full object-contain drop-shadow-[0_0_3px_black]"
        />
      </div>
      <div className="flex items-center justify-center w-3/5">
        <img
          src={longLogo}
          alt=""
          className="max-h-full max-w-full object-contain drop-shadow-[0_0_3px_black]"
        />
      </div>
      {affiliationLogo !== "" && (
        <div className="w-1/5 flex items-center justify-center">
          <img
            src={affiliationLogo}
            alt=""
            className="max-h-full max-w-full object-contain drop-shadow-[0_0_3px_black]"
          />
        </div>
      )}
    </div>
  ), [classLogo, longLogo, affiliationLogo]);

  return (
    <div 
      ref={ref} 
      className="border-8 flex flex-col w-90 h-150 m-3" 
      style={cardStyles}
    >
      {renderHeader()}
      {renderMainImage()}
      {renderMovements()}
      {renderDivider()}
      {renderFooter()}
    </div>
  );
});

// Añadir displayName para debugging
Card.displayName = 'Card';

export default Card;