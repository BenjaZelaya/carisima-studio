// src/components/Pago/InstruccionesTransferencia.jsx
import { useState } from "react";

const InstruccionesTransferencia = ({ seña, onSubirComprobante, comprobante, subiendoComprobante }) => {
  const [preview, setPreview] = useState(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  const handleArchivoSeleccionado = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoSeleccionado(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmarSubida = () => {
    if (archivoSeleccionado) {
      const event = { target: { files: [archivoSeleccionado] } };
      onSubirComprobante(event);
    }
  };

  const handleAnular = () => {
    setPreview(null);
    setArchivoSeleccionado(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Transferencia bancaria</h2>
          <p className="text-sm text-gray-500 mt-1">
            Realizá la transferencia y enviá el comprobante para confirmar tu turno.
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

      {/* Preview de la imagen */}
      {preview && !comprobante && (
        <div className="mb-5 p-4 border-2 border-blue-300 bg-blue-50 rounded-xl">
          <p className="text-sm font-medium text-gray-700 mb-3">Vista previa del comprobante:</p>
          <img src={preview} alt="Preview comprobante" className="w-full max-h-64 object-contain rounded-lg mb-4" />
          <div className="flex gap-3">
            <button
              onClick={handleConfirmarSubida}
              disabled={subiendoComprobante}
              className="flex-1 bg-[#ff7bed] hover:bg-[#ff6bd8] text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
            >
              {subiendoComprobante ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Subiendo...
                </div>
              ) : (
                "Confirmar y enviar"
              )}
            </button>
            <button
              onClick={handleAnular}
              disabled={subiendoComprobante}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition disabled:opacity-60"
            >
              Anular
            </button>
          </div>
        </div>
      )}

      {/* Subir comprobante */}
      {!comprobante && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subir comprobante
          </label>
          <label className={`cursor-pointer block ${preview ? "opacity-50 pointer-events-none" : ""}`}>
            <div className={`border-2 border-dashed rounded-xl p-4 text-center transition ${
              preview
                ? "border-gray-200 bg-gray-50"
                : "border-gray-200 hover:border-[#ff7bed]/50 hover:bg-pink-50/30"
            }`}>
              <p className="text-sm text-gray-400">
                {preview ? "Selecciona otra imagen" : "Hacé click para seleccionar el comprobante"}
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleArchivoSeleccionado}
              className="hidden"
              disabled={subiendoComprobante}
            />
          </label>
        </div>
      )}

      {/* Comprobante subido */}
      {comprobante && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-4 mb-5">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-green-500 text-xl">✓</span>
            <p className="text-sm text-green-600 font-medium">Comprobante cargado exitosamente</p>
          </div>
          <img src={comprobante} alt="Comprobante cargado" className="w-full max-h-64 object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default InstruccionesTransferencia;