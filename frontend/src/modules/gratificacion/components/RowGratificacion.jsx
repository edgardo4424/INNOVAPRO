import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, FileDown } from "lucide-react";
import { formatearFecha } from "../utils/formatearFecha";
const RowGratificacion = ({ key, e, index }) => {
  return (
    <TableRow key={key} className={"text-xs"}>
      <TableCell className="text-right">{e.numero_documento}</TableCell>
      <TableCell className="text-right">
        {e.nombres} {e.apellidos}
      </TableCell>
      <TableCell className="text-right">{e.regimen}</TableCell>
      <TableCell className="text-right">
        {formatearFecha(e.fecha_ingreso)}
      </TableCell>
      <TableCell className="text-right">
        {formatearFecha(e.fecha_fin)}
      </TableCell>
      <TableCell className="text-right">{e.tiempo_laborado}</TableCell>
      <TableCell className="text-right">{e.sueldo_base}</TableCell>
      <TableCell className="text-right">{e.asig_familiar}</TableCell>
      <TableCell className="text-right">{e.prom_horas_extras}</TableCell>
      <TableCell className="text-right">{e.prom_bono_obra}</TableCell>
      <TableCell className="text-right">{e.sueldo_bruto}</TableCell>
      <TableCell className="text-right">{e.gratificacion_semestral}</TableCell>
      <TableCell className="text-right">{e.falta_dias}</TableCell>
      <TableCell className="text-right">{e.falta_importe}</TableCell>
      <TableCell className="text-right">{e.no_computable}</TableCell>
      <TableCell className="text-right">{e.grat_despues_descuento}</TableCell>
      <TableCell className="text-right">{e.bonificac_essalud}</TableCell>
      <TableCell className="text-right">{e.rent_quint_cat_no_domiciliado}</TableCell>
      <TableCell className="text-right">{e.mont_adelanto}</TableCell>
      <TableCell className="text-right">{e.total_a_pagar}</TableCell>
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
  );
};

export default RowGratificacion;
