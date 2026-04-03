// src/page/PagoResultado.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const PagoResultado = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const estado = searchParams.get("estado");
  const [procesando, setProcesando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setProcesando(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (procesando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Procesando tu pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {estado === "aprobado" ? (
          <>
            <p className="text-5xl mb-4">🎉</p>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago aprobado!</h1>
            <p className="text-gray-500 text-sm mb-6">
              Tu turno fue confirmado correctamente. Te esperamos!
            </p>
            <button onClick={() => navigate("/configuracion")}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition">
              Ver mis turnos
            </button>
          </>
        ) : estado === "pendiente" ? (
          <>
            <p className="text-5xl mb-4">⏳</p>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Pago pendiente</h1>
            <p className="text-gray-500 text-sm mb-6">
              Tu pago está siendo procesado. Te notificaremos cuando se acredite.
            </p>
            <button onClick={() => navigate("/configuracion")}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition">
              Ver mis turnos
            </button>
          </>
        ) : (
          <>
            <p className="text-5xl mb-4">❌</p>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Pago rechazado</h1>
            <p className="text-gray-500 text-sm mb-6">
              Hubo un problema con tu pago. Podés intentarlo de nuevo.
            </p>
            <button onClick={() => navigate(-1)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition">
              Intentar de nuevo
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PagoResultado;