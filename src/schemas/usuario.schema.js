const { z } = require('zod');

// 🛡️ Schema base de usuario con validaciones claras y .strict() para evitar campos no definidos
const usuarioSchema = z.object({
  email: z.string({ required_error: 'El email es obligatorio' })
    .email({ message: 'El email no es válido' }),

  password: z.string({ required_error: 'La contraseña es obligatoria' })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),

  rolId: z.number({ required_error: 'El rol es obligatorio' })
}).strict({ message: 'No se permiten campos adicionales' }); // 🚫 Rechaza cualquier campo no definido

// 🔧 Validación para crear (campos requeridos definidos arriba con mensajes personalizados)
const usuarioCreateSchema = usuarioSchema;

// ✏️ Validación para actualizar (todos opcionales, pero válidos)
const usuarioUpdateSchema = usuarioSchema.partial();

module.exports = {
  usuarioCreateSchema,
  usuarioUpdateSchema
};