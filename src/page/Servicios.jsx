// src/page/Servicios.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Servicios = () => {
  const { estaLogueado } = useAuth();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);

  // ─── Cargar productos ───────────────────────────────────────────────────────

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos");
        const data = await res.json();
        setProductos(data.productos || []);
      } catch {
        console.error("Error al cargar productos");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleReservar = () => {
    if (!estaLogueado) {
      navigate("/login");
    } else {
      navigate("/reservar");
    }
  };

  const cerrarModal = (e) => {
    if (e.target === e.currentTarget) setSeleccionado(null);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Nuestros Servicios</h1>
          <p className="text-gray-500 text-lg">Elegí el tratamiento ideal para vos</p>
        </div>

        {/* Grilla */}
        {cargando ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : productos.length === 0 ? (
          <p className="text-center text-gray-400 py-24">No hay servicios disponibles por el momento</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((p) => (
              <div
                key={p._id}
                onClick={() => setSeleccionado(p)}
                className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Imagen */}
                <div className="relative overflow-hidden h-64">
                  <img
                    src={p.img}
                    alt={p.nombreProducto}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300" />
                </div>

                {/* Info */}
                <div className="bg-white px-5 py-4 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{p.nombreProducto}</h3>
                  <span className="text-sm text-pink-500 font-medium group-hover:underline">
                    Ver más →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal detalle */}
      {seleccionado && (
        <div
          onClick={cerrarModal}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

            {/* Imagen */}
            <div className="relative h-64">
              <img
                src={seleccionado.img}
                alt={seleccionado.nombreProducto}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSeleccionado(null)}
                className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-gray-600 hover:text-black transition"
              >
                ✕
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{seleccionado.nombreProducto}</h2>
              <p className="text-pink-500 font-semibold text-lg mb-4">
                AR${seleccionado.precio.toLocaleString()}
              </p>
              {seleccionado.descripcion && (
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {seleccionado.descripcion}
                </p>
              )}
              <button
                onClick={handleReservar}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition"
              >
                Reservar turno
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Servicios;