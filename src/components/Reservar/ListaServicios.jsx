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
    const coincideBusqueda = s.nombreProducto?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva
      ? categorias
          .find((c) => c._id === categoriaActiva)
          ?.productos?.some((p) => (typeof p === "object" ? p._id : p) === s._id)
      : true;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div
      className="w-full lg:w-3/5 xl:w-2/3 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 relative"
      style={{
        backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <BuscadorServicios
        busqueda={busqueda}
        onChange={onBusqueda}
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onCategoria={onCategoria}
      />

      <div className="space-y-5">
        {serviciosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No encontramos servicios</p>
            <p className="text-sm mt-2">Intentá con otra búsqueda o categoría</p>
          </div>
        ) : (
          serviciosFiltrados.map((servicio) => (
            <TarjetaServicio
              key={servicio._id}
              servicio={servicio}
              isSelected={seleccionados.some((s) => s._id === servicio._id)}
              onToggle={onToggle}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ListaServicios;