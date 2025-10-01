import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNota } from "@/modules/facturacion/context/NotaContext";
import { useEffect, useState } from "react";
import { valorInicialProducto } from "../utils/valoresInicialNota";

const PenalidadInteresForm = ({ closeModal }) => {
  const { notaCreditoDebito, setNotaCreditoDebito, itemActual, setItemActual } =
    useNota();

  const [penalidadInteres, setPenalidadInteres] =
    useState(valorInicialProducto);

  useEffect(() => {
    if (itemActual.monto_Valor_Unitario > 0) {
      setPenalidadInteres(itemActual);
    }
  }, []);

  const handleInputChange = (e) => {
    const { value } = e.target;
    const numericValue = Number.parseFloat(value || 0);

    // Esta línea es exonerada (20). Base exonerada = valor de venta.
    const valorLinea = Number.isFinite(numericValue) ? numericValue : 0;

    setPenalidadInteres((prev) => ({
      ...prev,
      monto_Valor_Unitario: valorLinea, // valor sin IGV (en exoneradas coincide con precio)
      monto_Base_Igv: valorLinea, // ¡IMPORTANTE! Base exonerada = valor de la línea
      monto_Valor_Venta: valorLinea, // cantidad (1) * valor unitario
      monto_Precio_Unitario: valorLinea, // precio con impuestos (igual en exoneradas)
      tip_Afe_Igv: "20", // exonerado - operación onerosa
      porcentaje_Igv: 0,
      igv: 0,
      total_Impuestos: 0,
    }));
    setItemActual(valorInicialProducto);
  };

  const handleCancel = () => {
    setPenalidadInteres(valorInicialProducto);
    closeModal();
  };

  const handleSave = () => {
    const item = {
      ...penalidadInteres,
      cantidad: 1,
      unidad: "NIU",
      descripcion: notaCreditoDebito.motivo_Des || "", // siempre igual a motivo_Des
      tip_Afe_Igv: "20",
      porcentaje_Igv: 0,
      igv: 0,
      total_Impuestos: 0,
      // Por seguridad, normaliza números
      monto_Valor_Unitario: Number(penalidadInteres.monto_Valor_Unitario || 0),
      monto_Valor_Venta: Number(penalidadInteres.monto_Valor_Venta || 0),
      monto_Base_Igv: Number(penalidadInteres.monto_Base_Igv || 0),
      monto_Precio_Unitario: Number(
        penalidadInteres.monto_Precio_Unitario || 0,
      ),
    };

    setNotaCreditoDebito((prev) => ({
      ...prev,
      detalle: [item],
    }));
    closeModal();
  };

  useEffect(() => {
    setPenalidadInteres((prev) => ({
      ...prev,
      cantidad: 1,
      descripcion: notaCreditoDebito.motivo_Des || "", // siempre igual a motivo_Des
      unidad: "NIU",
    }));
  }, [notaCreditoDebito.motivo_Des]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        // Default to 1 column on small screens, 2 on medium, 4 on large
        className="grid w-full grid-cols-1 gap-x-2 gap-y-3 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Valor Unitario */}
        <div className="col-span-full flex flex-col gap-1 md:col-span-2 lg:col-span-2">
          <Label>Valor Unitario</Label>
          <Input
            type="number"
            name="monto_Valor_Unitario"
            value={penalidadInteres.monto_Valor_Unitario || ""} // mantiene controlado
            step="0.01"
            inputMode="decimal"
            className="border-1 border-gray-400"
            onChange={handleInputChange}
          />
        </div>

        {/* Descripción */}
        <div className="col-span-full flex flex-col gap-1 md:col-span-2">
          <Label>Primera Descripción</Label>
          <Input
            type="text"
            name="descripcion"
            value={penalidadInteres.descripcion}
            readOnly
            className="border-1 border-gray-400"
          />
        </div>
        <Button
          variant="outline"
          onClick={handleCancel}
          className={
            "w-full cursor-pointer border-2 hover:bg-red-50 hover:text-red-600 md:w-auto"
          }
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          form="form-producto"
          className={
            "w-full cursor-pointer bg-blue-600 hover:bg-blue-800 md:w-auto"
          }
        >
          Guardar
        </Button>
      </form>
    </div>
  );
};

export default PenalidadInteresForm;
