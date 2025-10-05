import { useRef, useCallback, useEffect, useMemo, useState } from "react";

export default function ImageContainer({ image, onImageChange, imageBorderColor }) {
  const [isEditing, setIsEditing] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [minScale, setMinScale] = useState(1);
  const [clickTimeout, setClickTimeout] = useState(null);

  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const clamp = useCallback((value, min, max) => Math.min(Math.max(value, min), max), []);

  const updatePosition = useCallback(
    (newX, newY) => {
      if (!isEditing) return;

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
        setPosition({ x: 0, y: 0 });
      }
    },
    [isEditing, scale, minScale, clamp]
  );

  const handleMove = useCallback(
    (clientX, clientY) => {
      if (!isEditing || !dragging) return;
      const dx = clientX - lastPos.x;
      const dy = clientY - lastPos.y;
      updatePosition(position.x + dx, position.y + dy);
      setLastPos({ x: clientX, y: clientY });
    },
    [isEditing, dragging, lastPos, position, updatePosition]
  );

  const startDrag = useCallback((clientX, clientY) => {
    if (!isEditing) return;
    setDragging(true);
    setLastPos({ x: clientX, y: clientY });
  }, [isEditing]);

  const endDrag = useCallback(() => {
    setDragging(false);
    setLastPos({});
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file && onImageChange) {
        const reader = new FileReader();
        reader.onloadend = () => onImageChange(reader.result);
        reader.readAsDataURL(file);
      }
      e.target.value = "";
    },
    [onImageChange]
  );

  const handleImageClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (clickTimeout) {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
        setIsEditing(!isEditing);
      } else {
        const timeout = setTimeout(() => {
          if (!isEditing && fileInputRef.current) {
            fileInputRef.current.click();
          }
          setClickTimeout(null);
        }, 250);

        setClickTimeout(timeout);
      }
    },
    [clickTimeout, isEditing]
  );

  useEffect(() => {
    if (containerRef.current && imgRef.current) {
      const contWidth = containerRef.current.offsetWidth;
      const contHeight = containerRef.current.offsetHeight;
      const imgWidth = imgRef.current.naturalWidth;
      const imgHeight = imgRef.current.naturalHeight;

      if (imgWidth > 0 && imgHeight > 0) {
        const scaleX = contWidth / imgWidth;
        const scaleY = contHeight / imgHeight;
        const coverScale = Math.max(scaleX, scaleY);

        setMinScale(coverScale);
        setScale(coverScale);
        setPosition({ x: 0, y: 0 });
      }
    }
  }, [image]);

  useEffect(() => {
    return () => {
      if (clickTimeout) clearTimeout(clickTimeout);
    };
  }, [clickTimeout]);

  const handleWheel = useCallback(
    (e) => {
      if (!isEditing) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      const newScale = Math.max(minScale, scale + delta);
      setScale(newScale);
      updatePosition(position.x, position.y);
    },
    [isEditing, minScale, scale, position, updatePosition]
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (isEditing) startDrag(e.clientX, e.clientY);
    },
    [isEditing, startDrag]
  );

  const handleMouseMove = useCallback((e) => handleMove(e.clientX, e.clientY), [handleMove]);

  const handleTouchStart = useCallback(
    (e) => {
      if (!isEditing || e.touches.length !== 1) return;
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    },
    [isEditing, startDrag]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isEditing) return;

      if (e.touches.length === 1 && dragging) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
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
    },
    [isEditing, dragging, handleMove, lastPos.dist, minScale]
  );

  const imageStyles = useMemo(
    () => ({
      boxShadow: "0 4px 8px 1px rgba(0,0,0,0.3),inset 0 0 10px rgba(0,0,0,0.5)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderColor: imageBorderColor,
      overflow: "hidden",
      position: "relative",
      cursor: isEditing ? (dragging ? "grabbing" : "grab") : "pointer",
    }),
    [imageBorderColor, isEditing, dragging]
  );

  const imageTransformStyle = useMemo(
    () => ({
      transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
      transition: dragging ? "none" : "transform 0.1s ease-out",
      touchAction: "none",
      transformOrigin: "center center",
      maxWidth: "none",
      maxHeight: "none",
    }),
    [position.x, position.y, scale, dragging]
  );

  return (
    <div className="w-full h-2/5 flex justify-center items-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
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
  );
}