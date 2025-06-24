// INNOVA PRO+ v1.3.4 - Placeholder ImportadorDespiece

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp } from "lucide-react";

export default function ImportadorDespiece({ tarea }) {
  return (
    <Card className="bg-gray-50 border border-dashed border-gray-300">
      <CardHeader>
        <CardTitle className="text-md flex items-center gap-2 text-gray-700">
          <FileUp className="w-4 h-4" />
          Importador de Despiece (próximamente)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-600">
        Esta funcionalidad permitirá cargar un archivo con el despiece completo.
        <br />
        <span className="italic text-gray-400">En desarrollo por Jeampierk.</span>
      </CardContent>
    </Card>
  );
}