import * as yup from "yup";

//tipo de cliente

// persona jurídica:
// - razón social
// - ruc
// - representante legal
// - Domicilio fiscal

// - tipo de documento
// - numero de documento
// - Teléfono
// - Correo

// Persona natural
// - nombre completo

// - tipo de documento
// - numero del documento
// - teléfono
// - correo

// Tanto la razon social como el nombre completo, se guardan en al atrbuto llamado 'RAZON SOCIAL'
export const obtenerClienteSchema = (tipo) =>
   yup.object({
      tipo: yup.string().required("Debe de seleccionar el tipo de Cliente"),
      razon_social: yup
         .string()
         .required(
            `${tipo === "Persona Jurídica"
               ? "La Razón social es requerida"
               : "El nombre es  requerido"
            }`
         )
         .min(4),
      ruc:
         tipo === "Persona Jurídica"
            ? yup
               .string()
               .required("El ruc es requerido")
               .test(
                  "len",
                  "Must be exactly 11 characters",
                  (val) => val.length === 11
               )
            : yup.string().notRequired(),
      representante_legal:
         tipo === "Persona Jurídica"
            ? yup.string().required("El representante legal es requerido")
            : yup.string().notRequired(),
      tipo_documento: yup
         .string()
         .required("Debe de seleccionar el Tipo de Documento"),
      dni_representante:
         tipo === "Persona Jurídica"
            ? yup.string().required("El DNI del representante es requerido")
            : yup.string().notRequired,
      domicilio_fiscal:
         tipo === "Persona Jurídica"
            ? yup.string().required("El domicilio fiscal es requerido")
            : yup.string().notRequired(),

      dni:
         tipo === "Persona Jurídica"
            ? yup.string().notRequired()
            : yup.string().required("EL DNI es requerido"),
      telefono: yup.string().required("El telefono es requerido"),
      email: yup
         .string()
         .required("El email es requerido")
         .email("El email no es valido"),
   });
