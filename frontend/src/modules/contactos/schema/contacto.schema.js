import * as yup from "yup";

const obtenerSchemaContacto = () =>
   yup.object({
      nombre: string().required("El nombre es requerido").min(4, ""),
      email: string()
         .required("El emaail es requerido")
         .email("El email ingresado es invalido."),
      telefono: string().required("El teléfono es requerido"),
      cargo: string().required("El cargo es requerido"),
   });
