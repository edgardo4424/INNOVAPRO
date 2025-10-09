import { useState } from "react";
import planillaMensualService from "../services/planillaMensualService";
import { toast } from "react-toastify";

const form_base = {
  tipo_comprobante_emitido: "R",
  serie_comprobante_emitido: "",
  numero_comprobante_emitido: "",
  monto_total_servicio: "",
  fecha_emision: "",
  fecha_pago: "",
  indicador_retencion_cuarta_categoria: false,
  indicador_retencion_regimen_pensionario: undefined,
  importe_aporte_regimen_pensionario: "",
};
export const useRecibos = (data,setLoading,buscarPlame) => {
  const estado_inicial = data.recibo?.recibo_por_honorario
    ? data.recibo.recibo_por_honorario
    : form_base;
  estado_inicial.planilla_id = data.id;
  estado_inicial.trabajador_id = data.trabajador_id;

  const datos_empleado = {
    nombres: data.nombres_apellidos,
    tipo_doc: data.tipo_documento,
    numero_doc: data.numero_documento,
  };
  const guardarRecibo = async () => {
    setLoading(true)
    try {
      await planillaMensualService.crearReciboPorPlanilla(form);
      toast.success("Recibo guardado exitosamente");
      await buscarPlame();
    } catch (error) {
      toast.error("Ocurrio un error al guardar el recibo");
    }
    finally{
      setLoading(false)
    }
  };

  const actualizarRecibo = async () => {
    setLoading(true)
    try {
      await planillaMensualService.actualizarReciboPorPlanilla(form)
      await buscarPlame();
      toast.success("Recibo actualizado exitosamente.")
    } catch (error) {
      toast.error("Ocurrio un error al actualizar el recibo ")
    }
    finally{
      setLoading(false)
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();
    if (form.id) {
      await actualizarRecibo();
    } else {
      await guardarRecibo();
    }
  };

  const [form, setForm] = useState(estado_inicial);
  const [formCurrent, setCurrent] = useState(estado_inicial);
  return {
    formCurrent,
    form,
    datos_empleado,
    setForm,
    handleClick,
  };
};
