/**
 * Renderiza un control de selección mejorado
 */
export default function selectControl(
  label,
  options,
  value,
  onChange,
  id
) {
  return (
    <div className="form-control w-full">
      <label htmlFor={id} className="label">
        <span className="label-text font-medium text-base-content">
          {label}
        </span>
      </label>
      <select
        id={id}
        key={id}
        className="select select-bordered w-full focus:select-primary"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}