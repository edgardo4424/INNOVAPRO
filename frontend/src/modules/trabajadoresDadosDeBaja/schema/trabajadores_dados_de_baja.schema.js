import * as yup from "yup";

export const trabajadoresDadosDeBajaSchema = yup.object().shape({
  filial_id: yup
    .number()
    .typeError("Filial es requerida")
    .required("Filial es requerida"),
  trabajador_id: yup
    .number()
    .typeError("Trabajador es requerido")
    .required("Trabajador es requerido"),
  fecha_baja: yup.string().required("La fecha es requerida"),
  motivo_liquidacion_id: yup
    .number()
    .typeError("Motivo de baja es requerido")
    .required("Motivo de baja es requerido"),
});
