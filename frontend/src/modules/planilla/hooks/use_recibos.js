import { useState } from "react";
import planillaMensualService from "../services/planillaMensualService";

const form_base = {
  tipo_comprobante_emitido:"R",
  serie_comprobante_emitido: "",
  numero_comprobante_emitido: "",
  monto_total_servicio: "",
  fecha_emision: "",
  fecha_pago: "",
  indicador_retencion_cuarta_categoria: false,
  indicador_retencion_regimen_pensionario: undefined,
  importe_aporte_regimen_pensionario: "",
};
export const useRecibos = (data) => {  
  console.log("Recibo entrante",data);
  
  const estado_inicial = data.recibo?.recibo_por_honorario
    ? data.recibo.recibo_por_honorario
    : form_base;
  estado_inicial.planilla_id=data.id;
  estado_inicial.trabajador_id=data.trabajador_id;
  
  const datos_empleado = {
    nombres: data.nombres_apellidos,
    tipo_doc: data.tipo_documento,
    numero_doc: data.numero_documento,
  };
  const handleClick = async(event) => {
    event.preventDefault(); // Previene que el formulario se envíe y recargue la página


    console.log(form    ); // Muestra todos los datos del formulario como objeto JS
    const response=await planillaMensualService.crearReciboPorPlanilla(form)
  };
  const [form, setForm] = useState(estado_inicial);
  return {
    form,
    datos_empleado,
    setForm,
    handleClick,
  };
};
