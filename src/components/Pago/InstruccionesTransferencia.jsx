// src/components/Pago/InstruccionesTransferencia.jsx
const InstruccionesTransferencia = ({ seña, onSubirComprobante, comprobante, subiendoComprobante }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Transferencia bancaria</h2>
          <p className="text-sm text-gray-500 mt-1">
            Realizá la transferencia y enviá el comprobante por WhatsApp para confirmar tu turno.
          </p>
        </div>
        <span className="text-4xl">🏦</span>
      </div>

      {/* Datos bancarios */}
      <div className="bg-gray-50 rounded-xl p-4 mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Alias</span>
          <span className="font-bold text-gray-800">Carissimasestudio.uala</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Nombre</span>
          <span className="font-bold text-gray-800">Paz Julieta</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-500">Monto a transferir</span>
          <span className="font-black text-[#ff7bed] text-lg">AR${seña.toLocaleString()}</span>
        </div>
      </div>

      {/* Subir comprobante */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subir comprobante
        </label>
        <label className="cursor-pointer block">
          <div className={`border-2 border-dashed rounded-xl p-4 text-center transition ${
            comprobante
              ? "border-green-300 bg-green-50"
              : "border-gray-200 hover:border-[#ff7bed]/50 hover:bg-pink-50/30"
          }`}>
            {subiendoComprobante ? (
              <p className="text-sm text-gray-500">Subiendo comprobante...</p>
            ) : comprobante ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500">✓</span>
                <p className="text-sm text-green-600 font-medium">Comprobante cargado</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Hacé click para subir el comprobante de transferencia
              </p>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onSubirComprobante}
            className="hidden"
            disabled={!!comprobante}
          />
        </label>
      </div>

      {/* WhatsApp */}
      <a
        href="https://wa.me/543813349985?text=Hola!%20Quiero%20confirmar%20mi%20turno%20en%20Carissima%20Studio"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#25D366] hover:bg-[#1fbb57] text-white font-bold transition"
      >
        <span className="text-xl">💬</span>
        3813349985
      </a>
    </div>
  );
};

export default InstruccionesTransferencia;