const { verificarDuplicados } = require("../infrastructure/services/entidadService");
const { Op } = require("sequelize");

describe("🧪 verificarDuplicados", () => {
  const mockModelo = {
    findOne: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar null si no hay campos relevantes para verificar", async () => {
    const resultado = await verificarDuplicados(mockModelo, {});
    expect(resultado).toBeNull();
  });

  it("✅ debe retornar null si no hay duplicado encontrado", async () => {
    mockModelo.findOne.mockResolvedValue(null);

    const resultado = await verificarDuplicados(mockModelo, {
      email: "test@innova.com",
    });

    expect(mockModelo.findOne).toHaveBeenCalledWith({
      where: {
        [Op.or]: [{ email: "test@innova.com" }],
      },
    });
    expect(resultado).toBeNull();
  });

  it("✅ debe detectar duplicado por RUC", async () => {
    mockModelo.findOne.mockResolvedValue({ ruc: "12345678901" });

    const resultado = await verificarDuplicados(mockModelo, {
      ruc: "12345678901",
    });

    expect(resultado).toMatch(/ruc.*ya está registrado/i);
  });

  it("✅ debe detectar duplicado por DNI del representante", async () => {
    mockModelo.findOne.mockResolvedValue({ dni_representante: "98765432" });

    const resultado = await verificarDuplicados(mockModelo, {
      dni_representante: "98765432",
    });

    expect(resultado).toMatch(/representante.*ya está registrado/i);
  });

  it("✅ debe aplicar excludeId correctamente", async () => {
    mockModelo.findOne.mockResolvedValue(null);
    await verificarDuplicados(mockModelo, {
      email: "lucas@innova.com",
    }, 5);

    expect(mockModelo.findOne).toHaveBeenCalledWith({
      where: {
        [Op.or]: [{ email: "lucas@innova.com" }],
        id: { [Op.ne]: 5 },
      },
    });
  });

  it("❌ debe lanzar error si modelo no tiene findOne", async () => {
    await expect(() =>
      verificarDuplicados({}, { email: "x@x.com" })
    ).rejects.toThrow("Modelo no válido para verificación de duplicados.");
  });
});
