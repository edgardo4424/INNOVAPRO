const SequelizeObraRepository = require("../infrastructure/repositories/sequelizeObraRepository");

jest.mock("../infrastructure/models/obraModel", () => ({
  Obra: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  }
}));

const { Obra } = require("../infrastructure/models/obraModel");

describe("🧪 SequelizeObraRepository", () => {
  const repo = new SequelizeObraRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ crear obra", async () => {
    const data = { nombre: "Obra Sur" };
    Obra.create.mockResolvedValue(data);

    const resultado = await repo.crear(data);

    expect(Obra.create).toHaveBeenCalledWith(data);
    expect(resultado).toBe(data);
  });

  it("✅ obtener todas las obras", async () => {
    const lista = [{ id: 1 }, { id: 2 }];
    Obra.findAll.mockResolvedValue(lista);

    const resultado = await repo.obtenerObras();
    expect(resultado).toEqual(lista);
  });

  it("✅ obtener obra por ID", async () => {
    const obra = { id: 1 };
    Obra.findByPk.mockResolvedValue(obra);

    const resultado = await repo.obtenerPorId(1);
    expect(resultado).toBe(obra);
  });

  it("✅ actualizar obra", async () => {
    const mockObra = { update: jest.fn().mockResolvedValue(true) };
    Obra.findByPk.mockResolvedValue(mockObra);

    const resultado = await repo.actualizarObra(1, { nombre: "Actualizada" });

    expect(mockObra.update).toHaveBeenCalled();
    expect(resultado).toBe(mockObra);
  });

  it("❌ actualizar obra no existente", async () => {
    Obra.findByPk.mockResolvedValue(null);

    const resultado = await repo.actualizarObra(999, {});
    expect(resultado).toBeNull();
  });

  it("✅ eliminar obra", async () => {
    const mockObra = { destroy: jest.fn().mockResolvedValue(true) };
    repo.obtenerPorId = jest.fn().mockResolvedValue(mockObra);

    const resultado = await repo.eliminarObra(1);

    expect(mockObra.destroy).toHaveBeenCalled();
    expect(resultado).toBe(true);
  });

  it("❌ eliminar obra no existente", async () => {
    repo.obtenerPorId = jest.fn().mockResolvedValue(null);

    const resultado = await repo.eliminarObra(999);

    expect(resultado).toBeNull();
  });
});
