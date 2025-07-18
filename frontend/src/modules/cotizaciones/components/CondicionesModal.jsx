import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CondicionesCard from "./CondicionesCard";
import { ShieldCheck  } from "lucide-react";
import {
   Tooltip,
   TooltipTrigger,
   TooltipContent,
   TooltipProvider,
} from "@/components/ui/tooltip";

export default function CondicionesModal({ cotizacionId, onActualizarCotizaciones }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <ShieldCheck className="w-4 h-4" />
                    </Button>
                </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
                <p>Valida Las Condiciones de Alquiler</p>
            </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogHeader>
            <DialogTitle> Validar condiciones de alquiler</DialogTitle>
                <DialogDescription>
                </DialogDescription>
            </DialogHeader>
        </DialogHeader>
        
        <CondicionesCard 
            cotizacionId={cotizacionId} 
            onClose={() => setOpen(false)} 
            onActualizarCotizaciones={onActualizarCotizaciones}
        />
      </DialogContent>
    </Dialog>
  );
}