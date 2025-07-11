import { useEffect, useState } from "react";
import asistenciaService from "../services/asistenciaService";
import AsistenciaHeader from "../components/AsistenciaHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JornadaCard from "../components/JornadaCard";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import BadgeEstadoAsistencia from "../components/BadgeEstadoAsistencia";

const AsistenciaAndamiosElectricos = () => {
   const IDRAZONSOCIAL = 2;
   const [fechaSeleccionada, setFechaSeleccionada] = useState(
      new Date().toISOString().split("T")[0]
   );
   const [trabajadores, setTrabajadores] = useState([]);
   const obtenerTrabajadoresPorFilial = async () => {
      const response = await asistenciaService.obtenerTrabajadoresPorFilial(
         IDRAZONSOCIAL
      );
      // setTrabajadores(trab);
   setTrabajadores(response.data.trabajadores);

   };
   useEffect(() => {
      obtenerTrabajadoresPorFilial();
   }, []);

   const estadisticas = {
      presentes: 8,
      ausentes: 9,
      tardanzas: 7,
      doble_turno: 4,
   };
   return (
      <div className="min-h-full flex-1  flex flex-col items-center p-8">
         <div className="max-w-7xl mx-auto space-y-6  w-full">
            <AsistenciaHeader
               trabajadores={trabajadores}
               estadisticas={estadisticas}
               fechaSeleccionada={fechaSeleccionada}
               setFechaSeleccionada={setFechaSeleccionada}
               title={"Andamios Eléctricos"}
            />
            <div className="space-y-6">
               {trabajadores.map((trabajador) => (
                  <Card key={trabajador.id}>
                     <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                           <div>
                              <h3 className="text-lg font-semibold">
                                 {trabajador.nombres} {trabajador.apellidos}
                              </h3>
                              <p className="text-sm text-gray-600">
                                 {trabajador.tipo_documento}:{" "}
                                 {trabajador.numero_documento}
                              </p>
                           </div>
                           <div>
                              <BadgeEstadoAsistencia trabajador={trabajador} />
                           </div>
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                           {/* <JornadaCard trabajador={trabajador} /> */}
                           <JornadaCard trabajador={trabajador} />
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>
      </div>
   );
};
export default AsistenciaAndamiosElectricos;

// {
//   "id": 4,
//   "filial_id": 2,
//   "nombres": "Carlos",
//   "apellidos": "Ramírez",
//   "tipo_documento": "DNI",
//   "numero_documento": "12345678",
//   "fecha_ingreso": "2024-06-15",
//   "fecha_salida": null,
//   "sueldo_base": 2800,
//   "asignacion_familiar": true,
//   "sistema_pension": "AFP",
//   "quinta_categoria": false,
//   "estado": "activo",
//   "asistencia": {
//     "id": 1,
//     "trabajador_id": 4,
//     "fecha": "2025-07-11T15:00:00.000Z",
//     "horas_trabajadas": 5.5,
//     "estado_asistencia": "falto",
//     "gastos": [
//       {
//         "id": 1,
//         "asistencia_id": 1,
//         "descripcion": "El empleado Gomes tubo que pagar taxi par trasladar EPP",
//         "monto": "16"
//       }
//     ],
//     "jornadas": [
//       {
//         "id": 1,
//         "asistencia_id": 1,
//         "tipo_trabajo_id": 6,
//         "turno": "mañana",
//         "lugar": "obra",
//         "tipo_trabajo": {
//           "id": 6,
//           "nombre": "Elevadores"
//         }
//       }
//     ]
//   }
// }