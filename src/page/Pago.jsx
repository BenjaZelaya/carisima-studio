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
          const pendiente = data.data.find((t) => ["borrador", "pendiente", "pago_rechazado"].includes(t.estado));
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

      window.location.href = data.initPoint || data.sandboxInitPoint;
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
      setComprobante(data.comprobante || data.img || "ok");
      setTurnoCreado(data);
      setExito(true);
    } catch (err) {
      console.error("❌ Error al subir comprobante:", err);
      setError("Error al subir el comprobante. Verificá tu conexión e intentá de nuevo.");
    } finally {
      setSubiendoComprobante(false);
    }
  };

  if (turnoPendiente && !turnoCreado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
        <div className="border border-white/10 bg-[#111111] p-8 max-w-md w-full">
          <div className="mb-6">
            <p className="text-xs tracking-widest uppercase text-white/30 mb-2">Reserva pendiente</p>
            <h2 className="font-serif text-2xl font-light text-white">¿Continuar con tu reserva?</h2>
            <p className="text-white/40 text-sm mt-2">
              Encontramos una reserva pendiente de pago. ¿Deseas continuar pagándola o hacer una nueva reserva?
            </p>
          </div>

          <div className="border border-white/10 p-4 mb-6 space-y-2">
            <p className="text-sm text-white/60"><span className="text-white/30">Fecha:</span> {new Date(turnoPendiente.fecha).toLocaleDateString("es-AR")}</p>
            <p className="text-sm text-white/60"><span className="text-white/30">Hora:</span> {turnoPendiente.horaInicio}</p>
            <p className="text-sm text-white/60"><span className="text-white/30">Servicios:</span> {turnoPendiente.productos?.length || 0}</p>
            <p className="text-sm text-white font-serif">AR${Math.round((turnoPendiente.total || 0) * 0.5).toLocaleString()}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleContinuarReserva}
              className="flex-1 border border-white/30 text-white py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all"
            >
              Continuar
            </button>
            <button
              onClick={handleNuevaReserva}
              className="flex-1 border border-white/15 text-white/50 py-3 text-sm tracking-widest uppercase hover:border-white/30 hover:text-white transition-all"
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (servicios.length === 0 && !turnoCreado) return null;

  if (exito) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
        <div className="border border-white/10 bg-[#111111] p-10 max-w-sm w-full text-center">
          <div className="w-12 h-12 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-xl">✓</span>
          </div>
          <h1 className="font-serif text-2xl font-light text-white mb-2">¡Comprobante enviado!</h1>
          <p className="text-white/40 text-sm mb-8">
            Tu turno está pendiente de confirmación. Te avisaremos cuando esté confirmado.
          </p>
          <button
            onClick={() => navigate("/configuracion")}
            className="w-full border border-white/30 text-white py-3.5 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all"
          >
            Ver mis turnos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate("/horario", { state: { servicios } })}
            className="text-white/30 hover:text-white transition-colors text-xl">
            ←
          </button>
          <div className="flex items-center gap-2 text-xs text-white/30 tracking-widest uppercase">
            <span>Servicios</span>
            <span>→</span>
            <span>Fecha y Hora</span>
            <span>→</span>
            <span className="text-white">Pago</span>
          </div>
        </div>

        {error && (
          <div className="border border-red-500/30 bg-red-500/5 text-red-400 px-4 py-3 mb-6 text-xs tracking-wide">
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
              <div className="bg-[#111111] border border-white/10 p-6">
                <h2 className="font-serif text-xl font-light text-white mb-2">Mercado Pago</h2>
                <p className="text-white/40 text-sm mb-5">
                  Pagá la seña de forma segura con tarjeta, efectivo o transferencia.
                </p>

                <div className="border border-white/10 p-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-sm">Monto a pagar</span>
                    <span className="font-serif text-xl text-white">
                      AR${seña.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePagarConMP}
                  disabled={cargandoMP || cargando}
                  className="w-full flex items-center justify-center gap-3 py-4 border border-white/30 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all disabled:opacity-40"
                >
                  {cargandoMP ? (
                    <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Pagar con Mercado Pago"
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
