import React, { useState, useEffect } from 'react';
import { Clock, Plus, Check, X, Search } from 'lucide-react';

const SERVICIOS_DATA = [
  { id: 1, nombre: "Limpieza Facial", duracion: "1 hora 30 minutos", precio: 15000, sena: 7500, descripcion: "Limpieza general de la piel, mascara hidratante y protector solar.", imagen: "https://cdn.shopify.com/s/files/1/1051/6806/files/Fotolia_6656103_Subscription_L_1024x1024.jpg?13335607050985159455" },
  { id: 2, nombre: "Peeling", duracion: "1 hora 30 minutos", precio: 15000, sena: 7500, descripcion: "Renovación celular con ácidos seleccionados según cada tipo de piel. Mejora textura y tono.", imagen: "https://clidecem.es/wp-content/uploads/2025/09/peeling-facial-clidecem-e1677678321278-846x1024-1.jpg" },
  { id: 3, nombre: "Masajes Relajantes", duracion: "2 horas", precio: 50000, sena: 25000, descripcion: "Masaje relajante o descontracturante enfocado en aliviar la tensión muscular.", imagen: "https://via.placeholder.com/100" },
  { id: 4, nombre: "Perfilado", duracion: "30 minutos", precio: 15000, sena: 7500, descripcion: "Perfilado de cejas es un tratamiento estético que da forma y define las cejas.", imagen: "https://via.placeholder.com/100" }
];

const Reservar = () => {

  const [seleccionados, setSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // cargar selección guardada
  useEffect(() => {
    const saved = localStorage.getItem("servicios");
    if (saved) setSeleccionados(JSON.parse(saved));
  }, []);

  // guardar selección
  useEffect(() => {
    localStorage.setItem("servicios", JSON.stringify(seleccionados));
  }, [seleccionados]);

  const toggleServicio = (servicio) => {
    const existe = seleccionados.find(s => s.id === servicio.id);

    if (existe) {
      setSeleccionados(seleccionados.filter(s => s.id !== servicio.id));
    } else {
      setSeleccionados([...seleccionados, servicio]);
    }
  };

  const calcularDuracionTotal = () => {

    let minutosTotales = 0;

    seleccionados.forEach(s => {

      if (s.duracion.includes("hora")) {

        const partes = s.duracion.split(" ");
        const horas = parseInt(partes[0]);
        const mins = s.duracion.includes("minutos") ? parseInt(partes[2]) : 0;

        minutosTotales += (horas * 60) + mins;

      } else {

        minutosTotales += parseInt(s.duracion.split(" ")[0]);

      }

    });

    const h = Math.floor(minutosTotales / 60);
    const m = minutosTotales % 60;

    if (h === 0) return `${m} min`;

    return m > 0 ? `${h}h ${m}min` : `${h} hs`;

  };

  const total = seleccionados.reduce((acc, el) => acc + el.precio, 0);
  const totalSena = seleccionados.reduce((acc, el) => acc + el.sena, 0);

  const serviciosFiltrados = SERVICIOS_DATA.filter(servicio =>
    servicio.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="w-full bg-[#F8FAFC] font-sans">

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

      <div className="px-10 py-10">

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* SERVICIOS */}

          <div className="w-full lg:w-[65%] bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 bg-grid-dots relative">

            {/* BUSCADOR */}

            <div className="relative mb-10 z-10">

              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

              <input
                type="text"
                placeholder="¿Qué servicio buscas?"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-50 focus:ring-2 focus:ring-[#ff7bed] outline-none transition-all"
              />

            </div>

            {/* LISTA */}

            <div className="space-y-6 z-10 relative">

              {serviciosFiltrados.map((servicio) => {

                const isSelected = seleccionados.some(s => s.id === servicio.id);

                return (

                  <div
                    key={servicio.id}
                    onClick={() => toggleServicio(servicio)}
                    className={`group flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all cursor-pointer hover:shadow-lg ${
                      isSelected
                        ? 'border-[#ff7bed] bg-[#ff7bed]/5 shadow-[#ff7bed]/10'
                        : 'border-transparent bg-white shadow-md shadow-gray-100'
                    }`}
                  >

                    <div className={`p-1 rounded-full border-2 transition-colors ${isSelected ? 'border-[#ff7bed]/30' : 'border-transparent'}`}>

                      <img
                        src={servicio.imagen}
                        alt=""
                        className="w-20 h-20 rounded-full object-cover"
                      />

                    </div>

                    <div className="flex-1">

                      <div className="flex justify-between items-start">

                        <h3 className={`font-bold text-xl ${isSelected ? 'text-[#ff7bed]' : 'text-gray-800'} group-hover:text-[#ff7bed]`}>
                          {servicio.nombre}
                        </h3>

                        <div className="text-right">
                          <p className="font-extrabold text-gray-900 text-xl">
                            AR${servicio.precio.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            Seña ${servicio.sena.toLocaleString()}
                          </p>
                        </div>

                      </div>

                      <div className="flex items-center gap-2 my-3 text-[#ff7bed] bg-[#ff7bed]/10 w-fit px-4 py-1.5 rounded-full text-xs font-bold">
                        <Clock size={14}/>
                        {servicio.duracion}
                      </div>

                      <p className="text-sm text-gray-500 max-w-lg">
                        {servicio.descripcion}
                      </p>

                    </div>

                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#ff7bed] text-white'
                        : 'bg-gray-50 text-gray-300'
                    }`}>

                      {isSelected
                        ? <Check size={24} strokeWidth={3}/>
                        : <Plus size={24} strokeWidth={3}/>
                      }

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

          {/* RESUMEN */}

          <div className="w-full lg:w-[35%] lg:sticky lg:top-28">

            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200 border border-gray-50">

              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-800">Tu Reserva</h2>
                <span className="bg-[#ff7bed]/10 text-[#ff7bed] text-xs font-black px-3 py-1 rounded-full uppercase">
                  {seleccionados.length} items
                </span>
              </div>

              {seleccionados.length === 0 ? (

                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-[2rem]">

                  <p className="text-gray-400 italic">
                    Personaliza tu experiencia seleccionando servicios
                  </p>

                </div>

              ) : (

                <div className="flex flex-col gap-6">

                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">

                    {seleccionados.map((s) => (

                      <div key={s.id} className="bg-gray-50 p-5 rounded-[1.5rem] relative">

                        <button
                          onClick={(e)=>{
                            e.stopPropagation();
                            toggleServicio(s);
                          }}
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
                        >
                          <X size={18}/>
                        </button>

                        <h4 className="font-bold text-gray-700 pr-6">
                          {s.nombre}
                        </h4>

                        <div className="flex justify-between mt-4">

                          <div className="flex items-center gap-1 text-[10px] text-[#ff7bed] font-bold uppercase">
                            <Clock size={12}/>
                            {s.duracion}
                          </div>

                          <p className="font-black text-gray-900">
                            AR${s.precio.toLocaleString()}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                  <div className="pt-8 border-t border-gray-100">

                    <div className="flex flex-col gap-3 mb-8">

                      <div className="flex justify-between">
                        <span className="font-bold text-sm">
                          A abonar en el local
                        </span>

                        <span className="text-3xl font-black text-[#ff7bed]">
                          ${total.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">

                        <span className="text-gray-400 uppercase text-[10px] font-bold">
                          Seña para reservar
                        </span>

                        <span className="font-bold">
                          ${totalSena.toLocaleString()}
                        </span>

                      </div>

                      <div className="flex justify-between text-sm">

                        <span className="text-gray-400 uppercase text-[10px] font-bold">
                          Duración
                        </span>

                        <span className="flex items-center gap-1 font-bold">
                          <Clock size={14}/>
                          {calcularDuracionTotal()}
                        </span>

                      </div>

                    </div>

                    <button
                      disabled={seleccionados.length === 0}
                      className={`w-full py-5 rounded-2xl font-black uppercase text-sm transition-all ${
                        seleccionados.length === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#ff7bed] hover:bg-[#e66ed5] text-white"
                      }`}
                    >

                      Confirmar y elegir fecha

                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Reservar;