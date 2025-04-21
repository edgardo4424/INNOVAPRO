const SequelizeFilialRepository = require("../infrastructure/repositories/sequelizeFilialRepository");

jest.mock("../infrastructure/models/filialModel", () => ({
  Filial: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  }
}));

const { Filial } = require("../infrastructure/models/filialModel");

describe("🧪 SequelizeFilialRepository", () => {
    const repo = new SequelizeFilialRepository();
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("✅ debe crear una filial", async () => {
      const data = { razon_social: "Sucursal Innova" };
      Filial.create.mockResolvedValue(data);
  
      const resultado = await repo.crear(data);
  
      expect(Filial.create).toHaveBeenCalledWith(data);
      expect(resultado).toBe(data);
    });
  
    it("✅ debe obtener todas las filiales", async () => {
      const lista = [{ id: 1 }, { id: 2 }];
      Filial.findAll.mockResolvedValue(lista);
  
      const resultado = await repo.obtenerFiliales();
  
      expect(resultado).toEqual(lista);
    });
  
    it("✅ debe obtener una filial por ID", async () => {
      const filial = { id: 1 };
      Filial.findByPk.mockResolvedValue(filial);
  
      const resultado = await repo.obtenerPorId(1);
  
      expect(resultado).toBe(filial);
    });
  
    it("✅ debe actualizar una filial si existe", async () => {
      const mockFilial = { update: jest.fn().mockResolvedValue(true) };
      Filial.findByPk.mockResolvedValue(mockFilial);
  
      const resultado = await repo.actualizarFilial(1, { direccion: "Actualizada" });
  
      expect(mockFilial.update).toHaveBeenCalledWith({ direccion: "Actualizada" });
      expect(resultado).toBe(mockFilial);
    });
  
    it("❌ debe retornar null si la filial no existe al actualizar", async () => {
      Filial.findByPk.mockResolvedValue(null);
  
      const resultado = await repo.actualizarFilial(1, {});
  
      expect(resultado).toBeNull();
    });
  
    it("✅ debe eliminar una filial si existe", async () => {
      const mockFilial = { destroy: jest.fn().mockResolvedValue(true) };
      repo.obtenerPorId = jest.fn().mockResolvedValue(mockFilial);
  
      const resultado = await repo.eliminarFilial(1);
  
      expect(mockFilial.destroy).toHaveBeenCalled();
      expect(resultado).toBe(true);
    });
  
    it("❌ debe retornar null si la filial no existe al eliminar", async () => {
      repo.obtenerPorId = jest.fn().mockResolvedValue(null);
  
      const resultado = await repo.eliminarFilial(999);
      expect(resultado).toBeNull();
    });
  });