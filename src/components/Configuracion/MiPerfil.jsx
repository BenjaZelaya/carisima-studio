// src/components/Configuracion/MiPerfil.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/35 mb-2">
      {label}
    </label>
    <input
      {...props}
      className={`w-full bg-transparent border-b py-2.5 text-sm outline-none transition-colors ${
        props.disabled
          ? "border-white/8 text-white/25 cursor-not-allowed"
          : "border-white/15 text-white placeholder:text-white/25 focus:border-white/50"
      }`}
    />
  </div>
);

const MiPerfil = () => {
  const { usuario, token } = useAuth();
  const [form, setForm] = useState({
    nombre:   usuario?.nombre    || "",
    apellido: usuario?.apellido  || "",
    telefono: usuario?.telefono  || "",
    password: "",
  });
  const [exito, setExito]     = useState(null);
  const [error, setError]     = useState(null);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/perfil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Error al actualizar"); return; }
      setExito("Perfil actualizado correctamente");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch {
      setError("Error de conexiÃ³n");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="border-b border-white/8 pb-6 mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">Admin / Perfil</p>
        <h1 className="text-2xl font-bold tracking-tight text-white">Mi Perfil</h1>
      </div>

      <div className="max-w-lg">
        {error && (
          <div className="border-l-2 border-red-400 pl-3 text-red-400 text-xs mb-6">{error}</div>
        )}
        {exito && (
          <div className="border-l-2 border-white/40 pl-3 text-white/60 text-xs mb-6">{exito}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            <Field label="Nombre"   name="nombre"   value={form.nombre}   onChange={handleChange} />
            <Field label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} />
          </div>

          <Field label="Email" value={usuario?.email} disabled />

          <Field
            label="TelÃ©fono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="+54 (000) 000-0000"
          />

          <Field
            label="Nueva contraseÃ±a"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Dejar en blanco para no cambiar"
          />

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-white text-black py-3 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors disabled:opacity-40 mt-2"
          >
            {cargando ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MiPerfil;
