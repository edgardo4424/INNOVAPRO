import * as yup from 'yup';

export const obraSchema = () => yup.object({
  nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .matches(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,\-\s]+$/,
      'El nombre contiene caracteres no permitidos'
    ),

  direccion: yup
    .string()
    .required('La dirección es obligatoria'),

  ubicacion: yup
    .string()
    .nullable(), 

  estado: yup
    .string()
    .oneOf(
      [
        'Planificación',
        'Demolición',
        'Excavación',
        'Cimentación y estructura',
        'Cerramientos y albañilería',
        'Acabados',
        'Entrega y postventa',
      ],
      'Estado no válido'
    )
    .required('Debes seleccionar una etapa de la obra'),

});
