// schemas/usuarioSchema.js
import * as yup from "yup";

export const obtenerUsuarioSchema = (esCrear = true) =>
   yup.object({
      nombre: yup.string().required("El nombre es obligatorio").min(3),
      telefono: yup
         .string()
         .required("El teléfono es obligatorio")
         .matches(/^[0-9]{9}$/, "Debe tener 9 dígitos"),
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
      rol: yup.string().required("Debe seleccionar un rol"),
   });
