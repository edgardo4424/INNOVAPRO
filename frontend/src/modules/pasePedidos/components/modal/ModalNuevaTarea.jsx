import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import FormNuevaTarea from "../form/FormNuevaTarea";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePedidos } from "../../context/PedidosContenxt";

const TareaOT = {
  empresaProveedoraId: null,
  clienteId: null,
  obraId: null,
  contactoId: null,

  tipoTarea: "Pase de Pedido",
  usoId: null,

  detalle: {
    nota: "",
    estadoPasePedido: "",
    numeroVersionContrato: "",
    fechaLimite: "",
    obra: "",
    tipoSolicitud: "",
    prioridad: "",
  },
  estado: "Pendiente",
  usuarioId: null,
};

export default function ModalNuevaTarea({
  open,
  setOpen,
  pedidoView,
  setPedidoView,
  filiales,
}) {
  const { user } = useAuth();
  const [nuevaTareaForm, setNuevaTareaForm] = useState(TareaOT);

  useEffect(() => {
    if (pedidoView) {
      setNuevaTareaForm({
        ...nuevaTareaForm,
        empresaProveedoraId: pedidoView.empresaProveedoraId, // * empresa
        clienteId: pedidoView.clienteId, // * cliente
        obraId: pedidoView.obraId, // * obra
        contactoId: pedidoView.contactoId, // * contacto
        usuarioId: user.id, // * usuario
        detalle: {
          ...nuevaTareaForm.detalle,
          estadoPasePedido: pedidoView.estado,
          numeroVersionContrato: pedidoView.nro_contrato,
          obra: pedidoView.obra ? pedidoView.obra.toUpperCase() : "",
        },
      });
    }
  }, [pedidoView]);

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
        <div className="flex flex-col">
          <AlertDialogTitle>Crear Tarea para Oficina Técnica</AlertDialogTitle>

          <AlertDialogDescription className={"text-center"}>
            {""}
          </AlertDialogDescription>

          <FormNuevaTarea
            pedidoContent={nuevaTareaForm}
            pedidoView={pedidoView}
            setNuevaTareaForm={setNuevaTareaForm}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
