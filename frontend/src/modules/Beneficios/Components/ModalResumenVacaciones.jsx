import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ResumenVacacionesDialog({
  total_generado,
  total_tomado,
  total_vendido,
  dias_disponibles,
  dias_tomar,
  dias_vender,
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Ver resumen de vacaciones</Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Resumen de vacaciones</AlertDialogTitle>
          <AlertDialogDescription>
            Estado detallado de los días generados, tomados y vendidos.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Card original embebida */}
        <Card className="shadow-sm border-primary/20">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-4">
              {/* Generated Days */}
              <div className="space-y-2 col-span-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total generado:
                  </span>
                  <Badge variant="outline" className="font-mono">
                    {total_generado.toFixed(0)} días
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total tomado:
                  </span>
                  <Badge variant="outline" className="font-mono">
                    {total_tomado.toFixed(0)} días
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total vendido:
                  </span>
                  <Badge variant="outline" className="font-mono">
                    {total_vendido.toFixed(0)} días
                  </Badge>
                </div>
              </div>

              <Separator orientation="vertical" className="hidden lg:block" />

              {/* Available Days */}
              <div className="space-y-2 col-span-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Días disponibles:
                  </span>
                  <Badge className="bg-primary text-primary-foreground font-mono">
                    {dias_disponibles.toFixed(0)} días
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Puedes aún tomar:
                  </span>
                  <Badge variant="secondary" className="font-mono">
                    {dias_tomar.toFixed(0)} días
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Puedes aún vender:
                  </span>
                  <Badge variant="secondary" className="font-mono">
                    {dias_vender.toFixed(0)} días
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
                <div className="flex justify-end pt-4">
          <AlertDialogCancel asChild>
            <Button variant="ghost">Cerrar</Button>
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
