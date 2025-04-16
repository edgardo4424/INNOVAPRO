const SequelizeClienteRepository = require('../infrastructure/repositories/sequelizeClienteRepository');
const EliminarCliente = require('../application/useCases/eliminarCliente');
const CrearCliente = require('../application/useCases/crearCliente');
const entidadService = require('../infrastructure/services/entidadService');

const clienteRepository = new SequelizeClienteRepository();
const { Cliente } = require('../infrastructure/models/clienteModel');
const db = require('../../../models');
const sequelize = require('../../../config/db');

if (!Cliente.associations || !Cliente.associations.contactos_asociados) {
  Cliente.belongsToMany(db.contactos, {
    through: "contacto_clientes",
    foreignKey: "cliente_id",
    otherKey: "contacto_id",
    as: "contactos_asociados"
  });
}

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
});

describe("Caso de uso: Eliminar Cliente", () => {
  it("debe eliminar correctamente un cliente existente", async () => {
    const timestamp = Date.now();
    const clienteCreado = await CrearCliente({
      razon_social: `Cliente Test ${timestamp}`,
      tipo: "Persona Jurídica",
      ruc: `20${Math.floor(100000000 + Math.random() * 900000000)}`,
      telefono: "987654321",
      email: `test${timestamp}@mail.com`,
      domicilio_fiscal: "Calle Falsa 123",
      representante_legal: "Juan Pérez",
      dni_representante: `${Math.floor(10000000 + Math.random() * 89999999)}`,
      creado_por: 1
    }, clienteRepository, entidadService);

    const clienteId = clienteCreado.respuesta.cliente.id;
    const resultado = await EliminarCliente(clienteId, clienteRepository);

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.mensaje).toMatch(/eliminado/i);
  });
});
