import { useState, useMemo } from "react";
import { TfiSearch } from "react-icons/tfi";
import { FiChevronUp } from "react-icons/fi";

export default function selectGridControl(label, options, value, onChange, id) {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  
  const INITIAL_COUNT = 8;
  const LOAD_MORE_COUNT = 9; // Cargar 9 más cada vez

  // Filtrar opciones basado en el término de búsqueda
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Resetear visibleCount cuando cambia la búsqueda
  useMemo(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [searchTerm]);

  // Opciones visibles actualmente
  const visibleOptions = useMemo(() => {
    return filteredOptions.slice(0, visibleCount);
  }, [filteredOptions, visibleCount]);

  // ¿Hay más opciones para mostrar?
  const hasMore = visibleCount < filteredOptions.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, filteredOptions.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <div className="form-control w-full">
      <div htmlFor={id} className="label">
        <span className="label-text font-medium text-base-content">
          {label}
        </span>
      </div>
      
      {/* Input de búsqueda */}
      <div className="flex items-center m-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full font-mono text-sm"
          placeholder="Buscar..."
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="btn btn-ghost btn-sm ml-2"
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {/* Información de resultados */}
      {filteredOptions.length > 0 && (
        <div className="text-sm text-base-content opacity-70 text-center mb-2">
          Mostrando {visibleOptions.length} de {filteredOptions.length} resultados
        </div>
      )}

      {/* Grid de opciones */}
      <div className="border border-base-300 rounded-lg bg-base-100">
        <div className="grid grid-cols-3 gap-3 p-4">
          {visibleOptions.length > 0 ? (
            <>
              {/* Renderizar opciones visibles */}
              {visibleOptions.map((option) => (
                <div
                  key={option.value}
                  className={`
                    relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105
                    ${
                      value === option.value
                        ? "border-primary shadow-lg ring-2 ring-primary ring-opacity-50"
                        : "border-base-300 hover:border-primary"
                    }
                  `}
                  onClick={() => onChange(option.value)}
                >
                  <div className="aspect-square w-full h-full">
                    {option.value ? (
                      <img
                        src={option.value}
                        alt={option.label}
                        className="w-full h-full object-cover block"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-base-content opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    )}

                    <div
                      className="w-full h-full bg-base-200 flex items-center justify-center text-xs text-base-content opacity-70"
                      style={{ display: "none" }}
                    >
                      {option.label}
                    </div>
                  </div>

                  {/* Label overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 text-white text-xs px-2 py-1 text-center"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
                  >
                    <span className="font-medium">{option.label}</span>
                  </div>

                  {/* Indicador de selección */}
                  {value === option.value && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-2.5 h-2.5 text-primary-content"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}

              {/* Botón "Ver más" como elemento del grid */}
              {hasMore && (
                <div
                  className="aspect-square cursor-pointer rounded-lg border-2 border-dashed border-base-300 hover:border-primary transition-all duration-200 hover:scale-105 flex items-center justify-center bg-base-50 hover:bg-base-100"
                  onClick={handleLoadMore}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">+</div>
                    <div className="text-xs font-medium text-base-content opacity-70">
                      Ver más
                    </div>
                    <div className="text-xs text-base-content opacity-50">
                      ({filteredOptions.length - visibleCount} más)
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="col-span-3 text-center py-8 text-base-content opacity-60">
              <div className="mb-2 flex justify-center items-center">
                <TfiSearch className="text-2xl mb-2"/>
              </div>
              <div>No se encontraron texturas con "{searchTerm}"</div>
            </div>
          )}
        </div>

        {/* Botón "Mostrar menos" si hay muchos elementos visibles */}
        {visibleCount > INITIAL_COUNT && (
          <div className="border-t border-base-300 p-4 text-center">
            <button
              onClick={handleShowLess}
              className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content hover:bg-base-200 transition-colors"
            >
              <FiChevronUp className="w-4 h-4" />
              Mostrar menos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}