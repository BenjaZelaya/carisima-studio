// src/components/Configuracion/admin/GestionCategorias.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { Pencil, Trash2, RotateCcw, ChevronDown, ChevronUp, X, GripVertical } from "lucide-react";
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

const FORM_INICIAL = { nombreCategoria: "", descripcion: "" };

// ─── Componente sortable individual ─────────────────────────────────────────

const CategoriaSortable = ({
  categoria, expandidaId, onExpandir, onEditar, onEliminar,
  onRestaurar, onEliminarDefinitivo, onAgregarProducto, onQuitarProducto,
  productosDeCategoria, productosDisponibles,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: categoria._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}
      className={`rounded-xl border ${categoria.estado ? "border-gray-100 bg-gray-50" : "border-red-100 bg-red-50"}`}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Handle drag */}
        <button {...attributes} {...listeners}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0">
          <GripVertical size={16} />
        </button>

        <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
          <span className="text-pink-500 font-bold text-sm">
            {categoria.nombreCategoria.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-800 truncate">{categoria.nombreCategoria}</p>
          <p className="text-xs text-gray-400">
            {categoria.productos?.length || 0} {categoria.productos?.length === 1 ? "servicio" : "servicios"}
          </p>
          {!categoria.estado && <span className="text-xs text-red-400">Inactiva</span>}
        </div>

        <div className="flex gap-1 flex-shrink-0">
          {categoria.estado ? (
            <>
              <button onClick={() => onExpandir(expandidaId === categoria._id ? null : categoria._id)}
                className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-700 transition">
                {expandidaId === categoria._id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              <button onClick={() => onEditar(categoria)}
                className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-700 transition">
                <Pencil size={15} />
              </button>
              <button onClick={() => onEliminar(categoria._id)}
                className="p-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 text-gray-400 hover:text-red-500 transition">
                <Trash2 size={15} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onRestaurar(categoria._id)}
                className="p-2 rounded-lg hover:bg-green-50 border border-transparent hover:border-green-100 text-gray-400 hover:text-green-500 transition">
                <RotateCcw size={15} />
              </button>
              <button onClick={() => onEliminarDefinitivo(categoria._id)}
                className="p-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 text-gray-400 hover:text-red-600 transition"
                title="Eliminar definitivamente">
                <X size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Panel expandible */}
      {expandidaId === categoria._id && (
        <div className="px-3 pb-3 border-t border-gray-100 pt-3">
          {productosDeCategoria.length > 0 && (
            <div className="flex flex-col gap-2 mb-3">
              {productosDeCategoria.map((p) => p && (
                <div key={p._id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100">
                  <img src={p.img} alt={p.nombreProducto} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  <span className="text-sm text-gray-700 flex-1 truncate">{p.nombreProducto}</span>
                  <button onClick={() => onQuitarProducto(categoria._id, p._id)}
                    className="text-gray-300 hover:text-red-400 transition flex-shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {productosDisponibles.length > 0 ? (
            <select defaultValue="" onChange={(e) => { if (e.target.value) onAgregarProducto(categoria._id, e.target.value); e.target.value = ""; }}
              className="w-full border border-dashed border-pink-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/50">
              <option value="" disabled>+ Agregar servicio</option>
              {productosDisponibles.map((p) => (
                <option key={p._id} value={p._id}>{p.nombreProducto}</option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-gray-400 text-center py-1">Todos los servicios ya están asignados</p>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Componente principal ───────────────────────────────────────────────────

const GestionCategorias = () => {
  const { token } = useAuth();

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [expandidaId, setExpandidaId] = useState(null);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [cargando, setCargando] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const cargarCategorias = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categorias/admin`, {
        headers: { "x-token": token },
      });
      const data = await res.json();
      const ordenadas = (data.categorias || []).sort((a, b) => a.orden - b.orden);
      setCategorias(ordenadas);
    } catch {
      setError("Error al cargar categorías");
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/productos/admin`, {
        headers: { "x-token": token },
      });
      const data = await res.json();
      setProductos(data.productos || []);
    } catch {
      setError("Error al cargar productos");
    }
  };

  useEffect(() => {
    if (!token) return;
    cargarCategorias();
    cargarProductos();
  }, [token]);

  // ─── Drag & Drop ──────────────────────────────────────────────────────────

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categorias.findIndex((c) => c._id === active.id);
    const newIndex = categorias.findIndex((c) => c._id === over.id);
    const nuevasCategorias = arrayMove(categorias, oldIndex, newIndex);
    setCategorias(nuevasCategorias);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/categorias/orden`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify({
          items: nuevasCategorias.map((c, index) => ({ id: c._id, orden: index })),
        }),
      });
    } catch {
      setError("Error al guardar el orden");
    }
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setExito(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setExito(null);

    const url = editandoId
      ? `${import.meta.env.VITE_API_URL}/categorias/${editandoId}`
      : `${import.meta.env.VITE_API_URL}/categorias`;

    try {
      const res = await fetch(url, {
        method: editandoId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || data.errors?.[0]?.msg || "Error al guardar"); return; }
      setExito(editandoId ? "Categoría actualizada" : "Categoría creada");
      setForm(FORM_INICIAL);
      setEditandoId(null);
      cargarCategorias();
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (c) => {
    setForm({ nombreCategoria: c.nombreCategoria, descripcion: c.descripcion || "" });
    setEditandoId(c._id);
    setExpandidaId(null);
    setError(null);
    setExito(null);
  };

  const handleCancelar = () => {
    setForm(FORM_INICIAL);
    setEditandoId(null);
    setError(null);
    setExito(null);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Desactivar esta categoría?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/categorias/${id}`, {
      method: "DELETE",
      headers: { "x-token": token },
    });
    cargarCategorias();
  };

  const handleRestaurar = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/categorias/${id}/restaurar`, {
      method: "PATCH",
      headers: { "x-token": token },
    });
    cargarCategorias();
  };

  const handleEliminarDefinitivo = async (id) => {
    if (!confirm("¿Eliminar definitivamente? Esta acción no se puede deshacer.")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/categorias/${id}/definitivo`, {
      method: "DELETE",
      headers: { "x-token": token },
    });
    cargarCategorias();
  };

  const handleAgregarProducto = async (categoriaId, productoId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categorias/${categoriaId}/agregar-producto`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify({ productoId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Error al agregar producto"); return; }
      cargarCategorias();
    } catch {
      setError("Error de conexión");
    }
  };

  const handleQuitarProducto = async (categoriaId, productoId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categorias/${categoriaId}/quitar-producto`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify({ productoId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Error al quitar producto"); return; }
      cargarCategorias();
    } catch {
      setError("Error de conexión");
    }
  };

  const productosDeCategoria = (categoria) =>
    categoria.productos?.map((p) => typeof p === "object" ? p : productos.find((pr) => pr._id === p)).filter(Boolean) || [];

  const productosDisponibles = (categoria) => {
    const idsAsignados = categoria.productos?.map((p) => typeof p === "object" ? p._id : p) || [];
    return productos.filter((p) => p.estado && !idsAsignados.includes(p._id));
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

      {/* Formulario */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          {editandoId ? "Editar categoría" : "Nueva categoría"}
        </h2>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
        {exito && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">{exito}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input name="nombreCategoria" value={form.nombreCategoria} onChange={handleChange}
              placeholder="Faciales, Corporales..." required
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
              placeholder="Descripción de la categoría..." rows={3}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="submit" disabled={cargando}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm">
              {cargando ? "Guardando..." : editandoId ? "Actualizar" : "Crear categoría"}
            </button>
            {editandoId && (
              <button type="button" onClick={handleCancelar}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista con drag & drop */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Categorías <span className="text-gray-400 font-normal text-sm">({categorias.length})</span>
        </h2>
        <p className="text-xs text-gray-400 mb-4">Arrastrá para cambiar el orden</p>

        {categorias.length === 0 ? (
          <p className="text-gray-400 text-center py-12 text-sm">No hay categorías aún</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={categorias.map((c) => c._id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                {categorias.map((c) => (
                  <CategoriaSortable
                    key={c._id}
                    categoria={c}
                    expandidaId={expandidaId}
                    onExpandir={setExpandidaId}
                    onEditar={handleEditar}
                    onEliminar={handleEliminar}
                    onRestaurar={handleRestaurar}
                    onEliminarDefinitivo={handleEliminarDefinitivo}
                    onAgregarProducto={handleAgregarProducto}
                    onQuitarProducto={handleQuitarProducto}
                    productosDeCategoria={productosDeCategoria(c)}
                    productosDisponibles={productosDisponibles(c)}
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

export default GestionCategorias;