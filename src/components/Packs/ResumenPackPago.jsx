// src/components/Packs/ResumenPackPago.jsx
const ResumenPackPago = ({ pack }) => {
  if (!pack) return null;

  const seña = Math.round(pack.precio * ((pack.porcentajeSeña ?? 50) / 100));
  const resto = pack.precio - seña;

  return (
    <div className="bg-[#111111] border border-white/10">
      {/* Imagen */}
      {pack.imagen && (
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <img
            src={pack.imagen}
            alt={pack.nombre}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Título */}
        <div className="mb-6 pb-6 border-b border-white/10">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1.5">Pack seleccionado</p>
          <h2 className="font-serif text-2xl font-light text-white">{pack.nombre}</h2>
          {pack.descripcion && (
            <p className="text-white/40 text-xs mt-2 leading-relaxed">{pack.descripcion}</p>
          )}
        </div>

        {/* Sesiones y servicios */}
        <div className="mb-6 pb-6 border-b border-white/10">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-3">Incluye</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Sesiones totales</span>
              <span className="text-white font-medium">{pack.totalSesiones}</span>
            </div>
            {pack.serviciosIncluidos?.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-white/50">{s.nombre}</span>
                {s.cantidad > 1 && (
                  <span className="text-white/40 text-xs">×{s.cantidad}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Precios */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40">Precio total</span>
            <span className="text-white/80">AR${pack.precio.toLocaleString("es-AR")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40">
              Seña ahora ({pack.porcentajeSeña ?? 50}%)
            </span>
            <span className="text-white font-medium">AR${seña.toLocaleString("es-AR")}</span>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-white/10 pt-2.5 mt-2.5">
            <span className="text-white/40">Resto en el local</span>
            <span className="text-white/60">AR${resto.toLocaleString("es-AR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenPackPago;
