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
    <div className="bg-[#111111] border border-white/10 p-6">
      <h2 className="font-serif text-xl font-light text-white mb-1">Transferencia bancaria</h2>
      <p className="text-white/40 text-sm mb-5">
        Realizá la transferencia y enviá el comprobante para confirmar tu turno.
      </p>

      {/* Datos bancarios */}
      <div className="border border-white/10 p-4 mb-5 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/30 tracking-wide">Alias</span>
          <span className="text-sm text-white/70">Carissimasestudio.uala</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/30 tracking-wide">Nombre</span>
          <span className="text-sm text-white/70">Paz Julieta</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <span className="text-xs text-white/30 tracking-wide">Monto a transferir</span>
          <span className="font-serif text-lg text-white">AR${seña.toLocaleString()}</span>
        </div>
      </div>

      {/* Preview de la imagen */}
      {preview && !comprobante && (
        <div className="mb-5 border border-white/20 p-4">
          <p className="text-xs text-white/40 mb-3 tracking-wide">Vista previa del comprobante:</p>
          <img src={preview} alt="Preview comprobante" className="w-full max-h-64 object-contain grayscale mb-4" />
          <div className="flex gap-3">
            <button
              onClick={handleConfirmarSubida}
              disabled={subiendoComprobante}
              className="flex-1 border border-white/30 text-white py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all disabled:opacity-40"
            >
              {subiendoComprobante ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                  Subiendo...
                </div>
              ) : (
                "Confirmar y enviar"
              )}
            </button>
            <button
              onClick={handleAnular}
              disabled={subiendoComprobante}
              className="flex-1 border border-white/15 text-white/50 py-3 text-sm tracking-widest uppercase hover:border-white/30 hover:text-white transition-all disabled:opacity-40"
            >
              Anular
            </button>
          </div>
        </div>
      )}

      {/* Subir comprobante */}
      {!comprobante && (
        <div className="mb-5">
          <label className={`cursor-pointer block ${preview ? "opacity-40 pointer-events-none" : ""}`}>
            <div className={`border border-dashed p-4 text-center transition ${
              preview
                ? "border-white/10"
                : "border-white/15 hover:border-white/30"
            }`}>
              <p className="text-xs text-white/30 tracking-wide">
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
        <div className="border border-white/20 p-4 mb-5">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-white/60 text-sm">✓ Comprobante cargado</span>
          </div>
          <img src={comprobante} alt="Comprobante cargado" className="w-full max-h-64 object-contain grayscale" />
        </div>
      )}
    </div>
  );
};

export default InstruccionesTransferencia;