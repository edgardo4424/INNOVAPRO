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
      .typeError("La fecha de inicio no es válida")
      .required("La fecha de inicio es requerida"),
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
});

export const trabajadorSchema = (isEdit = false) =>
   yup.object().shape({
      ...(isEdit && {
         id: yup
            .number()
            .integer()
            .positive("ID debe ser un número positivo")
            .required("El ID es requerido en edición"),
      }),
      filial_id: yup
         .number()
         .transform((value, originalValue) =>
            originalValue === "" ? null : value
         )
         .nullable()
         .required("La filial es requerida"),
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
      asignacion_familiar: yup
         .boolean()
         .required("La asignación familiar es requerida"),
      sistema_pension: yup
         .string()
         .oneOf(["AFP", "ONP"], "Sistema de pensión no válido")
         .required("El sistema de pensión es requerido"),
      quinta_categoria: yup
         .boolean()
         .required("La quinta categoría es requerida"),
      cargo_id: yup
         .number()
         .transform((value, originalValue) =>
            originalValue === "" ? null : value
         )
         .nullable()
         .required("El cargo es obligatorio"),

      // estado y fecha_salida no se validan según tu requerimiento
   });
