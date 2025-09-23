import * as yup from "yup";

export const obtenerEmpresaSchema = () =>
   yup.object({
      razon_social: yup
         .string()
         .trim()
         .required("La razón social es obligatoria"),

      ruc: yup
         .string()
         .required("El RUC es obligatorio")
         .matches(/^\d{11}$/, "El RUC debe tener exactamente 11 dígitos"),

      direccion: yup
         .string()
         .trim()
         .required("La dirección fiscal es obligatoria"),

      representante_legal: yup
         .string()
         .trim()
         .required("El representante legal es obligatorio"),

      tipo_documento: yup
         .string()
         .required("Debe seleccionar un tipo de documento"),

      dni_representante: yup
         .string()
         .required("El DNI del representante es obligatorio")
         /* .matches(
            /^\d{8}$/,
            "El DNI del representante debe tener exactamente 8 dígitos"
         ), */,

      cargo_representante: yup
         .string()
         .trim()
         .required("El cargo del representante es obligatorio"),

      telefono_representante: yup
         .string()
         .required("El teléfono del representante es requerido"),
      telefono_oficina: yup
         .string()
         .required("El Telefono de oficina es requerido"),
   });
