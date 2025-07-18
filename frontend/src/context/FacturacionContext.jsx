import facturacionService from "@/modules/factuacion/service/FacturacionService";
import redondearPersonalizado from "@/modules/factuacion/utils/redondearPersonalizado ";
import { validarModal } from "@/modules/factuacion/utils/validarModal";
import { validarPasos } from "@/modules/factuacion/utils/validarPasos";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const FacturacionContext = createContext();

export function FacturacionProver({ children }) {
    const [factura, setFactura] = useState({
        tipo_Operacion: "",
        tipo_Doc: "",
        serie: "",
        correlativo: "",
        tipo_Moneda: "",
        fecha_Emision: "",

        empresa_Ruc: "",

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
                legend_Value: "SON CIENTO DIECIOCHO CON 00/100 SOLES",
            },
        ],
    });


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

    //? Productos
    const [productoActual, setProductoActual] = useState({
        unidad: "",
        cantidad: 0,
        cod_Producto: "",
        descripcion: "",
        monto_Valor_Unitario: 0,
        monto_Base_Igv: 0,
        porcentaje_Igv: 18.0,
        igv: 0,
        tip_Afe_Igv: "",
        total_Impuestos: 0,
        monto_Precio_Unitario: 0,
        monto_Valor_Venta: 0,
        factor_Icbper: 0,
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
    })

    const [TotalProducto, setTotalProducto] = useState(0);

    //? Pagos
    const [pagoActual, setPagoActual] = useState({
        tipo: "",
        monto: 0,
        cuota: 0,
        fecha_Pago: "",
    });


    // ! Validar Factura
    const validarFactura = async (paso) => {
        try {
            const { errores, validos, message } = await validarPasos(paso, factura);
            if (errores !== null) {
                setFacturaValida(prev => ({
                    ...prev,
                    ...errores,
                }));
            }
            if (!validos && message !== "") {
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
            const { errores, validos, message } = await validarModal(tipo, productoActual);

            if (errores !== null) {
                setProductoValida(prev => ({
                    ...prev,
                    ...errores,
                }));
            }
            if (!validos && message !== "") {
                toast.error(message);
                return false;
            }
            return true;
        } catch (error) {
            toast.error(error.message || "Error al validar factura");
            return false;
        }
    }


    useEffect(() => {
        if (!productoActual.cod_Producto) return;

        const productoExistente = factura.detalle.find(
            (item) => item.cod_Producto === productoActual.cod_Producto
        );

        if (productoExistente) {
            setProductoActual(productoExistente);
        }
    }, [productoActual.cod_Producto, factura.detalle]);



    useEffect(() => {
        const actualizarFactura = () => {
            let gravadas = 0;
            let exoneradas = 0;
            let igvTotal = 0;

            // Calcular montos por tipo de afectación
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

            setTotalProducto(gravadas); // opcional

            setFactura((prev) => ({
                ...prev,
                monto_Oper_Gravadas: parseFloat(redondearPersonalizado(gravadas)),
                monto_Oper_Exoneradas: parseFloat(redondearPersonalizado(exoneradas)),
                monto_Igv: parseFloat(redondearPersonalizado(igvTotal)),
                total_Impuestos: parseFloat(redondearPersonalizado(igvTotal)),
                valor_Venta: parseFloat(redondearPersonalizado(gravadas + exoneradas)),
                sub_Total: parseFloat(redondearPersonalizado(subTotal)),
                monto_Imp_Venta: parseFloat(redondearPersonalizado(totalVenta)),
            }));
        };

        if (factura.detalle?.length > 0) {
            actualizarFactura();
        }
    }, [factura.detalle]);


    useEffect(() => {

        if (factura.forma_pago.length === 0) {
            setPagoActual((prev) => ({
                ...prev,
                cuota: factura.forma_pago.length,
                monto: factura.monto_Imp_Venta,
            }));
        } else {
            const pagoRestante = factura.forma_pago.reduce((total, item) => {
                const monto = parseFloat(item.monto);
                return total + (isNaN(monto) ? 0 : monto);
            }, 0);

            setPagoActual((prev) => ({
                ...prev,
                cuota: factura.forma_pago.length,
                monto: factura.monto_Imp_Venta - pagoRestante,
            }));
        }
    }, [factura.monto_Imp_Venta, factura.forma_pago]);


    const agregarPago = () => {

    }

    const agregarProducto = () => {
        setFactura((prev) => {
            const existe = prev.detalle.some(p => p.cod_Producto === productoActual.cod_Producto);
            let nuevoDetalle;
            if (existe) {
                // Reemplaza el producto existente
                nuevoDetalle = prev.detalle.map(p =>
                    p.cod_Producto === productoActual.cod_Producto ? productoActual : p
                );
            } else {
                // Agrega el producto nuevo
                nuevoDetalle = [...prev.detalle, productoActual];
            }
            return {
                ...prev,
                detalle: nuevoDetalle,
            };
        });
    };



    // ** Metodo de Facturacion
    const facturarNuevoDocumento = async () => {
        try {
            const res = await facturacionService.facturacion(factura);
            console.log(res);
            return res;
        } catch (error) {
            toast.error("Error al facturar");
            console.error(error);
        }
    }

    // Todo los metodos de consulta
    const buscarPersonaPorDni = async (dni) => {
        try {
            await toast.promise(
                facturacionService.obtenerPersonaPorDni(dni),
                {
                    pending: "Buscando Persona...",
                    success: "Persona encontrada con éxito",
                    error: "No se pudo encontrar la persona",
                }
            ).then(({ data, status, message }) => {
                if (status === 200 && message === "Exito") {
                    setFactura((prev) => ({
                        ...prev,
                        cliente_Razon_Social: data.nombre_completo,
                        cliente_Direccion: data.direccion_completa,
                    }));
                }
            });
        } catch (error) {
            toast.error("Error al buscar persona por DNI");
            console.error(error);
        }
    };

    const buscarEmpresaPorRuc = async (ruc) => {
        try {
            await toast.promise(
                facturacionService.obtenerEmpresaPorRuc(ruc),
                {
                    pending: "Buscando empresa...",
                    success: "Empresa encontrada con éxito",
                    error: "No se pudo encontrar la empresa",
                }
            ).then(({ data, status, message }) => {
                if (status === 200 && message === "Exito") {
                    setFactura((prev) => ({
                        ...prev,
                        cliente_Razon_Social: data.nombre_o_razon_social,
                        cliente_Direccion: data.direccion_completa,
                    }));
                }
            });
        } catch (error) {
            toast.error("Error al buscar empresa por RUC");
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
            await toast.promise(
                facturacionService.obtenerPersonaPorDni(dni),
                {
                    pending: "Buscando Persona...",
                    success: "Persona encontrada con éxito",
                    error: "No se pudo encontrar la persona",
                }
            ).then(({ data, status, message }) => {
                if (status === 200 && message === "Exito") {
                    setFactura((prev) => ({
                        ...prev,
                        cliente_Razon_Social: `${data.nombres} ${data.apellido_paterno} ${data.apellido_materno}`,
                        cliente_Direccion: "",
                    }));
                }
            });
        } catch (error) {
            toast.error("Error al buscar extranjero");
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

    const obtenerMiInformacion = async () => {
        console.log("informacion del cliente", factura);
        if (factura.cliente_Tipo_Doc === "6") {
            return buscarEmpresaPorRuc(factura.cliente_Num_Doc);
        }
        if (factura.cliente_Tipo_Doc === "1") {
            return buscarPersonaPorDni(factura.cliente_Num_Doc);
        }
        if (factura.cliente_Tipo_Doc === "placa") {
            return buscarVehiculoPorPlaca(factura.cliente_Num_Doc);
        }
        if (factura.cliente_Tipo_Doc === "4") {
            return buscarExtranjeroPorCee(factura.cliente_Num_Doc);
        }
        if (factura.cliente_Tipo_Doc === "licencia") {
            return buscarLicenciaPorDni(factura.cliente_Num_Doc);
        }
        if (factura.cliente_Tipo_Doc === "fecha") {
            return buscarTipoCambioPorFecha(factura.cliente_Num_Doc);
        }
        if (factura.cliente_Tipo_Doc === "mes") {
            return buscarTipoCambioPorMes(valor[0], valor[1]);
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
        <FacturacionContext.Provider
            value={{
                factura,
                setFactura,
                validarFactura,
                validarCampos,
                facturaValida,
                productoValida,
                productoActual,
                setProductoActual,
                agregarProducto,
                TotalProducto,
                pagoActual,
                setPagoActual,
                metodo,
                facturarNuevoDocumento
            }}
        >
            {children}
        </FacturacionContext.Provider>
    );
}

export function useFacturacion() {
    return useContext(FacturacionContext);
}
