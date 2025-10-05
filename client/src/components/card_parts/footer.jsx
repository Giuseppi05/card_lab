export default function Footer({ classLogo, longLogo, affiliationLogo, mark }) {
  return (
    <div className="flex items-center justify-center h-20 p-3 gap-2">
      <div className="w-1/5 flex items-center justify-center">
        <img
          src={classLogo}
          alt=""
          className="max-h-full max-w-full object-contain drop-shadow-[0_0_2px_black]"
        />
      </div>
      <div className="flex items-center justify-center w-3/5">
        <img
          src={longLogo}
          alt=""
          className="max-h-full max-w-full object-contain drop-shadow-[0_0_2px_black]"
        />
      </div>
      {affiliationLogo !== "" && (
        <div className="w-1/5 flex items-center justify-center relative">
          {mark && (
            <img
              src="utils/aspa.png"
              alt=""
              className="absolute z-10 inset-0 m-auto max-h-full max-w-full object-contain"
            />
          )}
          <img
            src={affiliationLogo}
            alt=""
            className="max-h-full max-w-full object-contain drop-shadow-[0_0_2px_black]"
          />
        </div>
      )}
    </div>
  );
}
