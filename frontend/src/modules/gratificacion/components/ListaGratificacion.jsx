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

const ListaGratificacion = ({ TipoGratificacion, gratificacion }) => {
  const { planilla, honorarios } = gratificacion
  const totalP = planilla.totales;
  const totalH = honorarios.totales;

  return (
    <div className="w-full overflow-x-auto p-10 mb-10 flex flex-col bg-gray-100 border-2 rounded-xl shadow-xl">
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
            <TableRow className={"bg-gray-800 "}>
              <TableHead className="w-[100px] text-white">Dni</TableHead>
              <TableHead className="text-white">Nombre y Apellido</TableHead>
              <TableHead className="text-white">Regimen</TableHead>
              <TableHead className="text-white">Fecha Ingreso</TableHead>
              <TableHead className="text-white">Tiempo Laborado</TableHead>
              {/* <TableHead className="text-white">Sueldo Base</TableHead> */}
              {/* <TableHead className="text-white">Sueldo Bruto</TableHead> */}
              <TableHead className="text-white">Total a Pagar</TableHead>
              <TableHead className="text-white">Acciones</TableHead>
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
                  <TableRow>
                    <TableCell>{e.numero_documento}</TableCell>
                    <TableCell>
                      {e.nombres} {e.apellidos}
                    </TableCell>
                    <TableCell>{e.regimen}</TableCell>
                    <TableCell>{e.fecha_ingreso}</TableCell>
                    <TableCell>{e.tiempo_laborado}</TableCell>
                    {/* <TableCell>{e.sueldo_base}</TableCell> */}
                    {/* <TableCell>{e.sueldo_bruto}</TableCell> */}
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
                  <TableCell colSpan={2} className={"text-left"}>{totalP.total_total_a_pagar}</TableCell>
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
                    {/* <TableCell>{e.sueldo_base}</TableCell> */}
                    {/* <TableCell>{e.sueldo_bruto}</TableCell> */}
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
                {/* <TableRow className={"bg-orange-100"}>
                  <TableCell colSpan={5} className={"text-right"}>Total A Pagar:</TableCell>
                  <TableCell colSpan={2} className={"text-left"}>{honorarios.total_total_a_pagar}</TableCell>
                </TableRow> */}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListaGratificacion;
