// src/components/Pago/ResumenPago.jsx
const DIAS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const ResumenPago = ({ servicios, fecha, horario }) => {
  const total = servicios.reduce((sum, s) => sum + (Number(s.precio) || 0), 0);
  const seña = Math.round(total * 0.5);
  const pendiente = total - seña;

  const formatearFecha = () => {
    if (!fecha) return "";
    const d = new Date(fecha + "T00:00:00");
    return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}, ${horario}hs`;
  };

  return (
    <div className="bg-[#111111] border border-white/10 p-6">
      <h2 className="font-serif text-xl font-light text-white mb-5">Resumen de compra</h2>

      {/* Dirección */}
      <div className="flex items-start gap-3 mb-4 pb-4 border-b border-white/10">
        <span className="text-white/40 text-sm mt-0.5">📍</span>
        <div>
          <p className="text-sm text-white/60">Lamadrid 117, San Miguel de Tucumán</p>
          <p className="text-xs text-white/30">Tucumán, Argentina</p>
        </div>
      </div>

      {/* Servicios */}
      <div className="flex flex-col gap-3 mb-4 pb-4 border-b border-white/10">
        {servicios.map((s) => (
          <div key={s._id} className="flex items-center gap-3">
            <img src={s.img} alt={s.nombreProducto} className="w-10 h-10 object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm font-light text-white/70 truncate">{s.nombreProducto}</p>
              <p className="text-xs text-white/30">AR${Number(s.precio).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fecha */}
      <div className="mb-5 pb-5 border-b border-white/10">
        <p className="text-sm text-white/50">{formatearFecha()}</p>
      </div>

      {/* Totales */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Subtotal</span>
          <span className="text-white/60">AR${total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Seña (anticipado)</span>
          <span className="font-serif text-white">AR${seña.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Pendiente en el local</span>
          <span className="text-white/50">AR${pendiente.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ResumenPago;