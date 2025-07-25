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

export const DetallesEspecificos = ({ detalles }) => {
  if (typeof detalles === "string") {
    try {
      detalles = JSON.parse(detalles);
    } catch (error) {
      console.error("Error al parsear los detalles:", error);
      return null;
    }
  }

  if (!detalles || Object.keys(detalles).length === 0) return null;

  const USOS_NOMBRE = {
    1: "ANDAMIO DE FACHADA",
    2: "ANDAMIO DE TRABAJO",
    3: "ESCALERA DE ACCESO",
    4: "ESCUADRAS",
    5: "PUNTALES"
  }

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
    "usoId",
    "tipo_cotizacion",
    "notaDespiece",
    "dias_alquiler",
    "atributos_valor_zonas",
  ];

  const labels = {
    apoyoTecnico: "Apoyo Técnico",
    apoyoAdministrativo: "Apoyo Administrativo",
    tipoServicio: "Tipo de Servicio",
    estadoPasePedido: "Estado Pase Pedido",
    numeroVersionContrato: "Versión de Contrato",
    despacho: "Despacho",
    tipoOperacion: "Tipo de Operación",
    estadoHabilitacion: "Estado de Habilitación",
    obraNueva: "Obra Nueva",
    valorizacionAdelantada: "Valorización Adelantada",
    transporte: "Transporte",
    fechaEntrega: "Fecha de Entrega",
    horaEntrega: "Hora de Entrega",
    adaptarMotor: "Adaptar Motor",
    tipoServicioColgante: "Servicio Colgante",
    valorizacion: "Valorización",
    envioCliente: "Envío al Cliente",
    tipoModulacion: "Tipo de Modulación",
    tipoEquipo: "Tipo de Equipo",
    plataformado: "Plataformado",
    anclajes: "Anclajes",
    uso: "Uso",
    infoAdicional: "Información Adicional",
    nota: "Nota",
    usoId: "Uso Asociado",
    tipo_cotizacion: "Tipo de Cotización",
    notaDespiece: "Nota del Despiece",
    dias_alquiler: "Días de alquiler",
    atributos_valor_zonas: "Zonas y Atributos",
  };

  const atributosLabels = {
    ancho: "Ancho (mm)",
    altura: "Altura (m)",
    longitud: "Longitud (mm)",
    paraIzaje: "¿Es para izaje?",
    tipoApoyo: "Tipo de Apoyo",
    tuboAmarre: "¿Tubo de Amarre?",
    tipoRodapie: "Tipo de Rodapié",
    cantPlataforma: "Cantidad de Plataformas",
    tipoPlataforma: "Tipo de Plataforma",
    diagonalLongitud: "Diagonal de Longitud",
    plataformaAcceso: "Plataforma de Acceso",
    tripode: "¿Incluye trípode?",
    cantidad: "Cantidad",
    tipoPuntal: "Tipo de puntal"
  };


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
    tipo_cotizacion: <Settings className="h-4 w-4 text-purple-500" />,
    dias_alquiler: <Clock className="h-4 w-4 text-purple-500" />,
    atributos_valor_zonas: <Package className="h-4 w-4 text-purple-500" />,
  };

  const detallesOrdenados = Object.entries(detalles)
    .filter(([key]) => key !== "nota")
    .sort(([a], [b]) => {
      const ia = orden.indexOf(a);
      const ib = orden.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
  });
console.log('detallesOrdenados', detallesOrdenados);

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
              {detallesOrdenados
                .filter((_, i) => i % 2 === col)
                .map(([key, value], idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {iconos[key] || <Settings className="h-4 w-4 text-purple-500" />}
                      <span className="font-medium text-gray-700">
                        {labels[key] ||
                          key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                        :
                      </span>
                    </div>
                    {key === "atributos_valor_zonas" ? (
                      value.map((zona, index) => (
                        <div key={index} className="mb-4">
                          <p className="font-bold text-purple-700 mb-2">📍 Zona {zona.zona}</p>
                          <table className="w-full text-sm border">
                            <thead>
                              <tr className="bg-purple-50 text-purple-800 border-b">
                                <th className="text-left p-2">Atributo</th>
                                <th className="text-left p-2">Valor</th>
                              </tr>
                            </thead>
                            <tbody>
                              {zona.atributos_formulario &&
                                zona.atributos_formulario.map((grupo, i) =>
                                  Object.entries(grupo).map(([k, v], j) => (
                                    <tr key={`${i}-${j}`} className="border-t">
                                      <td className="p-2 text-gray-700">
                                        {atributosLabels[k] || k}
                                      </td>
                                      <td className="p-2 text-gray-900 font-medium">{v || "—"}</td>
                                    </tr>
                                  ))
                                )}
                            </tbody>
                          </table>
                        </div>
                      ))
                    ) : typeof value === "object" && !Array.isArray(value) ? (
                      value.map((v, i) => (
                        <pre
                          key={i}
                          className="text-xs text-gray-700 bg-gray-100 p-2 rounded mb-2 overflow-x-auto"
                        >
                          {JSON.stringify(v, null, 2)}
                        </pre>
                      ))
                    ) : (
                      <p className="text-gray-900 font-semibold">
                        {key === "usoId"
                          ? USOS_NOMBRE[value] || `Uso #${value}`
                          : Array.isArray(value)
                          ? value.join(", ")
                          : value}
                      </p>
                    )}
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