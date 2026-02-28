export default function Header({ genLogo, characterName, onCharacterNameChange, hp, onHpChange }) {
  return (
    <div className="flex justify-between items-center p-3 pb-1">
      <div className="flex-1 mr-2">
        <input
          className="text-xl w-full bg-transparent border-none outline-none"
          type="text"
          name="name"
          id="name"
          value={characterName}
          onChange={(e) => onCharacterNameChange(e.target.value)}
        />
      </div>
      <div className="flex items-center text-xl">
        <input
          className="w-16 text-right bg-transparent border-none outline-none hp-input me-1"
          type="number"
          value={hp}
          min={0}
          max={10000}
          step={25}
          onChange={(e) => onHpChange(Number(e.target.value))}
        />
        <span className="font-bold">HP</span>
        <div className="w-15 h-15 ml-1 flex items-center justify-center">
          <img src={genLogo} alt="logo" />
        </div>
      </div>
    </div>
  );
}