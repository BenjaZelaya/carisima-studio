// src/page/Reservar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListaServicios from "../components/Reservar/ListaServicios.jsx";
import ResumenReserva from "../components/Reservar/ResumenReserva.jsx";

const Reservar = () => {
  const navigate = useNavigate();

  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarResumen, setMostrarResumen] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resProductos, resCategorias] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/productos`),
          fetch(`${import.meta.env.VITE_API_URL}/categorias`),
        ]);
        const dataProductos = await resProductos.json();
        const dataCategorias = await resCategorias.json();
        setServicios(dataProductos.productos || []);
        setCategorias(dataCategorias.categorias || []);
      } catch {
        setError("No se pudieron cargar los servicios.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const toggleServicio = (servicio) => {
    setSeleccionados((prev) => {
      const existe = prev.some((s) => s._id === servicio._id);
      return existe
        ? prev.filter((s) => s._id !== servicio._id)
        : [...prev, servicio];
    });
  };

  const total = seleccionados.reduce(
    (sum, s) => sum + (Number(s.precio) || 0),
    0
  );

  const handleContinuar = () => {
    navigate("/horario", { state: { servicios: seleccionados } });
  };

  const abrirResumen = () => setMostrarResumen(true);
  const cerrarResumen = () => setMostrarResumen(false);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-white/50 text-center px-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        
        {/* TÍTULO */}
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-white/30 mb-3 font-sans">Booking</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-white">
            Elegí tus servicios
          </h1>
          <p className="text-white/40 text-sm mt-3">
            Seleccioná los tratamientos que deseas reservar
          </p>
        </div>

        {/* LAYOUT RESPONSIVE */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          
          {/* IZQUIERDA - SERVICIOS */}
          <div className="lg:col-span-2">
            <div
              className={`transition-all duration-300 ${
                mostrarResumen
                  ? "blur-sm pointer-events-none lg:blur-none lg:pointer-events-auto"
                  : ""
              }`}
            >
              <ListaServicios
                servicios={servicios}
                categorias={categorias}
                seleccionados={seleccionados}
                busqueda={busqueda}
                categoriaActiva={categoriaActiva}
                onBusqueda={setBusqueda}
                onCategoria={setCategoriaActiva}
                onToggle={toggleServicio}
              />
            </div>
          </div>

          {/* DERECHA - RESUMEN (SOLO DESKTOP) */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <ResumenReserva
                seleccionados={seleccionados}
                total={total}
                onRemove={toggleServicio}
                onContinuar={handleContinuar}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ===== MOBILE ===== */}

      {/* Overlay */}
      {mostrarResumen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={cerrarResumen}
        />
      )}

      {/* PANEL RESUMEN MOBILE */}
      {mostrarResumen && (
        <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
          <ResumenReserva
            seleccionados={seleccionados}
            total={total}
            onRemove={toggleServicio}
            onContinuar={handleContinuar}
          />
        </div>
      )}

      {/* BOTÓN FLOTANTE MOBILE */}
      {seleccionados.length > 0 && !mostrarResumen && (
        <button
          onClick={abrirResumen}
          className="fixed bottom-6 right-6 lg:hidden z-50 border border-white/30 bg-[#0a0a0a] text-white px-6 py-3.5 flex items-center gap-2 font-medium active:scale-95 transition-all text-sm tracking-wide"
        >
          Ver resumen
          <span className="border border-white/20 px-2.5 py-0.5 text-xs font-bold">
            {seleccionados.length}
          </span>
        </button>
      )}
    </div>
  );
};

export default Reservar;