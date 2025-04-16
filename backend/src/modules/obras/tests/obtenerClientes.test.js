const ObtenerClientes = require('../application/useCases/obtenerClientes');
const SequelizeClienteRepository = require('../infrastructure/repositories/sequelizeClienteRepository');

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

describe("Caso de uso: Obtener Clientes", () => {
  it("debe retornar un array de clientes", async () => {
    const resultado = await ObtenerClientes(clienteRepository);
    expect(resultado.codigo).toBe(200);
    expect(Array.isArray(resultado.respuesta)).toBe(true);
  });
});
