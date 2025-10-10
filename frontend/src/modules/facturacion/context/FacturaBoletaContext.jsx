import {
  PagoValidarEstados,
  ProductoValidarEstados,
  valorIncialDetracion,
  valorIncialPago,
  valorIncialRetencion,
  ValorInicialFactura,
  valorInicialProducto,
} from "@/modules/facturacion/emitir/factura-boleta/utils/valoresInicial";
import factilizaService from "@/modules/facturacion/service/FactilizaService";
import facturaService from "@/modules/facturacion/service/FacturaService";
import numeroALeyenda from "@/modules/facturacion/utils/numeroALeyenda";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validarFacturaCompleta } from "../emitir/factura-boleta/utils/validarPasos";
import filialesService from "../service/FilialesService";
import determinarEstadoFactura from "../utils/manejadorCodigosSunat";
import { obtenerFechaActual } from "../utils/fechaEmisionActual";

const FacturaBoletaContext = createContext();

export function FacturaBoletaProvider({ children }) {
  // ** CORRELATIVOS
  const [correlativos, setCorrelativos] = useState([]);
  const [correlativosPendientes, setCorrelativosPendientes] = useState([]);
  const [correlativoEstado, setCorrelativoEstado] = useState(false);
  const [loadingCorrelativo, setLoadingCorrelativo] = useState(false);

  const serieFactura = [
    { value: "FT01", descrip: "ALQUILER" },
    { value: "FT02", descrip: "TRANSPORTE" },
    { value: "FT03", descrip: "SERVICIO" },
    { value: "FT04", descrip: "VENTA" },
    // { value: "FT05" },
  ];
  const serieBoleta = [
    { value: "BT01", descrip: "ALQUILER" },
    { value: "BT02", descrip: "TRANSPORTE" },
    { value: "BT03", descrip: "SERVICIO" },
    { value: "BT04", descrip: "VENTA" },
    // { value: "BT05" },
  ];

  // ** ID SI LA FACTURA FUE RRELLENADA DESDE EL BORRADOR
  const [idBorrador, setIdBorrador] = useState(null);

  // ** DATOS PARA FORMULARIO
  const [factura, setFactura] = useState(ValorInicialFactura); // * FACTURA

  const [detallesExtra, setDetallesExtra] = useState([]);

  // todo: DETRACCION
  const [detraccionActivado, setDetraccionActivado] = useState(false);
  const [detraccion, setDetraccion] = useState(valorIncialDetracion); // * DETRACCION
  const [precioDolarActual, setPrecioDolarActual] = useState(0);

  // todo: RETENCION
  const [retencionActivado, setRetencionActivado] = useState(false);
  const [retencion, setRetencion] = useState(valorIncialRetencion);

  const [facturaValida, setFacturaValida] = useState(null); // ? VALIDAR FACTURA

  const [productoActual, setProductoActual] = useState(valorInicialProducto);

  const [edicionProducto, setEdicionProducto] = useState({
    edicion: false,
    index: null,
  });

  const [productoValida, setProductoValida] = useState(ProductoValidarEstados);

  const [TotalProducto, setTotalProducto] = useState(0);

  const [pagoActual, setPagoActual] = useState(valorIncialPago);

  const [pagoValida, setPagoValida] = useState(PagoValidarEstados);

  const [filiales, setFiliales] = useState([]);

  // ?? traer la fecha actual para el documento
  useEffect(() => {
    setFactura((prevValores) => ({
      ...prevValores,
      fecha_Emision: obtenerFechaActual(),
    }));
  }, []);

  const validarFactura = async () => {
    try {
      const { errores, validos, message } = await validarFacturaCompleta(
        factura,
        detraccion,
        retencionActivado,
        retencion,
        detallesExtra,
      );
      if (!validos) {
        // *Encuentra el primer error y lo muestra en un toast
        const primerError = Object.values(errores)[0];
        if (primerError) {
          toast.error(primerError);
        } else {
          toast.error("El formulario contiene errores. Revise los campos.");
        }

        // *Opcional: Si quieres guardar todos los errores en el estado
        setFacturaValida(errores);

        return false;
      } else {
        // toast.success(message);
        setFacturaValida(null); // ?Limpia los errores del estado si todo es válido
        return true;
      }
    } catch (error) {
      toast.error(error.message || "Error al validar factura");
      return false;
    }
  };

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

  // ?? OBTENER CORRELATIVO
  const buscarCorrelativo = async () => {
    try {
      setLoadingCorrelativo(true);
      const rucsAndSeries = filiales.map((filial) => ({
        ruc: filial.ruc,
        serieBoleta: serieBoleta,
        serieFactura: serieFactura,
      }));

      const { data } = await facturaService.obtenerCorrelativo(rucsAndSeries);
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
        await facturaService.obtenerCorrelativoPendientes(rucsAndSeries);
      setCorrelativosPendientes(data);
    } catch (error) {
    } finally {
      setLoadingCorrelativo(false);
    }
  };

  // Al cargar el componente o cambiar la lista de filiales, buscar los correlativos
  useEffect(() => {
    if (filiales.length > 0) {
      buscarCorrelativo();
      buscarCorrelativoPendientes();
    }
  }, [filiales]);

  // Al cambiar el tipo de documento o la serie, actualizar el correlativo
  useEffect(() => {
    // Establecer la serie por defecto al cambiar el tipo de documento
    const nuevaSerie = factura.tipo_Doc === "01" ? "FT01" : "BT01";
    setFactura((prev) => ({
      ...prev,
      serie: nuevaSerie,
      correlativo: "", // Limpiar el correlativo para que se recalcule
    }));
  }, [factura.tipo_Doc]);

  // TODO LOS USEEFFECT DE LOS FORMULARIOS DE LOS MODALES ------- INICIO

  useEffect(() => {
    if (!productoActual.cod_Producto) return;

    const productoExistente = factura.detalle.find(
      (item) => item.cod_Producto === productoActual.cod_Producto,
    );

    if (productoExistente && !edicionProducto.edicion) {
      setProductoActual(productoExistente);
      setEdicionProducto({
        edicion: true,
        index: factura.detalle.indexOf(productoExistente),
      });
    }
  }, [productoActual.cod_Producto, factura.detalle, edicionProducto.edicion]);

  useEffect(() => {
    const actualizarFacturaMontos = () => {
      let gravadas = 0;
      let exoneradas = 0;
      let igvTotal = 0;

      factura.detalle.forEach((producto) => {
        const valorVenta = parseFloat(producto.monto_Valor_Venta || 0);

        if (
          ["10", "11", "12", "13", "14", "15", "16", "17"].includes(
            producto.tip_Afe_Igv,
          )
        ) {
          gravadas += valorVenta;
          igvTotal += valorVenta * 0.18;
        } else if (
          ["20", "21", "30", "31", "32", "33", "34", "35", "36", "40"].includes(
            producto.tip_Afe_Igv,
          )
        ) {
          // 👈 Aquí está el cambio
          exoneradas += valorVenta;
        }
      });

      const subTotal = gravadas + igvTotal + exoneradas;

      setTotalProducto(gravadas);

      setFactura({
        ...factura,
        monto_Oper_Gravadas: parseFloat(gravadas.toFixed(2)),
        monto_Oper_Exoneradas: parseFloat(exoneradas.toFixed(2)),
        monto_Igv: parseFloat(igvTotal.toFixed(2)),
        total_Impuestos: parseFloat(igvTotal.toFixed(2)),
        valor_Venta: parseFloat((gravadas + exoneradas).toFixed(2)),
        sub_Total: parseFloat(subTotal.toFixed(2)),
        monto_Imp_Venta: parseFloat(subTotal.toFixed(2)),
      });
    };

    if (factura.detalle?.length > 0) {
      actualizarFacturaMontos();
    } else {
      setFactura((prev) => ({
        ...prev,
        monto_Oper_Gravadas: 0,
        monto_Oper_Exoneradas: 0,
        monto_Igv: 0,
        total_Impuestos: 0,
        valor_Venta: 0,
        sub_Total: 0,
        monto_Imp_Venta: 0,
      }));
    }
  }, [factura.detalle]);

  useEffect(() => {
    if (!factura.monto_Imp_Venta || factura.monto_Imp_Venta <= 0) return;

    const nuevaLegenda = numeroALeyenda(
      factura.monto_Imp_Venta,
      factura.tipo_Moneda,
    );

    setFactura((prev) => ({
      ...prev,
      legend: [
        {
          legend_Code: "1000",
          legend_Value: nuevaLegenda,
        },
      ],
    }));
  }, [factura.monto_Imp_Venta]);

  useEffect(() => {
    let montoBase = factura.monto_Imp_Venta || 0;
    let montoPendiente = montoBase;

    const pagosRealizados = factura.forma_pago.reduce((total, item) => {
      const monto = parseFloat(item.monto || 0);
      return total + (isNaN(monto) ? 0 : monto);
    }, 0);

    montoPendiente = montoBase - pagosRealizados;
    setPagoActual((prev) => ({
      ...prev,
      monto: parseFloat(montoPendiente.toFixed(2)),
    }));
  }, [
    factura.monto_Imp_Venta,
    factura.forma_pago,
    detraccion.detraccion_mount,
    retencionActivado,
  ]);

  // TODO LOS USEEFFECT DE LOS FORMULARIOS DE LOS MODALES ------- FINAL

  const agregarProducto = () => {
    const { edicion, index } = edicionProducto;
    const {
      edicion: productoEdicion,
      index: productoIndex,
      ...productDataToSave
    } = productoActual;

    productDataToSave.cantidad = Number(productDataToSave.cantidad);
    productDataToSave.monto_Valor_Unitario = Number(
      productDataToSave.monto_Valor_Unitario,
    );

    setFactura((prevFactura) => {
      let nuevoDetalle;
      if (
        edicion &&
        index != null &&
        index >= 0 &&
        index < prevFactura.detalle.length
      ) {
        nuevoDetalle = [...prevFactura.detalle];
        nuevoDetalle[index] = productDataToSave;
      } else {
        nuevoDetalle = [...prevFactura.detalle, productDataToSave];
      }
      return {
        ...prevFactura,
        detalle: nuevoDetalle,
      };
    });

    setProductoActual(valorInicialProducto);
    setEdicionProducto({ edicion: false, index: null });
  };

  const editarProducto = (index) => {
    setProductoActual({
      ...factura.detalle[index],
    });
    setEdicionProducto({
      edicion: true,
      index,
    });
  };

  const eliminarProducto = () => {
    setFactura((prevFactura) => ({
      ...prevFactura,
      detalle: prevFactura.detalle.filter(
        (_, i) => i !== edicionProducto.index,
      ),
    }));
    // setFactura((prevFactura) => ({
    //   ...prevFactura,
    //   forma_pago: [],
    //   cuotas_Real: [],
    // }));
  };

  const emitirFactura = async () => {
    const { id: id_logeado } = await JSON.parse(localStorage.getItem("user"));
    let result = {
      success: false,
      message: "Error desconocido al emitir la factura",
      data: null,
    };
    try {
      let facturaAEmitir;

      if (
        retencionActivado &&
        !detraccionActivado &&
        factura.tipo_Doc !== "03" &&
        factura.tipo_Operacion !== "1001"
      ) {
        facturaAEmitir = {
          ...factura,
          ...retencion,
        };
      } else if (
        factura.tipo_Operacion === "1001" &&
        detraccionActivado &&
        !retencionActivado &&
        factura.tipo_Doc !== "03"
      ) {
        facturaAEmitir = {
          ...factura,
          ...detraccion,
        };
      } else {
        facturaAEmitir = factura;
      }
      const { status, success, message, data } =
        await factilizaService.enviarFactura(facturaAEmitir);

      if (status === 200) {
        const sunat_respuest = {
          hash: data?.hash ?? null,
          // cdr_zip: data?.sunatResponse?.cdrZip ?? null, // Descomentar si es necesario
          cdr_zip: null,
          sunat_success: data?.sunatResponse?.success ?? null,
          cdr_response_id: data?.sunatResponse?.cdrResponse?.id ?? null,
          cdr_response_code: data?.sunatResponse?.cdrResponse?.code ?? null,
          cdr_response_description:
            data?.sunatResponse?.cdrResponse?.description ?? null,
        };

        // ?? Transformamos los documentos relacionados a texto
        facturaAEmitir.relDocs =
          factura.relDocs.length > 0
            ? JSON.stringify(facturaAEmitir.relDocs)
            : null;

        // ?? Si se agregaron detalles esta
        if (detallesExtra.length > 0) {
          facturaAEmitir.extraDetails = JSON.stringify(detallesExtra);
        }

        const facturaCopia = {
          ...facturaAEmitir,
          usuario_id: id_logeado,
          estado: determinarEstadoFactura({ status, success, message, data }),
          precio_dolar: precioDolarActual,
          cuotas_Real: JSON.stringify(facturaAEmitir.cuotas_Real),
          sunat_respuesta: sunat_respuest,
          id_borrador: idBorrador ? idBorrador : null,
        };
        // ?Intentar registrar en base de datos
        const dbResult = await registrarBaseDatos(facturaCopia);

        if (dbResult.success) {
          result = {
            success: true,
            message: message || "Factura emitida y registrada con éxito.",
            data: facturaCopia,
            detailed_message:
              data?.sunatResponse?.cdrResponse?.description || null,
          };
        } else {
          result = {
            success: false,
            message:
              dbResult.mensaje ||
              "Factura emitida a SUNAT, pero no se pudo registrar en la base de datos.",
            data: facturaCopia,
          };
        }
      } else {
        result = {
          success: false,
          message: message,
          detailed_message:
            `${data.error.code} - ${data.error.message}` ||
            "Error desconocido al enviar la factura.",
          data: null,
        };
      }
    } catch (error) {
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
      return result;
    }
  };

  const registrarBaseDatos = async (documento) => {
    try {
      if (!documento) {
        return { success: false, mensaje: "No se pudo registrar la factura" };
      }
      if (documento.estado !== "EMITIDA") {
        const esValido = await validarFactura("validarBorrador");
        if (!esValido) {
          return toast.error(
            "Para crear un borrador, por favor complete los datos del comprobante y del cliente.",
          );
        }
      }
      const { status, success } =
        await facturaService.registrarFactura(documento);
      if (status === 201) {
        Limpiar();
      }
      return { status, success };
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 409) {
          toast.error(data?.mensaje);
        }
      }
    }
  };

  const Limpiar = () => {
    setFactura({
      ...ValorInicialFactura,
      fecha_Emision: obtenerFechaActual(),
      empresa_Ruc: factura.empresa_Ruc,
      serie: factura.serie,
    });
    setProductoActual(valorInicialProducto);
    setEdicionProducto({ edicion: false, index: null });
    setPagoActual(valorIncialPago);
    setTotalProducto(0);
    setDetraccionActivado(false);
    setDetraccion(valorIncialDetracion);
    setRetencion(valorIncialRetencion);
    setRetencionActivado(false);
    setIdBorrador(null);
    setDetallesExtra([]);
    buscarCorrelativo();
    buscarCorrelativoPendientes();
    setDetallesExtra([]);
    setIdBorrador(null);
  };

  return (
    <FacturaBoletaContext.Provider
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
        serieFactura,
        serieBoleta,
        filiales,
        idBorrador,
        detallesExtra,
        setDetallesExtra,
        setIdBorrador,
        factura,
        setFactura,
        detraccion,
        setDetraccion,
        detraccionActivado,
        setDetraccionActivado,
        retencion,
        setRetencion,
        retencionActivado,
        setRetencionActivado,
        precioDolarActual,
        setPrecioDolarActual,
        validarFactura,
        facturaValida,
        productoValida,
        productoActual,
        setProductoActual,
        editarProducto,
        edicionProducto,
        setEdicionProducto,
        setProductoValida,
        setPagoValida,
        eliminarProducto,
        agregarProducto,
        TotalProducto,
        pagoActual,
        pagoValida,
        setPagoActual,
        emitirFactura,
        registrarBaseDatos,
        Limpiar,
      }}
    >
      {children}
    </FacturaBoletaContext.Provider>
  );
}

export function useFacturaBoleta() {
  return useContext(FacturaBoletaContext);
}
