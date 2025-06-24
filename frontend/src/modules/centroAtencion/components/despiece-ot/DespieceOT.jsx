import { useState } from "react";
import { toast } from "react-toastify";
import DespieceAdicional from "./DespieceAdicional";
import { Button } from "@/components/ui/button";
import { crearDespieceOT } from "../../services/centroAtencionService";
import ResumenDespieceManual from "./ResumenDespieceManual";

export default function DespieceOT({ tarea, onDespieceCreado }) {
  const [formData, setFormData] = useState({
    despiece: [],
    resumenDespiece: {}
  });

  const handleCrearDespiece = async () => {
    if (!formData.despiece || formData.despiece.length === 0) {
      toast.error("Agrega al menos una pieza al despiece.");
      return;
    }

    const payload = {
      idTarea: tarea.id,
      despiece: formData.despiece.map(p => ({
        pieza_id: p.pieza_id,
        cantidad: p.cantidad,
        peso_kg: p.peso_kg,
        precio_venta_dolares: p.precio_venta_dolares,
        precio_venta_soles: p.precio_venta_soles,
        precio_alquiler_soles: p.precio_alquiler_soles,
      }))
    };
    console.log("Datos enviados para generar TAREA:", payload)
    try {
      const data = await crearDespieceOT(payload);
      toast.success(data.mensaje || "Despiece creado correctamente.");
      onDespieceCreado();
      setFormData({ despiece: [], resumenDespiece: {} });
    } catch (error) {
      console.error("Error creando despiece OT:", error);
      toast.error("Error al crear despiece");
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">🧱 Crear Despiece Manual</h3>

      <DespieceAdicional formData={formData} setFormData={setFormData} />
      <ResumenDespieceManual despiece={formData.despiece} resumen={formData.resumenDespiece} />


      <Button
        onClick={handleCrearDespiece}
        className="bg-[#061a5b] hover:bg-[#061a5b]/80 text-white w-full"
      >
        Guardar Despiece
      </Button>
    </div>
  );
}