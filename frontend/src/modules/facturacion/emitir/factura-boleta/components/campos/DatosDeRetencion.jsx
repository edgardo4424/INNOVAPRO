// Importaciones necesarias de React y tu contexto personalizado
import React, { useEffect } from 'react';
import { useFacturaBoleta } from '@/modules/facturacion/context/FacturaBoletaContext';

// Importaciones de los componentes de shadcn/ui
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch'; // Usamos un switch para un mejor UX

const DatosDeRetencion = () => {
  const {
    factura,
    setFactura,
    retencionActivado,
    setRetencionActivado,
    retencion,
    setRetencion
  } = useFacturaBoleta();

  let importeNeto = 0;

  const handleSelectChange = (value) => {
    let montoPorcentaje = factura.monto_Imp_Venta * value;
    let montoBase = factura.monto_Imp_Venta;

    setRetencion({
      ...retencion,
      descuento_factor: value,
      descuento_monto_base: Number(montoBase.toFixed(2)),
      descuento_monto: Number(montoPorcentaje.toFixed(2)),
    });

    importeNeto = (montoBase - montoPorcentaje).toFixed(2);
  };

  useEffect(() => {
    if (retencionActivado) {
      handleSelectChange(retencion.descuento_factor);
    }
  }, [factura.monto_Imp_Venta]);

  if(factura.monto_Imp_Venta < 699) return null

  if (factura.tipo_Doc == "03") return null

  if (factura.tipo_Operacion == "1001") return null

  return (
    // Contenedor principal con espaciado y layout responsivo
    <div className='overflow-y-auto pt-4 px-4 lg:px-8 flex flex-col gap-y-6'>
      <div className='flex items-center gap-x-4'>
        <h1 className="text-2xl font-bold">
          Retención
        </h1>
        {/* Usamos un Switch de shadcn para un mejor control de activación */}
        <Switch
          checked={retencionActivado}
          onCheckedChange={setRetencionActivado}
          id="retencion-switch"
          aria-label="Activar retención"
          className={retencionActivado ? '!bg-blue-500' : 'bg-gray-200'}
        />
        <Label htmlFor="retencion-switch" className="text-gray-700">
          {retencionActivado ? 'Activado' : 'Desactivado'}
        </Label>
      </div>

      {/* Contenedor del formulario, se muestra solo si la retención está activada */}
      {retencionActivado && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
          {/* Campo de selección de tipo de descuento */}
          {/* <div className='flex flex-col space-y-2'>
            <Label htmlFor="descuento_cod_tipo">
              Tipo de descuento
            </Label>
            <Select
              value={retencion.descuento_cod_tipo}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="descuento_cod_tipo">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="00">00 - Descuento en el valor</SelectItem>
                <SelectItem value="01">01 - Descuento en el impuesto</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Campo de factor */}
          <div className='flex flex-col space-y-2'>
            <Label htmlFor="descuento_factor">
              Porcentaje
            </Label>
            <Select
              name="descuento_factor"
              value={retencion.descuento_factor || ''}
              onValueChange={handleSelectChange}
              placeholder="Selecciona un porcentaje"
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                <SelectValue placeholder="Selecciona un porcentaje de detracción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={0.03}>3%</SelectItem>
                <SelectItem value={0.06}>6%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campo de monto base */}
          <div className='flex flex-col space-y-2'>
            <Label htmlFor="descuento_monto_base">
              Monto a base
            </Label>
            <Input
              type="number"
              id="descuento_monto_base"
              value={retencion.descuento_monto_base}
              disabled
            // onChange={(e) => setRetencion({ ...retencion, des}cuento_monto_base: Number(e.target.value) })}
            />
          </div>

          {/* Campo de monto */}
          <div className='flex flex-col space-y-2'>
            <Label htmlFor="descuento_monto">
              Importe a retener
            </Label>
            <Input
              type="number"
              id="descuento_monto"
              value={retencion.descuento_monto}
              disabled
            // onChange={(e) => setRetencion({ ...retencion, descuento_monto: Number(e.target.value) })}
            />
          </div>

          {/* Campo de monto */}
          <div className='flex flex-col space-y-2'>
            <Label htmlFor="descuento_monto">
              Importe neto a pagar
            </Label>
            <Input
              type="number"
              id="descuento_monto"
              value={(factura.monto_Imp_Venta - retencion.descuento_monto).toFixed(2)}
              disabled
            // onChange={(e) => setRetencion({ ...retencion, descuento_monto: Number(e.target.value) })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DatosDeRetencion;
