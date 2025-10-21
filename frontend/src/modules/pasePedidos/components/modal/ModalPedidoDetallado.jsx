import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription, // <-- Componente necesario
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import FormPedido from "../form/FormPedido";

export default function ModalPedidoDetallado({
  open,
  setOpen,
  pedidoView,
  setPedidoView,
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="flex flex-col gap-4 pt-10 md:min-w-3xl">
        {/* ❌ Botón cerrar arriba */}
        <button
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-600"
          onClick={() => setOpen(false)}
        >
          <X />
        </button>

        {/* Contenido */}
        <div className="flex max-h-[85dvh] flex-col overflow-y-scroll">
          <AlertDialogTitle>Detalles del Pedido</AlertDialogTitle>

          <AlertDialogDescription className={"text-center"}>
            Tu pedido con N° {pedidoView?.nro_Pedido}
          </AlertDialogDescription>

          <FormPedido pedidoView={pedidoView} />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
