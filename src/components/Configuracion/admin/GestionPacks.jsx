// src/components/Configuracion/admin/GestionPacks.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { Plus, Pencil, X, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";

const FORM_INICIAL = {
  nombre: "",
  descripcion: "",
  serviciosIncluidos: [{ nombre: "", cantidad: 1 }],
  totalSesiones: 1,
  precio: "",
  porcentajeSeña: 50,
  activo: true,
};

const GestionPacks = () => {
  const { token } = useAuth();
  const [packs, setPacks] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(null);
  const [confirmEliminar, setConfirmEliminar] = useState(null); // pack a confirmar eliminar
  const [error, setError] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  const cargar = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/packs`, {
        headers: { "x-token": token },
      });
      const data = await res.json();
      setPacks(data.packs || []);
    } catch {
      setError("Error al cargar los packs");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, [token]);

  const abrirNuevo = () => {
    setEditandoId(null);
    setForm(FORM_INICIAL);
    setImagenFile(null);
    setImagenPreview(null);
    setError(null);
    setMostrarForm(true);
  };

  const abrirEditar = (pack) => {
    setEditandoId(pack._id);
    setForm({
      nombre: pack.nombre || "",
      descripcion: pack.descripcion || "",
      serviciosIncluidos: pack.serviciosIncluidos?.length
        ? pack.serviciosIncluidos
        : [{ nombre: "", cantidad: 1 }],
      totalSesiones: pack.totalSesiones || 1,
      precio: pack.precio || "",
      porcentajeSeña: pack.porcentajeSeña ?? 50,
      activo: pack.activo ?? true,
    });
    setImagenFile(null);
    setImagenPreview(pack.imagen || null);
    setError(null);
    setMostrarForm(true);
  };

  const cerrarForm = () => {
    setMostrarForm(false);
    setEditandoId(null);
    setError(null);
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagenPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleServicioChange = (i, field, value) => {
    setForm((prev) => {
      const copy = [...prev.serviciosIncluidos];
      copy[i] = { ...copy[i], [field]: value };
      return { ...prev, serviciosIncluidos: copy };
    });
  };

  const addServicio = () => {
    setForm((prev) => ({
      ...prev,
      serviciosIncluidos: [...prev.serviciosIncluidos, { nombre: "", cantidad: 1 }],
    }));
  };

  const removeServicio = (i) => {
    setForm((prev) => ({
      ...prev,
      serviciosIncluidos: prev.serviciosIncluidos.filter((_, idx) => idx !== i),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    try {
      // Si hay imagen nueva, subirla primero
      let imagenUrl = editandoId
        ? (imagenPreview && !imagenFile ? imagenPreview : null)
        : null;

      if (imagenFile) {
        const formData = new FormData();
        formData.append("img", imagenFile);
        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/productos/upload`, {
          method: "POST",
          headers: { "x-token": token },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Error al subir la imagen");
        const uploadData = await uploadRes.json();
        imagenUrl = uploadData.url;
      }

      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        serviciosIncluidos: form.serviciosIncluidos.filter((s) => s.nombre.trim()),
        totalSesiones: Number(form.totalSesiones),
        precio: Number(form.precio),
        porcentajeSeña: Number(form.porcentajeSeña),
        activo: form.activo,
      };

      if (imagenUrl) payload.imagen = imagenUrl;

      const url = editandoId
        ? `${import.meta.env.VITE_API_URL}/packs/${editandoId}`
        : `${import.meta.env.VITE_API_URL}/packs`;
      const method = editandoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al guardar");

      await cargar();
      cerrarForm();
    } catch (err) {
      setError(err.message || "Error al guardar el pack");
    } finally {
      setGuardando(false);
    }
  };

  const toggleActivo = async (pack) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/packs/${pack._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify({ activo: !pack.activo }),
      });
      if (res.ok) await cargar();
    } catch {
      // silent
    }
  };

  const eliminarPack = async (pack) => {
    setEliminando(pack._id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/packs/${pack._id}`, {
        method: "DELETE",
        headers: { "x-token": token },
      });
      if (res.ok) {
        await cargar();
        if (editandoId === pack._id) cerrarForm();
      }
    } catch {
      // silent
    } finally {
      setEliminando(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Lista */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">
            {packs.length} pack{packs.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={abrirNuevo}
            className="flex items-center gap-2 border border-white/20 px-4 py-2 text-xs tracking-widest uppercase text-white/60 hover:text-white hover:border-white/40 transition"
          >
            <Plus size={12} />
            Nuevo pack
          </button>
        </div>

        {cargando ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border border-white/20 border-t-white/80 rounded-full animate-spin" />
          </div>
        ) : packs.length === 0 ? (
          <div className="border border-white/8 px-6 py-10 text-center">
            <p className="text-xs text-white/25">No hay packs creados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {packs.map((pack) => (
              <div
                key={pack._id}
                className={`flex items-center justify-between p-4 border transition ${
                  pack.activo
                    ? "border-white/10 bg-[#111111]"
                    : "border-red-500/15 bg-red-500/4 opacity-60"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {pack.imagen && (
                    <img
                      src={pack.imagen}
                      alt={pack.nombre}
                      className="w-12 h-12 object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{pack.nombre}</p>
                    <p className="text-xs text-white/35 mt-0.5">
                      {pack.totalSesiones} sesión{pack.totalSesiones !== 1 ? "es" : ""} ·
                      AR${Number(pack.precio).toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <button
                    onClick={() => toggleActivo(pack)}
                    className="p-1.5 text-white/30 hover:text-white/70 transition"
                    title={pack.activo ? "Desactivar" : "Activar"}
                  >
                    {pack.activo
                      ? <ToggleRight size={16} />
                      : <ToggleLeft size={16} />
                    }
                  </button>
                  <button
                    onClick={() => abrirEditar(pack)}
                    className="p-1.5 text-white/30 hover:text-white transition"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmEliminar(pack)}
                    disabled={eliminando === pack._id}
                    className="p-1.5 text-white/20 hover:text-red-400 transition disabled:opacity-40"
                    title="Eliminar pack"
                  >
                    {eliminando === pack._id
                      ? <div className="w-3.5 h-3.5 border border-white/20 border-t-white/60 rounded-full animate-spin" />
                      : <Trash2 size={14} />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <div className="lg:w-96 shrink-0">
          <div className="bg-[#111111] border border-white/10 sticky top-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <p className="text-xs tracking-widest uppercase text-white/60">
                {editandoId ? "Editar pack" : "Nuevo pack"}
              </p>
              <button onClick={cerrarForm} className="text-white/30 hover:text-white transition">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="border border-red-500/20 px-3 py-2">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-white/35 block mb-1.5">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                  required
                  className="w-full bg-transparent border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 transition"
                  placeholder="Ej: Pack Maderoterapia"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-white/35 block mb-1.5">
                  Descripción
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
                  rows={2}
                  className="w-full bg-transparent border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 transition resize-none"
                  placeholder="Descripción breve del pack"
                />
              </div>

              {/* Servicios incluidos */}
              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-white/35 block mb-2">
                  Servicios incluidos
                </label>
                <div className="space-y-2">
                  {form.serviciosIncluidos.map((s, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={s.cantidad}
                        min={1}
                        onChange={(e) => handleServicioChange(i, "cantidad", Number(e.target.value))}
                        className="w-14 bg-transparent border border-white/15 px-2 py-2 text-sm text-white text-center focus:outline-none focus:border-white/40 transition"
                      />
                      <input
                        type="text"
                        value={s.nombre}
                        onChange={(e) => handleServicioChange(i, "nombre", e.target.value)}
                        placeholder="Nombre del servicio"
                        className="flex-1 bg-transparent border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 transition"
                      />
                      {form.serviciosIncluidos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeServicio(i)}
                          className="text-white/25 hover:text-red-400 transition p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addServicio}
                  className="mt-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-white/60 transition flex items-center gap-1"
                >
                  <Plus size={10} /> Agregar servicio
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-white/35 block mb-1.5">
                    Sesiones *
                  </label>
                  <input
                    type="number"
                    value={form.totalSesiones}
                    min={1}
                    onChange={(e) => setForm((p) => ({ ...p, totalSesiones: e.target.value }))}
                    required
                    className="w-full bg-transparent border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-white/35 block mb-1.5">
                    Seña %
                  </label>
                  <input
                    type="number"
                    value={form.porcentajeSeña}
                    min={1}
                    max={100}
                    onChange={(e) => setForm((p) => ({ ...p, porcentajeSeña: e.target.value }))}
                    className="w-full bg-transparent border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-white/35 block mb-1.5">
                  Precio total (AR$) *
                </label>
                <input
                  type="number"
                  value={form.precio}
                  min={0}
                  onChange={(e) => setForm((p) => ({ ...p, precio: e.target.value }))}
                  required
                  className="w-full bg-transparent border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 transition"
                  placeholder="105000"
                />
                {form.precio && (
                  <p className="text-[10px] text-white/30 mt-1">
                    Seña: AR${Math.round(Number(form.precio) * (Number(form.porcentajeSeña) / 100)).toLocaleString("es-AR")}
                  </p>
                )}
              </div>

              {/* Imagen */}
              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-white/35 block mb-1.5">
                  Imagen (opcional)
                </label>
                {imagenPreview && (
                  <div className="relative mb-2">
                    <img src={imagenPreview} alt="Preview" className="w-full h-28 object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImagenPreview(null); setImagenFile(null); }}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/60 border border-white/20 text-white/60 flex items-center justify-center hover:text-white transition"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
                <label className="flex items-center justify-center border border-dashed border-white/20 py-3 text-xs text-white/30 hover:text-white/60 hover:border-white/40 cursor-pointer transition">
                  <input type="file" accept="image/*" onChange={handleImagenChange} className="hidden" />
                  {imagenPreview ? "Cambiar imagen" : "Subir imagen"}
                </label>
              </div>

              <button
                type="submit"
                disabled={guardando}
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition disabled:opacity-50"
              >
                {guardando && <Loader2 size={13} className="animate-spin" />}
                {guardando ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear pack"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      {confirmEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-white/15 w-full max-w-sm">
            <div className="px-6 py-5 border-b border-white/10">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">Confirmar acción</p>
              <h3 className="text-sm font-medium text-white">Eliminar pack</h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-white/50 leading-relaxed">
                ¿Estás seguro que querés eliminar{" "}
                <span className="text-white font-medium">"{confirmEliminar.nombre}"</span>?
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-5">
              <button
                onClick={() => setConfirmEliminar(null)}
                className="flex-1 py-2.5 border border-white/15 text-white/50 text-xs tracking-[0.15em] uppercase hover:bg-white/5 hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  eliminarPack(confirmEliminar);
                  setConfirmEliminar(null);
                }}
                disabled={eliminando === confirmEliminar._id}
                className="flex-1 py-2.5 border border-red-500/40 text-red-400 text-xs tracking-[0.15em] uppercase hover:bg-red-500/10 transition disabled:opacity-40"
              >
                {eliminando === confirmEliminar._id ? (
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

export default GestionPacks;
