// src/components/Configuracion/admin/GestionCategorias.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { Pencil, Trash2, RotateCcw, ChevronDown, ChevronUp, Plus, X } from "lucide-react";

const FORM_INICIAL = { nombreCategoria: "", descripcion: "" };

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

  // ─── Cargar datos ───────────────────────────────────────────────────────────

  const cargarCategorias = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categorias/admin", {
        headers: { "x-token": token },
      });
      const data = await res.json();
      setCategorias(data.categorias || []);
    } catch {
      setError("Error al cargar categorías");
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/productos/admin", {
        headers: { "x-token": token },
      });
      const data = await res.json();
      setProductos(data.productos || []);
    } catch {
      setError("Error al cargar productos");
    }
  };

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);

  // ─── Handlers formulario ────────────────────────────────────────────────────

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
      ? `http://localhost:5000/api/categorias/${editandoId}`
      : "http://localhost:5000/api/categorias";

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
    await fetch(`http://localhost:5000/api/categorias/${id}`, {
      method: "DELETE",
      headers: { "x-token": token },
    });
    cargarCategorias();
  };

  const handleRestaurar = async (id) => {
    await fetch(`http://localhost:5000/api/categorias/${id}/restaurar`, {
      method: "PATCH",
      headers: { "x-token": token },
    });
    cargarCategorias();
  };

  // ─── Handlers productos ─────────────────────────────────────────────────────

  const handleAgregarProducto = async (categoriaId, productoId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/categorias/${categoriaId}/agregar-producto`, {
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
      const res = await fetch(`http://localhost:5000/api/categorias/${categoriaId}/quitar-producto`, {
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

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const productosDeCategoria = (categoria) =>
    categoria.productos?.map((p) => (typeof p === "object" ? p : productos.find((pr) => pr._id === p))) .filter(Boolean) || [];

  const productosDisponibles = (categoria) => {
    const idsAsignados = categoria.productos?.map((p) => typeof p === "object" ? p._id : p) || [];
    return productos.filter((p) => p.estado && !idsAsignados.includes(p._id));
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

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

      {/* Lista */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Categorías <span className="text-gray-400 font-normal text-sm">({categorias.length})</span>
        </h2>

        {categorias.length === 0 ? (
          <p className="text-gray-400 text-center py-12 text-sm">No hay categorías aún</p>
        ) : (
          <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
            {categorias.map((c) => (
              <div key={c._id}
                className={`rounded-xl border ${
                  c.estado ? "border-gray-100 bg-gray-50" : "border-red-100 bg-red-50"
                }`}
              >
                {/* Header categoría */}
                <div className="flex items-center gap-3 p-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-500 font-bold text-sm">
                      {c.nombreCategoria.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{c.nombreCategoria}</p>
                    <p className="text-xs text-gray-400">
                      {c.productos?.length || 0} {c.productos?.length === 1 ? "servicio" : "servicios"}
                    </p>
                    {!c.estado && <span className="text-xs text-red-400">Inactiva</span>}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {c.estado ? (
                      <>
                        <button onClick={() => setExpandidaId(expandidaId === c._id ? null : c._id)}
                          className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-700 transition">
                          {expandidaId === c._id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                        <button onClick={() => handleEditar(c)}
                          className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-700 transition">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleEliminar(c._id)}
                          className="p-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 text-gray-400 hover:text-red-500 transition">
                          <Trash2 size={15} />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleRestaurar(c._id)}
                        className="p-2 rounded-lg hover:bg-green-50 border border-transparent hover:border-green-100 text-gray-400 hover:text-green-500 transition">
                        <RotateCcw size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Panel expandible de productos */}
                {expandidaId === c._id && (
                  <div className="px-3 pb-3 border-t border-gray-100 pt-3">

                    {/* Productos asignados */}
                    {productosDeCategoria(c).length > 0 && (
                      <div className="flex flex-col gap-2 mb-3">
                        {productosDeCategoria(c).map((p) => p && (
                          <div key={p._id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100">
                            <img src={p.img} alt={p.nombreProducto} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                            <span className="text-sm text-gray-700 flex-1 truncate">{p.nombreProducto}</span>
                            <button onClick={() => handleQuitarProducto(c._id, p._id)}
                              className="text-gray-300 hover:text-red-400 transition flex-shrink-0">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Selector para agregar productos */}
                    {productosDisponibles(c).length > 0 ? (
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) handleAgregarProducto(c._id, e.target.value);
                          e.target.value = "";
                        }}
                        className="w-full border border-dashed border-pink-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/50"
                      >
                        <option value="" disabled>+ Agregar servicio</option>
                        {productosDisponibles(c).map((p) => (
                          <option key={p._id} value={p._id}>{p.nombreProducto}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs text-gray-400 text-center py-1">
                        {productos.length === 0
                          ? "No hay servicios creados aún"
                          : "Todos los servicios ya están asignados"}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionCategorias;