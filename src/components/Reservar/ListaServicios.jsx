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
    <div className="w-full bg-[#111111] border border-white/10 p-5 sm:p-6 lg:p-8">
      
      <BuscadorServicios
        busqueda={busqueda}
        onChange={onBusqueda}
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onCategoria={onCategoria}
      />

      <div className="mt-6 space-y-3">
        {serviciosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p className="text-sm">No encontramos servicios</p>
          </div>
        ) : (
          serviciosFiltrados.map((servicio, index) => (
            <div
              key={`${servicio._id}-${busqueda}-${categoriaActiva}`}
              className="cascade-item"
              style={{ animationDelay: `${index * 0.06}s` }}
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