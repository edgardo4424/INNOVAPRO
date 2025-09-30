import * as yup from "yup";

export const adelantosSueldoSchema = yup.object().shape({
  trabajador_id: yup
    .number()
    .typeError("Trabajador es requerido")
    .required("Trabajador es requerido"),
  fecha: yup.string().required("La fecha es requerida"),
  monto: yup
    .number()
    .typeError("El monto debe ser un número") // valida "" o texto
    .moreThan(0, "El monto debe ser mayor a 0") // estrictamente > 0
    .required("El monto es requerido"),
  observacion: yup.string().nullable(),
  
  tipo: yup.string().required("El tipo de adelanto es requerido"),
  forma_descuento: yup
    .string()
    .nullable()
    .test("forma-de-descuento-es-requerida-si-el-tipo-es-simple", "La forma de descuento es requerida", function(value) {
      return this.parent.tipo === "simple" ? value !== null : true;
    }),
   primera_cuota: yup
    .string()
    .nullable()
    .test("primera-cuota-es-requerida-si-el-tipo-es-simple", "La fecha de primera cuota es requerida", function(value) {
        console.log('this.parent.tipo', this.parent.tipo);
        console.log('value', value);
      return this.parent.tipo === "simple" ? value !== null : true;
    }),
  cuotas: yup
    .number()
    .typeError("Las cuotas deben ser un número")
    .min(1, "Las cuotas deben ser al menos 1")
    .required("Las cuotas son requeridas"),
  cuotas_pagadas: yup.number().nullable(),
});
