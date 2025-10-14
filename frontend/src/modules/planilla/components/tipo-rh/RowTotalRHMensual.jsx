import {
    TableCell,
    TableRow
} from "@/components/ui/table"

const RowTotalPlanillaMensual = ({ gratificacion }) => {
    console.log(gratificacion)
    return (
        <TableRow className={"bg-blue-300 text-xs"} key={gratificacion}>
            <TableCell className="text-right" colSpan={6} >Total</TableCell>
            <TableCell className="text-right bg-orange-300">{gratificacion.total_sueldo}</TableCell>
            <TableCell className="text-right bg-orange-300">{gratificacion.total_asig_familiar}</TableCell>
            <TableCell className="text-right bg-orange-300">{gratificacion.total_horas_extras}</TableCell>
            <TableCell className="text-right bg-orange-300">{gratificacion.total_bono_obra}</TableCell>
            <TableCell className="text-right">{gratificacion.total_sueldo_bruto}</TableCell>
            <TableCell className="text-right">{gratificacion.total_gratificacion_semestral}</TableCell>
            <TableCell className="text-right bg-orange-300">{gratificacion.total_faltas}</TableCell>
            <TableCell className="text-right">{gratificacion.total_importe_falta}</TableCell>
            <TableCell className="text-right">{gratificacion.total_no_computable}</TableCell>
            <TableCell className="text-right">{gratificacion.total_gratificacion_despues_descuento}</TableCell>
            <TableCell className="text-right">{gratificacion.total_bonificacion_essalud}</TableCell>
            <TableCell className="text-right">{gratificacion.total_rent_quint_cat_no_domiciliado}</TableCell>
            <TableCell className="text-right">{gratificacion.total_mont_adelanto}</TableCell>
            <TableCell className="text-right bg-yellow-300">{gratificacion.total_total_a_pagar}</TableCell>
        </TableRow>
    )
}

export default RowTotalPlanillaMensual
