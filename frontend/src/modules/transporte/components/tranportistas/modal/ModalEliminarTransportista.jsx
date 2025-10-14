import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import choferService from "@/modules/transporte/service/ChoferService";
import transportistaService from "@/modules/transporte/service/TransportistaService";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export default function ModalEliminarTransportista({
  open,
  setOpen,
  transportistaEliminar,
  setTransportistaEliminar,
  refresh,
}) {
  const closeModal = () => {
    setTransportistaEliminar({});
    setOpen(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const { message, data, success } = await toast.promise(
        transportistaService.eliminar(transportistaEliminar.id),
        {
          pending: "Eliminando Transportista",
          success: "Transportista eliminado correctamente.",
          error: "Ocurrió al tratar de eliminar.",
        },
      );
      if (success) {
        await refresh();
        closeModal();
      }
    } catch (error) {
      // console.error("Error eliminando chofer:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="flex flex-col gap-4 md:min-w-[500px]">
        {/* ❌ Botón cerrar arriba */}
        <button
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-600"
          onClick={closeModal}
        >
          <X />
        </button>

        {/* 🧾 Encabezado */}
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            ¿Seguro de eliminar a este transportista?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Estás a punto de eliminar al transportista{" "}
            <span className="font-semibold">
              {transportistaEliminar?.razon_social}
            </span>{" "}
            con documento{" "}
            <span className="font-semibold">
              {transportistaEliminar?.nro_doc}
            </span>
            .
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Botones */}
        <AlertDialogFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
