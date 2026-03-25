// src/components/Configuracion/admin/GestionTurnos.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { Check, X, Clock, Calendar, User } from "lucide-react";

const ESTADOS_COLOR = {
  pendiente: "bg-yellow-100 text-yellow-700",
  señado: "bg-blue-100 text-blue-700",
  confirmado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
  completado: "bg-gray-100 text-gray-600",
};

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const GestionTurnos = () => {
  const { token } = useAuth();

  const [turnos, setTurnos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [turnoExpandido, setTurnoExpandido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ─── Cargar turnos ──────────────────────────────────────────────────────────

  const cargarTurnos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/turnos/admin", {
        headers: { "x-token": token },
      });
      const data = await res.json();
      setTurnos(data.turnos || data || []);
    } catch {
      setError("Error al cargar turnos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleConfirmar = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/turnos/${id}/confirmar`, {
        method: "PATCH",
        headers: { "x-token": token },
      });
      if (res.ok) cargarTurnos();
    } catch {
      setError("Error al confirmar turno");
    }
  };

  const handleCancelar = async (id) => {
    if (!confirm("¿Cancelar este turno?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/turnos/${id}/cancelar`, {
        method: "PATCH",
        headers: { "x-token": token },
      });
      if (res.ok) cargarTurnos();
    } catch {
      setError("Error al cancelar turno");
    }
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const formatearFecha = (fecha, hora) => {
    const d = new Date(fecha);
    return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}, ${hora}hs`;
  };

  const turnosFiltrados = turnos.filter((t) =>
    filtro === "todos" ? true : t.estado === filtro
  );

  const contarPorEstado = (estado) => turnos.filter((t) => t.estado === estado).length;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "todos", label: "Todos", count: turnos.length },
          { id: "señado", label: "Con comprobante", count: contarPorEstado("señado") },
          { id: "pendiente", label: "Pendientes", count: contarPorEstado("pendiente") },
          { id: "confirmado", label: "Confirmados", count: contarPorEstado("confirmado") },
          { id: "cancelado", label: "Cancelados", count: contarPorEstado("cancelado") },
        ].map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setFiltro(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filtro === id
                ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filtro === id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Lista de turnos */}
      {cargando ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : turnosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No hay turnos en esta categoría</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {turnosFiltrados.map((turno) => (
            <div
              key={turno._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Header del turno */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setTurnoExpandido(turnoExpandido === turno._id ? null : turno._id)}
              >
                {/* Avatar usuario */}
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-500 font-bold text-sm">
                    {turno.usuario?.nombre?.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800">
                    {turno.usuario?.nombre} {turno.usuario?.apellido}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={11} />
                      {formatearFecha(turno.fecha, turno.horaInicio)}
                    </span>
                  </div>
                </div>

                {/* Estado + monto */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ESTADOS_COLOR[turno.estado]}`}>
                    {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    Seña: AR${turno.seña?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Detalle expandido */}
              {turnoExpandido === turno._id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">

                  {/* Servicios */}
                  <div className="flex flex-col gap-2 mb-4">
                    {turno.productos?.map((p) => (
                      <div key={p._id} className="flex items-center gap-3 bg-white rounded-xl p-3">
                        <img src={p.img} alt={p.nombreProducto} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{p.nombreProducto}</p>
                          <p className="text-xs text-gray-400">AR${p.precio?.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Datos del usuario */}
                  <div className="bg-white rounded-xl p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Datos del cliente</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-700">
                        <span className="text-gray-400">Email: </span>
                        {turno.usuario?.email}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="text-gray-400">Teléfono: </span>
                        {turno.usuario?.telefono}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="text-gray-400">Método de pago: </span>
                        {turno.metodoPago}
                      </p>
                    </div>
                  </div>

                  {/* Comprobante */}
                  {turno.comprobante && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Comprobante</p>
                      <a href={turno.comprobante} target="_blank" rel="noopener noreferrer">
                        <img
                          src={turno.comprobante}
                          alt="comprobante"
                          className="w-full max-h-48 object-contain rounded-xl border border-gray-200 hover:opacity-90 transition"
                        />
                      </a>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-2">
                    {turno.estado === "señado" && (
                      <button
                        onClick={() => handleConfirmar(turno._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl transition text-sm"
                      >
                        <Check size={16} />
                        Confirmar turno
                      </button>
                    )}
                    {["pendiente", "señado", "confirmado"].includes(turno.estado) && (
                      <button
                        onClick={() => handleCancelar(turno._id)}
                        className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-2.5 rounded-xl transition text-sm"
                      >
                        <X size={16} />
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestionTurnos;