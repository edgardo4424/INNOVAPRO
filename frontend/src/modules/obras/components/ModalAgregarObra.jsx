import { useState } from "react";
import ObraForm from "../forms/ObraForm";
import { Button } from "@/components/ui/button";
import { BadgePlus, X } from "lucide-react";

export default function ModalAgregarObra({ onSubmit }) {
   const [open, setOpen] = useState(false);

   const handleCancel = (e) => {
      e.preventDefault();
      setOpen(false);
   };

   const handleClose = () => setOpen(false);

   return (
      <>
         <Button className="btn-agregar" onClick={() => setOpen(true)}>
            <BadgePlus />
            <span className="hidden md:block">Agregar Obra</span>
         </Button>

         {open && (
            <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50"
               onClick={handleClose}
            >
               <div
                  className="relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6"
                  onClick={(e) => e.stopPropagation()}
               >
                  {/* Botón de cerrar en la esquina superior derecha */}
                  <button
                     onClick={handleClose}
                     className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                  >
                     <X className="w-5 h-5" />
                  </button>

                  <div className="mb-4 text-center">
                     <h2 className="text-lg font-semibold">Crear obra</h2>
                     <p className="text-sm text-gray-500">
                        Completa los datos correctamente para crear una obra
                     </p>
                  </div>

                  <ObraForm
                     modo="crear"
                     closeModal={handleClose}
                     handleCancel={handleCancel}
                     onSubmit={onSubmit}
                  />
               </div>
            </div>
         )}
      </>
   );
}
