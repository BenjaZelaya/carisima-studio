// src/page/PagoPack.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ResumenPackPago from "../components/Packs/ResumenPackPago.jsx";
import MetodoPago from "../components/Pago/MetodoPago.jsx";
import InstruccionesTransferencia from "../components/Pago/InstruccionesTransferencia.jsx";
import { Loader2 } from "lucide-react";

const PagoPack = () => {
  const { packId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [pack, setPack] = useState(null);
  const [cargandoPack, setCargandoPack] = useState(true);
  const [metodoPago, setMetodoPago] = useState("mercadopago");
  const [compraCreada, setCompraCreada] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [cargandoMP, setCargandoMP] = useState(false);
  const [subiendoComprobante, setSubiendoComprobante] = useState(false);
  const [comprobante, setComprobante] = useState(null);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState(null);

  // Cargar pack
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/packs/${packId}`, {
          headers: { "x-token": token },
        });
        if (!res.ok) throw new Error("Pack no encontrado");
        const data = await res.json();
        setPack(data);
      } catch {
        navigate("/servicios");
      } finally {
        setCargandoPack(false);
      }
    };
    cargar();
  }, [packId, token, navigate]);

  const crearCompra = async (metodo) => {
    if (compraCreada) return compraCreada;
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/packs/compras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-token": token,
        },
        body: JSON.stringify({ packId, metodoPago: metodo || metodoPago }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Error al crear la compra"); return null; }
      setCompraCreada(data);
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
      let compra = compraCreada;
      if (!compra) {
        compra = await crearCompra("mercadopago");
        if (!compra) return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/packs/compras/${compra._id}/preferencia-mp`,
        { method: "POST", headers: { "x-token": token } }
      );
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
      let compra = compraCreada;
      if (!compra) {
        compra = await crearCompra("transferencia");
        if (!compra) { setSubiendoComprobante(false); return; }
      }

      const formData = new FormData();
      formData.append("img", file);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/packs/compras/${compra._id}/subir-comprobante`,
        { method: "POST", headers: { "x-token": token }, body: formData }
      );
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Error al subir el comprobante"); return; }

      setComprobante(data.comprobantePago || "ok");
      setCompraCreada(data);
      setExito(true);
    } catch {
      setError("Error al subir el comprobante. Verificá tu conexión e intentá de nuevo.");
    } finally {
      setSubiendoComprobante(false);
    }
  };

  if (cargandoPack) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (exito) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
        <div className="border border-white/10 bg-[#111111] p-10 max-w-sm w-full text-center">
          <div className="w-12 h-12 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-xl">✓</span>
          </div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">Comprobante enviado</p>
          <h2 className="font-serif text-2xl font-light text-white mb-3">
            ¡Gracias por tu compra!
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            Recibirás una confirmación una vez que revisemos tu pago. Una vez activo el pack, podrás agendar tus sesiones desde "Mis Packs".
          </p>
          <button
            onClick={() => navigate("/configuracion?tab=packs")}
            className="w-full border border-white/30 text-white py-3 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all"
          >
            Ver mis packs
          </button>
        </div>
      </div>
    );
  }

  const seña = pack ? Math.round(pack.precio * ((pack.porcentajeSeña ?? 50) / 100)) : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-white/30 mb-3">Pago</p>
          <h1 className="font-serif text-4xl font-light text-white">Completá tu compra</h1>
        </div>

        {error && (
          <div className="border border-red-500/20 bg-red-500/8 px-4 py-3 mb-6">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Resumen del pack */}
          <div className="lg:col-span-2">
            <ResumenPackPago pack={pack} />
          </div>

          {/* Pago */}
          <div className="lg:col-span-3 space-y-4">
            <MetodoPago
              seleccionado={metodoPago}
              onChange={setMetodoPago}
            />

            {metodoPago === "mercadopago" && (
              <div className="bg-[#111111] border border-white/10 p-6">
                <h2 className="font-serif text-xl font-light text-white mb-2">Mercado Pago</h2>
                <p className="text-white/40 text-sm mb-5">
                  Pagá la seña de forma segura con tarjeta, efectivo o transferencia.
                </p>
                <div className="border border-white/10 p-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-sm">Monto a pagar (seña)</span>
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
                  {cargandoMP || cargando ? (
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
                subiendoComprobante={subiendoComprobante || cargando}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoPack;
