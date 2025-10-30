import TablaContratos from "../components/TablaContratos";
import { useGestionContratos } from "../hooks/useGestionContratos";
import { useNavigate } from "react-router-dom";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Si ya tienes un previsualizador para contratos, usa ese.
// Caso contrario, comenta la siguiente línea y el bloque de render al final.
//import PrevisualizadorPDFContrato from "../components/PrevisualizadorPDFContrato";

export default function GestionContratos() {
  const navigate = useNavigate();

  const {
    contratos,
    solicitarPasePedido,
    modalConfirmacion,
    cerrarModal,
    ejecutarDescarga,
    solicitarCondiciones,
    user,
  } = useGestionContratos();

  const verDetalleContrato = (idContrato) => {
    navigate(`/contratos/${idContrato}`);
  };

  return (
    <div className="min-h-full flex-1 flex flex-col items-center">
      <ModuloNavegacion />

      <TablaContratos
        data={contratos}
     
        onSolicitarPasePedido={solicitarPasePedido}
       
       
        onSolicitarCondicionesAlquiler={solicitarCondiciones}
        onVerDetalle={verDetalleContrato}
        user={user}
      />

      <AlertDialog open={modalConfirmacion.abierto} onOpenChange={cerrarModal}>
        <AlertDialogTrigger asChild>{/* Trigger oculto */}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>¿Deseas descargar el PDF?</AlertDialogTitle>
          <AlertDialogDescription>
            Se descargará el archivo PDF con los datos completos del contrato seleccionado.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={ejecutarDescarga}>
              Sí, descargar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* {contratoSeleccionadoId && (
        <PrevisualizadorPDFContrato contratoId={contratoSeleccionadoId} />
      )} */}
    </div>
  );
}