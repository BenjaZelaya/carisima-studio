// src/components/Configuracion/MisPacks.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import AgendarSesionModal from "../Packs/AgendarSesionModal.jsx";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";

const ESTADO_PACK = {
  pendiente:  { label: "Pendiente de pago",     color: "border-yellow-500/30 text-yellow-400" },
  señado:     { label: "En revisión",            color: "border-blue-500/30 text-blue-400" },
  activo:     { label: "Activo",                 color: "border-green-500/30 text-green-400" },
  completado: { label: "Completado",             color: "border-white/20 text-white/50" },
  cancelado:  { label: "Cancelado",              color: "border-red-500/30 text-red-400" },
};

const ESTADO_SESION = {
  sin_fecha:  { label: "Sin fecha",              color: "border-white/20 text-white/40" },
  pendiente:  { label: "Pendiente de confirmación", color: "border-yellow-500/30 text-yellow-400" },
  confirmada: { label: "Confirmada",             color: "border-green-500/30 text-green-400" },
  completada: { label: "Realizada",              color: "border-white/20 text-white/50" },
  cancelada:  { label: "Cancelada",              color: "border-red-500/30 text-red-400" },
};

const SesionRow = ({ sesion, packCompraId, activo, onRefresh }) => {
  const [agendar, setAgendar] = useState(false);
  const badge = ESTADO_SESION[sesion.estado] || ESTADO_SESION.sin_fecha;

  return (
    <>
      <div className="flex items-center justify-between py-3 border-b border-white/6 last:border-0">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-white/30 w-5 text-center">{sesion.numero}</span>
          <div>
            {sesion.fecha ? (
              <p className="text-xs text-white/70">
                {new Date(sesion.fecha + "T00:00:00").toLocaleDateString("es-AR")}
                {sesion.horaInicio && <span className="text-white/40"> · {sesion.horaInicio}hs</span>}
              </p>
            ) : (
              <p className="text-xs text-white/30">Sin fecha asignada</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-[9px] tracking-widest uppercase border px-2 py-0.5 ${badge.color}`}
          >
            {badge.label}
          </span>
          {activo && ["sin_fecha", "cancelada"].includes(sesion.estado) && (
            <button
              onClick={() => setAgendar(true)}
              className="text-[10px] tracking-widest uppercase border border-white/20 text-white/50 px-3 py-1.5 hover:bg-white hover:text-black transition"
            >
              Agendar
            </button>
          )}
        </div>
      </div>

      {agendar && (
        <AgendarSesionModal
          packCompraId={packCompraId}
          sesion={sesion}
          onClose={() => setAgendar(false)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
};

const PackCompraCard = ({ compra, onRefresh }) => {
  const [expandido, setExpandido] = useState(false);
  const badge = ESTADO_PACK[compra.estado] || ESTADO_PACK.pendiente;
  const sesiones = compra.sesiones || [];
  const realizadas = sesiones.filter((s) => s.estado === "completada").length;
  const total = sesiones.length;
  const progreso = total > 0 ? Math.round((realizadas / total) * 100) : 0;
  const activo = compra.estado === "activo";

  return (
    <div className="bg-[#111111] border border-white/10">
      {/* Header */}
      <button
        onClick={() => setExpandido((p) => !p)}
        className="w-full flex items-start justify-between p-5 text-left hover:bg-white/4 transition"
      >
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
            <Layers size={14} className="text-white/40" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {compra.pack?.nombre || "Pack"}
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              AR${compra.montoAbonado?.toLocaleString("es-AR")} abonados
            </p>
            {/* Barra de progreso */}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-32 h-1 bg-white/10 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-white/60 transition-all duration-500"
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <span className="text-[10px] text-white/35 tracking-wide">
                {realizadas}/{total} sesiones
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span
            className={`text-[9px] tracking-widest uppercase border px-2 py-0.5 ${badge.color}`}
          >
            {badge.label}
          </span>
          {expandido ? (
            <ChevronUp size={14} className="text-white/30" />
          ) : (
            <ChevronDown size={14} className="text-white/30" />
          )}
        </div>
      </button>

      {/* Sesiones */}
      {expandido && (
        <div className="border-t border-white/10 bg-[#0d0d0d] px-5 py-3">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-2">
            Sesiones
          </p>
          {sesiones.length === 0 ? (
            <p className="text-xs text-white/30 py-2">No hay sesiones</p>
          ) : (
            <div>
              {sesiones.map((sesion) => (
                <SesionRow
                  key={sesion._id}
                  sesion={sesion}
                  packCompraId={compra._id}
                  activo={activo}
                  onRefresh={onRefresh}
                />
              ))}
            </div>
          )}

          {!activo && compra.estado === "señado" && (
            <p className="text-[10px] text-white/30 mt-3 py-2 border-t border-white/8">
              Tu pago está en revisión. Una vez confirmado podrás agendar tus sesiones.
            </p>
          )}
          {!activo && compra.estado === "pendiente" && (
            <p className="text-[10px] text-white/30 mt-3 py-2 border-t border-white/8">
              Completá el pago para activar este pack y poder agendar sesiones.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const MisPacks = () => {
  const { token } = useAuth();
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/packs/compras/mis-compras`, {
        headers: { "x-token": token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setCompras(data.compras || []);
    } catch (err) {
      setError(err.message || "Error al cargar tus packs");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [token]);

  if (cargando) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500/20 px-4 py-3">
        <p className="text-xs text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">Packs</p>
        <h2 className="text-xl font-light text-white">Mis Packs</h2>
      </div>

      {compras.length === 0 ? (
        <div className="border border-white/8 px-6 py-12 text-center">
          <Layers size={28} className="text-white/15 mx-auto mb-4" />
          <p className="text-sm text-white/30 mb-1">No tenés packs activos</p>
          <p className="text-xs text-white/20">
            Explorá nuestros packs en la sección{" "}
            <a href="/servicios" className="text-white/40 underline underline-offset-2">
              Servicios
            </a>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {compras.map((compra) => (
            <PackCompraCard key={compra._id} compra={compra} onRefresh={cargar} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPacks;
