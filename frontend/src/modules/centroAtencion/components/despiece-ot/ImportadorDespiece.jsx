
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, FileSpreadsheet, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import ResumenDespieceManual from "./ResumenDespieceManual";
import useImportadorDespiece from "../../hooks/useImportadorDespiece";
import centroAtencionService from "../../services/centroAtencionService";

export default function ImportadorDespiece({ tarea, formData, setFormData }) {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const {
    procesarArchivo,
    limpiarArchivo,
    cargarDesdeExcel,
  } = useImportadorDespiece({ tarea, setFormDataExterno: setFormData });

  const handleProcesar = async () => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    await procesarArchivo(file, ext);
  };

  const handleGuardarDespiece = async () => {
    if (!formData.despiece || formData.despiece.length === 0) return;

    console.log("Guardando despiece importado:", formData.despiece);
    const payload = {
      idTarea: tarea.id,
      despiece: formData.despiece.map((p) => ({
        pieza_id: p.pieza_id,
        item: p.item,
        cantidad: p.cantidad,
        peso_kg: p.peso_kg,
        precio_venta_dolares: p.precio_venta_dolares,
        precio_venta_soles: p.precio_venta_soles,
        precio_alquiler_soles: p.precio_alquiler_soles,
      })),
    };

    try {
      /* const data = await crearDespieceOT(payload);
      limpiarArchivo();
      onDespieceCreado(); */
    } catch (error) {
      console.error("Error al guardar despiece importado", error);
    }
  };

  return (
    <Card className="bg-gray-50 border border-dashed border-gray-300">
      <CardContent className="p-6">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            setFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
          <h3 className="font-semibold">Arrastra tu archivo aquí</h3>
          <p className="text-sm text-muted-foreground">
            o haz clic para seleccionar.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv,.xml"
          onChange={async (e) => {
            const nuevoArchivo = e.target.files[0];
            if (!nuevoArchivo) return;
            setFile(nuevoArchivo);

            const ext = nuevoArchivo.name.split(".").pop().toLowerCase();
            await procesarArchivo(nuevoArchivo, ext);
          }}
          className="hidden"
        />


        {file && (
          <div className="mt-6">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {file.name.endsWith(".csv") || file.name.endsWith(".xml") ? (
                  <FileText className="w-4 h-4" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {`${(file.size / 1024).toFixed(2)} KB`}
                  </p>
                </div>
                <Badge>{file.name.split(".").pop().toUpperCase()}</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              <Button onClick={handleProcesar}>Procesar archivo</Button>
            </div>

            <ResumenDespieceManual
              despiece={formData.despiece}
              resumen={formData.resumenDespiece}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}