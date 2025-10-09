import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRecibos } from "../../hooks/use_recibos";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

const ReciboCard = ({ planilla_recibo,setLoading,buscarPlame}) => {
  // console.log("Data por recibo",planilla_recibo);
  const { form, datos_empleado, setForm, handleClick ,formCurrent} =
    useRecibos(planilla_recibo,setLoading,buscarPlame);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm({ ...form, [name]: value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{datos_empleado.nombres}</CardTitle>
        <CardDescription>
          {datos_empleado.tipo_doc} - {datos_empleado.numero_doc}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action=""
          className="grid grid-cols-5 space-y-2 space-x-2"
          onSubmit={handleClick}
        >
          <section>
            <Label>Serie del comprobante</Label>
            <Input
              value={form.serie_comprobante_emitido}
              name="serie_comprobante_emitido"
              placeholder="Serie del comprobante"
              onChange={handleChange}
            />
          </section>
          <section>
            <Label>Número del comprobante</Label>
            <Input
              value={form.numero_comprobante_emitido}
              name="numero_comprobante_emitido"
              placeholder="Número del comprobante"
              onChange={handleChange}
            />
          </section>
          <section>
            <Label>Monto del servicio</Label>
            <Input
              value={form.monto_total_servicio}
              name="monto_total_servicio"
              placeholder="Monto del servicio"
              onChange={handleChange}
            />
          </section>
          <section>
            <Label>Fecha de emisión</Label>
            <Input
              type="date"
              value={form.fecha_emision}
              name="fecha_emision"
              placeholder="Fecha de emisión"
              onChange={handleChange}
            />
          </section>
          <section>
            <Label>Fecha de pago</Label>
            <Input
              type="date"
              value={form.fecha_pago}
              name="fecha_pago"
              placeholder="Fecha de pago"
              onChange={handleChange}
            />
          </section>
          <section>
            <Label>¿Aplica retención de cuarta cat.?</Label>
            <Checkbox
              checked={form.indicador_retencion_cuarta_categoria}
              onCheckedChange={(e) => {
                setForm({ ...form, indicador_retencion_cuarta_categoria: e });
              }}
            />
          </section>
          <section className="">
            <Label>Retención de régimen pensionario</Label>
            <Select
              value={form.indicador_retencion_regimen_pensionario}
              onValueChange={(e) => {
                setForm({ ...form, indicador_retencion_regimen_pensionario: e });
              }
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecioner el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">ONP</SelectItem>
                <SelectItem value="2">AFP</SelectItem>
                <SelectItem value="3">No aplica</SelectItem>
              </SelectContent>
            </Select>
          </section>
          <section>
            <Label>Importe regimen pensionario</Label>
            <Input
              value={form.importe_aporte_regimen_pensionario}
              name="importe_aporte_regimen_pensionario"
              placeholder="Ingrese el importe de pensión"
              onChange={handleChange}
            />
          </section>
          <Button disabled={form===formCurrent} type="submit">{form.id?"Actualizar Recibo":"Guardar Recibo"}</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReciboCard;
