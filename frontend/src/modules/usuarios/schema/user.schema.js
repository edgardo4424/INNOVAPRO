// schemas/usuarioSchema.js
import * as yup from "yup";

export const obtenerUsuarioSchema = (esCrear = true) =>
   yup.object({
      email: yup.string().required("El correo es obligatorio").email(),
      password: esCrear
         ? yup
              .string()
              .required("La contraseña es obligatoria")
              .min(8)
              .matches(
                 /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                 "Debe incluir mayúscula, minúscula y número"
              )
         : yup.string().notRequired(),
      trabajador_id:esCrear? yup.string().required("Debe seleccionar un TRABAJADOR."):yup.string().notRequired(),
   });
