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
      /* .min(1130, "El sueldo base debe ser mayor a 1130") */
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
   banco: yup.string().required("El nombre es requerido"),
   numero_cuenta: yup.string().required("El nombre es requerido"),
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
      fecha_nacimiento: yup
      .date()
      .transform((value, originalValue) => new Date(originalValue))
      .typeError("La fecha de nacimiento no es válida")
      .required("La fecha de nacimiento es requerida"),
      contratos_laborales: yup
         .array()
         .of(contratoSchema)
         .min(1, "Debe haber al menos un trabajo"),
      sistema_pension: yup
         .string()
         .nullable()
         .test(
            "validar-solo-si-planilla",
            "El sistema de pensión es requerido y debe ser AFP u ONP",
            function (value) {
               const { contratos_laborales } = this.parent;
               const ultimoContrato =
                  contratos_laborales?.[contratos_laborales.length - 1];

               if (
                  !ultimoContrato ||
                  ultimoContrato.tipo_contrato === "HONORARIOS"
               ) {
                  return true; // No se valida nada
               }

               return value === "AFP" || value === "ONP"; // Debe ser uno de esos si es PLANILLA
            }
         ),

      tipo_afp: yup
         .string()
         .nullable()
         .test(
            "validar-afp-si-aplica",
            "El tipo de AFP es requerido y debe ser válido",
            function (value) {
               const { sistema_pension, contratos_laborales } = this.parent;
               const ultimoContrato =
                  contratos_laborales?.[contratos_laborales.length - 1];

               if (
                  !ultimoContrato ||
                  ultimoContrato.tipo_contrato === "HONORARIOS"
               ) {
                  return true; // No se valida
               }

               if (sistema_pension !== "AFP") {
                  return true; // No aplica AFP
               }

               return ["HABITAT", "INTEGRA", "PRIMA", "PROFUTURO"].includes(
                  value
               ); // Validar contenido
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
