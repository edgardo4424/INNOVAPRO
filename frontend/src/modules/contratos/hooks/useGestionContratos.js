import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import * as contratosService from "../services/contratosService";
import {generarPDFContrato} from "../pdf/generadorPDFContrato";
import { generarMensajeCondiciones } from "../utils/generarMensajeCondiciones";
import { useAuth } from "@/context/AuthContext";

// Lógica de negocio para gestión de contratos (extensión de cotizaciones)
export function useGestionContratos() {
  const { user } = useAuth();
  const [contratos, setContratos] = useState([]);

  const [modalConfirmacion, setModalConfirmacion] = useState({
    abierto: false,
    contratoId: null,
  });

  const confirmarDescargaPDF = (contratoId) => {
    setModalConfirmacion({ abierto: true, contratoId });
  };

  const cerrarModal = () => {
    setModalConfirmacion({ abierto: false, contratoId: null });
  };

  const ejecutarDescarga = async () => {
    const id = modalConfirmacion.contratoId;
    cerrarModal();
    try {
      const data = await contratosService.autocompletarCotizacion(id);

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Generador de PDF para contratos (legalidades, cláusulas, anexos)
      await generarPDFContrato({ data, doc });

      const codigo = data.contrato?.codigo_contrato || data.contrato?.codigo_documento || "CONTRATO";
      const razon =
        data.cliente?.razon_social?.replace(/[^\w\s-]/gi, "").replace(/\s+/g, " ") ||
        "CLIENTE";
      const obra =
        data.obra?.nombre?.replace(/[^\w\s-]/gi, "").replace(/\s+/g, " ") ||
        "OBRA";
      const uso =
        data.uso?.nombre?.replace(/[^\w\s-]/gi, "").replace(/\s+/g, " ") ||
        "USO";
      const tipo = (data.contrato?.tipo_contrato || data.contrato?.tipo_servicio || "TIPO").toUpperCase();

      const nombreArchivo = `${codigo}-${razon}-${obra}-${uso}-${tipo}.pdf`;
      doc.save(nombreArchivo);
    } catch (error) {
      console.error("❌ Error al generar PDF de contrato:", error);
      toast.error("Error al generar el PDF del contrato");
    }
  };

  const solicitarCondiciones = async (contrato, extras) => {
      try {
        const comentario = generarMensajeCondiciones(contrato, extras);
        await contratosService.solicitarCondiciones(contrato.id, comentario);
        toast.success("Condiciones de alquiler solicitadas correctamente");
  
        const res = await contratosService.obtenerContratos();
        setContratos( res || [])
      } catch (error) {
        console.error("Error al solicitar condiciones:", error);
        toast.error("No se pudo enviar la solicitud.");
      }
    }

  const solicitarPasePedido = async (contratoId) => {
    try {
      await contratosService.solicitarPasePedido(contratoId);
      toast.success("Se ha generado el Pase de Pedido con éxito");
    } catch (error) {
      console.error("No se pudo generar el pase de pedido:", error );
      toast.error(error?.response?.data?.error || "No se puedo generar el pase de pedido");
    }
  }

  useEffect(() => {
    async function fetchContratos() {
      try {
        const res = await contratosService.obtenerContratos(); 
        setContratos(res || []);
      } catch (error) {
        console.error("❌ Error al obtener contratos:", error);
        toast.error("Error al cargar contratos");
      }
    }
    fetchContratos();
  }, []);

  return {
    contratos,
    confirmarDescargaPDF,
    solicitarPasePedido,
    modalConfirmacion,
    cerrarModal,
    ejecutarDescarga,
    solicitarCondiciones,
    user,
  };
}