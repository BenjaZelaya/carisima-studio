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
    <div className="min-h-screen bg-[#0a0a0a] py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs tracking-widest2 uppercase text-white/30 mb-4 font-sans">Specialized</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light text-white">
            Nuestros Servicios
          </h1>
          <p className="text-white/40 text-sm mt-4 max-w-md leading-relaxed">
            Clinical precision meets exclusive care. Experience our curated selection of
            high-end beauty treatments designed for the modern aesthetic.
          </p>
        </div>

        {/* Grid */}
        {cargando ? (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : productos.length === 0 ? (
          <p className="text-center text-white/30 py-24">No hay servicios disponibles por el momento</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {productos.map((p, index) => (
              <div
                key={p._id}
                onClick={() => setSeleccionado(p)}
                className="group bg-[#0a0a0a] overflow-hidden cursor-pointer opacity-0"
                style={{
                  animation: `fadeUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 80}ms`
                }}
              >
                {/* Imagen */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <img
                    src={p.img}
                    alt={p.nombreProducto}
                    className="w-full h-full object-cover contrast-110 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-light text-white mb-2 group-hover:text-white/70 transition-colors">
                    {p.nombreProducto}
                  </h3>
                  {p.descripcion && (
                    <p className="text-white/30 text-xs leading-relaxed mb-4 line-clamp-2">
                      {p.descripcion}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-white/60 text-sm">
                      AR${p.precio.toLocaleString()}
                    </p>
                    <span className="text-white/30 group-hover:text-white/70 transition-colors text-sm">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECCIÓN PACKS */}
      {packs.length > 0 && (
        <div className="max-w-6xl mx-auto mt-24 px-6 pb-16">
          <div className="mb-12">
            <p className="text-xs tracking-widest uppercase text-white/30 mb-4 font-sans">Packs</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-white">
              Packs de sesiones
            </h2>
            <p className="text-white/40 text-sm mt-4 max-w-md leading-relaxed">
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

      {/* MODAL */}
      {seleccionado && (
        <div
          onClick={cerrarModal}
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6 backdrop-blur-sm"
        >
          <div
            className="bg-[#111111] border border-white/10 w-full max-w-lg overflow-hidden"
            style={{ animation: "modalEnter 0.3s ease forwards" }}
          >
            {/* Imagen */}
            <div className="relative" style={{ aspectRatio: "16/9" }}>
              <img
                src={seleccionado.img}
                alt={seleccionado.nombreProducto}
                className="w-full h-full object-cover contrast-110"
              />
              <button
                onClick={() => setSeleccionado(null)}
                className="absolute top-4 right-4 w-9 h-9 border border-white/20 text-white/60 hover:text-white flex items-center justify-center transition bg-black/40"
              >
                ✕
              </button>
            </div>

            {/* Contenido */}
            <div className="p-8">
              <h2 className="font-serif text-3xl font-light text-white mb-2">
                {seleccionado.nombreProducto}
              </h2>
              <p className="text-white/40 text-sm mb-6">
                AR${seleccionado.precio.toLocaleString()}
              </p>

              {seleccionado.descripcion && (
                <p className="text-white/40 text-sm leading-relaxed mb-8">
                  {seleccionado.descripcion}
                </p>
              )}

              <button
                onClick={handleReservar}
                className="w-full border border-white/30 text-white hover:bg-white hover:text-black font-medium py-3.5 text-sm tracking-widest uppercase transition-all duration-300"
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
