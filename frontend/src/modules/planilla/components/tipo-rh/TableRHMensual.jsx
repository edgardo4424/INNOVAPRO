
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
import RowRHMensual from "./RowRHMensual";

/* import RowGratificacion from "@/modules/gratificacion/components/RowGratificacion";
import RowTotalGratificacion from "@/modules/gratificacion/components/RowTotalGratificacion"; */

const TablePlanillaMensual = ({ planillaMensualTipoRh, total }) => {

  const [filtro, setFiltro] = useState("");
 
  // Filtrar por nombres y apellidos (case-insensitive)
  const filtrarTrabajadores = (trabajadores) =>
    trabajadores.filter((t) =>
        `${t.nombres} ${t.apellidos}`
               .toLowerCase().toLowerCase().includes(filtro?.toLowerCase())
    );


  return (
    <div className="w-full overflow-x-auto p-5  flex flex-col bg-gray-100 border-2 rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold pb-6">Recibo por honorarios</h1>
      <div className="relative">
        <Input
          type="search"
          className="block w-full appearance-none px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Buscar por nombres"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <Search className="absolute right-3 top-1 text-gray-400" />
      </div>

      <div className="py-4">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow className={"bg-gray-800 text-xs "}>
              {/* Estas celdas abarcan 2 filas porque no tienen sub-encabezados */}
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Tipo Doc</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">N° Doc</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Nombres y Apellidos</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Área</TableHead>

              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Fecha Ingreso</TableHead>

              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Dias Laborados</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Sueldo Base</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Sueldo Mensual</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Vacaciones</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Vacaciones vendidas</TableHead>


              <TableHead colSpan={2} className="text-center border-r h-5 text-white border-black">Prom. H. Extras.</TableHead>

               <TableHead colSpan={2} className="text-center border-r h-5 text-white border-black">Importe Faltas</TableHead>

               <TableHead rowSpan={2} className="text-center border-r h-5 text-white border-black">Sueldo Neto</TableHead>


               <TableHead rowSpan={2} className="text-center border-r h-5 text-white border-black">Sueldo Quincenal</TableHead>
               <TableHead rowSpan={2} className="text-center border-r h-5 text-white border-black"> Adelanto prestamo</TableHead>


              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Saldo por Pagar</TableHead>


              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Banco</TableHead>

            </TableRow>

              <TableRow className={"bg-gray-800 text-xs "}>

              
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">1era Quincena</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">2da Quincena</TableHead>

              
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">1era Quincena</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">2da Quincena</TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Render Trabajadores Planilla */}
            {planillaMensualTipoRh.length > 0 && (
              <>
                
                 {filtrarTrabajadores(planillaMensualTipoRh).map((e, index) => (
                  <RowRHMensual key={index} e={e} index={index} />
                ))}
                {/* <RowTotalRHMensual total={total} /> */}
              </>
            )}

           
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TablePlanillaMensual;
