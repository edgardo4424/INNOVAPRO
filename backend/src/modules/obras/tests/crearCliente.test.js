const CrearCliente = require('../application/useCases/crearCliente');
const SequelizeClienteRepository = require('../infrastructure/repositories/sequelizeClienteRepository');
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
    try {
      await sequelize.authenticate(); // ← IMPORTANTE
      await sequelize.sync();
    } catch (error) {
      console.error("❌ Sequelize falló en beforeAll:", error);
    }
  });


describe("Caso de uso: Crear Cliente", () => {
  it("debe fallar si faltan campos obligatorios", async () => {
    const datosInvalidos = { razon_social: "", tipo: "" };

    const resultado = await CrearCliente(datosInvalidos, clienteRepository, entidadService);
    
    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta).toHaveProperty("mensaje");
  });

  it("debe crear un cliente válido correctamente", async () => {
    const timestamp = Date.now(); // Genera un timestamp único para evitar duplicados en el email y RUC

    const datosValidos = {
        razon_social: `Cliente de Prueba TEST ${timestamp}`,
        tipo: "Persona Jurídica",
        ruc: `20${Math.floor(100000000 + Math.random() * 900000000)}`, // evita duplicados
        telefono: "987654321",
        email: `test${timestamp}@mail.com`, // único
        domicilio_fiscal: "Calle Falsa 123",
        representante_legal: "Juan Pérez",
        dni_representante: `${Math.floor(10000000 + Math.random() * 89999999)}`,
        creado_por: 1
      };

    const resultado = await CrearCliente(datosValidos, clienteRepository, entidadService);

    expect(resultado.codigo).toBe(201);
    expect(resultado.respuesta).toHaveProperty("cliente");
    expect(resultado.respuesta.cliente).toHaveProperty("id");
  });
});
