// src/components/Configuracion/admin/GestionPackCompras.jsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { ChevronDown, ChevronUp, Loader2, Check, CheckCheck, X, Layers, Trash2 } from "lucide-react";

const ESTADOS_PACK = {
  pendiente:  { label: "Pendiente",  color: "border-yellow-500/30 text-yellow-400" },
  señado:     { label: "Señado",     color: "border-blue-500/30 text-blue-400" },
  activo:     { label: "Activo",     color: "border-green-500/30 text-green-400" },
  completado: { label: "Completado", color: "border-white/20 text-white/50" },
  cancelado:  { label: "Cancelado",  color: "border-red-500/30 text-red-400" },
};

const ESTADOS_SESION = {
  sin_fecha:  { label: "Sin fecha",   color: "border-white/20 text-white/40" },
  pendiente:  { label: "Pendiente",   color: "border-yellow-500/30 text-yellow-400" },
  confirmada: { label: "Confirmada",  color: "border-green-500/30 text-green-400" },
  completada: { label: "Realizada",   color: "border-white/20 text-white/50" },
  cancelada:  { label: "Cancelada",   color: "border-red-500/30 text-red-400" },
};

const FILTROS = [
  { id: "todos",     label: "Todos" },
  { id: "señado",    label: "Señados" },
  { id: "activo",    label: "Activos" },
  { id: "completado",label: "Completados" },
  { id: "cancelado", label: "Cancelados" },
];

const SesionAdminRow = ({ sesion, compraId, onRefresh }) => {
  const { token } = useAuth();
  const [cargando, setCargando] = useState(null);
  const badge = ESTADOS_SESION[sesion.estado] || ESTADOS_SESION.sin_fecha;

  const accion = async (tipo) => {
    setCargando(tipo);
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/packs/compras/${compraId}/sesiones/${sesion._id}/${tipo}`,
        { method: "PATCH", headers: { "x-token": token } }
      );
      onRefresh();
    } catch {
      // silent
    } finally {
      setCargando(null);
    }
  };

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/6 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-white/30 w-4 text-center">{sesion.numero}</span>
        <div>
          {sesion.fecha ? (
            <p className="text-xs text-white/70">
              {new Date(sesion.fecha + "T00:00:00").toLocaleDateString("es-AR")}
              {sesion.horaInicio && (
                <span className="text-white/40"> · {sesion.horaInicio}hs</span>
              )}
            </p>
          ) : (
            <p className="text-xs text-white/25">Sin fecha</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`text-[9px] tracking-widest uppercase border px-2 py-0.5 ${badge.color}`}>
          {badge.label}
        </span>

        {sesion.estado === "pendiente" && (
          <button
            onClick={() => accion("confirmar")}
            disabled={!!cargando}
            className="flex items-center gap-1 border border-green-500/30 text-green-400 px-2.5 py-1 text-[9px] tracking-widest uppercase hover:bg-green-500/10 transition disabled:opacity-40"
          >
            {cargando === "confirmar" ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
            Confirmar
          </button>
        )}

        {sesion.estado === "confirmada" && (
          <button
            onClick={() => accion("completar")}
            disabled={!!cargando}
            className="flex items-center gap-1 border border-white/20 text-white/50 px-2.5 py-1 text-[9px] tracking-widest uppercase hover:bg-white/8 hover:text-white transition disabled:opacity-40"
          >
            {cargando === "completar" ? <Loader2 size={10} className="animate-spin" /> : <CheckCheck size={10} />}
            Completar
          </button>
        )}

        {["sin_fecha", "pendiente", "confirmada"].includes(sesion.estado) && (
          <button
            onClick={() => accion("cancelar")}
            disabled={!!cargando}
            className="p-1 text-white/20 hover:text-red-400 transition disabled:opacity-40"
            title="Cancelar sesión"
          >
            {cargando === "cancelar" ? <Loader2 size={10} className="animate-spin" /> : <X size={10} />}
          </button>
        )}
      </div>
    </div>
  );
};

const PackCompraAdminCard = ({ compra, onRefresh, onEliminar }) => {
  const { token } = useAuth();
  const [expandido, setExpandido] = useState(false);
  const [activando, setActivando] = useState(false);

  const badge = ESTADOS_PACK[compra.estado] || ESTADOS_PACK.pendiente;
  const sesiones = compra.sesiones || [];
  const realizadas = sesiones.filter((s) => s.estado === "completada").length;
  const total = sesiones.length;

  const handleActivar = async () => {
    setActivando(true);
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/packs/compras/${compra._id}/activar`,
        { method: "PATCH", headers: { "x-token": token } }
      );
      onRefresh();
    } catch {
      // silent
    } finally {
      setActivando(false);
    }
  };

  return (
    <div className="bg-[#111111] border border-white/10">
      {/* Header clickeable */}
      <button
        onClick={() => setExpandido((p) => !p)}
        className="w-full flex items-start justify-between p-5 text-left hover:bg-white/4 transition"
      >
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
            <Layers size={13} className="text-white/40" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-white">
              {compra.usuario?.nombre} {compra.usuario?.apellido}
            </p>
            <p className="text-xs text-white/35 mt-0.5 truncate">
              {compra.pack?.nombre} · {realizadas}/{total} sesiones
            </p>
            <p className="text-xs text-white/25 mt-0.5">
              AR${compra.montoAbonado?.toLocaleString("es-AR")} abonados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className={`text-[9px] tracking-widest uppercase border px-2 py-0.5 ${badge.color}`}>
            {badge.label}
          </span>
          {expandido ? (
            <ChevronUp size={14} className="text-white/30" />
          ) : (
            <ChevronDown size={14} className="text-white/30" />
          )}
        </div>
      </button>

      {/* Detalle expandido */}
      {expandido && (
        <div className="border-t border-white/10 bg-[#0d0d0d] px-5 py-4 space-y-4">
          {/* Info del usuario */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-white/30 mb-0.5">Email</p>
              <p className="text-white/60">{compra.usuario?.email}</p>
            </div>
            <div>
              <p className="text-white/30 mb-0.5">Método de pago</p>
              <p className="text-white/60 capitalize">{compra.metodoPago}</p>
            </div>
            <div>
              <p className="text-white/30 mb-0.5">Comprobante</p>
              {compra.comprobantePago ? (
                <a
                  href={compra.comprobantePago}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 underline underline-offset-2 hover:text-white transition"
                >
                  Ver comprobante
                </a>
              ) : (
                <span className="text-white/25">No subido</span>
              )}
            </div>
            <div>
              <p className="text-white/30 mb-0.5">Fecha de compra</p>
              <p className="text-white/60">
                {new Date(compra.createdAt).toLocaleDateString("es-AR")}
              </p>
            </div>
          </div>

          {/* Activar si está señado */}
          {compra.estado === "señado" && (
            <button
              onClick={handleActivar}
              disabled={activando}
              className="flex items-center gap-2 border border-green-500/30 text-green-400 px-4 py-2 text-xs tracking-widest uppercase hover:bg-green-500/10 transition disabled:opacity-40"
            >
              {activando ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              Activar pack
            </button>
          )}

          {/* Eliminar compra */}
          <button
            onClick={() => onEliminar(compra)}
            className="flex items-center gap-2 border border-red-500/20 text-red-400/60 px-4 py-2 text-xs tracking-widest uppercase hover:bg-red-500/8 hover:text-red-400 transition"
          >
            <Trash2 size={12} />
            Eliminar compra
          </button>

          {/* Sesiones */}
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-2">Sesiones</p>
            {sesiones.length === 0 ? (
              <p className="text-xs text-white/25">Sin sesiones</p>
            ) : (
              sesiones.map((sesion) => (
                <SesionAdminRow
                  key={sesion._id}
                  sesion={sesion}
                  compraId={compra._id}
                  onRefresh={onRefresh}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const GestionPackCompras = () => {
  const { token } = useAuth();
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/packs/compras/admin`, {
        headers: { "x-token": token },
      });
      const data = await res.json();
      setCompras(data.compras || []);
    } catch {
      // silent
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleEliminar = async () => {
    if (!confirmEliminar) return;
    setEliminando(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/packs/compras/${confirmEliminar._id}`, {
        method: "DELETE",
        headers: { "x-token": token },
      });
      setConfirmEliminar(null);
      await cargar();
    } catch {
      // silent
    } finally {
      setEliminando(false);
    }
  };

  const comprasFiltradas = compras.filter((c) => {
    const matchFiltro = filtro === "todos" || c.estado === filtro;
    const q = busqueda.toLowerCase();
    const matchBusqueda =
      !q ||
      c.usuario?.nombre?.toLowerCase().includes(q) ||
      c.usuario?.apellido?.toLowerCase().includes(q) ||
      c.usuario?.email?.toLowerCase().includes(q) ||
      c.pack?.nombre?.toLowerCase().includes(q);
    return matchFiltro && matchBusqueda;
  });

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`px-3 py-1.5 text-[10px] tracking-widest uppercase transition ${
              filtro === f.id
                ? "bg-white text-black"
                : "border border-white/15 text-white/40 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Búsqueda */}
      <div className="mb-5">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por usuario o pack..."
          className="w-full bg-transparent border border-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition"
        />
      </div>

      {cargando ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border border-white/20 border-t-white/80 rounded-full animate-spin" />
        </div>
      ) : comprasFiltradas.length === 0 ? (
        <div className="border border-white/8 px-6 py-10 text-center">
          <p className="text-xs text-white/25">
            {compras.length === 0 ? "No hay compras de packs" : "No hay resultados"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {comprasFiltradas.map((compra) => (
            <PackCompraAdminCard
              key={compra._id}
              compra={compra}
              onRefresh={cargar}
              onEliminar={setConfirmEliminar}
            />
          ))}
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      {confirmEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-white/15 w-full max-w-sm">
            <div className="px-6 py-5 border-b border-white/10">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">Confirmar acción</p>
              <h3 className="text-sm font-medium text-white">Eliminar compra</h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-white/50 leading-relaxed">
                ¿Eliminar la compra de{" "}
                <span className="text-white font-medium">
                  {confirmEliminar.usuario?.nombre} {confirmEliminar.usuario?.apellido}
                </span>
                {" "}({confirmEliminar.pack?.nombre})? Se eliminarán también todas sus sesiones.
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-5">
              <button
                onClick={() => setConfirmEliminar(null)}
                disabled={eliminando}
                className="flex-1 py-2.5 border border-white/15 text-white/50 text-xs tracking-[0.15em] uppercase hover:bg-white/5 hover:text-white transition disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={eliminando}
                className="flex-1 py-2.5 border border-red-500/40 text-red-400 text-xs tracking-[0.15em] uppercase hover:bg-red-500/10 transition disabled:opacity-40"
              >
                {eliminando ? (
                  <div className="w-4 h-4 border border-red-400/30 border-t-red-400 rounded-full animate-spin mx-auto" />
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPackCompras;
