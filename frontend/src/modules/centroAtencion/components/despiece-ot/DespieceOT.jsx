import { useState } from "react";
import { toast } from "react-toastify";
import DespieceAdicional from "./DespieceAdicional";
import { Button } from "@/components/ui/button";
import { crearDespieceOT } from "../../services/centroAtencionService";
import ResumenDespieceManual from "./ResumenDespieceManual";

export default function DespieceOT({ tarea, formData, setFormData }) {

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">🧱 Crear Despiece Manual</h3>

      <DespieceAdicional formData={formData} setFormData={setFormData} />
      <ResumenDespieceManual despiece={formData.despiece} resumen={formData.resumenDespiece} />

    </div>
  );
}