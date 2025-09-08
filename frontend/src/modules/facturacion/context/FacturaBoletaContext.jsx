import { PagoValidarEstados, ProductoValidarEstados, valorIncialDetracion, valorIncialPago, valorIncialRetencion, ValorInicialFactura, valorInicialProducto } from "@/modules/facturacion/emitir/factura-boleta/utils/valoresInicial";
import factilizaService from "@/modules/facturacion/service/FactilizaService";
import facturaService from "@/modules/facturacion/service/FacturaService";
import numeroALeyenda from "@/modules/facturacion/utils/numeroALeyenda";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validarFacturaCompleta } from "../emitir/factura-boleta/utils/validarPasos";
import filialesService from "../service/FilialesService";


const FacturaBoletaContext = createContext();

export function FacturaBoletaProvider({ children }) {


    // ** CORRELATIVOS
    const [correlativos, setCorrelativos] = useState([]);
    const [correlativoEstado, setCorrelativoEstado] = useState(false);
    const [loadingCorrelativo, setLoadingCorrelativo] = useState(false);

    const serieFactura = [
        { value: "F001" },
        { value: "F002" },
        { value: "F003" },
        { value: "F004" },
        { value: "F005" },
    ];
    const serieBoleta = [
        { value: "B001" },
        { value: "B002" },
        { value: "B003" },
        { value: "B004" },
        { value: "B005" },
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

    const validarFactura = async () => {
        try {
            const { errores, validos, message } = await validarFacturaCompleta(factura, detraccion, retencionActivado, retencion);
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
                toast.success(message);
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
        }
        consultarFiliales();
    }, []);

    // ?? OBTENER CORRELATIVO
    const buscarCorrelativo = async () => {
        if (loadingCorrelativo) return;

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

    // Al cambiar el tipo de documento o la serie, actualizar el correlativo
    useEffect(() => {
        // Establecer la serie por defecto al cambiar el tipo de documento
        const nuevaSerie = factura.tipo_Doc === "01" ? "F001" : "B001";
        setFactura((prev) => ({
            ...prev,
            serie: nuevaSerie,
            correlativo: "" // Limpiar el correlativo para que se recalcule
        }));
    }, [factura.tipo_Doc]);

    // TODO LOS USEEFFECT DE LOS FORMULARIOS DE LOS MODALES ------- INICIO

    useEffect(() => {
        if (!productoActual.cod_Producto) return;

        const productoExistente = factura.detalle.find(
            (item) => item.cod_Producto === productoActual.cod_Producto
        );

        if (productoExistente && !edicionProducto.edicion) {
            setProductoActual(productoExistente);
            setEdicionProducto({ edicion: true, index: factura.detalle.indexOf(productoExistente) });
        }
    }, [productoActual.cod_Producto, factura.detalle, edicionProducto.edicion]);


    useEffect(() => {
        const actualizarFacturaMontos = () => {
            let gravadas = 0;
            let exoneradas = 0;
            let igvTotal = 0;

            factura.detalle.forEach((producto) => {
                const valorVenta = parseFloat(producto.monto_Valor_Venta || 0);

                if (["10", "11", "12", "13", "14", "15", "16", "17"].includes(producto.tip_Afe_Igv)) {
                    gravadas += valorVenta;
                    igvTotal += valorVenta * 0.18;
                } else if (["20", "21", "30", "31", "32", "33", "34", "35", "36", "40"].includes(producto.tipAfeIgv)) {
                    exoneradas += valorVenta;
                }
            });

            const subTotal = gravadas + igvTotal + exoneradas;

            setTotalProducto(gravadas);

            setFactura((prev) => ({
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

        if (factura.detalle?.length > 0) {
            actualizarFacturaMontos();
        }
    }, [factura.detalle]);

    useEffect(() => {
        if (!factura.monto_Imp_Venta || factura.monto_Imp_Venta <= 0) return;

        const nuevaLegenda = numeroALeyenda(factura.monto_Imp_Venta, factura.tipo_Moneda);

        setFactura((prev) => ({
            ...prev,
            legend: [{
                legend_Code: "1000",
                legend_Value: nuevaLegenda,
            }]
        }));
    }, [factura.monto_Imp_Venta]);


    useEffect(() => {
        let montoBase = factura.monto_Imp_Venta || 0;
        let montoPendiente = montoBase;

        const pagosRealizados = factura.forma_pago.reduce((total, item) => {
            const monto = parseFloat(item.monto || 0); // ✅ Aquí corregimos para evitar NaN
            return total + (isNaN(monto) ? 0 : monto);
        }, 0);

        montoPendiente = montoBase - pagosRealizados;
        console.log("else defecto", montoPendiente);

        console.log("monto pendiente")
        console.log(montoPendiente)

        setPagoActual((prev) => ({
            ...prev,
            monto: parseFloat(montoPendiente.toFixed(2)),
        }));

    }, [factura.monto_Imp_Venta, factura.forma_pago, detraccion.detraccion_mount, retencionActivado]);



    // TODO LOS USEEFFECT DE LOS FORMULARIOS DE LOS MODALES ------- FINAL

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let validatedValue = value;

        if (name === "cantidad" || name === "monto_Valor_Unitario") {
            let numericValue = parseFloat(value);
            if (isNaN(numericValue) || numericValue < 0) {
                validatedValue = 0;
            } else {
                validatedValue = numericValue;
            }
        }

        const cantidad = name === "cantidad" ? validatedValue : parseFloat(productoActual.cantidad);
        const valorUnitario = name === "monto_Valor_Unitario" ? validatedValue : parseFloat(productoActual.monto_Valor_Unitario);
        // const tipAfeIgv = productoActual.tip_Afe_Igv || "10";

        let monto_Base_Igv = cantidad * valorUnitario;
        let igv = 0;
        let total_Impuestos = 0;
        let monto_Precio_Unitario = valorUnitario;
        let monto_Valor_Venta = cantidad * valorUnitario;

        if (["10", "11", "12", "13", "14", "15", "16", "17"].includes(productoActual.tip_Afe_Igv)) {
            igv = +(monto_Base_Igv * 0.18).toFixed(2);
            total_Impuestos = igv;
            monto_Precio_Unitario = +(valorUnitario * 1.18).toFixed(2);
        } else if (["20", "21", "30", "31", "32", "33", "34", "35", "36", "40"].includes(productoActual.tip_Afe_Igv)) {
            igv = 0;
            total_Impuestos = 0;
            monto_Precio_Unitario = valorUnitario;
        } else {
            igv = 0;
            total_Impuestos = 0;
            monto_Precio_Unitario = valorUnitario;
        }

        setProductoActual((prevValores) => ({
            ...prevValores,
            [name]: validatedValue,
            monto_Base_Igv: +monto_Base_Igv.toFixed(2),
            igv,
            total_Impuestos,
            monto_Precio_Unitario,
            monto_Valor_Venta: +monto_Valor_Venta.toFixed(2),
            porcentaje_Igv: (["10", "11", "12", "13", "14", "15", "16", "17"].includes(tipAfeIgv)) ? 18 : 0,
        }));
    };



    const agregarProducto = () => {
        const { edicion, index } = edicionProducto;
        const { edicion: productoEdicion, index: productoIndex, ...productDataToSave } = productoActual;

        productDataToSave.cantidad = Number(productDataToSave.cantidad);
        productDataToSave.monto_Valor_Unitario = Number(productDataToSave.monto_Valor_Unitario);

        setFactura((prevFactura) => {
            let nuevoDetalle;
            if (edicion && index != null && index >= 0 && index < prevFactura.detalle.length) {
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
            detalle: prevFactura.detalle.filter((_, i) => i !== edicionProducto.index),
        }));
        setFactura((prevFactura) => ({
            ...prevFactura,
            forma_pago: [],
        }));
    };

    const emitirFactura = async () => {
        const { id: id_logeado } = await JSON.parse(localStorage.getItem("user"));
        let result = { success: false, message: "Error desconocido al emitir la factura", data: null };
        try {
            let facturaAEmitir;

            if (retencionActivado && factura.tipo_Doc !== "03" && factura.monto_Imp_Venta > 699) {
                facturaAEmitir = {
                    ...factura,
                    ...retencion,
                };
            } else if (factura.tipo_Operacion === "1001" && factura.tipo_Doc !== "03") {
                facturaAEmitir = {
                    ...factura,
                    ...detraccion
                };
            } else {
                facturaAEmitir = factura;
            }
            const { status, success, message, data } = await factilizaService.enviarFactura(facturaAEmitir)


            if (status === 200 && success) {

                const sunat_respuest = {
                    hash: data.hash,
                    cdr_zip: data.sunatResponse.cdrZip, // Descomentar si es necesario
                    sunat_success: data.sunatResponse.success,
                    cdr_response_id: data.sunatResponse.cdrResponse.id,
                    cdr_response_code: data.sunatResponse.cdrResponse.code,
                    cdr_response_description: data.sunatResponse.cdrResponse.description
                };

                // ?? Transformamos los documentos relacionados a texto
                facturaAEmitir.relDocs = factura.relDocs.length > 0 ? JSON.stringify(facturaAEmitir.relDocs) : null;

                // ?? Si se agregaron detalles esta
                if (detallesExtra.length > 0) {
                    facturaAEmitir.extraDetails = JSON.stringify(detallesExtra);
                }

                const facturaCopia = {
                    ...facturaAEmitir,
                    usuario_id: id_logeado,
                    estado: "EMITIDA",
                    sunat_respuesta: sunat_respuest,
                    id_borrador: idBorrador ? idBorrador : null
                };
                // ?Intentar registrar en base de datos
                const dbResult = await registrarBaseDatos(facturaCopia);

                if (dbResult.success) {
                    result = { success: true, message: message || "Factura emitida y registrada con éxito.", data: facturaCopia };
                } else {
                    result = { success: false, message: dbResult.mensaje || "Factura emitida a SUNAT, pero no se pudo registrar en la base de datos.", data: facturaCopia };
                }
            } else if (status === 200 && !success) {
                result = { success: false, message: message, detailed_message: `${data.error.code} - ${data.error.message}` || "Error desconocido al enviar la factura.", data: facturaAEmitir };
            } else {
                result = { success: false, message: message, detailed_message: `${data.error.code} - ${data.error.message}` || "Error desconocido al enviar la factura.", data: null };
            }
        } catch (error) {
            console.error("Error al enviar factura:", error);
            if (error.response) {
                result = {
                    success: false,
                    message: error.response.data?.message || error.response.data?.error || "Error al comunicarse con la API.",
                    data: error.response.data
                };
            } else {
                result = { success: false, message: error.message || "Ocurrió un error inesperado.", data: null };
            }
        } finally {
            return result;
        }

    };

    const registrarBaseDatos = async (documento) => {
        try {
            if (!documento) {
                return { success: false, mensaje: "No se pudo registrar la factura" }
            }
            if (documento.estado !== "EMITIDA") {
                const esValido = await validarFactura("validarBorrador")
                if (!esValido) {
                    return toast.error("Para crear un borrador, por favor complete los datos del comprobante y del cliente.")
                }
            }
            const { status, success } = await toast.promise(
                facturaService.registrarFactura(documento),
                {
                    pending: "Registrando factura en la base de datos...",
                    success: "Factura registrada con éxito en la base de datos de INNOVA.",
                    error: `No se pudo registrar la factura`,
                }
            )
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
        setFactura(ValorInicialFactura);
        setProductoActual(valorInicialProducto);
        setEdicionProducto({ edicion: false, index: null });
        setPagoActual(valorIncialPago);
        setTotalProducto(0);
        setDetraccionActivado(false);
        setDetraccion(valorIncialDetracion);
        setRetencion(valorIncialRetencion);
        setRetencionActivado(false);
        setIdBorrador(null);
        setDetallesExtra([])
        buscarCorrelativo()
    };



    return (
        <FacturaBoletaContext.Provider
            value={{
                correlativos, setCorrelativos, correlativoEstado, setCorrelativoEstado, loadingCorrelativo, setLoadingCorrelativo,
                serieFactura,serieBoleta,
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
                handleInputChange, // Exposed for use in product form inputs
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
                Limpiar
            }}
        >
            {children}
        </FacturaBoletaContext.Provider>
    );
}

export function useFacturaBoleta() {
    return useContext(FacturaBoletaContext);
}