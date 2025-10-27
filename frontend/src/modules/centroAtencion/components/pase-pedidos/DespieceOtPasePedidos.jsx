import { BrickWall } from "lucide-react";
import ResumenDespieceManual from "../despiece-ot/ResumenDespieceManual";
import DespieceAdicionalPP from "./DespieceAdicionalPP";

export default function DespieceOtPasePedidos({
  formData,
  setFormData,
  piezasObtenidas = [],
}) {
  return (
    <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 className="text-lg font-semibold text-gray-700 flex gap-x-2">
        <BrickWall  className="text-orange-500"/> <span>Lista de Piezas</span>
      </h3>
{/* 
      <DespieceAdicionalPP
        formData={formData}
        setFormData={setFormData}
        piezasObtenidas={piezasObtenidas}
      /> */}
      <ResumenDespieceManual
        despiece={formData.despiece}
        resumen={formData.resumenDespiece}
      />
    </div>
  );
}
