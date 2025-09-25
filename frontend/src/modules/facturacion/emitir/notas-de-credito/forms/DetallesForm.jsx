import { useNota } from "@/modules/facturacion/context/NotaContext";
import { useEffect, useState } from "react";
import ModalProducto from "../components/modal/ModalProducto";
import TablaProductos from "../components/tabla/TablaProductos";

const DetallesForm = () => {
  const { notaCreditoDebito, setNotaCreditoDebito } = useNota();

  const { motivo_Cod, motivo_Des, detalle } = notaCreditoDebito;

  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Solo actualiza si motivo_Cod es "01" o "03" y tipo_Doc es "08"
    if (
      (motivo_Cod === "01" || motivo_Cod === "03") &&
      notaCreditoDebito.tipo_Doc === "08"
    ) {
      if (notaCreditoDebito.detalle && notaCreditoDebito.detalle.length > 0) {
        setNotaCreditoDebito((prev) => {
          const newDetalle = [...prev.detalle];
          newDetalle[0] = {
            ...newDetalle[0],
            descripcion: prev.motivo_Des || "",
          };
          return { ...prev, detalle: newDetalle };
        });
      }
    }
  }, [
    motivo_Des,
    motivo_Cod,
    notaCreditoDebito.tipo_Doc,
    setNotaCreditoDebito,
  ]);

  return (
    <div className="overflow-y-auto py-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <h1 className="py-2 text-2xl font-bold">Detalles</h1>
        {/* //? Caso de Cambio de Descripcion */}
        {((motivo_Cod == "03" ||
          motivo_Cod == "04" ||
          motivo_Cod == "05" ||
          motivo_Cod == "07") &&
          notaCreditoDebito.tipo_Doc === "07") ||
        ((motivo_Cod == "01" || motivo_Cod == "02" || motivo_Cod == "03") &&
          notaCreditoDebito.tipo_Doc === "08") ? (
          <ModalProducto
            open={open}
            setOpen={setOpen}
            closeModal={closeModal}
          />
        ) : null}
      </div>
      <TablaProductos setOpen={setOpen} />
    </div>
  );
};

export default DetallesForm;
