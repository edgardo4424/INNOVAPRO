const { z } = require('zod');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

// 🔒 Regla de validación de contraseña (reutilizable)
const passwordSchema = z.string({ required_error: 'La contraseña es obligatoria' })
  .regex(passwordRegex, {
    message: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número',
  });

// 🛡️ Schema base de usuario con validaciones claras y .strict() para evitar campos no definidos
const usuarioSchema = z.object({
  
  nombre: z.string({ required_error: 'El nombre es obligatorio' }),

  email: z.string({ required_error: 'El email es obligatorio' })
    .email({ message: 'El email no es válido' }),

  password: passwordSchema,

  rol_id: z.number({ required_error: 'El rol es obligatorio' })
}).strip(); // ✅ Elimina cualquier campo adicional sin dar error

// 🛡️ Schema base de usuario con validaciones claras y .strict() para evitar campos no definidos
const usuarioAuthSchema = z.object({
  
  email: z.string({ required_error: 'El email es obligatorio' })
    .email({ message: 'El email no es válido' }),

  password: passwordSchema,

  recaptchaToken: z.string({ required_error: 'El recaptchaToken es obligatorio' })
}).strip(); 

// 🔧 Validación para crear (campos requeridos definidos arriba con mensajes personalizados)
const usuarioCreateSchema = usuarioSchema;

// ✨ Actualizar: todos obligatorios excepto password
const usuarioUpdateSchema = usuarioSchema.extend({
  password: passwordSchema.optional()
});

module.exports = {
  usuarioCreateSchema,
  usuarioUpdateSchema,
  usuarioAuthSchema
};