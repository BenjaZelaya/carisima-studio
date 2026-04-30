// src/components/Configuracion/admin/GestionTurnos.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { Check, X, Clock, Calendar, Trash2, Search } from "lucide-react";
import useConfirm from "../../hooks/useConfirm.jsx";

const ESTADOS_COLOR = {
  borrador:   'bg-white/5 text-white/40 border border-white/10',
  pendiente:  'bg-white/5 text-white/50 border border-white/10',
  señado:     'bg-white/8 text-white/70 border border-white/15',
  confirmado: 'bg-white/10 text-white border border-white/20',
  cancelado:  'bg-red-500/10 text-red-400 border border-red-500/20',
  completado: 'bg-white/5 text-white/30 border border-white/8',
};

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const GestionTurnos = () => {
  const { token } = useAuth();
  const { confirm: askConfirm, ConfirmDialog } = useConfirm();

  const [turnos, setTurnos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [turnoExpandido, setTurnoExpandido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ─── Cargar turnos ──────────────────────────────────────────────────────────

  const cargarTurnos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos/admin`, {
        headers: { "x-token": token },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Error al cargar turnos");
        setTurnos([]);
        return;
      }

      setTurnos(Array.isArray(data.turnos) ? data.turnos : Array.isArray(data) ? data : []);
    } catch {
      setError("Error al cargar turnos");
      setTurnos([]);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos/${id}/confirmar`, {
        method: "PATCH",
        headers: { "x-token": token },
      });
      if (res.ok) cargarTurnos();
    } catch {
      setError("Error al confirmar turno");
    }
  };

  const handleCancelar = async (id) => {
    if (!await askConfirm("¿Cancelar este turno?", { danger: true, confirmText: "Sí, cancelar" })) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos/${id}/cancelar`, {
        method: "PATCH",
        headers: { "x-token": token },
      });
      if (res.ok) cargarTurnos();
    } catch {
      setError("Error al cancelar turno");
    }
  };

  const handleEliminarDefinitivo = async (id) => {
    if (!await askConfirm("¿Eliminar definitivamente este turno? Esta acción no se puede deshacer.", { danger: true, confirmText: "Sí, eliminar" })) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos/${id}`, {
        method: "DELETE",
        headers: { "x-token": token },
      });
      if (res.ok) cargarTurnos();
    } catch {
      setError("Error al eliminar turno");
    }
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const formatearFecha = (fecha, hora) => {
    const d = new Date(fecha);
    return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}, ${hora}hs`;
  };

  const turnosFiltrados = turnos.filter((t) => {
    let cumpleFiltro = true;
    if (filtro === "todos") cumpleFiltro = true;
    else if (filtro === "cambios") cumpleFiltro = t.cambiosRealizados > 0;
    else cumpleFiltro = t.estado === filtro;

    if (!cumpleFiltro) return false;

    if (busqueda.trim() !== "") {
      const busquedaLower = busqueda.toLowerCase();
      const nombre = `${t.usuario?.nombre || ""} ${t.usuario?.apellido || ""}`.toLowerCase();
      const enNombre = nombre.includes(busquedaLower);
      const enEmail = t.usuario?.email?.toLowerCase().includes(busquedaLower);
      const enTelefono = t.usuario?.telefono?.includes(busqueda);
      const servicios = t.productos?.map(p => p.nombreProducto?.toLowerCase()).join(" ");
      const enServicios = servicios?.includes(busquedaLower);
      const fechaFormato = new Date(t.fecha).toLocaleDateString("es-AR");
      const enFecha = fechaFormato.includes(busqueda);

      if (!enNombre && !enEmail && !enTelefono && !enServicios && !enFecha) return false;
    }

    if (fechaFiltro.trim() !== "") {
      // Comparar como strings YYYY-MM-DD para evitar problemas de zona horaria
      const fechaTurnoStr = new Date(t.fecha).toISOString().split("T")[0];
      if (fechaTurnoStr !== fechaFiltro) {
        return false;
      }
    }

    return true;
  });

  const contarPorEstado = (estado) => turnos.filter((t) => t.estado === estado).length;
  const contarConCambios = () => turnos.filter((t) => t.cambiosRealizados > 0).length;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {ConfirmDialog}
      {error && (
        <div className="border border-red-500/20 bg-red-500/8 text-red-400 px-4 py-3 mb-4 text-xs tracking-wide">
          {error}
        </div>
      )}

      {/* Búsqueda y Filtro por fecha */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, teléfono, servicio o fecha..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-transparent border border-white/15 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition"
          />
        </div>

        <div className="relative">
          <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-transparent border border-white/15 text-white/60 text-sm focus:outline-none focus:border-white/40 transition"
          />
        </div>

        {fechaFiltro && (
          <button
            onClick={() => setFechaFiltro("")}
            className="px-4 py-2.5 border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition text-xs tracking-widest uppercase"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "todos", label: "Todos", count: turnos.length },
          { id: "cambios", label: "Con cambios", count: contarConCambios() },
          { id: "señado", label: "Con comprobante", count: contarPorEstado("señado") },
          { id: "borrador", label: "Pendiente pago", count: contarPorEstado("borrador") },
          { id: "confirmado", label: "Confirmados", count: contarPorEstado("confirmado") },
          { id: "cancelado", label: "Cancelados", count: contarPorEstado("cancelado") },
        ].map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setFiltro(id)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs tracking-widest uppercase transition ${
              filtro === id
                ? "bg-white text-black"
                : "border border-white/15 text-white/40 hover:text-white hover:border-white/30"
            }`}
          >
            {label}
            <span className={`text-[10px] px-1.5 py-0.5 ${
              filtro === id ? "bg-black/10 text-black" : "bg-white/5 text-white/40"
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Lista de turnos */}
      {cargando ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
        </div>
      ) : turnosFiltrados.length === 0 ? (
        <div className="border border-white/8 p-12 text-center">
          <Calendar size={28} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/35 text-sm">
            {busqueda.trim() ? "No se encontraron turnos con esa búsqueda" : "No hay turnos en esta categoría"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {turnosFiltrados.map((turno) => (
            <div
              key={turno._id}
              className="border border-white/10 bg-[#111111] overflow-hidden"
            >
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/3 transition"
                onClick={() => setTurnoExpandido(turnoExpandido === turno._id ? null : turno._id)}
              >
                <div className="w-8 h-8 border border-white/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-white/50 text-xs font-semibold">
                    {turno.usuario?.nombre?.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    {turno.usuario?.nombre} {turno.usuario?.apellido}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-white/35">
                      <Calendar size={10} />
                      {formatearFecha(turno.fecha, turno.horaInicio)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 tracking-widest uppercase ${ESTADOS_COLOR[turno.estado]}`}>
                    {turno.estado}
                  </span>
                  <span className="text-[11px] text-white/30">
                    Seña: AR${turno.seña?.toLocaleString()}
                  </span>
                </div>
              </div>

              {turnoExpandido === turno._id && (
                <div className="border-t border-white/8 p-4 bg-[#0d0d0d]">

                  {turno.cambiosRealizados > 0 && (
                    <div className="mb-4 border border-white/10 p-3">
                      <p className="text-[10px] tracking-[0.15em] uppercase text-white/35 mb-2 flex items-center gap-2">
                        <Clock size={12} />
                        Historial de cambios ({turno.cambiosRealizados}/{turno.cambiosRestantes || 2})
                      </p>
                      {turno.cambios && turno.cambios.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {turno.cambios.map((cambio, idx) => (
                            <p key={idx} className="text-xs text-white/45">
                              Cambio {idx + 1}: <span className="line-through text-white/25">{cambio.anterior}</span> → <span className="text-white/70">{cambio.nuevo}</span>
                              <span className="text-white/25 ml-2">({new Date(cambio.fecha).toLocaleDateString()})</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-2 mb-4">
                    {turno.productos?.map((p) => (
                      <div key={p._id} className="flex items-center gap-3 border border-white/8 p-3">
                        <img src={p.img} alt={p.nombreProducto} className="w-9 h-9 object-cover" />
                        <div>
                          <p className="text-xs text-white/80">{p.nombreProducto}</p>
                          <p className="text-[11px] text-white/35">AR${p.precio?.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border border-white/8 p-3 mb-4">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 mb-2">Datos del cliente</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-white/60"><span className="text-white/30">Email: </span>{turno.usuario?.email}</p>
                      <p className="text-xs text-white/60"><span className="text-white/30">Teléfono: </span>{turno.usuario?.telefono}</p>
                      <p className="text-xs text-white/60"><span className="text-white/30">Método de pago: </span>{turno.metodoPago}</p>
                    </div>
                  </div>

                  {turno.comprobante && (
                    <div className="mb-4">
                      {turno.metodoPago === "mercadopago" ? (
                        <div className="border border-white/10 p-3">
                          <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 mb-2">Comprobante Mercado Pago</p>
                          <p className="text-xs text-white/60 font-mono break-all mb-2">{turno.comprobante}</p>
                          <a
                            href={`https://www.mercadopago.com.ar/activities/${turno.comprobante}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-white/40 hover:text-white transition underline"
                          >
                            Ver en Mercado Pago →
                          </a>
                        </div>
                      ) : (
                        <>
                          <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 mb-2">Comprobante</p>
                          <a href={turno.comprobante} target="_blank" rel="noopener noreferrer">
                            <img
                              src={turno.comprobante}
                              alt="comprobante"
                              className="w-full max-h-48 object-contain border border-white/10 hover:opacity-80 transition"
                            />
                          </a>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {["señado", "borrador"].includes(turno.estado) && (
                      <button
                        onClick={() => handleConfirmar(turno._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 py-2 text-[11px] font-semibold tracking-widest uppercase transition"
                      >
                        <Check size={13} />
                        Confirmar
                      </button>
                    )}
                    {["borrador", "señado", "confirmado"].includes(turno.estado) && (
                      <button
                        onClick={() => handleCancelar(turno._id)}
                        className="flex-1 flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 py-2 text-[11px] tracking-widest uppercase transition"
                      >
                        <X size={13} />
                        Cancelar
                      </button>
                    )}
                    {turno.estado === "cancelado" && (
                      <button
                        onClick={() => handleEliminarDefinitivo(turno._id)}
                        className="flex-1 flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 py-2 text-[11px] tracking-widest uppercase transition"
                      >
                        <Trash2 size={13} />
                        Eliminar definitivamente
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