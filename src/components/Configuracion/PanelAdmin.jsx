// src/components/Configuracion/PanelAdmin.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Package, Tag } from "lucide-react";
import GestionProductos from "./admin/GestionProductos.jsx";
import GestionCategorias from "./admin/GestionCategorias.jsx";

const PanelAdmin = () => {
  const [seccion, setSeccion] = useState("productos");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Panel Admin</h1>
      <p className="text-gray-400 text-sm mb-6">Gestioná productos y categorías</p>

      {/* Tabs internos */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setSeccion("productos")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            seccion === "productos"
              ? "bg-pink-500 text-white shadow-md shadow-pink-200"
              : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Package size={16} />
          Productos
        </button>
        <button
          onClick={() => setSeccion("categorias")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            seccion === "categorias"
              ? "bg-pink-500 text-white shadow-md shadow-pink-200"
              : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Tag size={16} />
          Categorías
        </button>
      </div>

      {seccion === "productos" ? <GestionProductos /> : <GestionCategorias />}
    </div>
  );
};

export default PanelAdmin;