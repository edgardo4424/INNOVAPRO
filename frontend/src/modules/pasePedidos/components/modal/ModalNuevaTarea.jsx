import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import pedidosService from "../../service/PedidosService";
import { validaTarea } from "../../utils/validarTarea";
import FormNuevaTarea from "../form/FormNuevaTarea";

const TareaOT = {
  empresaProveedoraId: null,
  clienteId: null,
  obraId: null,
  contactoId: null,
  cotizacionId: null,
  atributos_valor_zonas: null,

  tipoTarea: "Pase de Pedido",
  usoId: null,

  detalles: {
    tipoSolicitud: "",
    nota: "",
    estadoPasePedido: "",
    numeroVersionContrato: "",
    fechaLimite: "",
    obra: "",
    prioridad: "",
  },
  pedido_id: null,
  estado: "Pendiente",
  usuarioId: null,
};

export default function ModalNuevaTarea({
  open,
  setOpen,
  pedidoView,
  setPedidoView,
}) {
  const { user } = useAuth();
  const [nuevaTareaForm, setNuevaTareaForm] = useState(TareaOT);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pedidoView) {
      setNuevaTareaForm((prev) => ({
        ...prev,
        empresaProveedoraId: pedidoView.empresaProveedoraId,
        clienteId: pedidoView.clienteId,
        obraId: pedidoView.obraId,
        contactoId: pedidoView.contactoId,
        cotizacionId: pedidoView.cotizacion_id,
        usuarioId: user.id,
        pedido_id: pedidoView.pedido_id,
        detalles: {
          ...prev.detalles,
          estadoPasePedido: pedidoView.estado,
          numeroVersionContrato: pedidoView.nro_contrato,
          obra: pedidoView.obra ? pedidoView.obra.toUpperCase() : "",
        },
      }));
    }
  }, [pedidoView, user.id]);

  const handleCrearTarea = async () => {
    try {
      const { errores, validos } = validaTarea(nuevaTareaForm.detalles);
      if (!validos) {
        const mensajeError = Object.values(errores).join("\n");
        toast.error(mensajeError);
        return;
      }

      setIsLoading(true);

      const { mensaje, tarea } =
        await pedidosService.nuevaTareaPasePedido(nuevaTareaForm);

      toast.success(mensaje);

      if (tarea) {
        setOpen(false);
        setPedidoView(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al crear la tarea");
    } finally {
      setIsLoading(false);
    }
  };

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
            setNuevaTareaForm={setNuevaTareaForm}
            handleCrearTarea={handleCrearTarea}
            isLoading={isLoading}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
