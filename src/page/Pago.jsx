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

  let servicios = location.state?.servicios || [];
  let fecha = location.state?.fecha || null;
  let horario = location.state?.horario || null;

  const [metodoPago, setMetodoPago] = useState("mercadopago");
  const [turnoCreado, setTurnoCreado] = useState(null);
  const [comprobante, setComprobante] = useState(null);
  const [subiendoComprobante, setSubiendoComprobante] = useState(false);
  const [cargandoMP, setCargandoMP] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  const [turnoPendiente, setTurnoPendiente] = useState(null);
  const [cargandoTurnos, setCargandoTurnos] = useState(true);

  if (turnoPendiente) {
    servicios = turnoPendiente.productos || [];
    fecha = turnoPendiente.fecha;
    horario = turnoPendiente.horaInicio;
  }

  const total = servicios.reduce((sum, s) => sum + (Number(s.precio) || 0), 0);
  const seña = Math.round(total * 0.5);

  useEffect(() => {
    const cargarTurnosPendientes = async () => {
      if (!token) {
        setCargandoTurnos(false);
        return;
      }

      if (location.state?.servicios && location.state.servicios.length > 0) {
        setCargandoTurnos(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos/mis-turnos`, {
          headers: { "x-token": token },
        });
        const data = await res.json();

        if (res.ok && data.data && Array.isArray(data.data)) {
          const pendiente = data.data.find((t) => t.estado === "pendiente");
          if (pendiente) {
            setTurnoPendiente(pendiente);
          }
        }
      } catch (err) {
        console.error("Error cargando turnos:", err);
      } finally {
        setCargandoTurnos(false);
      }
    };

    cargarTurnosPendientes();
  }, [token, location.state?.servicios]);

  useEffect(() => {
    if (cargandoTurnos) return;
    if (servicios.length === 0 && !turnoPendiente) {
      navigate("/reservar");
    }
  }, [cargandoTurnos, servicios.length, turnoPendiente, navigate]);

  const handleContinuarReserva = () => {
    setTurnoCreado(turnoPendiente);
  };

  const handleNuevaReserva = () => {
    setTurnoPendiente(null);
    navigate("/reservar");
  };

  const crearTurno = async (metodo) => {
    if (turnoCreado) return turnoCreado;
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-token": token,
        },
        body: JSON.stringify({
          productos: servicios.map((s) => s._id),
          fecha,
          horaInicio: horario,
          metodoPago: metodo || metodoPago,
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

  const handlePagarConMP = async () => {
    setCargandoMP(true);
    setError(null);
    try {
      let turno = turnoCreado;
      if (!turno) {
        turno = await crearTurno("mercadopago");
        if (!turno) return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/pagos/preferencia/${turno._id}`, {
        method: "POST",
        headers: { "x-token": token },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Error al crear preferencia"); return; }

      window.location.href = data.sandboxInitPoint || data.initPoint;
    } catch {
      setError("Error de conexión con Mercado Pago");
    } finally {
      setCargandoMP(false);
    }
  };

  const handleSubirComprobante = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoComprobante(true);
    setError(null);

    try {
      let turno = turnoCreado;
      if (!turno) {
        turno = await crearTurno("transferencia");
        if (!turno) {
          setError("Error al crear el turno. Intenta de nuevo.");
          setSubiendoComprobante(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("img", file);

      console.log("📤 Subiendo comprobante para turno:", turno._id);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos/${turno._id}/subir-comprobante`, {
        method: "POST",
        headers: { "x-token": token },
        body: formData,
      });
      
      console.log("📨 Response status:", res.status);
      const data = await res.json();
      console.log("📦 Response data:", data);
      
      if (!res.ok) { 
        console.error("❌ Error response:", data);
        setError(data.msg || "Error al subir el comprobante");
        setSubiendoComprobante(false);
        return; 
      }

      console.log("✅ Comprobante subido correctamente");
      setComprobante(data.comprobante || data.img);
      setTurnoCreado(data);
      setExito(true);
      setSubiendoComprobante(false);
    } catch (err) {
      console.error("❌ Error al subir comprobante:", err);
      setError("Error al subir el comprobante");
      setSubiendoComprobante(false);
    }
  };

  if (turnoPendiente && !turnoCreado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¿Continuar con tu reserva?</h2>
            <p className="text-gray-600 text-sm">
              Encontramos una reserva pendiente de pago. ¿Deseas continuar pagándola o hacer una nueva reserva?
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
            <p className="text-sm"><strong>Fecha:</strong> {new Date(turnoPendiente.fecha).toLocaleDateString("es-AR")}</p>
            <p className="text-sm"><strong>Hora:</strong> {turnoPendiente.horaInicio}</p>
            <p className="text-sm"><strong>Servicios:</strong> {turnoPendiente.productos?.length || 0}</p>
            <p className="text-sm font-bold text-[#ff7bed]">Monto: AR${Math.round((turnoPendiente.total || 0) * 0.5).toLocaleString()}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleContinuarReserva}
              className="flex-1 bg-[#ff7bed] hover:bg-[#ff6bd8] text-white font-bold py-3 rounded-xl transition"
            >
              Continuar pagando
            </button>
            <button
              onClick={handleNuevaReserva}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition"
            >
              Nueva reserva
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cargandoTurnos) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#ff7bed] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (servicios.length === 0 && !turnoCreado) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-10">
      <div className="max-w-5xl mx-auto">

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

        {exito && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-bold text-green-700 text-lg">¡Comprobante enviado!</p>
            <p className="text-green-600 text-sm mt-1">
              Tu turno está pendiente de confirmación. Te avisaremos por WhatsApp cuando esté confirmado.
            </p>
            <button onClick={() => navigate("/configuracion")}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition text-sm">
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

          <div className="flex-1 flex flex-col gap-6">
            <ResumenPago servicios={servicios} fecha={fecha} horario={horario} />
            <MetodoPago seleccionado={metodoPago} onChange={setMetodoPago} />
          </div>

          <div className="w-full lg:w-96 flex flex-col gap-4">
            {metodoPago === "mercadopago" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Mercado Pago</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Pagá la seña de forma segura con tarjeta, efectivo o transferencia.
                    </p>
                  </div>
                  <span className="text-3xl">💳</span>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Monto a pagar</span>
                    <span className="font-black text-[#ff7bed] text-lg">
                      AR${seña.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePagarConMP}
                  disabled={cargandoMP || cargando}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#009ee3] hover:bg-[#008ccc] text-white font-bold transition disabled:opacity-60"
                >
                  {cargandoMP ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="text-xl">💳</span>
                      Pagar con Mercado Pago
                    </>
                  )}
                </button>
              </div>
            )}

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
