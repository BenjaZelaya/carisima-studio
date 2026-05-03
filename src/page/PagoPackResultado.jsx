// src/page/PagoPackResultado.jsx
import { useSearchParams, useNavigate } from "react-router-dom";

const PagoPackResultado = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const estado = searchParams.get("estado");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      <div className="bg-[#111111] border border-white/10 p-10 max-w-sm w-full text-center">
        {estado === "aprobado" ? (
          <>
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-xl">✓</span>
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">Pago aprobado</p>
            <h2 className="font-serif text-2xl font-light text-white mb-3">¡Pack adquirido!</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Tu pago fue aprobado. El pack se activará en breve y podrás agendar tus sesiones desde "Mis Packs".
            </p>
            <button
              onClick={() => navigate("/configuracion?tab=packs")}
              className="w-full border border-white/30 text-white py-3 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all"
            >
              Ver mis packs
            </button>
          </>
        ) : estado === "pendiente" ? (
          <>
            <div className="w-12 h-12 border border-yellow-500/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-yellow-400 text-xl">⏳</span>
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">Pago pendiente</p>
            <h2 className="font-serif text-2xl font-light text-white mb-3">Procesando pago</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Tu pago está siendo procesado. Una vez acreditado, el pack se activará automáticamente.
            </p>
            <button
              onClick={() => navigate("/configuracion?tab=packs")}
              className="w-full border border-white/30 text-white py-3 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all"
            >
              Ver mis packs
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-red-400 text-xl">✕</span>
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">Pago rechazado</p>
            <h2 className="font-serif text-2xl font-light text-white mb-3">No se pudo procesar</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Hubo un problema con tu pago. Podés intentarlo nuevamente.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="w-full border border-white/30 text-white py-3 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all"
            >
              Intentar de nuevo
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PagoPackResultado;
