import { Button } from "@/components/ui/button";
import UsuarioForm from "../forms/UsuarioForm";
import { X } from "lucide-react";

export default function ModalAgregarUsuario({
   usuario,
   setUsuario,
   onCancel,
   onSubmit,
   errores,
}) {
   return (
      <div className="centro-modal" onClick={onCancel}>
         <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Button
               variant={"outline"}
               size={"icon"}
               className="absolute z-50 top-0 right-0 -translate-y-1/3 translate-x-1/3 "
               onClick={onCancel}
            >
               <X />
            </Button>
            <div className="flex flex-col items-center  text-center">
              <h2 className="text-xl text-neutral-900">Crear Usuario</h2>
            <p className="text-xs text-neutral-900/70">Completa los datos correctamente para crear un usuario</p>
            </div>
            <UsuarioForm
               modo="crear"
               usuario={usuario}
               setUsuario={setUsuario}
               onCancel={onCancel}
               onSubmit={onSubmit}
               errores={errores}
            />
            
         </div>
      </div>
   );
}
