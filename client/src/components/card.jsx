import "../styles/card.css";
import {
  useMemo,
  forwardRef,
} from "react";
import Header from "./card_parts/header";
import ImageContainer from "./card_parts/image";
import MovsContainer from "./card_parts/movsContainer";
import Footer from "./card_parts/footer";

const Card = forwardRef(
  (
    {
      //GENERAL
      backgroundColor,
      borderColor,
      imageBorderColor,
      textColor,
      texture,
      
      //MOVIMIENTOS
      typeMovementOne,
      typeMovementTwo,
      levelMovementOne,
      levelMovementTwo,

      //LOGOS
      genLogo,
      classLogo,
      longLogo,
      affiliationLogo,
      mark,
      
      //IMAGEN
      image,
      onImageChange,
    },
    ref
  ) => {
    // Estilos memoizados para optimizar renders
    const cardStyles = useMemo(
      () => ({
        backgroundColor,
        borderColor,
        color: textColor,
        backgroundImage: `url(${texture})`,
        backgroundBlendMode: "multiply",
        backgroundSize: "cover",
        boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)",
      }),
      [backgroundColor, borderColor, textColor, texture]
    );

    return (
      <div
        ref={ref}
        className="border-8 flex flex-col w-90 h-150 m-3"
        style={cardStyles}
      >
        <Header genLogo={genLogo} />

        <ImageContainer
          image={image}
          onImageChange={onImageChange}
          imageBorderColor={imageBorderColor}
        />
        
        <MovsContainer 
          typeMovementOne={typeMovementOne}
          levelMovementOne={levelMovementOne}
          typeMovementTwo={typeMovementTwo}
          levelMovementTwo={levelMovementTwo}
        />

        <Footer 
          classLogo={classLogo}
          longLogo={longLogo}
          affiliationLogo={affiliationLogo}
          mark={mark}
        />
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;