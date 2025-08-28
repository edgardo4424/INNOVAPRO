import * as yup from "yup";

const contratoSchema = yup.object({
   fecha_inicio: yup
      .date()
      .transform((value, originalValue) => new Date(originalValue))
      .typeError("La fecha de inicio no es válida")
      .required("La fecha de inicio es requerida"),
   fecha_fin: yup
      .date()
      .required("La fecha de fin es obligatoria")
      .min(
         yup.ref("fecha_inicio"),
         "La fecha fin debe ser posterior a la fecha de inicio"
      )
      .transform((value, originalValue) => new Date(originalValue))
      .typeError("La fecha de fin no es válida")
      .required("La fecha de fin es requerida"),
   sueldo: yup
      .number()
      .transform((value, originalValue) => Number(originalValue))
      .typeError("El sueldo base debe ser un número")
      .min(1130, "El sueldo base debe ser mayor a 1130")
      .required("El sueldo base es requerido"),
   regimen: yup
      .string()
      .oneOf(["GENERAL", "MYPE"], "El régimen debe ser GENERAL o MYPE")
      .required("El régimen es obligatorio"),
   tipo_contrato: yup
      .string()
      .oneOf(
         ["PLANILLA", "HONORARIOS"],
         "El tipo de contrato debe ser Planilla o RxH"
      )
      .required("El tipo de contrato es obligatorio"),
});

export const trabajadorSchema = (isEdit = false, isGerente = false) =>
   yup.object().shape({
      ...(isEdit && {
         id: yup
            .number()
            .integer()
            .positive("ID debe ser un número positivo")
            .required("El ID es requerido en edición"),
      }),
      nombres: yup.string().required("El nombre es requerido"),
      apellidos: yup.string().required("El apellido es requerido"),
      tipo_documento: yup
         .string()
         .oneOf(["DNI", "CE", "PTP"], "Tipo de documento no válido")
         .required("El tipo de documento es requerido"),
      numero_documento: yup
         .string()
         .required("El número de documento es requerido"),
      contratos_laborales: yup
         .array()
         .of(contratoSchema)
         .min(1, "Debe haber al menos un trabajo"),
      sistema_pension: yup
         .string()
         .oneOf(["AFP", "ONP"], "Sistema de pensión no válido")
         .required("El sistema de pensión es requerido"),
      tipo_afp: yup
  .string()
  .trim()
  .oneOf(["HABITAT", "INTEGRA", "PRIMA", "PROFUTURO"], "Tipo de AFP no válido")
  .when("sistema_pension", (sistema_pension, schema) =>
  {
   
   return sistema_pension.includes("AFP")
      ? schema.required("El tipo de AFP es requerido")
      : schema.nullable().notRequired()
  }
    
  ),
      cargo_id: yup
         .number()
         .transform((value, originalValue) => {
            if (
               originalValue === "" ||
               originalValue === null ||
               originalValue === undefined
            ) {
               return null;
            }
            const parsed = Number(originalValue);
            return isNaN(parsed) ? null : parsed;
         })
         .nullable()
         .required("El cargo es obligatorio"),
   });
