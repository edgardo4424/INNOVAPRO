import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import { useCallback, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const DatosDeRetencion = () => {
  const {
    factura,
    setFactura,
    retencionActivado,
    setRetencionActivado,
    retencion,
    setRetencion,
    precioDolarActual,
  } = useFacturaBoleta();

  // Función para calcular la retención de forma más robusta
  const calcularRetencion = useCallback(
    (porcentaje) => {
      if (!porcentaje || porcentaje <= 0) {
        // Si no hay porcentaje válido, resetear valores
        setRetencion({
          ...retencion,
          descuento_factor: 0,
          descuento_monto_base: 0,
          descuento_monto: 0,
        });
        setFactura({ ...factura, neto_Pagar: 0 });
        return;
      }

      let montoBase;
      let montoPorcentaje;

      if (factura.tipo_Moneda === "PEN") {
        // Cálculo para moneda nacional (PEN)
        montoBase = factura.monto_Imp_Venta - factura.monto_Oper_Exoneradas;
        montoPorcentaje = montoBase * porcentaje;

        setRetencion({
          ...retencion,
          descuento_factor: porcentaje,
          descuento_monto_base: Number(montoBase.toFixed(2)),
          descuento_monto: Number(montoPorcentaje.toFixed(2)),
        });

        setFactura({
          ...factura,
          neto_Pagar: Number(
            (factura.monto_Imp_Venta - montoPorcentaje).toFixed(2),
          ),
        });
      } else {
        // Cálculo para moneda extranjera (USD)
        const montoVentaEnSoles =
          (factura.monto_Imp_Venta - factura.monto_Oper_Exoneradas) *
          precioDolarActual;
        montoBase = montoVentaEnSoles;
        montoPorcentaje = montoBase * porcentaje;

        setRetencion({
          ...retencion,
          descuento_factor: porcentaje,
          descuento_monto_base: Number(montoBase.toFixed(2)),
          descuento_monto: Number(montoPorcentaje.toFixed(2)),
        });

        setFactura({
          ...factura,
          neto_Pagar: Number(
            (
              factura.monto_Imp_Venta -
              montoPorcentaje / precioDolarActual
            ).toFixed(2),
          ),
        });
      }
    },
    [factura, retencion, setRetencion, setFactura, precioDolarActual],
  );

  // Manejo del cambio de porcentaje
  const handleSelectChange = (value) => {
    const porcentaje = parseFloat(value);
    calcularRetencion(porcentaje);
  };

  // Efecto para recalcular cuando cambian valores relevantes
  useEffect(() => {
    if (retencionActivado && retencion.descuento_factor) {
      calcularRetencion(retencion.descuento_factor);
    }
  }, [
    factura.monto_Imp_Venta,
    factura.tipo_Moneda,
    precioDolarActual,
    retencionActivado,
  ]);

  // Efecto para resetear cuando se desactiva la retención
  useEffect(() => {
    setFactura({
      ...factura,
      forma_pago: [],
      cuotas_Real: [],
    });
    if (!retencionActivado) {
      setRetencion({
        ...retencion,
        descuento_factor: 0,
        descuento_monto_base: 0,
        descuento_monto: 0,
      });
      setFactura({
        ...factura,
        forma_pago: [],
        cuotas_Real: [],
        neto_Pagar: 0,
      });
    }
  }, [retencionActivado, retencion.descuento_factor]);

  // Manejo del cambio de estado del switch
  const handleSwitchChange = (checked) => {
    setRetencionActivado(checked);
    if (!checked) {
      // Resetear valores cuando se desactiva
      setRetencion({
        ...retencion,
        descuento_factor: 0,
        descuento_monto_base: 0,
        descuento_monto: 0,
      });
    }
  };

  const shouldRender = !(
    factura.monto_Imp_Venta < 699 ||
    factura.tipo_Doc === "03" ||
    factura.tipo_Operacion === "1001"
  );

  return shouldRender ? (
    <div className="flex flex-col gap-y-6 overflow-y-auto px-4 pt-4 lg:px-8">
      <div className="flex items-center gap-x-4">
        <h1 className="text-lg font-bold md:text-2xl">Retención</h1>
        <Switch
          checked={retencionActivado}
          onCheckedChange={handleSwitchChange}
          id="retencion-switch"
          aria-label="Activar retención"
          className={retencionActivado ? "!bg-blue-500" : "bg-gray-200"}
        />
        <Label htmlFor="retencion-switch" className="text-gray-700">
          {retencionActivado ? "Activado" : "Desactivado"}
        </Label>
      </div>

      {/* Contenedor del formulario */}
      {retencionActivado && (
        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Campo de porcentaje */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="descuento_factor">Porcentaje de Retención</Label>
            <Select
              name="descuento_factor"
              value={retencion.descuento_factor?.toString() || ""}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
                <SelectValue placeholder="Selecciona porcentaje" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.03">3%</SelectItem>
                <SelectItem value="0.06">6%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Monto base */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="descuento_monto_base">
              Monto Base {factura.tipo_Moneda === "USD" ? "(PEN)" : ""}
            </Label>
            <Input
              type="number"
              id="descuento_monto_base"
              value={retencion.descuento_monto_base || 0}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Importe a retener */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="descuento_monto">
              Importe a Retener {factura.tipo_Moneda === "USD" ? "(PEN)" : ""}
            </Label>
            <Input
              type="number"
              id="descuento_monto"
              value={retencion.descuento_monto || 0}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Importe neto a pagar */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="neto_pagar">
              Neto a Pagar {factura.tipo_Moneda === "USD" ? "USD" : ""}
            </Label>
            <Input
              type="number"
              id="neto_pagar"
              value={factura.neto_Pagar}
              disabled
              className="bg-gray-50 font-semibold"
            />
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default DatosDeRetencion;
