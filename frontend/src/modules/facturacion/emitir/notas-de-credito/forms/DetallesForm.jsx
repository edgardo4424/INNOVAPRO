import { useNota } from "@/modules/facturacion/context/NotaContext";
import { useEffect, useState } from "react";
import ModalProducto from "../components/modal/ModalProducto";
import TablaProductos from "../components/tabla/TablaProductos";

const DetallesForm = () => {
  const { notaCreditoDebito, setNotaCreditoDebito } = useNota();

  const { motivo_Cod, motivo_Des } = notaCreditoDebito;

  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    const motivosValidos = ["01", "03"];

    setNotaCreditoDebito((prev) => {
      // 🔹 Si motivo_Cod cambia, vaciar detalle
      if (prev.motivo_Cod !== motivo_Cod) {
        return {
          ...prev,
          motivo_Cod,
          detalle: [],
        };
      }

      // 🔹 Si está en motivos válidos y hay detalle → actualizar solo descripción
      if (
        motivosValidos.includes(motivo_Cod) &&
        prev.tipo_Doc === "08" &&
        Array.isArray(prev.detalle) &&
        prev.detalle.length > 0
      ) {
        const nuevoDetalle = [...prev.detalle];
        if (nuevoDetalle[0]?.descripcion !== (prev.motivo_Des || "")) {
          nuevoDetalle[0] = {
            ...nuevoDetalle[0],
            descripcion: prev.motivo_Des || "",
          };
          return { ...prev, detalle: nuevoDetalle };
        }
      }

      return prev; // 🔹 Sin cambios
    });
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
