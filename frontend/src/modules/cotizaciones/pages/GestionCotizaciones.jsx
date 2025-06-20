import TablaCotizacion from "../components/TablaCotizacion";
import { useGestionCotizaciones } from "../hooks/useGestionCotizaciones";
import { useState } from "react";
import PrevisualizadorPDF from "../components/PrevisualizadorPDF";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion";
import { AlertDialog, AlertDialogTrigger, AlertDialogTitle, AlertDialogDescription, AlertDialogContent, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

// Este componente es la página que muestra la tabla de cotizaciones y permite la previsualización de PDFs y descarga de cotizaciones.
// Utiliza el hook useGestionCotizaciones para obtener las cotizaciones paginadas y la función de descarga de PDF.
// También maneja el estado de la cotización seleccionada para previsualizar.

export default function GestionCotizaciones() {

   const {
      cotizacionesPaginados,
      confirmarDescargaPDF,
      modalConfirmacion,
      cerrarModal,
      ejecutarDescarga,
   } = useGestionCotizaciones();

   const [cotizacionSeleccionadaId, setCotizacionSeleccionadaId] =
      useState(null);

   return (
      <div className="min-h-full flex-1  flex flex-col items-center">
         <ModuloNavegacion />

         <TablaCotizacion
            cotizaciones={cotizacionesPaginados}
            onDownloadPDF={confirmarDescargaPDF}
            setCotizacionPrevisualizada={setCotizacionSeleccionadaId}
         />

          <AlertDialog open={modalConfirmacion.abierto} onOpenChange={cerrarModal}>
            <AlertDialogTrigger asChild>
               
            </AlertDialogTrigger>

            <AlertDialogContent>

               <AlertDialogTitle>¿Deseas descargar el PDF?</AlertDialogTitle>

               <AlertDialogDescription>
                     Se descargará el archivo PDF con los datos completos de la cotización seleccionada.
               </AlertDialogDescription>

               <AlertDialogFooter >
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={ejecutarDescarga}>Sí, descargar</AlertDialogAction>
               </AlertDialogFooter>

            </AlertDialogContent>
            </AlertDialog>

         {cotizacionSeleccionadaId && (
            <PrevisualizadorPDF cotizacionId={cotizacionSeleccionadaId} />
         )}
      </div>
   );
}
