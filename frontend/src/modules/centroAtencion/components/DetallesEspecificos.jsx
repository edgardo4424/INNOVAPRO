import {
  Settings,
  Package,
  Anchor,
  Home,
  FileText,
  Truck,
  Clock,
  ClipboardList,
  Construction,
  ClipboardCheck,
  ShieldCheck,
  Layers3,
  Send,
  Hammer,
  BookMarked,
  FileSignature,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const DetallesEspecificos = ({detalles}) => {

  if (typeof detalles === "string") {
    try {
      detalles = JSON.parse(detalles);
    } catch (error) {
      console.error("Error al parsear los detalles:", error);
      return null;
    }
  }

  if (!detalles || Object.keys(detalles).length === 0) return null;

  const orden = [
    "apoyoTecnico",
    "apoyoAdministrativo",
    "tipoServicio",
    "estadoPasePedido",
    "numeroVersionContrato",
    "despacho",
    "tipoOperacion",
    "estadoHabilitacion",
    "obraNueva",
    "valorizacionAdelantada",
    "transporte",
    "fechaEntrega",
    "horaEntrega",
    "adaptarMotor",
    "tipoServicioColgante",
    "valorizacion",
    "envioCliente",
    "tipoModulacion",
    "tipoEquipo",
    "plataformado",
    "anclajes",
    "uso",
    "infoAdicional",
    "nota",
  ];

  const iconos = {
    apoyoTecnico: <Settings className="h-4 w-4 text-purple-500" />,
    apoyoAdministrativo: <ClipboardList className="h-4 w-4 text-purple-500" />,
    tipoServicio: <ClipboardCheck className="h-4 w-4 text-purple-500" />,
    estadoPasePedido: <FileSignature className="h-4 w-4 text-purple-500" />,
    numeroVersionContrato: <BookMarked className="h-4 w-4 text-purple-500" />,
    despacho: <Send className="h-4 w-4 text-purple-500" />,
    tipoOperacion: <Hammer className="h-4 w-4 text-purple-500" />,
    estadoHabilitacion: <ShieldCheck className="h-4 w-4 text-purple-500" />,
    obraNueva: <Construction className="h-4 w-4 text-purple-500" />,
    valorizacionAdelantada: <Layers3 className="h-4 w-4 text-purple-500" />,
    transporte: <Truck className="h-4 w-4 text-purple-500" />,
    fechaEntrega: <Clock className="h-4 w-4 text-purple-500" />,
    horaEntrega: <Clock className="h-4 w-4 text-purple-500" />,
    adaptarMotor: <Settings className="h-4 w-4 text-purple-500" />,
    tipoServicioColgante: <Package className="h-4 w-4 text-purple-500" />,
    valorizacion: <Layers3 className="h-4 w-4 text-purple-500" />,
    envioCliente: <Send className="h-4 w-4 text-purple-500" />,
    tipoModulacion: <Settings className="h-4 w-4 text-purple-500" />,
    tipoEquipo: <Package className="h-4 w-4 text-purple-500" />,
    plataformado: <Package className="h-4 w-4 text-purple-500" />,
    anclajes: <Anchor className="h-4 w-4 text-purple-500" />,
    uso: <Home className="h-4 w-4 text-purple-500" />,
    infoAdicional: <FileText className="h-4 w-4 text-purple-500" />,
    nota: <FileText className="h-4 w-4 text-yellow-600" />,
  };

  const detallesFiltrados = Object.entries(detalles).filter(
    ([key]) => key !== "nota"
  );

  return (
    <Card className="border-l-4 border-l-purple-500 gap-3">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-purple-500">
          <Settings className="h-6 w-6" />
          Detalles Específicos
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {[0, 1].map((col) => (
            <div className="space-y-4" key={col}>
              {detallesFiltrados
                .sort(([a], [b]) => {
                  const ia = orden.indexOf(a);
                  const ib = orden.indexOf(b);
                  if (ia === -1 && ib === -1) return a.localeCompare(b);
                  if (ia === -1) return 1;
                  if (ib === -1) return -1;
                  return ia - ib;
                })
                .filter((_, i) => i % 2 === col)
                .map(([key, value], idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {iconos[key] || (
                        <Settings className="h-4 w-4 text-purple-500" />
                      )}
                      <span className="font-medium text-gray-700">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (s) => s.toUpperCase())}
                        :
                      </span>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      {Array.isArray(value) ? value.join(", ") : value}
                    </p>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Nota especial */}
        {detalles.nota && (
          <>
            <Separator className="my-6" />
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {iconos.nota}
                <span className="font-medium text-yellow-800">Nota:</span>
              </div>
              <p className="text-yellow-900 font-mono text-sm bg-yellow-100 p-2 rounded">
                {detalles.nota}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
