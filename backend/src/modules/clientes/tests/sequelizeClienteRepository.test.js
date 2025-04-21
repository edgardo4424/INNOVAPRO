jest.mock("../../../models", () => ({
    contactos: {},
}))

const SequelizeClienteRepository = require("../infrastructure/repositories/sequelizeClienteRepository");

jest.mock("../infrastructure/models/clienteModel", () => ({
  Cliente: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  }
}));

const { Cliente } = require("../infrastructure/models/clienteModel");

describe("🧪 SequelizeClienteRepository", () => {
  const repo = new SequelizeClienteRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe crear un cliente", async () => {
    const clienteData = { razon_social: "INNOVA" };
    Cliente.create.mockResolvedValue(clienteData);

    const resultado = await repo.crear(clienteData);

    expect(Cliente.create).toHaveBeenCalledWith(clienteData);
    expect(resultado).toBe(clienteData);
  });

  it("✅ debe obtener todos los clientes", async () => {
    const lista = [{ id: 1 }, { id: 2 }];
    Cliente.findAll.mockResolvedValue(lista);

    const resultado = await repo.obtenerClientes();

    expect(Cliente.findAll).toHaveBeenCalled();
    expect(resultado).toEqual(lista);
  });

  it("✅ debe obtener un cliente por ID", async () => {
    const cliente = { id: 1 };
    Cliente.findByPk.mockResolvedValue(cliente);

    const resultado = await repo.obtenerPorId(1);

    expect(Cliente.findByPk).toHaveBeenCalledWith(1);
    expect(resultado).toBe(cliente);
  });

  it("✅ debe actualizar un cliente si existe", async () => {
    const mockCliente = { update: jest.fn().mockResolvedValue(true) };
    Cliente.findByPk.mockResolvedValue(mockCliente);

    const resultado = await repo.actualizarCliente(1, { telefono: "987654321" });

    expect(mockCliente.update).toHaveBeenCalledWith({ telefono: "987654321" });
    expect(resultado).toBe(mockCliente);
  });

  it("❌ debe retornar null si el cliente no existe al actualizar", async () => {
    Cliente.findByPk.mockResolvedValue(null);

    const resultado = await repo.actualizarCliente(1, {});
    expect(resultado).toBeNull();
  });

  it("✅ debe eliminar un cliente si existe", async () => {
    const mockCliente = { destroy: jest.fn().mockResolvedValue(true) };
    repo.obtenerPorId = jest.fn().mockResolvedValue(mockCliente);

    const resultado = await repo.eliminarCliente(1);

    expect(mockCliente.destroy).toHaveBeenCalled();
    expect(resultado).toBe(true);
  });

  it("❌ debe retornar null si el cliente no existe al eliminar", async () => {
    repo.obtenerPorId = jest.fn().mockResolvedValue(null);

    const resultado = await repo.eliminarCliente(999);
    expect(resultado).toBeNull();
  });
});
