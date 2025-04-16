const SequelizeClienteRepository = require('../infrastructure/repositories/sequelizeClienteRepository');
const ActualizarCliente = require('../application/useCases/actualizarCliente');
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

describe("Caso de uso: Actualizar Cliente", () => {
  it("debe actualizar correctamente un cliente existente", async () => {
    const timestamp = Date.now();
    const nuevoCliente = await CrearCliente({
        razon_social: `Cliente Test ${timestamp}`,
        tipo: "Persona Jurídica",
        ruc: `20${Math.floor(100000000 + Math.random() * 900000000)}`,
        telefono: "987654321",
        email: `actualizado${timestamp}@mail.com`,
        domicilio_fiscal: "Avenida Siempre Viva 742",
        representante_legal: "Luis Ramírez",
        dni_representante: `${Math.floor(10000000 + Math.random() * 89999999)}`,
        creado_por: 1 
      }, clienteRepository, entidadService);
      
    const clienteId = nuevoCliente.respuesta.cliente.id;
    const resultado = await ActualizarCliente(clienteId, {
        telefono: "999999999",
        razon_social: "Cliente Actualizado",
        email: `actualizado${timestamp}@mail.com`,
        tipo: "Persona Jurídica",
        ruc: nuevoCliente.respuesta.cliente.ruc,
        representante_legal: "Luis Ramírez",
        dni_representante: `${timestamp.toString().slice(-8)}`,
        domicilio_fiscal: "Avenida Siempre Viva 742"
      }, clienteRepository, entidadService);      
      
      
    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.cliente.telefono).toBe("999999999");
  });
});
