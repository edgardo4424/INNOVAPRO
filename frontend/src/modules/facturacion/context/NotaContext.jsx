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
import determinarEstadoFactura from "../utils/manejadorCodigosSunat";
import { obtenerFechaActual } from "../utils/fechaEmisionActual";

const NotaContext = createContext();

export function NotaProvider({ children }) {
  // ** CORRELATIVOS
  const [correlativos, setCorrelativos] = useState([]);
  const [correlativosPendientes, setCorrelativosPendientes] = useState([]);
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
  const [precioDolarActual, setPrecioDolarActual] = useState(0);

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

  // ?? trae la fecha actual para emitir la nota
  useEffect(() => {
    setNotaCreditoDebito((prevValores) => ({
      ...prevValores,
      fecha_Emision: obtenerFechaActual(),
    }));
  }, []);

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
    } finally {
      setLoadingCorrelativo(false);
    }
  };

  // ?? OBTENER CORRELATIVO
  const buscarCorrelativoPendientes = async () => {
    try {
      const rucsAndSeries = filiales.map((filial) => ({
        ruc: filial.ruc,
        serieBoleta: serieBoleta,
        serieFactura: serieFactura,
      }));

      const { data } =
        await facturaService.obtenerCorrelativoPendientesNota(rucsAndSeries);
      setCorrelativosPendientes(data);
    } catch (error) {
    } finally {
      setLoadingCorrelativo(false);
    }
  };

  // ?? OBTENER TIPO DE CAMBIO
  useEffect(() => {
    const cambioDelDia = async () => {
      try {
        const hoyISO = new Intl.DateTimeFormat("en-CA", {
          timeZone: "America/Lima",
        }).format(new Date());

        const { status, success, data } =
          await factilizaService.obtenerTipoCambio(hoyISO);

        if (success && status === 200) {
          setPrecioDolarActual(data.venta);
        }
      } catch (error) {}
    };

    cambioDelDia();
  }, []);

  //? Al cargar el componente o cambiar la lista de filiales, buscar los correlativos
  useEffect(() => {
    if (filiales.length > 0) {
      buscarCorrelativo();
      buscarCorrelativoPendientes();
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

      result = {
        status,
        success,
        message,
        data,
      };
      if (status == 200 || status == 201 || status == 400) {
        Limpiar();
      }
    } catch (error) {
      if (error.response) {
        const { success, message, detailed_message, data, status } =
          error.response.data;
        result = {
          success: false,
          message:
            message || detailed_message || "Error al comunicarse con la API.",
          data,
          status,
        };
        return result;
      } else {
        return {
          success: false,
          message: error.message || "Ocurrió un error inesperado.",
          data: null,
          status: 500,
        };
      }
    } finally {
      // ? 4. Devolver el resultado final del proceso.
      return result;
    }
  };

  const Limpiar = () => {
    setNotaCreditoDebito({
      ...notaInical,
      fecha_Emision: obtenerFechaActual(),
      empresa_Ruc: notaCreditoDebito.empresa_Ruc,
      serie: notaCreditoDebito.serie,
    });
    buscarCorrelativo();
    setIdFactura(null);
  };

  return (
    <NotaContext.Provider
      value={{
        correlativos,
        correlativosPendientes,
        setCorrelativos,
        correlativoEstado,
        setCorrelativoEstado,
        loadingCorrelativo,
        setLoadingCorrelativo,
        buscarCorrelativo,
        buscarCorrelativoPendientes,
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
