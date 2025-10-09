import * as yup from "yup";

const contratoSchema = yup.object({
   fecha_inicio: yup
      .date()
      .transform((value, originalValue) => new Date(originalValue))
      .typeError("La fecha de inicio no es válida")
      .required("La fecha de inicio es requerida"),
   fecha_fin: yup
      .mixed()
      .transform((value, originalValue) =>
         originalValue === "" || originalValue === null
            ? null
            : new Date(originalValue)
      )
      .nullable()
      .test(
         "fecha-fin-debe-ser-posterior",
         "La fecha fin debe ser posterior a la fecha de inicio",
         function (value) {
            //if (!value) return true; // Si es null o vacío, pasa
         
            const { fecha_inicio, es_indefinido } = this.parent;
          
            if(es_indefinido){
               return true;
            }else{
               return value > fecha_inicio;
            }
         }
      )
      .typeError("La fecha de fin no es válida"),
   sueldo: yup
  .number()
  .transform((value, originalValue) => {
    if (originalValue === "" || originalValue === null || originalValue === undefined) {
      return NaN; // Forzar error en typeError / required
    }
    return Number(originalValue);
  })
  .typeError("El sueldo base debe ser un número")
  .min(0, "El sueldo base debe ser mayor a 0") // ahora sí estrictamente mayor que 0
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
   banco: yup.string().required("El banco es requerido"),
   numero_cuenta: yup.string().required("El número de cuenta es requerido"),
filial_id: yup
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
         .required("La empresa es obligatorio"),
    id_cargo_sunat: yup
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
         .required("El cargo de la SUNAT es obligatorio"),
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

       estado_civil: yup
      .string()
      .oneOf(
         ["SOLTERO", "CASADO", "DIVORCIADO", "VIUDO", "CONVIVIENTE"],
         "El estado civil debe ser SOLTERO, CASADO, DIVORCIADO, VIUDO o CONVIVIENTE"
      )
      .required("El estado civil es requerido"),
      ruc:yup.string()
         .notRequired()
         .nullable()
         .test('is-empty-or-numeric', 'El RUC debe contener solo números', 
            value => { 
               return !value || /^\d+$/.test(value)
            }),
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

      
   asignacion_familiar: yup.boolean().default(false),

   asignacion_familiar_fecha: yup
    .mixed()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null
        ? null
        : new Date(originalValue)
    )
    .nullable()
    .test(
      "fecha-asignacion-familiar",
      "La fecha es requerida",
      function (value) {
        
        const { asignacion_familiar } = this.parent;
        // Si asignacion_familiar es true, la fecha debe existir
        if (asignacion_familiar) {
          return !!value;
        }
        return true; // si no tiene asignación familiar, no se valida
      }
    )
    .typeError("La fecha de asignación familiar no es válida"),

    cuspp_afp: yup
      .string()
      .nullable()
      .test(
        "cuspp-afp",
        "El CUSPP debe tener máximo 13 caracteres",
        function (value) {
       
          if(value){
            // Si tiene valor, validar longitud exacta de 13
            return value.length == 13;
          }else{
            // Si no tiene valor, no se valida
            return true
          }
        }
      )
   });
