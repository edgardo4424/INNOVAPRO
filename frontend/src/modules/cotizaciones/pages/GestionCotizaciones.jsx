import TablaCotizacion from "../components/TablaCotizacion";
import { useGestionCotizaciones } from "../hooks/useGestionCotizaciones";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrevisualizadorPDF from "../components/PrevisualizadorPDF";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion";
import { AlertDialog, AlertDialogTrigger, AlertDialogTitle, AlertDialogDescription, AlertDialogContent, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

// Este componente es la página que muestra la tabla de cotizaciones y permite la previsualización de PDFs y descarga de cotizaciones.
// Utiliza el hook useGestionCotizaciones para obtener las cotizaciones paginadas y la función de descarga de PDF.
// También maneja el estado de la cotización seleccionada para previsualizar.

export default function GestionCotizaciones() {
   const navigate = useNavigate();

   const {
      cotizaciones,
      confirmarDescargaPDF,
      modalConfirmacion,
      cerrarModal,
      ejecutarDescarga,
      user,
   } = useGestionCotizaciones();
   
   const [cotizacionSeleccionadaId, setCotizacionSeleccionadaId] =
      useState(null);

   const continuarCotizacion = (idCotizacion) => {
      navigate(`/cotizaciones/wizard/${idCotizacion}`);
   }

   const crearContrato = (idCotizacion) => {
      navigate("/contratos/registrar", {
         state: { cotizacionId: idCotizacion },
         replace: false,
      });
   };
   
   return (
      <div className="min-h-full flex-1  flex flex-col items-center">
         <ModuloNavegacion />

         <TablaCotizacion
            data={cotizaciones}   
            onDownloadPDF={confirmarDescargaPDF}
            setCotizacionPrevisualizada={setCotizacionSeleccionadaId}
            onContinuarWizard={continuarCotizacion}
            onCrearContrato={crearContrato}
            user={user}
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
