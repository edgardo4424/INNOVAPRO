import { TableCell, TableRow } from "@/components/ui/table";
import { formatearFecha } from "@/modules/gratificacion/utils/formatearFecha";
import { Eye, FileDown } from "lucide-react";

const RowCts = ({ e, num }) => {
   return (
      <TableRow className="text-xs">
         <TableCell className="text-right">{num}</TableCell>

         <TableCell className="text-right">{e?.tipo_documento || "-"}</TableCell>

         <TableCell className="text-right">{e.numero_documento}</TableCell>
         <TableCell className="text-right">{e.nombre}</TableCell>
         <TableCell className="text-right">{e.regimen}</TableCell>
         <TableCell className="text-right">{e.fecha_ingreso}</TableCell>
         <TableCell className="text-right">{e.inicio_periodo}</TableCell>
         <TableCell className="text-right">{e.fin_periodo}</TableCell>
         <TableCell className="text-right">{e.sueldo_basico}</TableCell>
         <TableCell className="text-right">{e.sueldo_asig_fam}</TableCell>
         <TableCell className="text-right">{e.ultima_remuneracion}</TableCell>
         <TableCell className="text-right">{e.prom_h_extras}</TableCell>
         <TableCell className="text-right">{e.prom_bono}</TableCell>
         <TableCell className="text-right">{e.remuneracion_comp}</TableCell>
         <TableCell className="text-right">{e.ultima_gratificacion}</TableCell>
         <TableCell className="text-right">{e.sexto_gratificacion}</TableCell>
         <TableCell className="text-right">{e.meses_comp}</TableCell>
         <TableCell className="text-right">{e.dias_comp}</TableCell>
         <TableCell className="text-right">{e.cts_meses}</TableCell>
         <TableCell className="text-right">{e.cts_dias}</TableCell>
         <TableCell className="text-right">{e.faltas_dias}</TableCell>
         <TableCell className="text-right">{e.faltas_importe}</TableCell>
         <TableCell className="text-right">{e.no_computable}</TableCell>
         <TableCell className="text-right">{e.no_domiciliado}</TableCell>
         <TableCell className="text-right">{e.cts_depositar}</TableCell>
         <TableCell className="text-right">{e.banco}</TableCell>
         <TableCell className="text-right">{e.numero_cuenta}</TableCell>
      </TableRow>
   );
};

export default RowCts;
