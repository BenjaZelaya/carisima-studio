// src/components/Configuracion/MisTurnos.jsx
import { useState, useEffect } from 'react';
import { Calendar, Clock, X, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import CambiarHorarioModal from './CambiarHorarioModal';

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
  const [cambiosDisponibles, setCambiosDisponibles] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const cargar = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos/mis-turnos`, {
        headers: { 'x-token': token },
      });
      const data = await res.json();
      if (!res.ok) { setError("Error al cargar tus turnos."); return; }
      
      const turnosData = data.data || data.turnos || (Array.isArray(data) ? data : []);
      setTurnos(turnosData);
      
      // Cargar info de cambios disponibles para cada turno confirmado
      turnosData.forEach(async (turno) => {
        if (turno.estado === 'confirmado') {
          try {
            const resCambios = await fetch(
              `${import.meta.env.VITE_API_URL}/turnos/${turno._id}/cambios-disponibles`,
              { headers: { 'x-token': token } }
            );
            if (resCambios.ok) {
              const infoCambios = await resCambios.json();
              setCambiosDisponibles(prev => ({
                ...prev,
                [turno._id]: infoCambios
              }));
            }
          } catch (err) {
            console.error('Error al cargar cambios disponibles:', err);
          }
        }
      });
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos/${id}/cancelar`, {
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
    <div className="max-w-2xl w-full">
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

              {/* Info de cambios disponibles */}
              {turno.estado === 'confirmado' && cambiosDisponibles[turno._id] && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-600 font-medium mb-2">CAMBIOS DE HORARIO</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-blue-700">
                        Cambios restantes: <span className="font-bold">{cambiosDisponibles[turno._id].cambiosRestantes}/2</span>
                      </p>
                      {cambiosDisponibles[turno._id].tiempoRestanteHoras > 0 && (
                        <p className="text-xs text-blue-600 mt-1">
                          Disponible por: <span className="font-semibold">{cambiosDisponibles[turno._id].tiempoRestanteHoras}h</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-2">
                {turno.estado === 'confirmado' && cambiosDisponibles[turno._id]?.puedesCambiar && (
                  <button
                    onClick={() => {
                      setTurnoSeleccionado(turno);
                      setModalAbierto(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 font-medium py-2.5 rounded-xl transition text-sm"
                  >
                    <Edit2 size={15} />
                    Cambiar horario
                  </button>
                )}
                {["pendiente", "señado", "confirmado"].includes(turno.estado) && (
                  <button
                    onClick={() => handleCancelar(turno._id)}
                    disabled={cancelando === turno._id}
                    className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 font-medium py-2.5 rounded-xl transition text-sm disabled:opacity-60"
                  >
                    <X size={15} />
                    {cancelando === turno._id ? "Cancelando..." : "Cancelar turno"}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal para cambiar horario */}
      {turnoSeleccionado && (
        <CambiarHorarioModal
          turno={turnoSeleccionado}
          isOpen={modalAbierto}
          onClose={() => {
            setModalAbierto(false);
            setTurnoSeleccionado(null);
          }}
          onSuccess={() => cargar()}
          token={token}
        />
      )}
    </div>
  );
};

export default MisTurnos;