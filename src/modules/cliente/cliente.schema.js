// Validaciones


const clienteCreateSchema = clienteSchema;


const clienteUpdateSchema = clienteSchema.extend({
  password: passwordSchema.optional()
});

module.exports = {
    clienteCreateSchema,
    clienteUpdateSchema,
};