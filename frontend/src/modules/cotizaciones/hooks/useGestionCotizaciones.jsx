import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import * as cotizacionesService from "../services/cotizacionesService";
import generarPDFPorUso from "../pdf/generadorPDFModular";

// Este hook maneja la lógica de negocio para la gestión de cotizaciones, incluyendo la descarga de PDFs y la paginación de las cotizaciones.
// Utiliza el servicio de cotizaciones para obtener los datos necesarios y generar PDFs personalizados.
// También maneja el estado de las cotizaciones y la paginación para optimizar la carga de datos.
// @returns {Object} Un objeto con las cotizaciones paginadas y la función para descargar PDFs.

export function useGestionCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([]);
  console.log('cotizaciones en el hook',cotizaciones);
  

  // Este estado controla si el modal de confirmación está abierto y qué cotización se va a descargar.
  // `abierto` indica si el modal está visible, y `cotizacionId` es el ID de la cotización seleccionada para descargar el PDF.
  // La función `confirmarDescargaPDF` se usa para abrir el modal con el ID de la cotización, `cerrarModal` cierra el modal y `ejecutarDescarga` maneja la 
  // lógica de descarga del PDF.
  // `ejecutarDescarga` llama al servicio para obtener los datos del PDF y genera el PDF utilizando `jsPDF`. El nombre del archivo se construye 
  // a partir de los datos de la cotización, cliente, obra y uso, asegurando que no contenga caracteres especiales ni espacios múltiples.
  // Si ocurre un error durante la generación del PDF, se muestra un mensaje de error utilizando `toast.error`.
  // El hook también maneja la carga inicial de cotizaciones desde el servicio, actualizando el estado `cotizaciones` con los datos obtenidos. 
  // Si hay un error al cargar las cotizaciones, se muestra un mensaje de error.
  // Finalmente, las cotizaciones se dividen en páginas utilizando `slice`, y se devuelve un objeto que contiene las cotizaciones paginadas, 
  // la función para confirmar la descarga del PDF, el estado del modal de confirmación y las funciones para cerrar el modal y ejecutar la descarga.

  const [modalConfirmacion, setModalConfirmacion] = useState({
    abierto: false,
    cotizacionId: null,
  });

  const confirmarDescargaPDF = (cotizacionId) => {
    setModalConfirmacion({ abierto: true, cotizacionId });
  };

  const cerrarModal = () => {
    setModalConfirmacion({ abierto: false, cotizacionId: null });
  };

  const ejecutarDescarga = async () => {
    const id = modalConfirmacion.cotizacionId;
    cerrarModal();
    try {
      const data = await cotizacionesService.obtenerDatosPDF(id);
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      await generarPDFPorUso({ uso_id: data.uso.id, data, doc });

      const codigo = data.cotizacion?.codigo_documento || "COTIZACION";
      const razon = data.cliente?.razon_social?.replace(/[^\w\s-]/gi, "").replace(/\s+/g, " ") || "CLIENTE";
      const obra = data.obra?.nombre?.replace(/[^\w\s-]/gi, "").replace(/\s+/g, " ") || "OBRA";
      const uso = data.uso?.nombre?.replace(/[^\w\s-]/gi, "").replace(/\s+/g, " ") || "USO";
      const tipo = data.cotizacion?.tipo_servicio?.toUpperCase() || "TIPO";
      const nombreArchivo = `${codigo}-${razon}-${obra}-${uso}-${tipo}.pdf`;

      doc.save(nombreArchivo);
    } catch (error) {
      console.error("❌ Error al generar PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };


  // 🔄 Cargar cotizaciones al iniciar
  useEffect(() => {
    async function fetchCotizaciones() {
      try {
        const res = await cotizacionesService.obtenerTodos();
        setCotizaciones(res || []);
      } catch (error) {
        console.error("❌ Error al obtener cotizaciones:", error);
        toast.error("Error al cargar cotizaciones");
      }
    }
    fetchCotizaciones();
  }, []);

  return {
    cotizaciones,
    confirmarDescargaPDF,
    modalConfirmacion,
    cerrarModal,
    ejecutarDescarga,
  };
}