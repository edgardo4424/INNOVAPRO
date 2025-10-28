import ModalDetalleExtra from "@/modules/facturacion/components/modal/ModalDetallesExtra";
import { useState } from "react";
import { useFacturaBoleta } from "../../../context/FacturaBoletaContext";

const DetalleProducto = () => {
  const { factura, setFactura, TotalProducto, detallesExtra } =
    useFacturaBoleta();
  const { detalle: listaProductos, tipo_Moneda } = factura;

  const [open, setOpen] = useState(false);

  let subTotalConIgv = factura.total_Impuestos + factura.monto_Oper_Gravadas;

  const handleObservacion = (e) => {
    const input = e.target;
    const { value } = input;

    const cursorStart = input.selectionStart;
    const cursorEnd = input.selectionEnd;

    const validatedValue = value.toUpperCase();

    input.value = validatedValue;

    input.selectionStart = cursorStart;
    input.selectionEnd = cursorEnd;

    setFactura((prevFactura) => ({
      ...prevFactura,
      Observacion: validatedValue,
    }));
  };

  return (
    <div className="flex w-full flex-col md:flex-row md:gap-6 lg:px-8">
      {/* Sección Izquierda - Observaciones y Detalles Extra */}
      <div className="flex w-full flex-col items-start py-6 md:w-7/12">
        {/* Observaciones */}
        <div className="relative mb-6 flex w-full flex-col items-start">
          <h2 className="mb-3 flex items-center text-lg font-semibold text-gray-800 md:text-xl">
            <span className="mr-3 h-6 w-1 rounded-full bg-blue-500"></span>
            <span> Observación:</span>
          </h2>
          <textarea
            name=""
            id=""
            className="h-32 w-full resize-none rounded-lg border border-gray-300 bg-white p-4 placeholder-gray-400 transition-all duration-200"
            placeholder="Ingrese observación adicional para el documento..."
            onChange={handleObservacion}
            value={factura.Observacion}
            maxLength="200"
          ></textarea>
          <p className="absolute right-4 bottom-2 mt-2 text-right text-sm text-gray-500">
            {factura.Observacion.length}/200
          </p>
        </div>

        {/* Detalles Extra */}
        <div className="w-full">
          <div className="flex items-center gap-x-4 pb-4">
            <h2 className="flex items-center text-lg font-semibold text-gray-800 md:text-xl">
              <span className="mr-3 h-6 w-1 rounded-full bg-green-500"></span>
              Detalles Extra:
            </h2>
            <ModalDetalleExtra open={open} setOpen={setOpen} />
          </div>
          {detallesExtra.length > 0 && (
            <div className="w-full overflow-hidden rounded-lg border border-gray-300">
              {detallesExtra.map((detalle, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 px-4 py-3 text-sm transition-colors duration-150 even:bg-gray-50 hover:bg-blue-50"
                >
                  <p className="border-r border-gray-300 pr-4 font-semibold text-gray-700">
                    {detalle.detalle}
                  </p>
                  <p className="pl-4 text-right font-medium text-gray-600">
                    {detalle.valor}
                  </p>
                </div>
              ))}
            </div>
          )}
          {detallesExtra.length === 0 && (
            <div className="py-8 text-center text-gray-500 italic">
              No hay detalles extra agregados
            </div>
          )}
        </div>
      </div>

      {/* Sección Derecha - Resumen de Totales */}
      <div className="w-full pt-6 md:w-5/12">
        <div className="space-y-1 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 px-5 py-3">
          {/* Encabezado */}
          <div className="mb-4 border-b border-gray-200 pb-3">
            <h3 className="flex items-center text-lg font-bold text-gray-800 md:text-xl">
              <span className="mr-3 h-6 w-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600"></span>
              Resumen Financiero
            </h3>
          </div>

          <div className="flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-150 hover:bg-gray-50">
            <span className="font-medium text-gray-700">Gravadas</span>
            <span className="font-semibold text-gray-800">
              {tipo_Moneda == "PEN" ? "S/." : "$"} {TotalProducto}
            </span>
          </div>

          {/* Separador */}
          <div className="my-3 border-t border-gray-200"></div>

          {/* Desglose de Impuestos */}
          <div className="mb-3 space-y-2">
            <div className="mb-2 text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Desglose de Impuestos
            </div>

            <div className="flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-150 hover:bg-gray-50">
              <span className="font-medium text-gray-700">IGV</span>
              <span className="font-semibold text-gray-800">
                {tipo_Moneda == "PEN" ? "S/." : "$"}{" "}
                {factura.monto_Igv}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-150 hover:bg-gray-50">
              <span className="font-medium text-gray-700">Sub Total + IGV</span>
              <span className="font-semibold text-gray-800">
                {tipo_Moneda == "PEN" ? "S/." : "$"} {subTotalConIgv}
              </span>
            </div>
          </div>

          {/* Separador */}
          <div className="my-3 border-t border-gray-200"></div>

          {/* Desglose de Operaciones */}
          <div className="space-y-2">
            <div className="mb-2 text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Desglose de Operaciones
            </div>

            <div className="flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-150 hover:bg-gray-50">
              <span className="font-medium text-gray-700">Exonerados</span>
              <span className="font-semibold text-gray-800">
                {tipo_Moneda == "PEN" ? "S/." : "$"}{" "}
                {factura.monto_Oper_Exoneradas}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-150 hover:bg-gray-50">
              <span className="font-medium text-gray-700">Sub Total</span>
              <span className="font-semibold text-gray-800">
                {tipo_Moneda == "PEN" ? "S/." : "$"}{" "}
                {factura.sub_Total}
              </span>
            </div>

            <div className="mb-3 flex items-center justify-between rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2">
              <span className="font-bold text-blue-800">Total</span>
              <span className="text-lg font-bold text-blue-800">
                {tipo_Moneda == "PEN" ? "S/." : "$"}{" "}
                {factura.monto_Imp_Venta}{" "}
              </span>
            </div>
          </div>

          {/* Footer con gradiente sutil */}
          {/* <div className="mt-4 border-t border-gray-200 pt-3">
            <div className="text-center text-xs text-gray-500">
              Montos calculados automáticamente
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
