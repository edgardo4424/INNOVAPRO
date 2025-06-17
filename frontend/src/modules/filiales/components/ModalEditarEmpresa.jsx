// import EmpresaForm from "../forms/EmpresaForm";

// export default function ModalEditarEmpresa({ empresa, setEmpresa, onCancel, onSubmit }) {
//   return (
//     <div className="centro-modal">
//       <div className="modal-content">
//         <h3>Editar Filial</h3>
//         <EmpresaForm
//           empresa={empresa}
//           setEmpresa={setEmpresa}
//           onCancel={onCancel}
//           onSubmit={onSubmit}
//         />
//       </div>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import EmpresaForm from "../forms/EmpresaForm";

export default function ModalEditarEmpresa({ onSubmit, empresa }) {
   const [open, setOpen] = useState(false);

   const handleCancel = (e) => {
      e.preventDefault();
      setOpen(false);
   };
   
   const handleClose = () => setOpen(false);

   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Button
               variant="outline"
               size={"icon"}
               className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            >
               <Edit className="h-4 w-4" />
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Editar usuario</AlertDialogTitle>
            </AlertDialogHeader>
            <EmpresaForm
               data={empresa}
               onSubmit={onSubmit}
               closeModal={handleClose}
               handleCancel={handleCancel}
            />
         </AlertDialogContent>
      </AlertDialog>
   );
}
