import { useState } from "react";
import { Button } from "@/components/ui/button";
import CondicionesCard from "./CondicionesCard";
import { ShieldCheck  } from "lucide-react";
import {
   Tooltip,
   TooltipTrigger,
   TooltipContent,
   TooltipProvider,
} from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function CondicionesModal({ contratoId, onActualizarCotizaciones }) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <ShieldCheck className="w-4 h-4" />
                    </Button>
                </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
                <p>Valida Las Condiciones de Alquiler</p>
            </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogHeader>
            <AlertDialogTitle> Validar condiciones de alquiler</AlertDialogTitle>
                <AlertDialogDescription>
                </AlertDialogDescription>
            </AlertDialogHeader>
        </AlertDialogHeader>
        
        <CondicionesCard 
            contratoId={contratoId} 
            onClose={() => setOpen(false)} 
            onActualizarCotizaciones={onActualizarCotizaciones}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}