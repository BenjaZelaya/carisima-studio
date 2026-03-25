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

  // ─── Cargar datos ───────────────────────────────────────────────────────────

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resProductos, resCategorias] = await Promise.all([
          fetch("http://localhost:5000/api/productos"),
          fetch("http://localhost:5000/api/categorias"),
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

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const toggleServicio = (servicio) => {
    setSeleccionados((prev) => {
      const existe = prev.some((s) => s._id === servicio._id);
      return existe
        ? prev.filter((s) => s._id !== servicio._id)
        : [...prev, servicio];
    });
  };

  const total = seleccionados.reduce((sum, s) => sum + (Number(s.precio) || 0), 0);

  const handleContinuar = () => {
    navigate("/horario", { state: { servicios: seleccionados } });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (cargando) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-xl text-red-600 text-center px-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8FAFC] font-sans min-h-screen">
      <div className="px-6 py-10 md:px-10">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start max-w-7xl mx-auto">
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
          <ResumenReserva
            seleccionados={seleccionados}
            total={total}
            onRemove={toggleServicio}
            onContinuar={handleContinuar}
          />
        </div>
      </div>
    </div>
  );
};

export default Reservar;