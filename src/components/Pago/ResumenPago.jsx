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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-5">Resumen de compra</h2>

      {/* Dirección */}
      <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
        <span className="text-xl">📍</span>
        <div>
          <p className="text-sm font-medium text-gray-700">Lamadrid 117, San Miguel de Tucumán</p>
          <p className="text-xs text-gray-400">Tucumán, Argentina</p>
        </div>
      </div>

      {/* Servicios */}
      <div className="flex flex-col gap-3 mb-4 pb-4 border-b border-gray-100">
        {servicios.map((s) => (
          <div key={s._id} className="flex items-center gap-3">
            <img src={s.img} alt={s.nombreProducto} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{s.nombreProducto}</p>
              <p className="text-xs text-[#ff7bed]">AR${Number(s.precio).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fecha */}
      <div className="flex items-center gap-2 mb-5 pb-5 border-b border-gray-100">
        <span className="text-lg">📅</span>
        <p className="text-sm text-gray-700 font-medium">{formatearFecha()}</p>
      </div>

      {/* Totales */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-800">AR${total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#ff7bed] font-medium">Seña (pago anticipado)</span>
          <span className="font-bold text-[#ff7bed]">AR${seña.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Pendiente en el local</span>
          <span className="font-medium text-gray-800">AR${pendiente.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ResumenPago;