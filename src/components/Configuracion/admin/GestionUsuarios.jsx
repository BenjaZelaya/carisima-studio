// src/components/Configuracion/admin/GestionUsuarios.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { Trash2, UserCircle2, Search } from "lucide-react";
import useConfirm from "../../hooks/useConfirm.jsx";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const formatearFecha = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}, ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}hs`;
};

const GestionUsuarios = () => {
  const { token, usuario: adminActual } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const { confirm: askConfirm, ConfirmDialog } = useConfirm();

  const cargarUsuarios = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
        headers: { "x-token": token },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Error al cargar usuarios"); return; }
      const lista = data.usuarios || data.data || (Array.isArray(data) ? data : []);
      // Mostrar solo usuarios activos y no-admin
      setUsuarios(lista.filter((u) => u.estado !== false));
    } catch {
      setError("Error al cargar usuarios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const handleEliminar = async (id, nombre) => {
    if (!await askConfirm(`¿Eliminar al usuario ${nombre}? Esta acción desactivará su cuenta.`, { danger: true, confirmText: "Sí, eliminar" })) return;
    setEliminando(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: { "x-token": token },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.msg || "Error al eliminar usuario");
        return;
      }
      setUsuarios((prev) => prev.filter((u) => u._id !== id));
    } catch {
      setError("Error al eliminar usuario");
    } finally {
      setEliminando(null);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      u.nombre?.toLowerCase().includes(q) ||
      u.apellido?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.telefono?.includes(q)
    );
  });

  return (
    <div>
      {ConfirmDialog}
      {/* Buscador */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-transparent border border-white/15 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition"
        />
      </div>

      {cargando && (
        <p className="text-center text-white/30 py-10">Cargando usuarios...</p>
      )}

      {error && (
        <p className="text-center text-red-400 py-10">{error}</p>
      )}

      {!cargando && !error && usuariosFiltrados.length === 0 && (
        <div className="text-center py-12 text-white/30">
          <UserCircle2 size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No hay usuarios registrados</p>
        </div>
      )}

      {!cargando && !error && usuariosFiltrados.length > 0 && (
        <div className="flex flex-col gap-3">
          {usuariosFiltrados.map((u) => {
            const esSelf = u._id === adminActual?._id;
            const esAdmin = u.rol === "ADMIN_ROLE";
            return (
              <div
                key={u._id}
                className="bg-[#111111] border border-white/10 p-4 flex items-center gap-4"
              >
                {/* Avatar inicial */}
                <div className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/50 text-xs font-semibold shrink-0 uppercase">
                  {u.nombre?.[0] || "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-white truncate">
                      {u.nombre} {u.apellido}
                    </p>
                    {esAdmin && (
                      <span className="text-[10px] border border-white/15 text-white/50 px-2 py-0.5 tracking-widest uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 truncate">{u.email}</p>
                  {u.telefono && (
                    <p className="text-xs text-white/30">{u.telefono}</p>
                  )}
                  <p className="text-xs text-white/25 mt-0.5">
                    Registrado: {formatearFecha(u.createdAt)}
                  </p>
                </div>

                {/* Eliminar */}
                {!esSelf && !esAdmin && (
                  <button
                    onClick={() => handleEliminar(u._id, `${u.nombre} ${u.apellido}`)}
                    disabled={eliminando === u._id}
                    className="shrink-0 p-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 transition disabled:opacity-40"
                    title="Eliminar usuario"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] tracking-widest text-white/25 text-right mt-4">
        {usuariosFiltrados.length} usuario{usuariosFiltrados.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default GestionUsuarios;
