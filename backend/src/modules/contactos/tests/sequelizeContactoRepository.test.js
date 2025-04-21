const SequelizeContactoRepository = require("../infrastructure/repositories/sequelizeContactoRepository");

jest.mock("../../../models", () => ({
  sequelize: {
    transaction: jest.fn().mockResolvedValue({
      commit: jest.fn(),
    }),
  },
  clientes: {
    findAll: jest.fn(),
  },
  obras: {
    findAll: jest.fn(),
  },
  contacto_clientes: {
    bulkCreate: jest.fn(),
  },
  contacto_obras: {
    bulkCreate: jest.fn(),
  }
}));

jest.mock("../infrastructure/models/contactoModel", () => ({
  Contacto: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  }
}));

const { Contacto } = require("../infrastructure/models/contactoModel");
const db = require("../../../models");

describe("🧪 SequelizeContactoRepository", () => {
  const repo = new SequelizeContactoRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe crear contacto con relaciones", async () => {
    const mockContacto = { id: 1 };
    Contacto.create.mockResolvedValue(mockContacto);
    db.clientes.findAll.mockResolvedValue([{ id: 2 }]);
    db.obras.findAll.mockResolvedValue([{ id: 5 }]);

    const data = {
      nombre: "Lucía",
      email: "lucia@innova.pe",
      clientesIds: [2],
      obrasIds: [5],
    };

    const resultado = await repo.crear(data);

    expect(Contacto.create).toHaveBeenCalledWith(data, expect.anything());
    expect(db.clientes.findAll).toHaveBeenCalled();
    expect(db.obras.findAll).toHaveBeenCalled();
    expect(db.contacto_clientes.bulkCreate).toHaveBeenCalled();
    expect(db.contacto_obras.bulkCreate).toHaveBeenCalled();
    expect(resultado).toBe(mockContacto);
  });

  it("✅ debe obtener todos los contactos", async () => {
    const mockLista = [{ id: 1 }, { id: 2 }];
    Contacto.findAll.mockResolvedValue(mockLista);

    const resultado = await repo.obtenerContactos();

    expect(Contacto.findAll).toHaveBeenCalled();
    expect(resultado).toEqual(mockLista);
  });

  it("✅ debe obtener contacto por ID", async () => {
    const contacto = { id: 1 };
    Contacto.findByPk.mockResolvedValue(contacto);

    const resultado = await repo.obtenerPorId(1);

    expect(Contacto.findByPk).toHaveBeenCalledWith(1, expect.anything());
    expect(resultado).toBe(contacto);
  });

  it("✅ debe actualizar contacto con nuevas relaciones", async () => {
    const mockContacto = {
      update: jest.fn(),
      setClientes_asociados: jest.fn(),
      setObras_asociadas: jest.fn()
    };

    Contacto.findByPk.mockResolvedValue(mockContacto);

    const resultado = await repo.actualizarContacto(1, {
      nombre: "Pedro Modificado",
      clientesIds: [3],
      obrasIds: [6]
    });

    expect(mockContacto.update).toHaveBeenCalled();
    expect(mockContacto.setClientes_asociados).toHaveBeenCalledWith([3]);
    expect(mockContacto.setObras_asociadas).toHaveBeenCalledWith([6]);
    expect(resultado).toBe(mockContacto);
  });

  it("✅ debe eliminar contacto si existe", async () => {
    const contacto = { destroy: jest.fn().mockResolvedValue(true) };
    repo.obtenerPorId = jest.fn().mockResolvedValue(contacto);

    const resultado = await repo.eliminarContacto(1);

    expect(contacto.destroy).toHaveBeenCalled();
    expect(resultado).toBeDefined();
  });

  it("❌ debe retornar null si el contacto no existe al eliminar", async () => {
    repo.obtenerPorId = jest.fn().mockResolvedValue(null);

    const resultado = await repo.eliminarContacto(999);

    expect(resultado).toBeNull();
  });
});
