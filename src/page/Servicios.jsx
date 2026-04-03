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

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos");
        const data = await res.json();
        setProductos(data.productos || []);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const handleReservar = () => {
    if (!estaLogueado) {
      navigate("/login");
    } else {
      navigate("/reservar");
    }
    setSeleccionado(null);
  };

  const cerrarModal = (e) => {
    if (e.target === e.currentTarget) setSeleccionado(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-gray-900 mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-md mx-auto">
            Tratamientos faciales y corporales diseñados para realzar tu belleza natural
          </p>
        </div>

        {/* Grid con efecto cascada */}
        {cargando ? (
          <div className="flex justify-center py-32">
            <div className="w-10 h-10 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
          </div>
        ) : productos.length === 0 ? (
          <p className="text-center text-gray-400 py-24 text-lg">No hay servicios disponibles por el momento</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {productos.map((p, index) => (
              <div
                key={p._id}
                onClick={() => setSeleccionado(p)}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full opacity-0 translate-y-10"
                style={{
                  animation: `fadeUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Imagen */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.nombreProducto}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col">
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                    {p.nombreProducto}
                  </h3>

                  {p.descripcion && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {p.descripcion}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500">DESDE</span>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${p.precio.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-pink-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver más <span className="text-lg">→</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL CON EFECTO SUAVE */}
      {seleccionado && (
        <div
          onClick={cerrarModal}
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-lg sm:max-w-xl overflow-hidden shadow-2xl 
                       scale-95 opacity-0 animate-[modalEnter_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
          >
            {/* Imagen */}
            <div className="relative h-72 sm:h-96">
              <img
                src={seleccionado.img}
                alt={seleccionado.nombreProducto}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSeleccionado(null)}
                className="absolute top-4 right-4 bg-white rounded-2xl w-10 h-10 flex items-center justify-center shadow text-gray-600 hover:text-black transition"
              >
                ✕
              </button>
            </div>

            {/* Contenido */}
            <div className="p-8 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-3">
                {seleccionado.nombreProducto}
              </h2>
              <p className="text-3xl font-semibold text-pink-600 mb-8">
                ${seleccionado.precio.toLocaleString()}
              </p>

              {seleccionado.descripcion && (
                <p className="text-gray-600 leading-relaxed mb-10 text-[15.2px]">
                  {seleccionado.descripcion}
                </p>
              )}

              <button
                onClick={handleReservar}
                className="w-full bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white font-semibold py-4 rounded-2xl text-lg transition-all"
              >
                Reservar turno
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animaciones */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Servicios;