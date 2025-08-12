import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Eye, FileDown, Search } from "lucide-react";
import ColumnaGratificacion from "./ColumnaGratificacion";

const ListaGratificacion = ({ TipoGratificacion, gratificacion }) => {
  const { planilla, honorarios } = gratificacion
  const totalP = planilla.totales;
  const totalH = honorarios.totales;
  console.log(gratificacion)

  return (
    <div className="w-full overflow-x-auto p-5 mb-10 flex flex-col bg-gray-100 border-2 rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold pb-6">Trabajadores</h1>
      <div className="relative w-[300px]">
        <Input
          type="search"
          className="block w-full appearance-none px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Buscar..."
        />
        <Search className="absolute right-3 top-1 text-gray-400" />
      </div>

      <div className="relative py-4">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow className={"bg-gray-800 text-xs "}>
              {/* Estas celdas abarcan 2 filas porque no tienen sub-encabezados */}
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">DNI</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Nombres y Apellidos</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Régimen</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Fecha Ingreso</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Tiempo Laborado</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Sueldo Base</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Asig. Fam.</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Prom. Horas Extras</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Prom. Bono Obra</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Sueldo Bruto</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Gratificación Semestral</TableHead>

              {/* Grupo FALTAS ocupa 2 columnas */}
              <TableHead colSpan={2} className="text-center border-r h-5 text-white border-black">FALTAS</TableHead>

              {/* El resto también va con rowSpan */}
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">No Computable</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Grat. después de desc.</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Bonif. Essalud 9%</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Renta 5ta / No dom.</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Adelanto</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Total a Pagar</TableHead>
              <TableHead rowSpan={2} className="text-center border-r text-white border-black">Acciones</TableHead>
            </TableRow>

            {/* Sub-encabezados del grupo FALTAS */}
            <TableRow className={"bg-gray-800 text-xs "}>
              <TableHead className="text-center border-r  text-white border-black">Día</TableHead>
              <TableHead className="text-center border-r  text-white border-black">Importe</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Render Trabajadores Planilla */}
            {planilla.trabajadores.length > 0 && (
              <>
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center bg-gray-200 text-black font-semibold"
                  >
                    Planilla
                  </TableCell>
                </TableRow>
                {planilla.trabajadores.map((e, index) => (
                  <ColumnaGratificacion key={index} e={e} index={index} />
                ))}
                <TableRow className={"bg-orange-100"}>
                  <TableCell colSpan={5} className={"text-right"}>Total A Pagar:</TableCell>
                  <TableCell colSpan={5} className={"text-left"}>{totalP.total_total_a_pagar}</TableCell>
                </TableRow>
              </>
            )}

            {/* Render Trabajadores Honorarios */}
            {honorarios.trabajadores.length > 0 && (
              <>
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center bg-gray-200 text-black font-semibold"
                  >
                    Honorarios
                  </TableCell>
                </TableRow>
                {honorarios.trabajadores.map((e, index) => (
                  <TableRow>
                    <TableCell>{e.numero_documento}</TableCell>
                    <TableCell>
                      {e.nombres} {e.apellidos}
                    </TableCell>
                    <TableCell>{e.regimen}</TableCell>
                    <TableCell>{e.fecha_ingreso}</TableCell>
                    <TableCell>{e.tiempo_laborado}</TableCell>
                    <TableCell>{e.sueldo_base}</TableCell>
                    <TableCell>{e.sueldo_bruto}</TableCell>
                    <TableCell>{e.total_a_pagar}</TableCell>
                    <TableCell className={"flex gap-x-4 items-center"}>

                      <button className="border border-gray-400 rounded-md p-1">
                        <Eye className="size-5" />
                      </button>

                      <button className="border border-gray-400 rounded-md p-1">
                        <FileDown className="size-5" />
                      </button>

                      <button className="border text-white border-red-500 bg-red-500 rounded-md p-1">
                        <span>Emitir gratificacion</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className={"bg-orange-100"}>
                  <TableCell colSpan={5} className={"text-right"}>Total A Pagar:</TableCell>
                  <TableCell colSpan={2} className={"text-left"}>{honorarios.total_total_a_pagar}</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListaGratificacion;
