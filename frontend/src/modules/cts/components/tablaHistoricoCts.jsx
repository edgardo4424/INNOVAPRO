import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"



export default function TablaHistoricoCts({ datos }) {
  const formatearMoneda = (valor) => {
    const numero = Number.parseFloat(valor)
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(numero)
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-PE")
  }

  return (
    <Card className="w-full">
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>ID Trabajador</TableHead>
                <TableHead>Contratos</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Régimen</TableHead>
                <TableHead>Sueldo Base</TableHead>
                <TableHead>Asignación Familiar</TableHead>
                <TableHead>Promedio Horas Extras</TableHead>
                <TableHead>Bono Obra</TableHead>
                <TableHead>Remuneración Computable</TableHead>
                <TableHead>Última Gratificación</TableHead>
                <TableHead>Sexto Gratificación</TableHead>
                <TableHead>Meses Computables</TableHead>
                <TableHead>Días Computables</TableHead>
                <TableHead>CTS Meses</TableHead>
                <TableHead>CTS Días</TableHead>
                <TableHead>Faltas Días</TableHead>
                <TableHead>Faltas Importe</TableHead>
                <TableHead>No Computable</TableHead>
                <TableHead>CTS Depósito</TableHead>
                <TableHead>Número Cuenta</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Fecha Bloqueo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datos.map((registro, index) => (
                <TableRow key={registro.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{registro.id}</TableCell>
                  <TableCell>{registro.trabajador_id}</TableCell>
                  <TableCell>{registro.contratos}</TableCell>
                  <TableCell>{registro.periodo}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{registro.regimen}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatearMoneda(registro.sueldo_base)}</TableCell>
                  <TableCell>{formatearMoneda(registro.asignacion_familiar)}</TableCell>
                  <TableCell>{formatearMoneda(registro.promedio_horas_extras)}</TableCell>
                  <TableCell>{formatearMoneda(registro.promedio_bono_obra)}</TableCell>
                  <TableCell className="font-semibold text-primary">
                    {formatearMoneda(registro.remuneracion_computable)}
                  </TableCell>
                  <TableCell>{formatearMoneda(registro.ultima_gratificacion)}</TableCell>
                  <TableCell>{formatearMoneda(registro.sexto_gratificacion)}</TableCell>
                  <TableCell>{registro.meses_computables}</TableCell>
                  <TableCell>{registro.dias_computables}</TableCell>
                  <TableCell>{registro.cts_meses}</TableCell>
                  <TableCell>{registro.cts_dias}</TableCell>
                  <TableCell>
                    {registro.faltas_dias > 0 ? (
                      <Badge variant="destructive">{registro.faltas_dias}</Badge>
                    ) : (
                      <Badge variant="secondary">0</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatearMoneda(registro.faltas_importe)}</TableCell>
                  <TableCell>{formatearMoneda(registro.no_computable)}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatearMoneda(registro.cts_depositar)}
                  </TableCell>
                  <TableCell>
                    {registro.numero_cuenta === "POR DEFINIR" ? (
                      <Badge variant="secondary">Por Definir</Badge>
                    ) : (
                      registro.numero_cuenta
                    )}
                  </TableCell>
                  <TableCell>
                    {registro.banco === "POR DEFINIR" ? <Badge variant="secondary">Por Definir</Badge> : registro.banco}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatearFecha(registro.locked_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
