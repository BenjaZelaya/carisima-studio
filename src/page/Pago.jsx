// src/page/Pago.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ResumenPago from "../components/Pago/ResumenPago.jsx";
import MetodoPago from "../components/Pago/MetodoPago.jsx";
import InstruccionesTransferencia from "../components/Pago/InstruccionesTransferencia.jsx";

const Pago = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const servicios = location.state?.servicios || [];
  const fecha = location.state?.fecha || null;
  const horario = location.state?.horario || null;

  const [metodoPago, setMetodoPago] = useState("transferencia");
  const [turnoCreado, setTurnoCreado] = useState(null);
  const [comprobante, setComprobante] = useState(null);
  const [subiendoComprobante, setSubiendoComprobante] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  const total = servicios.reduce((sum, s) => sum + (Number(s.precio) || 0), 0);
  const seña = Math.round(total * 0.5);

  // ─── Redirige si no hay datos ───────────────────────────────────────────────

  useEffect(() => {
    if (servicios.length === 0 || !fecha || !horario) {
      navigate("/reservar");
    }
  }, []);

  // ─── Crear turno ────────────────────────────────────────────────────────────

  const crearTurno = async () => {
    if (turnoCreado) return turnoCreado;
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/turnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-token": token,
        },
        body: JSON.stringify({
          productos: servicios.map((s) => s._id),
          fecha,
          horaInicio: horario,
          metodoPago,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Error al crear el turno"); return null; }
      setTurnoCreado(data);
      return data;
    } catch {
      setError("Error de conexión");
      return null;
    } finally {
      setCargando(false);
    }
  };

  // ─── Subir comprobante ──────────────────────────────────────────────────────

  const handleSubirComprobante = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setSubiendoComprobante(true);
  setError(null);

  try {
    // Primero crea el turno si no existe
    let turno = turnoCreado;
    if (!turno) {
      turno = await crearTurno();
      if (!turno) return;
    }

    // Sube el comprobante directamente al turno
    const formData = new FormData();
    formData.append("img", file);

    const res = await fetch(`http://localhost:5000/api/turnos/${turno._id}/subir-comprobante`, {
      method: "POST",
      headers: { "x-token": token },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) { setError(data.msg || "Error al subir el comprobante"); return; }

    setComprobante(data.comprobante);
    setTurnoCreado(data);
    setExito(true);
  } catch {
    setError("Error de conexión");
  } finally {
    setSubiendoComprobante(false);
  }
};

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (servicios.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header con stepper */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/horario", { state: { servicios } })}
            className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500">
            ←
          </button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-gray-400">Servicios</span>
            <span className="text-gray-300">→</span>
            <span className="text-gray-400">Fecha y Hora</span>
            <span className="text-gray-300">→</span>
            <span className="text-[#ff7bed] font-bold">Pagar</span>
          </div>
        </div>

        {/* Éxito */}
        {exito && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-bold text-green-700 text-lg">¡Comprobante enviado!</p>
            <p className="text-green-600 text-sm mt-1">
              Tu turno está pendiente de confirmación. Te avisaremos por WhatsApp cuando esté confirmado.
            </p>
            <button
              onClick={() => navigate("/configuracion")}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
            >
              Ver mis turnos
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Izquierda */}
          <div className="flex-1 flex flex-col gap-6">
            <ResumenPago servicios={servicios} fecha={fecha} horario={horario} />
            <MetodoPago seleccionado={metodoPago} onChange={setMetodoPago} />
          </div>

          {/* Derecha */}
          <div className="w-full lg:w-96">
            {metodoPago === "transferencia" && (
              <InstruccionesTransferencia
                seña={seña}
                onSubirComprobante={handleSubirComprobante}
                comprobante={comprobante}
                subiendoComprobante={subiendoComprobante}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Pago;