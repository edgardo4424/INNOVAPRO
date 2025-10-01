import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import { Trash } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import ModalPagos from "../modal/ModalPagos";
import TablaPagos from "../tabla/TablaPagos";

const FormaDePago = () => {
  const {
    factura,
    setFactura,
    precioDolarActual,
    retencionActivado,
    retencion,
    detraccion,
    detraccionActivado,
  } = useFacturaBoleta();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      factura.forma_pago.length > 0 &&
      factura.forma_pago[0].tipo == "Credito"
    ) {
      setFactura((prevFactura) => ({
        ...prevFactura,
        fecha_vencimiento: factura.forma_pago[0].fecha_Pago,
        dias_pagar:
          Math.ceil(
            (new Date(factura.forma_pago[0].fecha_Pago).getTime() -
              new Date(factura.fecha_Emision).getTime()) /
              (1000 * 60 * 60 * 24),
          ) + 1,
      }));
    } else {
      setFactura((prevFactura) => ({
        ...prevFactura,
        fecha_vencimiento: null,
        dias_pagar: null,
      }));
    }
  }, [factura.forma_pago]);

  // TODO: AUTOMATIZACION DE CALCULOS DE PAGOS
  const isRecalculatingRef = useRef(false);

  // Memoizar el cálculo de montoNeto para evitar recálculos innecesarios
  const montoNeto = useMemo(() => {
    let resultado = factura.monto_Imp_Venta;

    if (retencionActivado) {
      if (factura.tipo_Moneda === "USD") {
        resultado =
          factura.monto_Imp_Venta -
          retencion.descuento_monto / precioDolarActual;
        resultado = parseFloat(resultado.toFixed(2));
      } else {
        resultado = factura.monto_Imp_Venta - retencion.descuento_monto;
      }
    } else if (factura.tipo_Operacion == "1001" && !retencionActivado) {
      if (factura.tipo_Moneda === "USD") {
        resultado =
          factura.monto_Imp_Venta -
          detraccion.detraccion_mount / precioDolarActual;
        resultado = parseFloat(resultado.toFixed(2));
      } else {
        resultado = factura.monto_Imp_Venta - detraccion.detraccion_mount;
      }
    }

    return parseFloat(resultado);
  }, [
    factura.monto_Imp_Venta,
    factura.tipo_Moneda,
    factura.tipo_Operacion,
    retencionActivado,
    retencion?.descuento_monto, // Usar optional chaining
    detraccion?.detraccion_mount, // Usar optional chaining
    precioDolarActual,
    detraccionActivado,
  ]);

  useEffect(() => {
    // if (isRecalculatingRef.current) return;
  console.log("pasp")
    if (factura.forma_pago.length > 0) {
      isRecalculatingRef.current = true;

      const numCuotas = factura.forma_pago.length;

      // Distribuir montos
      const montoPorCuota = +(factura.monto_Imp_Venta / numCuotas).toFixed(2);
      const montoPorCuotaReal = +(montoNeto / numCuotas).toFixed(2);

      let acumuladoFormaPago = 0;
      let acumuladoReal = 0;

      const nuevasCuotas = factura.forma_pago.map((cuota, index) => {
        let monto = montoPorCuota;
        let montoReal = montoPorCuotaReal;

        if (index === numCuotas - 1) {
          // Ajustar última cuota
          monto = +(factura.monto_Imp_Venta - acumuladoFormaPago).toFixed(2);
          montoReal = +(montoNeto - acumuladoReal).toFixed(2);
        }

        acumuladoFormaPago += monto;
        acumuladoReal += montoReal;

        return {
          ...cuota,
          monto,
          montoReal,
        };
      });

      // Verificar cambios
      const montosChanged = factura.forma_pago.some(
        (c, i) =>
          Math.abs(c.monto - nuevasCuotas[i].monto) > 0.01 ||
          Math.abs((c.montoReal ?? 0) - nuevasCuotas[i].montoReal) > 0.01,
      );

      if (montosChanged) {
        setFactura((prev) => ({
          ...prev,
          forma_pago: nuevasCuotas,
          cuotas_Real: nuevasCuotas.map((c) => ({
            ...c,
            monto: c.montoReal,
          })),
          neto_Pagar: +montoNeto.toFixed(2),
        }));
      }

    }
  }, [
    montoNeto,
    factura.monto_Imp_Venta,
    factura.forma_pago.length,
    factura.detalle,
    detraccion,
    retencion,
    detraccionActivado,
    retencionActivado,
  ]);

  // Función para limpiar todos los pagos
  const limpiarPagos = () => {
    setFactura((prevFactura) => ({
      ...prevFactura,
      forma_pago: [],
      cuotas_Real: [],
      neto_Pagar: 0,
      fecha_vencimiento: null,
      dias_pagar: null,
    }));
  };

  return (
    <div className="overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between">
        <h1 className="text-lg font-bold md:text-2xl">Forma de Pago</h1>
        {factura.forma_pago.length > 0 && (
          <button
            variant="danger"
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-red-500 p-1 text-white hover:bg-red-600 md:px-4 md:py-2"
            onClick={limpiarPagos}
          >
            <Trash />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      <div className="flex justify-between">
        <ModalPagos open={open} setOpen={setOpen} />
      </div>
      <TablaPagos open={open} setOpen={setOpen} />
    </div>
  );
};

export default FormaDePago;
