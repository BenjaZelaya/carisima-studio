// src/components/Configuracion/MiPerfil.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { User, Mail, Phone, Lock } from "lucide-react";

const MiPerfil = () => {
  const { usuario, token } = useAuth();
  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    apellido: usuario?.apellido || "",
    telefono: usuario?.telefono || "",
    password: "",
  });
  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setExito(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const body = { ...form };
      if (!body.password) delete body.password;

      const res = await fetch("http://localhost:5000/api/usuarios/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-token": token,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || "Error al actualizar");
        return;
      }
      setExito("Perfil actualizado correctamente");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Mi Perfil</h1>
      <p className="text-gray-400 text-sm mb-8">Actualizá tu información personal</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
      )}
      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">{exito}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={usuario?.email}
              disabled
              className="w-full pl-9 pr-3 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Dejá en blanco para no cambiar"
              className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 mt-2"
        >
          {cargando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
};

export default MiPerfil;