import { FacturaValidarEstados, PagoValidarEstados, ProductoValidarEstados, valorIncialPago, ValorInicialFactura, valorInicialProducto } from "@/modules/facturacion/factura-boleta/utils/valoresInicial";
import facturacionService from "@/modules/facturacion/service/FacturacionService";
import facturaService from "@/modules/facturacion/service/FacturaService";
import numeroALeyenda from "@/modules/facturacion/utils/numeroALeyenda";
import { validarModal } from "@/modules/facturacion/utils/validarModal";
import { validarPasos } from "@/modules/facturacion/utils/validarPasos";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const FacturaBoletaContext = createContext();

export function FacturaBoletaProvider({ children }) {

    const [correlativos, setCorrelativos] = useState("000001");

    const [factura, setFactura] = useState(ValorInicialFactura);

    const [facturaValida, setFacturaValida] = useState(FacturaValidarEstados);

    const [productoActual, setProductoActual] = useState(valorInicialProducto);

    const [edicionProducto, setEdicionProducto] = useState({
        edicion: false,
        index: null,
    });

    const [productoValida, setProductoValida] = useState(ProductoValidarEstados);

    const [TotalProducto, setTotalProducto] = useState(0);


    const [pagoActual, setPagoActual] = useState(valorIncialPago);

    const [pagoValida, setPagoValida] = useState(PagoValidarEstados);


    const [facturaValidaParaGuardar, setFacturaValidaParaGuardar] = useState(false);

    const validarPaso = async (paso) => {
        try {
            const { errores, validos, message } = await validarPasos(paso, factura);
            if (errores) {
                setFacturaValida((prev) => ({
                    ...prev,
                    ...errores,
                }));
            }
            if (!validos && message) {
                toast.error(message);
                return false;
            }
            return true;
        } catch (error) {
            toast.error(error.message || "Error al validar factura");
            return false;
        }
    };

    const validarCampos = async (tipo) => {
        try {
            let errores, validos, message;
            if (tipo === "producto") {
                ({ errores, validos, message } = await validarModal(tipo, productoActual));
                if (errores) {
                    setProductoValida((prev) => ({
                        ...prev,
                        ...errores,
                    }));
                }
            } else if (tipo === "pago") {
                ({ errores, validos, message } = await validarModal(tipo, pagoActual));
                if (errores) {
                    setPagoValida((prev) => ({
                        ...prev,
                        ...errores,
                    }));
                }
            }

            if (!validos && message) {
                toast.error(message);
                return false;
            }
            return true;
        } catch (error) {
            toast.error(error.message || "Error al validar campos");
            return false;
        }
    };

    // TODO LOS USEEFFECT DE LOS FORMULARIOS DE LOS MODALES ------- INICIO
    useEffect(() => {
        let newSerie = "";
        let newCorrelativo = "";

        switch (factura.tipo_Doc) {
            case "01": // Factura
                newSerie = "F001";
                setFactura((prev) => ({ ...prev, cliente_Tipo_Doc: "6" }));
                newCorrelativo = (correlativos.facturas + 1).toString().padStart(8, "0");
                break;
            case "03": // Boleta
                newSerie = "B001";
                newCorrelativo = (correlativos.boletas + 1).toString().padStart(8, "0");
                break;
            case "07": // Nota de Crédito
                newSerie = "NC01";
                newCorrelativo = (correlativos.notasCredito + 1).toString().padStart(8, "0");
                break;
            case "08": // Nota de Débito
                newSerie = "ND01";
                newCorrelativo = (correlativos.notasDebito + 1).toString().padStart(8, "0");
                break;
            default:
                newSerie = "";
                newCorrelativo = "";
                break;
        }

        setFactura((prev) => ({
            ...prev,
            serie: newSerie,
        }));

    }, [factura.tipo_Doc]);

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

                if (producto.tip_Afe_Igv === "10") {
                    gravadas += valorVenta;
                    igvTotal += valorVenta * 0.18;
                }

                if (producto.tip_Afe_Igv === "20") {
                    exoneradas += valorVenta;
                }
            });

            const subTotal = gravadas + igvTotal;
            const totalVenta = subTotal;

            setTotalProducto(gravadas);

            setFactura((prev) => ({
                ...prev,
                monto_Oper_Gravadas: parseFloat(gravadas.toFixed(2)),
                monto_Oper_Exoneradas: parseFloat(exoneradas.toFixed(2)),
                monto_Igv: parseFloat(igvTotal.toFixed(2)),
                total_Impuestos: parseFloat(igvTotal.toFixed(2)),
                valor_Venta: parseFloat((gravadas + exoneradas).toFixed(2)),
                sub_Total: parseFloat(subTotal.toFixed(2)),
                monto_Imp_Venta: parseFloat(totalVenta.toFixed(2)),
            }));
        };

        if (factura.detalle?.length > 0) {
            actualizarFacturaMontos();
        }
    }, [factura.detalle]);

    useEffect(() => {
        if (!factura.monto_Imp_Venta || factura.monto_Imp_Venta <= 0) return;

        const nuevaLegenda = numeroALeyenda(factura.monto_Imp_Venta);
        console.log("nueva legenda")
        console.log(nuevaLegenda)

        setFactura((prev) => ({
            ...prev,
            legend: [{
                legend_Code: "1000",
                legend_Value: nuevaLegenda,
            }]
        }));
    }, [factura.monto_Imp_Venta]);


    useEffect(() => {
        let montoPendiente = factura.monto_Imp_Venta;
        if (factura.forma_pago.length > 0) {
            const pagosRealizados = factura.forma_pago.reduce((total, item) => {
                const monto = parseFloat(item.monto.toFixed(2));
                return total + (isNaN(monto) ? 0 : monto);
            }, 0);
            montoPendiente = factura.monto_Imp_Venta - pagosRealizados;
        }

        setPagoActual((prev) => ({
            ...prev,
            cuota: factura.forma_pago.length,
            monto: parseFloat(montoPendiente.toFixed(2)),
        }));
    }, [factura.monto_Imp_Venta, factura.forma_pago]);

    useEffect(() => {
        const { validos, message } = validarPasos("ValidaCionTotal", factura);
        console.log(message);
        setFacturaValidaParaGuardar(validos);
    }, [factura]);

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

        const cantidad = name === "cantidad" ? validatedValue : parseFloat(productoActual.cantidad || 0);
        const valorUnitario = name === "monto_Valor_Unitario" ? validatedValue : parseFloat(productoActual.monto_Valor_Unitario || 0);
        const tipAfeIgv = productoActual.tip_Afe_Igv || "10";

        let monto_Base_Igv = cantidad * valorUnitario;
        let igv = 0;
        let total_Impuestos = 0;
        let monto_Precio_Unitario = valorUnitario;
        let monto_Valor_Venta = cantidad * valorUnitario;

        if (["10", "11", "12", "13", "14", "15", "16", "17"].includes(tipAfeIgv)) {
            igv = +(monto_Base_Igv * 0.18).toFixed(2);
            total_Impuestos = igv;
            monto_Precio_Unitario = +(valorUnitario * 1.18).toFixed(2);
        } else if (["20", "21", "30", "31", "32", "33", "34", "35", "36", "40"].includes(tipAfeIgv)) {
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

    const agregarPago = () => {
        setFactura((prevFactura) => ({
            ...prevFactura,
            forma_pago: [...prevFactura.forma_pago, {
                ...pagoActual,
                monto: parseFloat(pagoActual.monto),
            }],
        }));
        setPagoActual(valorIncialPago);
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
        setFactura((prevFactura) => ({
            ...prevFactura,
            forma_pago: [],
        }));
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
        let result = { success: false, message: "Error desconocido al emitir la factura", data: null };
        try {
            const { status, success, message, data } = await facturacionService.enviarFactura(factura)


            if (status === 200 && success) {
                const sunat_respuest = {
                    hash: data.hash,
                    // cdr_zip: data.sunatResponse.cdrZip, // Descomentar si es necesario
                    sunat_success: data.sunatResponse.success,
                    cdr_response_id: data.sunatResponse.cdrResponse.id,
                    cdr_response_code: data.sunatResponse.cdrResponse.code,
                    cdr_response_description: data.sunatResponse.cdrResponse.description
                };

                const facturaCopia = { ...factura, estado: "EMITIDA", sunat_respuesta: sunat_respuest };
                // ?Intentar registrar en base de datos
                console.log("*************************FACTURA EMITIDA*************************");
                console.log(facturaCopia);
                const dbResult = await registrarBaseDatos(facturaCopia);

                if (dbResult.success) {
                    result = { success: true, message: message || "Factura emitida y registrada con éxito.", data: facturaCopia };
                } else {
                    result = { success: false, message: dbResult.mensaje || "Factura emitida a SUNAT, pero no se pudo registrar en la base de datos.", data: facturaCopia };
                }
            } else {
                console.error("*****MEGA ERROR ALV: ", status, success, message, data, "*****",);
                result = { success: false, message: message, detailed_message: data.error.message || "Error desconocido al enviar la factura.", data: null };
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

    const registrarBaseDatos = async (documento = factura) => {
        try {
            if (!documento) {
                return { success: false, mensaje: "No se pudo registrar la factura" }
            }
            if (documento.estado !== "EMITIDA") {
                const esValido = await validarPaso("validarBorrador")
                if (!esValido) {
                    return toast.error("Para crear un borrador, por favor complete los datos del comprobante y del cliente.")
                }
            }
            console.log("*************************REGISTRANDO EN BASE DE DATOS*************************");
            console.log(documento);
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
    };



    return (
        <FacturaBoletaContext.Provider
            value={{
                factura,
                setFactura,
                validarPaso,
                validarCampos,
                facturaValida,
                productoValida,
                productoActual,
                setProductoActual,
                handleInputChange, // Exposed for use in product form inputs
                editarProducto,
                edicionProducto,
                setEdicionProducto,
                eliminarProducto,
                agregarProducto,
                TotalProducto,
                pagoActual,
                pagoValida,
                setPagoActual,
                agregarPago,
                emitirFactura,
                facturaValidaParaGuardar,
                registrarBaseDatos
            }}
        >
            {children}
        </FacturaBoletaContext.Provider>
    );
}

export function useFacturaBoleta() {
    return useContext(FacturaBoletaContext);
}