const { verificarDuplicadosRUC } = require("../infrastructure/services/entidadService");

describe("🧪 verificarDuplicadosRUC", () => {
  const modeloMock = {
    findOne: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar null si no se proporciona RUC", async () => {
    const resultado = await verificarDuplicadosRUC(modeloMock, {});
    expect(resultado).toBeNull();
  });

  it("✅ debe retornar null si no se encuentra duplicado", async () => {
    modeloMock.findOne.mockResolvedValue(null);
  
    const resultado = await verificarDuplicadosRUC(modeloMock, { ruc: "20123456789" });
  
    expect(modeloMock.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          ruc: "20123456789",
        }),
      })
    );
    expect(resultado).toBeNull();
  });
  

  it("✅ debe detectar duplicado y retornar mensaje", async () => {
    modeloMock.findOne.mockResolvedValue({ id: 5 });

    const resultado = await verificarDuplicadosRUC(modeloMock, { ruc: "20123456789" });

    expect(resultado).toBe("El RUC ingresado ya está registrado.");
  });

  it("❌ debe lanzar error si el modelo no es válido", async () => {
    await expect(() =>
      verificarDuplicadosRUC({}, { ruc: "20123456789" })
    ).rejects.toThrow("Modelo no válido para verificación de duplicados.");
  });
});
