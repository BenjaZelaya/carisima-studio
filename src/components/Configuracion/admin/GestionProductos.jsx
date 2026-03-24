// src/components/Configuracion/admin/GestionProductos.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { Pencil, Trash2, RotateCcw } from "lucide-react";

const FORM_INICIAL = {
  nombreProducto: "",
  descripcion: "",
  precio: "",
  img: "",
};

const GestionProductos = () => {
  const { token } = useAuth();

  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [subiendoImg, setSubiendoImg] = useState(false);
  const [preview, setPreview] = useState(null);

  // ─── Cargar productos ───────────────────────────────────────────────────────

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
    cargarProductos();
  }, []);

  // ─── Subir imagen ───────────────────────────────────────────────────────────

  const handleImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setSubiendoImg(true);
    const formData = new FormData();
    formData.append("img", file);
    try {
      const res = await fetch("http://localhost:5000/api/productos/upload", {
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

  // ─── Handlers formulario ────────────────────────────────────────────────────

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
      ? `http://localhost:5000/api/productos/${editandoId}`
      : "http://localhost:5000/api/productos";

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setForm(FORM_INICIAL);
    setPreview(null);
    setEditandoId(null);
    setError(null);
    setExito(null);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Desactivar este producto?")) return;
    await fetch(`http://localhost:5000/api/productos/${id}`, {
      method: "DELETE",
      headers: { "x-token": token },
    });
    cargarProductos();
  };

  const handleRestaurar = async (id) => {
    await fetch(`http://localhost:5000/api/productos/${id}/restaurar`, {
      method: "PATCH",
      headers: { "x-token": token },
    });
    cargarProductos();
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

      {/* Formulario */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          {editandoId ? "Editar producto" : "Nuevo producto"}
        </h2>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
        {exito && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">{exito}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            <div className="flex items-center gap-4">
              {preview && (
                <img src={preview} alt="preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
              )}
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center hover:border-pink-400 transition">
                  <p className="text-sm text-gray-400">
                    {subiendoImg ? "Subiendo..." : preview ? "Cambiar imagen" : "Subir imagen"}
                  </p>
                </div>
                <input type="file" accept="image/*" onChange={handleImagen} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input name="nombreProducto" value={form.nombreProducto} onChange={handleChange} placeholder="Limpieza Facial" required
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input name="precio" type="number" value={form.precio} onChange={handleChange} placeholder="15000" required min="0"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción del servicio..." rows={3}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="submit" disabled={cargando || subiendoImg}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm">
              {cargando ? "Guardando..." : editandoId ? "Actualizar" : "Crear producto"}
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
          Productos <span className="text-gray-400 font-normal text-sm">({productos.length})</span>
        </h2>

        {productos.length === 0 ? (
          <p className="text-gray-400 text-center py-12 text-sm">No hay productos aún</p>
        ) : (
          <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
            {productos.map((p) => (
              <div key={p._id}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  p.estado ? "border-gray-100 bg-gray-50" : "border-red-100 bg-red-50"
                }`}
              >
                <img src={p.img} alt={p.nombreProducto} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{p.nombreProducto}</p>
                  <p className="text-xs text-gray-400">AR${p.precio.toLocaleString()}</p>
                  {!p.estado && <span className="text-xs text-red-400">Inactivo</span>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {p.estado ? (
                    <>
                      <button onClick={() => handleEditar(p)}
                        className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-700 transition">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleEliminar(p._id)}
                        className="p-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 text-gray-400 hover:text-red-500 transition">
                        <Trash2 size={15} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleRestaurar(p._id)}
                      className="p-2 rounded-lg hover:bg-green-50 border border-transparent hover:border-green-100 text-gray-400 hover:text-green-500 transition">
                      <RotateCcw size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionProductos;