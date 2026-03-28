// src/components/Configuracion/MisTurnos.jsx
import { useState, useEffect } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const ESTADOS_COLOR = {
  confirmado: 'bg-green-100 text-green-700 border-green-200',
  señado: 'bg-blue-100 text-blue-700 border-blue-200',
  pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  cancelado: 'bg-red-100 text-red-500 border-red-200',
  completado: 'bg-gray-100 text-gray-600 border-gray-200',
};

const formatearFecha = (fecha) => {
  const fechaStr = fecha?.split("T")[0];
  return new Date(fechaStr + "T12:00:00").toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

const MisTurnos = () => {
  const { token } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelando, setCancelando] = useState(null);

  const cargar = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/turnos/mis-turnos', {
        headers: { 'x-token': token },
      });
      const data = await res.json();
      if (!res.ok) { setError("Error al cargar tus turnos."); return; }
      setTurnos(data.data || data.turnos || (Array.isArray(data) ? data : []));
    } catch {
      setError("Error de conexión. Intentalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) cargar();
  }, [token]);

  const handleCancelar = async (id) => {
    if (!confirm("¿Cancelar este turno?")) return;
    setCancelando(id);
    try {
      const res = await fetch(`http://localhost:5000/api/turnos/${id}/cancelar`, {
        method: 'PATCH',
        headers: { 'x-token': token },
      });
      if (res.ok) cargar();
    } catch {
      setError("Error al cancelar el turno");
    } finally {
      setCancelando(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition text-sm">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Mis Turnos</h1>
      <p className="text-gray-400 text-sm mb-8">Historial y próximas reservas</p>

      {turnos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-4">
            <Calendar size={28} className="text-pink-400" />
          </div>
          <p className="text-gray-500 font-medium">Todavía no tenés turnos reservados</p>
          <p className="text-gray-400 text-sm mt-1">Cuando reserves un turno aparecerá acá</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {turnos.map((turno) => (
            <div key={turno._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-50 text-pink-500 rounded-xl p-2.5">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 capitalize">
                      {formatearFecha(turno.fecha)}
                    </p>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-0.5">
                      <Clock size={13} />
                      <span>{turno.horaInicio}hs</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${ESTADOS_COLOR[turno.estado] || ESTADOS_COLOR.completado}`}>
                  {turno.estado.toUpperCase()}
                </span>
              </div>

              {/* Servicios */}
              <div className="pt-4 border-t border-gray-100 mb-4">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">Servicios</p>
                <div className="flex flex-wrap gap-2">
                  {turno.productos?.map((p) => (
                    <div key={p._id} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl">
                      {p.img && (
                        <img src={p.img} alt={p.nombreProducto} className="w-6 h-6 rounded-lg object-cover" />
                      )}
                      <span className="text-sm text-gray-700">{p.nombreProducto}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="flex justify-between text-sm pt-3 border-t border-gray-100 mb-4">
                <div className="text-gray-500">
                  Total: <span className="font-semibold text-gray-800">AR${turno.total?.toLocaleString()}</span>
                </div>
                <div className="text-[#ff7bed]">
                  Seña: <span className="font-semibold">AR${turno.seña?.toLocaleString()}</span>
                </div>
              </div>

              {/* Botón cancelar */}
              {["pendiente", "señado", "confirmado"].includes(turno.estado) && (
                <button
                  onClick={() => handleCancelar(turno._id)}
                  disabled={cancelando === turno._id}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 font-medium py-2.5 rounded-xl transition text-sm disabled:opacity-60"
                >
                  <X size={15} />
                  {cancelando === turno._id ? "Cancelando..." : "Cancelar turno"}
                </button>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisTurnos;