// src/components/Configuracion/admin/GestionProductos.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import useConfirm from "../../hooks/useConfirm.jsx";
import { Pencil, Trash2, RotateCcw, GripVertical, X } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const FORM_INICIAL = {
  nombreProducto: "",
  descripcion: "",
  precio: "",
  img: "",
};

// ─── Componente sortable individual ─────────────────────────────────────────

const ProductoSortable = ({ producto, onEditar, onEliminar, onRestaurar, onEliminarDefinitivo }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: producto._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 border ${
        producto.estado ? "border-white/10 bg-[#111111]" : "border-red-500/20 bg-red-500/5"
      }`}
    >
      {/* Handle drag */}
      <button
        {...attributes}
        {...listeners}
        className="text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing flex-shrink-0"
      >
        <GripVertical size={16} />
      </button>

      <img src={producto.img} alt={producto.nombreProducto}
        className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/80 truncate">{producto.nombreProducto}</p>
        <p className="text-xs text-white/40">AR${producto.precio.toLocaleString()}</p>
        {!producto.estado && <span className="text-xs text-red-400">Inactivo</span>}
      </div>

      <div className="flex gap-1 flex-shrink-0">
        {producto.estado ? (
          <>
            <button onClick={() => onEditar(producto)}
              className="p-2 hover:bg-white/8 border border-white/10 text-white/35 hover:text-white/70 transition">
              <Pencil size={13} />
            </button>
            <button onClick={() => onEliminar(producto._id)}
              className="p-2 hover:bg-red-500/10 border border-white/10 text-white/35 hover:text-red-400 transition">
              <Trash2 size={13} />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onRestaurar(producto._id)}
              className="p-2 hover:bg-white/8 border border-white/10 text-white/35 hover:text-white/70 transition">
              <RotateCcw size={13} />
            </button>
            <button onClick={() => onEliminarDefinitivo(producto._id)}
              className="p-2 hover:bg-red-500/10 border border-white/10 text-white/35 hover:text-red-400 transition"
              title="Eliminar definitivamente">
              <X size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Componente principal ───────────────────────────────────────────────────

const GestionProductos = () => {
  const { token } = useAuth();
  const { confirm: askConfirm, ConfirmDialog } = useConfirm();

  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [subiendoImg, setSubiendoImg] = useState(false);
  const [preview, setPreview] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  // ─── Cargar productos ─────────────────────────────────────────────────────

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/productos/admin`, {
        headers: { "x-token": token },
      });
      const data = await res.json();
      const ordenados = (data.productos || []).sort((a, b) => a.orden - b.orden);
      setProductos(ordenados);
    } catch {
      setError("Error al cargar productos");
    }
  };

  useEffect(() => {
    if (!token) return;
    cargarProductos();
  }, [token]);

  // ─── Drag & Drop ──────────────────────────────────────────────────────────

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = productos.findIndex((p) => p._id === active.id);
    const newIndex = productos.findIndex((p) => p._id === over.id);
    const nuevosProductos = arrayMove(productos, oldIndex, newIndex);
    setProductos(nuevosProductos);

    // Guarda el nuevo orden en el backend
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/productos/orden`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify({
          items: nuevosProductos.map((p, index) => ({ id: p._id, orden: index })),
        }),
      });
    } catch {
      setError("Error al guardar el orden");
    }
  };

  // ─── Subir imagen ─────────────────────────────────────────────────────────

  const handleImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setSubiendoImg(true);
    const formData = new FormData();
    formData.append("img", file);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/productos/upload`, {
        method: "POST",
        headers: { "x-token": token },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) { setError("Error al subir la imagen"); return; }
      setForm((prev) => ({ ...prev, img: data.url }));
    } catch {
      setError("Error al subir la imagen");
    } finally {
      setSubiendoImg(false);
    }
  };

  // ─── Handlers formulario ──────────────────────────────────────────────────

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setExito(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.img) { setError("Debés subir una imagen"); return; }
    setCargando(true);
    setError(null);
    setExito(null);

    const url = editandoId
      ? `${import.meta.env.VITE_API_URL}/productos/${editandoId}`
      : `${import.meta.env.VITE_API_URL}/productos`;

    try {
      const res = await fetch(url, {
        method: editandoId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify({ ...form, precio: Number(form.precio) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || data.errors?.[0]?.msg || "Error al guardar"); return; }
      setExito(editandoId ? "Producto actualizado" : "Producto creado");
      setForm(FORM_INICIAL);
      setPreview(null);
      setEditandoId(null);
      cargarProductos();
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (p) => {
    setForm({ nombreProducto: p.nombreProducto, descripcion: p.descripcion || "", precio: p.precio, img: p.img });
    setPreview(p.img);
    setEditandoId(p._id);
    setError(null);
    setExito(null);
  };

  const handleCancelar = () => {
    setForm(FORM_INICIAL);
    setPreview(null);
    setEditandoId(null);
    setError(null);
    setExito(null);
  };

  const handleEliminar = async (id) => {
    if (!await askConfirm("¿Desactivar este producto?", { confirmText: "Sí, desactivar" })) return;
    await fetch(`${import.meta.env.VITE_API_URL}/productos/${id}`, {
      method: "DELETE",
      headers: { "x-token": token },
    });
    cargarProductos();
  };

  const handleRestaurar = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/productos/${id}/restaurar`, {
      method: "PATCH",
      headers: { "x-token": token },
    });
    cargarProductos();
  };

  const handleEliminarDefinitivo = async (id) => {
    if (!await askConfirm("¿Eliminar definitivamente? Esta acción no se puede deshacer.", { danger: true, confirmText: "Sí, eliminar" })) return;
    await fetch(`${import.meta.env.VITE_API_URL}/productos/${id}/definitivo`, {
      method: "DELETE",
      headers: { "x-token": token },
    });
    cargarProductos();
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {ConfirmDialog}

      {/* Formulario */}
      <div className="bg-[#111111] border border-white/10 p-6">
        <h2 className="text-sm font-medium tracking-wide text-white mb-6">
          {editandoId ? "Editar producto" : "Nuevo producto"}
        </h2>

        {error && <div className="border border-red-500/20 text-red-400 px-4 py-3 mb-4 text-xs">{error}</div>}
        {exito && <div className="border border-white/10 bg-white/5 text-white/60 px-4 py-3 mb-4 text-xs">{exito}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-white/35 mb-2">Imagen</label>
            <div className="flex items-center gap-4">
              {preview && (
                <img src={preview} alt="preview" className="w-14 h-14 object-cover border border-white/15" />
              )}
              <label className="flex-1 cursor-pointer">
                <div className="border border-dashed border-white/20 p-3 text-center hover:border-white/40 transition">
                  <p className="text-xs text-white/30">
                    {subiendoImg ? "Subiendo..." : preview ? "Cambiar imagen" : "Subir imagen"}
                  </p>
                </div>
                <input type="file" accept="image/*" onChange={handleImagen} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-white/35 mb-2">Nombre</label>
            <input name="nombreProducto" value={form.nombreProducto} onChange={handleChange}
              placeholder="Limpieza Facial" required
              className="w-full bg-transparent border border-white/15 p-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition" />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-white/35 mb-2">Precio</label>
            <input name="precio" type="number" value={form.precio} onChange={handleChange}
              placeholder="15000" required min="0"
              className="w-full bg-transparent border border-white/15 p-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition" />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-white/35 mb-2">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
              placeholder="Descripción del servicio..." rows={3}
              className="w-full bg-transparent border border-white/15 p-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition" />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="submit" disabled={cargando || subiendoImg}
              className="flex-1 bg-white text-black hover:bg-white/90 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase transition disabled:opacity-40">
              {cargando ? "Guardando..." : editandoId ? "Actualizar" : "Crear producto"}
            </button>
            {editandoId && (
              <button type="button" onClick={handleCancelar}
                className="flex-1 border border-white/20 text-white/50 hover:text-white hover:border-white/40 py-3 text-[11px] tracking-[0.2em] uppercase transition">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista con drag & drop */}
      <div className="bg-[#111111] border border-white/10 p-6">
        <h2 className="text-sm font-medium tracking-wide text-white mb-1">
          Productos <span className="text-white/30 font-normal">({productos.length})</span>
        </h2>
        <p className="text-[10px] tracking-widest uppercase text-white/25 mb-4">Arrastrá para cambiar el orden</p>

        {productos.length === 0 ? (
          <p className="text-white/30 text-center py-12 text-sm">No hay productos aún</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={productos.map((p) => p._id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                {productos.map((p) => (
                  <ProductoSortable
                    key={p._id}
                    producto={p}
                    onEditar={handleEditar}
                    onEliminar={handleEliminar}
                    onRestaurar={handleRestaurar}
                    onEliminarDefinitivo={handleEliminarDefinitivo}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default GestionProductos;