// src/components/Reservar/ListaServicios.jsx
import BuscadorServicios from "./BuscadorServicios.jsx";
import TarjetaServicio from "./TarjetaServicio.jsx";

const ListaServicios = ({
  servicios,
  categorias,
  seleccionados,
  busqueda,
  categoriaActiva,
  onBusqueda,
  onCategoria,
  onToggle,
}) => {

  const serviciosFiltrados = servicios.filter((s) => {
    const coincideBusqueda = s.nombreProducto
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria = categoriaActiva
      ? categorias
          .find((c) => c._id === categoriaActiva)
          ?.productos?.some(
            (p) => (typeof p === "object" ? p._id : p) === s._id
          )
      : true;

    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
      
      <BuscadorServicios
        busqueda={busqueda}
        onChange={onBusqueda}
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onCategoria={onCategoria}
      />

      <div className="mt-8 space-y-4 sm:space-y-5">
        {serviciosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No encontramos servicios</p>
            <p className="text-sm mt-3">
              Intentá con otra búsqueda o categoría
            </p>
          </div>
        ) : (
          serviciosFiltrados.map((servicio, index) => (
            <div
              key={`${servicio._id}-${busqueda}-${categoriaActiva}`}
              className="cascade-item"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <TarjetaServicio
                servicio={servicio}
                isSelected={seleccionados.some(
                  (s) => s._id === servicio._id
                )}
                onToggle={onToggle}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListaServicios;