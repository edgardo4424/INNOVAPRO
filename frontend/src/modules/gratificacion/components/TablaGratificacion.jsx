import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"



const TablaGratificacion = ({ TipoGratificacion, gratificacion }) => {
    return (
        <div className="w-full overflow-x-auto p-10 mb-10  bg-gray-100 border-2 rounded-xl shadow-xl">
            <h1 className="text-2xl font-bold pb-6">{TipoGratificacion}</h1>
            <Table className="[&_th]:whitespace-nowrap">
                <TableCaption>Gratificación Semestral</TableCaption>

                {/* HEADER en 2 filas */}
                <TableHeader className={"bg-gray-800  border-1 border-black"}>
                    <TableRow>
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
                        <TableHead colSpan={2} className="text-center border-r text-white border-black">FALTAS</TableHead>

                        {/* El resto también va con rowSpan */}
                        <TableHead rowSpan={2} className="text-center border-r text-white border-black">No Computable</TableHead>
                        <TableHead rowSpan={2} className="text-center border-r text-white border-black">Grat. después de desc.</TableHead>
                        <TableHead rowSpan={2} className="text-center border-r text-white border-black">Bonif. Essalud 9%</TableHead>
                        <TableHead rowSpan={2} className="text-center border-r text-white border-black">Renta 5ta / No dom.</TableHead>
                        <TableHead rowSpan={2} className="text-center border-r text-white border-black">Adelanto</TableHead>
                        <TableHead rowSpan={2} className="text-center border-r text-white border-black">Total a Pagar</TableHead>
                    </TableRow>

                    {/* Sub-encabezados del grupo FALTAS */}
                    <TableRow className={"text-center"}>
                        <TableHead className="text-center border-r text-white border-black">Día</TableHead>
                        <TableHead className="text-center border-r text-white border-black">Importe</TableHead>
                    </TableRow>
                </TableHeader>

                {/* BODY de ejemplo */}
                <TableBody className={"[&_td]:text-right bg-gray-100"}>
                    {
                    gratificacion.trabajadores.map((e,index) => (
                        <TableRow className={"hover:bg-gray-300"}>
                        <TableCell className="text-right">{e.dni}</TableCell>
                        <TableCell className="text-right">{e.nombres} {e.apellidos}</TableCell>
                        <TableCell className="text-right">{e.regimen}</TableCell>
                        <TableCell className="text-right">{e.fecha_ingreso}</TableCell>
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
                        <TableCell className="text-right">{e.renta_5ta_no_dom}</TableCell>
                        <TableCell className="text-right">{e.mont_adelanto}</TableCell>
                        <TableCell className="text-right">{e.total_a_pagar}</TableCell>
                    </TableRow>
                    ))
                    }


                    <TableRow className={"bg-blue-300"}>
                        <TableCell colSpan={5} >Total</TableCell>
                        <TableCell>{gratificacion.total_sueldo}</TableCell>
                        <TableCell>{gratificacion.total_asig_familiar}</TableCell>
                        <TableCell className="text-right">{gratificacion.total_horas_extras}</TableCell>
                        <TableCell className="text-right">{gratificacion.total_bono_obra}</TableCell>
                        <TableCell className="text-right">{gratificacion.total_sueldo_bruto}</TableCell>
                        <TableCell className="text-right">{gratificacion.total_gratificacion_semestral}</TableCell>
                        <TableCell className="text-right">{gratificacion.total_faltas}</TableCell>
                        <TableCell className="text-right">{gratificacion.total_importe_falta}</TableCell>
                        <TableCell className="text-right">{gratificacion.total_no_computable}</TableCell>
                        <TableCell className="text-right">{gratificacion.total_gratificacion_despues_descuento}</TableCell>
                        <TableCell className="text-right">{gratificacion.total_bonificacion_essalud}</TableCell>
                        <TableCell className="text-right">{gratificacion.total_renta_5ta_no_dom}</TableCell>
                        <TableCell className="text-right">{gratificacion.total_mont_adelanto}</TableCell>
                        <TableCell className="text-right bg-green-300">{gratificacion.total_total_a_pagar}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}


export default TablaGratificacion
