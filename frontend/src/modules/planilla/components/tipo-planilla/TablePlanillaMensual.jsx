import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";

import { Search } from "lucide-react";
import RowPlanillaMensual from "./RowPlanillaMensual";
import RowTotalPlanillaMensual from "./RowTotalPlanillaMensual";
import { Button } from "@/components/ui/button";
import ModalImportesTrabajador from "./ModalmportesTrabajador";

/* import RowGratificacion from "@/modules/gratificacion/components/RowGratificacion";
import RowTotalGratificacion from "@/modules/gratificacion/components/RowTotalGratificacion"; */

const TablePlanillaMensual = ({
   planillaMensualTipoPlanilla,
   filiales,
   filial_id,
   importes,
   setImportes,
   datosTotalesPlanilla
}) => {
   const [filtro, setFiltro] = useState("");

   // Filtrar por nombres y apellidos (case-insensitive)
   const filtrarTrabajadores = (trabajadores) =>
      trabajadores.filter((t) =>
         `${t.nombres} ${t.apellidos}`
            .toLowerCase()
            .toLowerCase()
            .includes(filtro?.toLowerCase())
      );

   return (
      <div className="w-full overflow-x-auto p-5 mb-10 flex flex-col bg-gray-100 border-2 rounded-xl shadow-xl">
         <h1 className="text-2xl font-bold pb-6">Planilla</h1>
         <section className="grid grid-cols-4 space-x-3">
            <div className="relative col-span-3">
               <Input
                  type="search"
                  className="block w-full appearance-none px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar por nombres"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
               />
               <Search className="absolute right-3 top-1 text-gray-400" />
            </div>
            <div className="col-span-1 flex justify-center">
               {filiales?.length > 0 && filial_id && (
                  <ModalImportesTrabajador
                     importes={importes}
                     setImportes={setImportes}
                     filial_id={filial_id}
                     filiales={filiales}
                  />
               )}
            </div>
         </section>

         <div className="py-4">
            <Table>
               {/* <TableCaption>A list of your recent invoices.</TableCaption> */}

               <TableHeader>
                  <TableRow className={"bg-gray-800 text-xs "}>
                     {/* Estas celdas abarcan 2 filas porque no tienen sub-encabezados */}
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Acciones
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Tipo Doc
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        N° Doc
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Nombres y Apellidos
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Área
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        AFP
                     </TableHead>

                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Fecha Ingreso
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Dias Labor
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Sueldo Base
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Sueldo Mensual
                     </TableHead>

                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Asig. Fam.
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Descanso Méd
                     </TableHead>

                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Lic. con Goce de Haber
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Lic. sin Goce de Haber
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Vacaciones
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Vacaciones vendidas
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Gratificación
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        CTS
                     </TableHead>

                     <TableHead
                        colSpan={2}
                        className="text-center border-r h-5 text-white border-black"
                     >
                        Prom. H. Extras.
                     </TableHead>

                     {/* <TableHead colSpan={2} className="text-center border-r h-5 text-white border-black">Salida a Obra</TableHead> */}

                     <TableHead
                        colSpan={2}
                        className="text-center border-r h-5 text-white border-black"
                     >
                        Importe Faltas
                     </TableHead>

                     <TableHead
                        colSpan={2}
                        className="text-center border-r h-5 text-white border-black"
                     >
                        Importe Tardanzas
                     </TableHead>

                     <TableHead
                        colSpan={2}
                        className="text-center border-r h-5 text-white border-black"
                     >
                        Prom. Bonos
                     </TableHead>

                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Sueldo Bruto
                     </TableHead>

                     {/* Grupo DESCUENTOS AL TRABAJADOR ocupa 5 columnas */}
                     <TableHead
                        colSpan={5}
                        className="text-center border-r h-5 text-white border-black"
                     >
                        DESCUENTOS AL TRABAJADOR
                     </TableHead>

                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Total Descuentos
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Sueldo Neto
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Sueldo Quincenal
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Adelanto / Préstamo
                     </TableHead>

                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Saldo por Pagar
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        ESSALUD 9%
                     </TableHead>

                     <TableHead
                        colSpan={3}
                        className="text-center border-r h-5 text-white border-black"
                     >
                        APORTES AL TRABAJADOR
                     </TableHead>
                  </TableRow>

                  {/* Sub-encabezados del grupo FALTAS */}
                  <TableRow className={"bg-gray-800 text-xs "}>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        1era Quincena
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        2da Quincena
                     </TableHead>

                     {/* <TableHead rowSpan={2} className="text-center border-r text-white border-black">1era Quincena</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">2da Quincena</TableHead> */}

                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        1era Quincena
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        2da Quincena
                     </TableHead>

                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        1era Quincena
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        2da Quincena
                     </TableHead>

                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        1era Quincena
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        2da Quincena
                     </TableHead>

                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        ONP
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        AFP Ap. Oblig
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Seguro
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Comisión
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        5ta Categ.
                     </TableHead>

                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        Seguro Vida Ley %
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        SCTR Salud %
                     </TableHead>
                     <TableHead
                        rowSpan={2}
                        className="text-center border-r text-white border-black"
                     >
                        SCTR Pension %
                     </TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {/* Render Trabajadores Planilla */}
                  {planillaMensualTipoPlanilla.length > 0 && (
                     <>
                        {filtrarTrabajadores(planillaMensualTipoPlanilla).map(
                           (e, index) => (
                              <RowPlanillaMensual
                                 key={index}
                                 e={e}
                                 index={index}
                              />
                           )
                        )}
                        <RowTotalPlanillaMensual datosTotalesPlanilla={datosTotalesPlanilla} />
                     </>
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   );
};

export default TablePlanillaMensual;
