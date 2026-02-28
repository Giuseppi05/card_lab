import Movement from "./movement";

export default function MovsContainer({
  typeMovementOne,
  levelMovementOne,
  typeMovementTwo,
  levelMovementTwo,
  movementOneName,
  onMovementOneNameChange,
  movementOneDesc,
  onMovementOneDescChange,
  movementOneDmg,
  onMovementOneDmgChange,
  movementTwoName,
  onMovementTwoNameChange,
  movementTwoDesc,
  onMovementTwoDescChange,
  movementTwoDmg,
  onMovementTwoDmgChange,
}) {
  return (
    <>
      <div className="flex flex-col p-3 pb-0 px-5">
        <Movement
          type={typeMovementOne}
          level={levelMovementOne}
          movName={movementOneName}
          onNameChange={onMovementOneNameChange}
          desc={movementOneDesc}
          onDescChange={onMovementOneDescChange}
          dmg={movementOneDmg}
          onDmgChange={onMovementOneDmgChange}
        />
        <Movement
          type={typeMovementTwo}
          level={levelMovementTwo}
          movName={movementTwoName}
          onNameChange={onMovementTwoNameChange}
          desc={movementTwoDesc}
          onDescChange={onMovementTwoDescChange}
          dmg={movementTwoDmg}
          onDmgChange={onMovementTwoDmgChange}
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="bg-black w-9/10 h-0.5 rounded-2xl" />
      </div>
    </>
  );
}
