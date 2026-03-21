import React, { useState, useEffect } from 'react';
import { Clock, Plus, Check, X, Search } from 'lucide-react';

const Reservar = () => {
  const [servicios, setServicios] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar servicios desde el backend
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('http://localhost:5000/api/productos');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Normalizamos: aseguramos que cada servicio tenga "id" (string)
        const dataNormalizada = data.map(serv => ({
          ...serv,
          id: serv.id || serv._id?.toString() || String(Math.random()), // fallback muy raro
        }));

        setServicios(dataNormalizada);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
        setError("No se pudieron cargar los servicios. Verifica que el backend esté corriendo.");
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  // Cargar selección guardada (solo los que aún existen)
  useEffect(() => {
    const saved = localStorage.getItem("servicios");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const validos = parsed.filter(s => 
          servicios.some(serv => serv.id === s.id)
        );
        setSeleccionados(validos);
      } catch (e) {
        console.error("Error parseando localStorage:", e);
      }
    }
  }, [servicios]);

  // Guardar en localStorage cada vez que cambian los seleccionados
  useEffect(() => {
    localStorage.setItem("servicios", JSON.stringify(seleccionados));
  }, [seleccionados]);

  const toggleServicio = (servicio) => {
    setSeleccionados(prev => {
      const existe = prev.some(s => s.id === servicio.id);
      if (existe) {
        return prev.filter(s => s.id !== servicio.id);
      }
      return [...prev, servicio];
    });
  };

  const calcularDuracionTotal = () => {
    let minutosTotales = 0;

    seleccionados.forEach(s => {
      const duracionStr = s.duracion || "";
      if (!duracionStr) return;

      const partes = duracionStr.split(/\s+/);
      let horas = 0;
      let minutos = 0;

      if (duracionStr.includes("hora") || duracionStr.includes("hs")) {
        horas = parseInt(partes[0]) || 0;
        if (duracionStr.includes("min")) {
          minutos = parseInt(partes[2]) || 0;
        }
      } else if (duracionStr.toLowerCase().includes("min")) {
        minutos = parseInt(partes[0]) || 0;
      }

      minutosTotales += (horas * 60) + minutos;
    });

    const h = Math.floor(minutosTotales / 60);
    const m = minutosTotales % 60;

    if (h === 0 && m === 0) return "—";
    if (h === 0) return `${m} min`;
    return m > 0 ? `${h}h ${m}min` : `${h} hs`;
  };

  const total = seleccionados.reduce((sum, s) => sum + (Number(s.precio) || 0), 0);
  const totalSena = seleccionados.reduce((sum, s) => sum + (Number(s.sena) || 0), 0);

  const serviciosFiltrados = servicios.filter(servicio =>
    servicio.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600 animate-pulse">Cargando servicios...</p>
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
      <style>{`
        .bg-grid-dots {
          background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #ff7bed;
          border-radius: 10px;
        }
      `}</style>

      <div className="px-6 py-10 md:px-10">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start max-w-7xl mx-auto">
          {/* LISTADO DE SERVICIOS */}
          <div className="w-full lg:w-3/5 xl:w-2/3 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 bg-grid-dots relative">
            {/* Buscador */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="¿Qué servicio buscas?"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-white rounded-2xl border border-gray-200 focus:border-[#ff7bed] focus:ring-2 focus:ring-[#ff7bed]/30 outline-none transition-all shadow-sm"
              />
            </div>

            {/* Lista de servicios */}
            <div className="space-y-5">
              {serviciosFiltrados.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg">No encontramos servicios con ese nombre</p>
                  <p className="text-sm mt-2">Intenta con otra búsqueda</p>
                </div>
              ) : (
                serviciosFiltrados.map((servicio) => {
                  const isSelected = seleccionados.some(s => s.id === servicio.id);

                  return (
                    <div
                      key={servicio.id}
                      onClick={() => toggleServicio(servicio)}
                      className={`group flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${
                        isSelected
                          ? 'border-[#ff7bed] bg-[#ff7bed]/5'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`p-1 rounded-full border-2 transition-all flex-shrink-0 ${
                        isSelected ? 'border-[#ff7bed]/40' : 'border-transparent'
                      }`}>
                        <img
                          src={servicio.imagen || "https://via.placeholder.com/80?text=?"}
                          alt={servicio.nombre || "Servicio"}
                          className="w-20 h-20 rounded-full object-cover"
                          onError={e => { e.target.src = "https://via.placeholder.com/80?text=?"; }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <h3 className={`font-bold text-lg sm:text-xl ${isSelected ? 'text-[#ff7bed]' : 'text-gray-800'} group-hover:text-[#ff7bed] truncate`}>
                            {servicio.nombre}
                          </h3>
                          <div className="text-right whitespace-nowrap">
                            <p className="font-extrabold text-gray-900 text-lg sm:text-xl">
                              AR${Number(servicio.precio || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              Seña ${Number(servicio.sena || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 mb-3 text-[#ff7bed] bg-[#ff7bed]/10 w-fit px-3 py-1 rounded-full text-xs font-semibold">
                          <Clock size={14} />
                          {servicio.duracion || "—"}
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {servicio.descripcion || "Sin descripción disponible"}
                        </p>
                      </div>

                      <div className={`hidden sm:flex w-12 h-12 rounded-full items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-[#ff7bed] text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isSelected ? <Check size={24} strokeWidth={3} /> : <Plus size={24} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RESUMEN */}
          <div className="w-full lg:w-2/5 xl:w-1/3 lg:sticky lg:top-8">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-800">Tu Reserva</h2>
                <span className="bg-[#ff7bed]/10 text-[#ff7bed] text-sm font-bold px-4 py-1.5 rounded-full">
                  {seleccionados.length} {seleccionados.length === 1 ? 'servicio' : 'servicios'}
                </span>
              </div>

              {seleccionados.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                  <p className="text-gray-500 italic">
                    Selecciona servicios para ver el resumen
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                    {seleccionados.map(s => (
                      <div key={s.id} className="bg-gray-50 p-4 rounded-2xl relative group/item">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleServicio(s);
                          }}
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-70 hover:opacity-100 transition-opacity"
                        >
                          <X size={18} />
                        </button>
                        <h4 className="font-semibold text-gray-800 pr-8">{s.nombre}</h4>
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <div className="flex items-center gap-1.5 text-[#ff7bed] font-medium">
                            <Clock size={14} />
                            {s.duracion}
                          </div>
                          <span className="font-bold text-gray-900">
                            AR${Number(s.precio || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-gray-200 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Total a abonar</span>
                      <span className="text-3xl font-black text-[#ff7bed]">
                        ${total.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Seña (reserva)</span>
                      <span className="font-semibold">${totalSena.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duración aproximada</span>
                      <span className="font-semibold flex items-center gap-1.5">
                        <Clock size={14} />
                        {calcularDuracionTotal()}
                      </span>
                    </div>

                    <button
                      disabled={seleccionados.length === 0}
                      className={`w-full py-4 mt-4 rounded-2xl font-bold text-base uppercase tracking-wide transition-all ${
                        seleccionados.length === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#ff7bed] text-white hover:bg-[#e85ed8] shadow-md hover:shadow-lg"
                      }`}
                    >
                      Confirmar y elegir fecha
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservar;