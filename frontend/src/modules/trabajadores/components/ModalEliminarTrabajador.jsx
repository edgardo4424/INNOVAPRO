import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Circle, CircleAlert, CircleX, Trash2 } from "lucide-react";
import { useState } from "react";

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const ModalEliminarTrabajador = ({ trabajador }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const handleConfirm = async() => {
    // onConfirm?.()
    console.log("Eniando data");
    setisLoading(true)
    await esperar(5000);
    console.log("Se termina el timer");
    setisLoading(false)
    
    // setOpen(false);
  };

  const handleCancel = () => {
    // onCancel?.()
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" className="gap-2">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="relative">
             <div className="absolute inset-0 bg-red-500/40 rounded-full blur-xl" />
              <div className="size-12 flex items-center justify-center bg-none" >
                   <CircleX className="text-red-600 size-10"/>
              </div>
            </div>
          </div>

          <AlertDialogTitle className="text-2xl">
            ¿Eliminar empleado?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <article className="flex w-auto flex-col space-y-4 pt-2">
          <p className="text-base">
              Esta acción eliminará permanentemente al empleado:
            </p>

          <div className="space-y-3 rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-4 dark:border-red-900/50 dark:from-red-950/30 dark:to-orange-950/30">
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Nombre
                </p>
                <p className="text-foreground text-lg font-bold">
                  {trabajador.nombres} {trabajador.apellidos}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    {trabajador.tipo_documento}
                  </p>
                  <p className="text-foreground font-mono font-semibold">
                    {trabajador.numero_documento}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Área
                  </p>
                  <p className="text-foreground font-semibold">
                    {trabajador.area}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Cargo
                </p>
                <p className="text-foreground font-semibold">
                  {trabajador.cargo}
                </p>
              </div>
            </div>

          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="mt-0.5 text-amber-600 dark:text-amber-400">
                ⚠️
              </div>
              <p className="text-sm text-amber-900 dark:text-amber-200">
                Esta acción{" "}
                <span className="font-semibold">no se puede deshacer</span>.
                Todos los datos asociados al empleado serán eliminados
                permanentemente.
              </p>
            </div>
        </article>

        <AlertDialogFooter className="gap-3 pt-2">
          <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Eliminar empleado
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalEliminarTrabajador;
