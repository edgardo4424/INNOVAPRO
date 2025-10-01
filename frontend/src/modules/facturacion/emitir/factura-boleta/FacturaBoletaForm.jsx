import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFacturaBoleta } from "../../context/FacturaBoletaContext";
import factilizaService from "../../service/FactilizaService";
import facturaService from "../../service/FacturaService";
import { formatearBorrador } from "../../utils/formatearBorrador";
import DatosDeDetraccion from "./components/campos/DatosDeDetraccion";
import DatosDelCliente from "./components/campos/DatosDelCliente";
import DatosDelComprobante from "./components/campos/DatosDelComprobante";
import DatosDeRetencion from "./components/campos/DatosDeRetencion";
import FormaDePago from "./components/campos/FormaDePago";
import MontoyProductos from "./components/campos/MontoyProductos";
import RelacionDocs from "./components/campos/RelacionDocs";
import ModalVisualizarFactura from "./components/modal/ModalVisualizarFactura";
import { ValorInicialFactura } from "./utils/valoresInicial";
import DetalleProducto from "./components/DetalleProducto";

const FacturaBoletaForm = () => {
  const {
    factura,
    setFactura,
    idBorrador,
    Limpiar,
    setPrecioDolarActual,
    detraccion,
    retencion,
    detallesExtra,
    setDetallesExtra,
    retencionActivado,
  } = useFacturaBoleta();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (idBorrador) {
      toast.error(
        "Estas tratando de registrar la factura como un borrardor, pero esta fue rellenada con un borrador previo",
      );
      return;
    }

    // *conseguir id usuario
    const user = localStorage.getItem("user");
    const userData = JSON.parse(user);

    let tipo_borrador = "";
    if (factura.tipo_Doc == "01") {
      tipo_borrador = "factura";
    }
    if (factura.tipo_Doc == "03") {
      tipo_borrador = "boleta";
    }
    let nuevoBorrador = {
      ...factura,
      valores_Detraccion: detraccion,
      valores_Retencion: retencion,
      retencion_activada: retencionActivado,
      valores_Detalles_Extra: detallesExtra,
    };

    const formateado = await formatearBorrador(
      tipo_borrador,
      nuevoBorrador,
      userData.id,
    );

    try {
      const { message, status, success } =
        await facturaService.registrarBorrador(formateado);
      if (status == 201 && success) {
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFactura(ValorInicialFactura);
        setDetallesExtra([]);
      }
      if (status == 400 && !success) {
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelar = () => {
    Limpiar();
    navigate("/facturacion/emitir/factura-boleta", { replace: true });
  };

  useEffect(() => {
    const cambioDelDia = async () => {
      try {
        const hoy = new Date(); // Esta línea es redundante si solo usas 'hoyISO' después
        const hoyISO = new Date().toISOString().slice(0, 10);

        const { status, success, data } =
          await factilizaService.obtenerTipoCambio(hoyISO);

        if (success && status === 200) {
          setPrecioDolarActual(data.compra);
        } else {
        }
      } catch (error) {}
    };

    cambioDelDia();
  }, []);
  return (
    <div className="mb-6 rounded-3xl border border-gray-400 bg-white p-4 shadow-xl transition-all duration-300">
      {/* Form */}
      {/* Datos del comprobante */}
      <DatosDelComprobante />

      {/* Documentos Relacionados */}
      <RelacionDocs />

      {/* Datos del cliente */}
      <DatosDelCliente />

      {/* Montos y productos */}
      <MontoyProductos />

      {/* Detalles adicionales */}
      <DetalleProducto />

      {/* Datos de retencion */}
      <DatosDeRetencion />

      {/* Datos de detraccion */}
      <DatosDeDetraccion />

      {/* Forma de pago */}
      <FormaDePago />

      {/* Facturar  */}
      <div className="flex justify-between">
        <div className="flex gap-x-8">
          <button
            onClick={handleRegister}
            className="bg-innova-blue cursor-pointer rounded-xl px-4 py-3 font-semibold text-white"
          >
            Guardar
          </button>
          <button
            onClick={handleCancelar}
            className="bg-innova-orange cursor-pointer rounded-xl px-4 py-3 font-semibold text-white"
          >
            Cancelar
          </button>
        </div>
        <ModalVisualizarFactura />
      </div>
    </div>
  );
};

export default FacturaBoletaForm;
