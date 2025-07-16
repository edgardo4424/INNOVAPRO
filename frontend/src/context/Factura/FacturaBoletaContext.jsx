import facturacionService from "@/modules/factuacion/service/FacturacionService";
import numeroALeyenda from "@/modules/factuacion/utils/numeroALeyenda";
import { validarModal } from "@/modules/factuacion/utils/validarModal";
import { validarPasos } from "@/modules/factuacion/utils/validarPasos";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import initialCorrelativosData from "./../../modules/factuacion/utils/correlativoLocal.json";
import facturasEmitidasLocal from "./../../modules/factuacion/utils/facturasEmitidasLocal.json";

const FacturaBoletaContext = createContext();

export function FacturaBoletaProvider({ children }) {
    const initialFacturaState = {
        tipo_Operacion: "",
        tipo_Doc: "01",
        serie: "",
        correlativo: "",
        tipo_Moneda: "PEN",
        fecha_Emision: new Date().toISOString().split("T")[0] + "T05:00:00-05:00",
        empresa_Ruc: "20607086215",
        cliente_Tipo_Doc: "",
        cliente_Num_Doc: "",
        cliente_Razon_Social: "",
        cliente_Direccion: "",
        monto_Oper_Gravadas: 0,
        monto_Igv: 18,
        total_Impuestos: 0,
        valor_Venta: 0,
        sub_Total: 0,
        monto_Imp_Venta: 0,
        monto_Oper_Exoneradas: 0,
        estado_Documento: "0",
        manual: false,
        id_Base_Dato: "15265",
        detalle: [],
        forma_pago: [],
        legend: [
            {
                legend_Code: "1000",
                legend_Value: "",
            },
        ],
    };

    const [factura, setFactura] = useState(initialFacturaState);

    const [facturaValida, setFacturaValida] = useState({
        tipo_Operacion: false,
        tipo_Doc: false,
        serie: false,
        correlativo: false,
        tipo_Moneda: false,
        fecha_Emision: false,
        empresa_Ruc: false,
        cliente_Tipo_Doc: false,
        cliente_Num_Doc: false,
        cliente_Razon_Social: false,
        cliente_Direccion: false,
    });

    const initialProductoActualState = {
        unidad: "",
        cantidad: null,
        cod_Producto: "",
        descripcion: "",
        monto_Valor_Unitario: null,
        monto_Base_Igv: 0,
        porcentaje_Igv: 18.0,
        igv: 0,
        tip_Afe_Igv: "",
        total_Impuestos: 0,
        monto_Precio_Unitario: 0,
        monto_Valor_Venta: 0,
        factor_Icbper: 0,
    };

    const [productoActual, setProductoActual] = useState(initialProductoActualState);
    const [edicionProducto, setEdicionProducto] = useState({
        edicion: false,
        index: null,
    });

    const [productoValida, setProductoValida] = useState({
        unidad: false,
        cantidad: false,
        cod_Producto: false,
        descripcion: false,
        monto_Valor_Unitario: false,
        monto_Base_Igv: false,
        porcentaje_Igv: false,
        igv: false,
        tip_Afe_Igv: false,
        total_Impuestos: false,
        monto_Precio_Unitario: false,
        monto_Valor_Venta: false,
        factor_Icbper: false,
    });

    const [TotalProducto, setTotalProducto] = useState(0);

    const initialPagoActualState = {
        tipo: "",
        monto: 0,
        cuota: 0,
        fecha_Pago: "",
    };
    const [pagoActual, setPagoActual] = useState(initialPagoActualState);

    const [pagoValida, setPagoValida] = useState({
        tipo: false,
        monto: false,
        cuota: false,
        fecha_Pago: false,
    });

    const [correlativos, setCorrelativos] = useState(initialCorrelativosData.correlativo);
    const [facturasEmitidas, setFacturasEmitidas] = useState(facturasEmitidasLocal); // Estado para facturas emitidas localmente

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

        setFactura((prev) => {
            if (prev.serie !== newSerie || prev.correlativo !== newCorrelativo) {
                return {
                    ...prev,
                    serie: newSerie,
                    correlativo: newCorrelativo,
                };
            }
            return prev;
        });
    }, [factura.tipo_Doc, correlativos]);

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
        setPagoActual(initialPagoActualState);
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

        setProductoActual(initialProductoActualState);
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

    const facturarNuevoDocumento = async () => {
        const { validos, message } = validarPasos("ValidaCionTotal", factura);
        if (!validos) {
            toast.error(message || "Por favor, completa todos los datos requeridos antes de emitir.");
            return null;
        }

        try {
            const res = await toast.promise(
                facturacionService.facturacion(factura),
                {
                    pending: "🧾 Generando y enviando tu documento...",
                    success: {
                        render({ data }) {
                            const { status, success, message, data: responseData } = data;

                            if (status === 200 && success) {
                                if (responseData?.cdrResponse?.code === "0") {
                                    setCorrelativos((prevCorrelativos) => {
                                        const newCorrelativos = { ...prevCorrelativos };
                                        if (factura.tipo_Doc === "01") {
                                            newCorrelativos.facturas += 1;
                                        } else if (factura.tipo_Doc === "03") {
                                            newCorrelativos.boletas += 1;
                                        }
                                        return newCorrelativos;
                                    });

                                    setFacturasEmitidas((prevList) => [
                                        ...prevList,
                                        {
                                            id: responseData.cdrResponse?.id || `${factura.serie}-${factura.correlativo}`,
                                            tipoDoc: factura.tipo_Doc,
                                            serie: factura.serie,
                                            correlativo: factura.correlativo,
                                            montoTotal: factura.monto_Imp_Venta,
                                            fechaEmision: factura.fecha_Emision,
                                            clienteRazonSocial: factura.cliente_Razon_Social,
                                            estadoSunat: responseData.cdrResponse?.description || "Aceptada",
                                        },
                                    ]);

                                    setFactura(initialFacturaState);
                                    setProductoActual(initialProductoActualState); // Reset product form as well
                                    setEdicionProducto({ edicion: false, index: null }); // Reset editing state
                                    setPagoActual(initialPagoActualState); // Reset payment form

                                    return `✅ ${responseData.cdrResponse.description || "Documento aceptado y registrado con éxito."}`;
                                } else {
                                    return `🎉 ¡Documento generado! ${message || ""}`;
                                }
                            } else if (status === 200 && !success) {
                                if (responseData?.error?.message) {
                                    return `⚠️ ${responseData.error.message} (Código: ${responseData.error.code})`;
                                }
                                return `⚠️ ${message || "Documento generado, pero con advertencias."}`;
                            }
                            return `👍 Operación completada: ${message || "Verifica los detalles."}`;
                        },
                    },
                    error: {
                        render({ data }) {
                            if (data.response?.data?.message) {
                                return `❌ Error: ${data.response.data.message}`;
                            }
                            return `🚨 Fallo al facturar: ${data.message || "Error de conexión o servidor."}`;
                        },
                    },
                }
            );
            console.log("Respuesta completa de facturación:", res);
            return res;
        } catch (error) {
            console.error("Error inesperado durante la facturación:", error);
            return null;
        }
    };

    const buscarPersonaPorDni = async (dni) => {
        try {
            const { data, status, message } = await toast.promise(
                facturacionService.obtenerPersonaPorDni(dni),
                {
                    pending: "Buscando Persona...",
                    success: "Persona encontrada con éxito",
                    error: "No se pudo encontrar la persona",
                }
            );
            if (status === 200 && message === "Exito") {
                setFactura((prev) => ({
                    ...prev,
                    cliente_Razon_Social: data.nombre_completo,
                    cliente_Direccion: data.direccion_completa,
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const buscarEmpresaPorRuc = async (ruc) => {
        try {
            const { data, status, message } = await toast.promise(
                facturacionService.obtenerEmpresaPorRuc(ruc),
                {
                    pending: "Buscando empresa...",
                    success: "Empresa encontrada con éxito",
                    error: "No se pudo encontrar la empresa",
                }
            );
            if (status === 200 && message === "Exito") {
                setFactura((prev) => ({
                    ...prev,
                    cliente_Razon_Social: data.nombre_o_razon_social,
                    cliente_Direccion: data.direccion_completa,
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const buscarEstablecimientosPorRuc = async (ruc) => {
        try {
            const data = await facturacionService.obtenerEstablecimientosPorRuc(ruc);
            return data;
        } catch (error) {
            toast.error("Error al buscar establecimientos");
            console.error(error);
        }
    };

    const buscarVehiculoPorPlaca = async (placa) => {
        try {
            const data = await facturacionService.obtenerVehiculoPorPlaca(placa);
            return data;
        } catch (error) {
            toast.error("Error al buscar vehículo");
            console.error(error);
        }
    };

    const buscarLicenciaPorDni = async (dni) => {
        try {
            const data = await facturacionService.obtenerLicenciaPorDni(dni);
            return data;
        } catch (error) {
            toast.error("Error al buscar licencia");
            console.error(error);
        }
    };

    const buscarExtranjeroPorCee = async (cee) => {
        try {
            const { data, status, message } = await toast.promise(
                facturacionService.obtenerPersonaPorDni(cee), // Asumo que el servicio es el mismo que para DNI
                {
                    pending: "Buscando Persona Extranjera...",
                    success: "Persona Extranjera encontrada con éxito",
                    error: "No se pudo encontrar la persona extranjera",
                }
            );
            if (status === 200 && message === "Exito") {
                setFactura((prev) => ({
                    ...prev,
                    cliente_Razon_Social: `${data.nombres} ${data.apellido_paterno} ${data.apellido_materno}`,
                    cliente_Direccion: "",
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const buscarTipoCambioPorFecha = async (fecha) => {
        try {
            const data = await facturacionService.obtenerTipoCambioDia(fecha);
            return data;
        } catch (error) {
            toast.error("Error al obtener tipo de cambio del día");
            console.error(error);
        }
    };

    const buscarTipoCambioPorMes = async (mes, anio) => {
        try {
            const data = await facturacionService.obtenerTipoCambioMes(mes, anio);
            return data;
        } catch (error) {
            toast.error("Error al obtener tipo de cambio mensual");
            console.error(error);
        }
    };

    const obtenerMiInformacion = () => {
        if (!factura.cliente_Num_Doc) return;

        switch (factura.cliente_Tipo_Doc) {
            case "6":
                return buscarEmpresaPorRuc(factura.cliente_Num_Doc);
            case "1":
                return buscarPersonaPorDni(factura.cliente_Num_Doc);
            case "placa":
                return buscarVehiculoPorPlaca(factura.cliente_Num_Doc);
            case "4":
                return buscarExtranjeroPorCee(factura.cliente_Num_Doc);
            case "licencia":
                return buscarLicenciaPorDni(factura.cliente_Num_Doc);
            case "fecha":
                return buscarTipoCambioPorFecha(factura.cliente_Num_Doc);
            case "mes":
                const [mes, anio] = factura.cliente_Num_Doc.split(",");
                return buscarTipoCambioPorMes(mes, anio);
            default:
                return null;
        }
    };

    const metodo = {
        buscarPersonaPorDni,
        buscarEmpresaPorRuc,
        buscarEstablecimientosPorRuc,
        buscarVehiculoPorPlaca,
        buscarLicenciaPorDni,
        buscarExtranjeroPorCee,
        buscarTipoCambioPorFecha,
        buscarTipoCambioPorMes,
        obtenerMiInformacion,
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
                metodo,
                facturarNuevoDocumento,
                facturaValidaParaGuardar,
            }}
        >
            {children}
        </FacturaBoletaContext.Provider>
    );
}

export function useFacturaBoleta() {
    return useContext(FacturaBoletaContext);
}