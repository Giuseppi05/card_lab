import Movement from "./movement";

export default function MovsContainer({
  typeMovementOne,
  levelMovementOne,
  typeMovementTwo,
  levelMovementTwo,
}) {
  /**
   * Renderiza la sección de movimientos
   * @returns {JSX.Element} Sección con los movimientos del personaje
   */
  return (
    <>
      <div className="flex flex-col p-3 pb-0 px-5">
        <Movement type={typeMovementOne} level={levelMovementOne} />
        <Movement type={typeMovementTwo} level={levelMovementTwo} />
      </div>
      <div className="flex items-center justify-center">
        <div className="bg-black w-9/10 h-0.5 rounded-2xl" />
      </div>
    </>
  );
}
