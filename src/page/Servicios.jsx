// src/page/Servicios.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import TarjetaPack from "../components/Packs/TarjetaPack.jsx";

const Servicios = () => {
  const { estaLogueado } = useAuth();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [packs, setPacks] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resProductos, resPacks] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/productos`),
          fetch(`${import.meta.env.VITE_API_URL}/packs`),
        ]);
        const dataProductos = await resProductos.json();
        const dataPacks = await resPacks.json();
        setProductos(dataProductos.productos || []);
        setPacks(dataPacks.packs || []);
      } catch {
        // sin cambio de estado — el array vacío muestra el empty state
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const handleReservar = () => {
    setSeleccionado(null);
    navigate(estaLogueado ? "/reservar" : "/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* ── Header ── */}
        <div className="mb-16">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">
            Carissima Studio
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-tight mb-5">
            Nuestros Servicios
          </h1>
          <p className="text-sm text-white/40 max-w-md leading-relaxed">
            Precisión clínica y cuidado exclusivo. Descubrí nuestra selección
            de tratamientos de alto nivel diseñados para la estética moderna.
          </p>
        </div>

        {/* ── Grid de servicios ── */}
        {cargando ? (
          <div className="flex justify-center py-32">
            <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : productos.length === 0 ? (
          <p className="text-center text-white/25 text-sm tracking-widest uppercase py-24">
            No hay servicios disponibles por el momento
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {productos.map((p, i) => (
              <div
                key={p._id}
                onClick={() => setSeleccionado(p)}
                className="group bg-[#0a0a0a] overflow-hidden cursor-pointer opacity-0"
                style={{ animation: "fadeUp 0.5s ease-out forwards", animationDelay: `${i * 70}ms` }}
              >
                {/* Imagen */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <img
                    src={p.img}
                    alt={p.nombreProducto}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Info */}
                <div className="p-6 border-t border-white/8">
                  <h3 className="text-base font-semibold tracking-tight text-white mb-2 group-hover:text-white/70 transition-colors">
                    {p.nombreProducto}
                  </h3>
                  {p.descripcion && (
                    <p className="text-white/30 text-xs leading-relaxed mb-5 line-clamp-2">
                      {p.descripcion}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">
                      AR${p.precio.toLocaleString("es-AR")}
                    </span>
                    <span className="text-white/25 group-hover:text-white/60 transition-colors text-base">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Sección Packs ── */}
        {packs.length > 0 && (
          <div className="mt-28">
            <div className="mb-12 border-t border-white/8 pt-16">
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">
                Packs de sesiones
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-5">
                Packs de sesiones
              </h2>
              <p className="text-sm text-white/40 max-w-md leading-relaxed">
                Comprá un pack y agendá tus sesiones cuando quieras. Una seña única y el resto en el local.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packs.map((pack) => (
                <TarjetaPack key={pack._id} pack={pack} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {seleccionado && (
        <div
          onClick={(e) => e.target === e.currentTarget && setSeleccionado(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
        >
          <div
            className="bg-[#111111] border border-white/10 w-full max-w-lg overflow-hidden"
            style={{ animation: "modalEnter 0.25s ease forwards" }}
          >
            {/* Imagen */}
            <div className="relative" style={{ aspectRatio: "16/9" }}>
              <img
                src={seleccionado.img}
                alt={seleccionado.nombreProducto}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSeleccionado(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 border border-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors text-xs"
              >
                ✕
              </button>
            </div>

            {/* Contenido */}
            <div className="p-8">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">
                Servicio
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                {seleccionado.nombreProducto}
              </h2>
              <p className="text-sm text-white/40 mb-6">
                AR${seleccionado.precio.toLocaleString("es-AR")}
              </p>

              {seleccionado.descripcion && (
                <p className="text-sm text-white/40 leading-relaxed mb-8">
                  {seleccionado.descripcion}
                </p>
              )}

              <button
                onClick={handleReservar}
                className="w-full bg-white text-black py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors"
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
