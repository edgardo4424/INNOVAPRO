import * as yup from "yup";

export const obtenerContactoSchema = () =>
   yup.object({
      nombre: yup.string().required("El campo nombre es requerido").min(3, "Ingrese un nombre con mas de 3 caracteres"),
      email: yup.string()
         .required("El campo email es requerido")
         .email("El email ingresado no es valdido."),
      telefono: yup.string().required("El campo teléfono es requerido"),
      cargo: yup.string().required("El campo cargo es requerido"),
   });
