import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, FileDown } from "lucide-react";
import { formatearFecha } from "../utils/formatearFecha";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
const RowGratificacion = ({ key, e, index }) => {
  
  return (
    <>
      <TableRow key={key} className={"text-xs"}>
        <TableCell className="text-right">{e.tipo_documento}</TableCell>
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
        <TableCell className="text-right">{typeof e.sueldo_base === "number" ? (e.sueldo_base).toFixed(2) : e.sueldo_base}</TableCell>
        <TableCell className="text-right">{typeof e.asig_familiar === "number" ? (e.asig_familiar).toFixed(2) : e.asig_familiar}</TableCell>
        <TableCell className="text-right">
          {e.prom_horas_extras > 0 ? (
            <Tooltip side="bottom" align="end" className="mr-2">
              <TooltipTrigger asChild>
                <div>{typeof e.prom_horas_extras === "number" ? (e.prom_horas_extras).toFixed(2) : e.prom_horas_extras}</div>
              </TooltipTrigger>
              <TooltipContent>

                <div className="text-center mb-2">Promedio de horas extras</div>
                <div className="font-bold"> {e.nombres} {e.apellidos}</div>
                
                    <div>
                      <table className="mt-2 w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left px-2 py-1">Fecha</th>
                            <th className="text-left px-2 py-1">Horas extras</th>
                          </tr>
                        </thead>
                        <tbody>
                          {e?.info_detalle?.info_horas_extras?.map(i => (
                            <tr key={i.mes} className="">
                              <td className="px-2 py-1 text-center">{formatearFecha(i.fecha)}</td>
                              <td className="px-2 py-1 text-center">{i.horas_extras}</td>
                            </tr>
                          ))}
                          <tr className="border-t border-gray-200">
                              <td className="px-2 py-1 text-center">Total</td>
                              <td className="px-2 py-1 text-center">
                                {e?.info_detalle?.info_horas_extras
                                  ?.reduce((total, item) => total + item.horas_extras, 0)}
                              </td>
                            </tr>
                        </tbody>
                      </table>
                    </div>
                
              </TooltipContent>
            </Tooltip>
          ) : (
            typeof e.prom_horas_extras === "number" ? (e.prom_horas_extras).toFixed(2) : e.prom_horas_extras
          )}
        </TableCell>
        <TableCell className="text-right">
          {e.prom_bono_obra > 0 ? (
            <Tooltip side="bottom" align="center" className="mr-2">
              <TooltipTrigger asChild>
                <div>{typeof e.prom_bono_obra === "number" ? (e.prom_bono_obra).toFixed(2) : e.prom_bono_obra}</div>
              </TooltipTrigger>
              <TooltipContent>

                <div className="text-center mb-2">Promedio de bonos</div>
                <div className="font-bold"> {e.nombres} {e.apellidos}</div>
                
                    <div>
                      <table className="mt-2 w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left px-2 py-1">Fecha</th>
                            <th className="text-left px-2 py-1">Monto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {e?.info_detalle?.info_bonos?.map(i => (
                            <tr key={i.mes} className="">
                              <td className="px-2 py-1 text-center">{formatearFecha(i.fecha)}</td>
                              <td className="px-2 py-1 text-center">{i.monto}</td>
                            </tr>
                          ))}
                          <tr className="border-t border-gray-200">
                              <td className="px-2 py-1 text-center">Total</td>
                              <td className="px-2 py-1 text-center">
                                {(e?.info_detalle?.info_bonos
                                  ?.reduce((total, item) => total + +(item.monto), 0)).toFixed(2)}
                              </td>
                            </tr>
                        </tbody>
                      </table>
                    </div>
                
              </TooltipContent>
            </Tooltip>
          ) : (
            typeof e.prom_bono_obra === "number" ? (e.prom_bono_obra).toFixed(2) : e.prom_bono_obra
          )}
        </TableCell>
        <TableCell className="text-right">{e.sueldo_bruto}</TableCell>
        <TableCell className="text-right">
          {typeof e.gratificacion_semestral === "number" ? (e.gratificacion_semestral).toFixed(2) : e.gratificacion_semestral}
        </TableCell>
         <TableCell className="text-right">
          {+(e.falta_dias) > 0 ? (
            <Tooltip side="bottom" align="center" className="mr-2">
              <TooltipTrigger asChild>
                <div>{e.falta_dias}</div>
              </TooltipTrigger>
              <TooltipContent>

                <div className="text-center mb-2">Faltas</div>
                <div className="font-bold"> {e.nombres} {e.apellidos}</div>
                
                    <div>
                      <table className="mt-2 w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left px-2 py-1">Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {e?.info_detalle?.info_faltas?.map(i => (
                            <tr key={i.mes} className="">
                              <td className="px-2 py-1 text-center">{formatearFecha(i.fecha)}</td>
                            </tr>
                          ))}
                       
                        </tbody>
                      </table>
                    </div>
                
              </TooltipContent>
            </Tooltip>
          ) : (
            e.falta_dias
          )}
        </TableCell>
        <TableCell className="text-right">{typeof e.falta_importe === "number" ? (e.falta_importe).toFixed(2) : e.falta_importe}</TableCell>
        <TableCell className="text-right">{typeof e.no_computable === "number" ? (e.no_computable).toFixed(2) : e.no_computable}</TableCell>
        <TableCell className="text-right">{typeof e.grat_despues_descuento === "number" ? (e.grat_despues_descuento).toFixed(2) : e.grat_despues_descuento}</TableCell>
        <TableCell className="text-right">{typeof e.bonificac_essalud === "number" ? (e.bonificac_essalud).toFixed(2) : e.bonificac_essalud}</TableCell>
        <TableCell className="text-right">
          {typeof e.rent_quint_cat_no_domiciliado === "number" ? (e.rent_quint_cat_no_domiciliado).toFixed(2) : e.rent_quint_cat_no_domiciliado}
        </TableCell>
        <TableCell className="text-right">   {typeof e.mont_adelanto === "number" ? (e.mont_adelanto).toFixed(2) : e.mont_adelanto}</TableCell>
        <TableCell className="text-right">   {typeof e.total_a_pagar === "number" ? (e.total_a_pagar).toFixed(2) : e.total_a_pagar}</TableCell>
        <TableCell className="text-right">{e.banco}</TableCell>
        <TableCell className="text-right">{e.numero_cuenta}</TableCell>

        {/*       <TableCell className={"flex gap-x-4 items-center"}>
        <button className="border border-gray-400 rounded-md p-1">
          <Eye className="size-5" />
        </button>

        <button className="border border-gray-400 rounded-md p-1">
          <FileDown className="size-5" />
        </button>

        <button className="border text-white border-red-500 bg-red-500 rounded-md p-1">
          <span>Emitir gratificacion</span>
        </button>
      </TableCell> */}
      </TableRow>
    </>
  );
};

export default RowGratificacion;
