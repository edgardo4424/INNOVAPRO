import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validarNotaCompleta } from "../emitir/notas-de-credito/utils/validarNota";
import {
  notaInical,
  ValorInicialDetalleNota,
  valorInicialProducto,
} from "../emitir/notas-de-credito/utils/valoresInicialNota";
import factilizaService from "../service/FactilizaService";
import facturaService from "../service/FacturaService";
import filialesService from "../service/FilialesService";
import numeroALeyenda from "../utils/numeroALeyenda";

const NotaContext = createContext();

export function NotaProvider({ children }) {
  // ** CORRELATIVOS
  const [correlativos, setCorrelativos] = useState([]);
  const [correlativoEstado, setCorrelativoEstado] = useState(false);
  const [loadingCorrelativo, setLoadingCorrelativo] = useState(false);
  // Notas de crédito
  const serieCredito = [
    { value: "FCT1", doc: "01" }, // Nota de crédito sobre factura
    { value: "FCT2", doc: "01" }, // (opcional segunda serie)
    { value: "BCT1", doc: "03" }, // Nota de crédito sobre boleta
    { value: "BCT2", doc: "03" },
  ];

  // Notas de débito
  const serieDebito = [
    { value: "FDT1", doc: "01" }, // Nota de débito sobre factura
    { value: "FDT2", doc: "01" },
    { value: "BDT1", doc: "03" }, // Nota de débito sobre boleta
    { value: "BDT2", doc: "03" },
  ];

  // ?? BORRADOR
  const [idBorrador, setIdBorrador] = useState(null);

  // ?? DATOS DE LA NOTA
  const [notaCreditoDebito, setNotaCreditoDebito] = useState(notaInical); // ?Datos de guia que abarcan los 3 casos
  // ?? DATOS DEL DOCUMNETO A AFECTAR
  const [documentoAAfectar, setDocumentoAAfectar] = useState(
    ValorInicialDetalleNota,
  );

  const [erroresNota, setErroresNota] = useState(null);

  const [itemActual, setItemActual] = useState(valorInicialProducto);

  const [id_items, setid_items] = useState([]);

  const [filiales, setFiliales] = useState([]);

  // ?? OBTENER TODAS LAS FILIALES

  useEffect(() => {
    const consultarFiliales = async () => {
      const data = await filialesService.ObtenerPiezas();
      if (data.length === 0) {
        toast.error("No se encontraron filiales");
        return;
      }
      setFiliales(data);
    };
    consultarFiliales();
  }, []);

  // ?? OBTENER CORRELATIVOS
  const buscarCorrelativo = async () => {
    if (loadingCorrelativo) return;

    try {
      setLoadingCorrelativo(true);
      const rucsAndSeries = filiales.map((filial) => ({
        ruc: filial.ruc,
        credito: serieCredito,
        debito: serieDebito,
      }));

      const { data } =
        await facturaService.obtenerCorrelativoNota(rucsAndSeries);
      setCorrelativos(data);
    } catch (error) {
      console.error("Error al obtener correlativos:", error);
    } finally {
      setLoadingCorrelativo(false);
    }
  };

  // Al cargar el componente o cambiar la lista de filiales, buscar los correlativos
  useEffect(() => {
    if (filiales.length > 0) {
      buscarCorrelativo();
    }
  }, [filiales]);

  useEffect(() => {
    const actualizarFacturaMontos = () => {
      let gravadas = 0;
      let exoneradas = 0;
      let igvTotal = 0;

      notaCreditoDebito.detalle.forEach((producto) => {
        const valorVenta = parseFloat(producto.monto_Valor_Venta);

        if (
          ["10", "11", "12", "13", "14", "15", "16", "17"].includes(
            producto.tip_Afe_Igv,
          )
        ) {
          gravadas += valorVenta;
          igvTotal += valorVenta * 0.18;
        } else if (
          [
            "20",
            "21",
            "30",
            "31",
            "32",
            "33",
            "34",
            "35",
            "36",
            "40",
            "",
          ].includes(producto.tip_Afe_Igv)
        ) {
          exoneradas += valorVenta;
        }
      });

      const subTotal = gravadas + igvTotal + exoneradas;

      setNotaCreditoDebito((prev) => ({
        ...prev,
        monto_Oper_Gravadas: parseFloat(gravadas.toFixed(2)),
        monto_Oper_Exoneradas: parseFloat(exoneradas.toFixed(2)),
        monto_Igv: parseFloat(igvTotal.toFixed(2)),
        total_Impuestos: parseFloat(igvTotal.toFixed(2)),
        valor_Venta: parseFloat((gravadas + exoneradas).toFixed(2)),
        sub_Total: parseFloat(subTotal.toFixed(2)),
        monto_Imp_Venta: parseFloat(subTotal.toFixed(2)),
      }));
    };

    if (notaCreditoDebito.detalle?.length > 0) {
      actualizarFacturaMontos();
    }
  }, [notaCreditoDebito.detalle]);

  useEffect(() => {
    if (
      !notaCreditoDebito.monto_Imp_Venta ||
      notaCreditoDebito.monto_Imp_Venta <= 0
    )
      return;

    const nuevaLegenda = numeroALeyenda(
      notaCreditoDebito.monto_Imp_Venta,
      notaCreditoDebito.tipo_Moneda,
    );

    setNotaCreditoDebito((prev) => ({
      ...prev,
      legend: [
        {
          legend_Code: "1000",
          legend_Value: nuevaLegenda,
        },
      ],
    }));
  }, [notaCreditoDebito.monto_Imp_Venta]);

  const validarNota = async () => {
    try {
      const { errores, validos, message } = await validarNotaCompleta(
        notaCreditoDebito,
        documentoAAfectar,
      );

      if (!validos) {
        // *Encuentra el primer error y lo muestra en un toast
        const primerError = Object.values(errores)[0];
        if (primerError) {
          toast.error(primerError);
        } else {
          toast.error(
            "El formulario de la nota contiene errores. Revise los campos.",
          );
        }

        // *Opcional: Si quieres guardar todos los errores en el estado
        setErroresNota(errores);

        return false;
      } else {
        toast.success(message);
        setErroresNota(null); // ?Limpia los errores del estado si todo es válido
        return true;
      }
    } catch (error) {
      toast.error(error.message || "Error al validar la nota");
      return false;
    }
  };

  const EmitirNota = async () => {
    const { id: id_logeado } = await JSON.parse(localStorage.getItem("user"));
    // ? 1. Iniciar un objeto de resultado para manejar todos los escenarios.
    let result = {
      success: false,
      message: "Error desconocido al emitir la nota",
      data: null,
    };

    try {
      // ? 2. Intentar enviar la nota a SUNAT
      const { status, success, message, data } =
        await factilizaService.enviarNota(notaCreditoDebito);

      // ? 3. Evaluar la respuesta de la API de factilización.
      if (
        status === 200 &&
        (data?.sunatResponse?.cdrResponse?.code == "0" ||
          data?.error?.code == "HTTP")
      ) {
        // ? ÉXITO en SUNAT: La nota fue aceptada.

        // ? a. Formatear la respuesta de SUNAT para el registro en la base de datos.
        const sunat_respuest = {
          hash: data.hash,
          cdr_zip: data.sunatResponse.cdrZip,
          sunat_success: data.sunatResponse.success,
          cdr_response_id: data.sunatResponse.cdrResponse.id,
          cdr_response_code: data.sunatResponse.cdrResponse.code,
          cdr_response_description: data.sunatResponse.cdrResponse.description,
        };
        let detalleFormateado = [];

        if (notaCreditoDebito.motivo_Cod == "05") {
          notaCreditoDebito.detalle.forEach((detalle) => {
            detalleFormateado.push({
              ...detalle,
              Descuentos: detalle.Descuentos
                ? JSON.stringify(detalle.Descuentos)
                : null,
            });
          });
        } else {
          detalleFormateado = notaCreditoDebito.detalle;
        }

        // ? b. Preparar el objeto final a registrar.
        const notaEmitida = {
          ...notaCreditoDebito,
          usuario_id: id_logeado,
          detalle: detalleFormateado,
          sunat_respuesta: sunat_respuest,
          factura_id: documentoAAfectar.factura_id,
          guia_id: documentoAAfectar.guia_id,
          id_borrador: idBorrador ? idBorrador : null,
        };

        // ? c. ¡Ahora sí! Intentar registrar la nota en la base de datos.
        const {
          status: dbStatus,
          success: dbSuccess,
          message: dbMessage,
        } = await registrarBaseDatos(notaEmitida);

        // ? d. Evaluar el resultado del registro en la base de datos.
        if (dbStatus) {
          // ? ÉXITO TOTAL: Se emitió y se registró correctamente.
          result = {
            success: true,
            message: "Nota de crédito/débito emitida y registrada con éxito.",
            data: notaEmitida,
          };
        } else {
          // ÉXITO PARCIAL: Se emitió a SUNAT, pero falló el registro local.
          result = {
            success: false,
            message:
              "La nota fue emitida a SUNAT, pero no se pudo registrar en la base de datos.",
            detailed_message: dbMessage,
            data: notaEmitida,
          };
        }
      } else if (
        status === 200 &&
        data?.sunatResponse?.cdrResponse?.code != "0"
      ) {
        // ? ERROR LÓGICO: La API respondió, pero SUNAT rechazó el documento.
        result = {
          success: false,
          message: message,
          detailed_message:
            `${data.error.code} - ${data.error.message}` ||
            "Error desconocido al enviar la nota.",
          data: data,
        };
      } else {
        // ? ERROR DE SERVICIO: La API no pudo procesar la solicitud.
        result = {
          success: false,
          message: message || "Error desconocido en el servicio de emisión.",
          data: data,
        };
      }
    } catch (error) {
      // ? ERROR DE RED o EXCEPCIÓN: Fallo de conexión o problema inesperado.
      console.error("Error al enviar la nota:", error);
      if (error.response) {
        result = {
          success: false,
          message:
            error.response.data?.message ||
            error.response.data?.error ||
            "Error al comunicarse con la API.",
          data: error.response.data,
        };
      } else {
        result = {
          success: false,
          message: error.message || "Ocurrió un error inesperado.",
          data: null,
        };
      }
    } finally {
      // ? 4. Devolver el resultado final del proceso.
      return result;
    }
  };

  const registrarBaseDatos = async (documento) => {
    if (!documento) {
      return {
        success: false,
        mensaje: "No se pudo registrar la nota: documento vacío.",
        status: 400,
      };
    }

    try {
      const { success, message, status } =
        await facturaService.registrarNota(documento);

      if (status === 201 && success) {
        Limpiar();
      }

      return { status, success, message };
    } catch (error) {
      // ? En caso de que toast.promise no capture el error, lo manejamos aquí
      if (error.response) {
        return {
          success: false,
          message:
            error.response.data?.mensaje || "Error al registrar la nota.",
          data: error.response.data,
          status: error.response.status,
        };
      } else {
        return {
          success: false,
          message: "Ocurrió un error inesperado al registrar la nota.",
          data: null,
          status: 500,
        };
      }
    }
  };

  const Limpiar = () => {
    setNotaCreditoDebito({
      ...notaInical,
      empresa_Ruc: notaCreditoDebito.empresa_Ruc,
      serie: notaCreditoDebito.serie,
    });
    setIdFactura(null);
    buscarCorrelativo();
  };

  return (
    <NotaContext.Provider
      value={{
        correlativos,
        setCorrelativos,
        correlativoEstado,
        setCorrelativoEstado,
        loadingCorrelativo,
        setLoadingCorrelativo,
        buscarCorrelativo,
        serieCredito,
        serieDebito,
        filiales,
        notaCreditoDebito,
        setNotaCreditoDebito,
        documentoAAfectar,
        setDocumentoAAfectar,
        EmitirNota,
        id_items,
        setid_items,
        itemActual,
        setItemActual,
        validarNota,
        idBorrador,
        setIdBorrador,
      }}
    >
      {children}
    </NotaContext.Provider>
  );
}

export function useNota() {
  return useContext(NotaContext);
}
