import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import RowCts from "./RowCts";
// import RowCts from "./RowCts";
const ListaCts = ({ cts }) => {
   return (
      <div className="relative py-4 ">
         <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
               {/* Fila principal */}
               <TableRow className="bg-gray-800 text-xs">
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     N
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Tipo doc
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Numero doc
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Nombres y apellidos
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Régimen
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
                     Inicio Periodo
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Fin Periodo
                  </TableHead>

                  {/* Grupo Sueldos */}
                  <TableHead
                     colSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Sueldos
                  </TableHead>

                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Última Remuneración
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Prom. H. Extras
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Prom. Bono
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Remun. Comput.
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                   Ultima Gratif. Percib
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     1/6 Gratif. Percib.
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Meses Comp.
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Días Comput.
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     CTS Meses
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     CTS Días
                  </TableHead>

                  {/* Grupo Faltas */}
                  <TableHead
                     colSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Faltas Injustificadas
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     No computable
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     No domiciliado
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     CTS a Depositar
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     Banco
                  </TableHead>
                  <TableHead
                     rowSpan={2}
                     className="text-center border-r text-white border-black"
                  >
                     N° cuenta CTS
                  </TableHead>
               </TableRow>

               {/* Subencabezados */}
               <TableRow className="bg-gray-700 text-xs">
                  {/* Sub de Sueldos */}
                  <TableHead className="text-center border-r text-white border-black">
                     Básico
                  </TableHead>
                  <TableHead className="text-center border-r text-white border-black">
                     Asig. Fam.
                  </TableHead>

                  {/* Sub de Faltas */}
                  <TableHead className="text-center border-r text-white border-black">
                     Días
                  </TableHead>
                  <TableHead className="text-center border-r text-white border-black">
                     Importe
                  </TableHead>
               </TableRow>
            </TableHeader>

            <TableBody className="bg-blue-50 min-h-64">
               {/* Render Trabajadores Planilla */}
               {cts.length > 0 && cts.map((c, i) => <RowCts e={c} key={i} num={i+1}/>)}
            </TableBody>
         </Table>
      </div>
   );
};
export default ListaCts;
