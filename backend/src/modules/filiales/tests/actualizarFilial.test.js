const ActualizarFilial = require("../application/useCases/actualizarFilial");

describe("🧪 Caso de uso: Actualizar Filial", () => {
  const mockFilial = {
    id: 1,
    razon_social: "Empresa Test",
    direccion: "Antigua",
    telefono_oficina: "999",
  };

  const mockModelo = {
    findOne: jest.fn().mockResolvedValue(null),
  }

  const verificarDuplicadosRUC = jest.fn().mockImplementation(() => Promise.resolve(null));

  const mockFilialRepository = {
    obtenerPorId: jest.fn(),
    actualizarFilial: jest.fn(),
    getModel: jest.fn(() => mockModelo),
  };


  it("✅ debe actualizar correctamente una filial existente", async () => {
    mockFilialRepository.obtenerPorId.mockResolvedValue(mockFilial);
    mockFilialRepository.actualizarFilial.mockResolvedValue({
      ...mockFilial,
      direccion: "Calle Actualizada 456",
      telefono_oficina: "011111111",
    });

    const resultado = await ActualizarFilial(
      1,
      { direccion: "Calle Actualizada 456", telefono_oficina: "011111111" },
      mockFilialRepository,
      { verificarDuplicadosRUC }
    );

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.filial.direccion).toBe("Calle Actualizada 456");
  });

  it("❌ debe retornar 404 si la filial no existe", async () => {
    mockFilialRepository.obtenerPorId.mockResolvedValue(null);

    const resultado = await ActualizarFilial(
      999,
      { telefono_oficina: "999999" },
      mockFilialRepository,
      { verificarDuplicadosRUC }
    );

    expect(resultado.codigo).toBe(404);
  });

  it("❌ debe fallar si no se envían campos válidos", async () => {
    mockFilialRepository.obtenerPorId.mockResolvedValue(mockFilial);

    const resultado = await ActualizarFilial(
      1,
      {},
      mockFilialRepository,
      { verificarDuplicadosRUC }
    );

    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta.mensaje).toMatch(/al menos un campo válido/i);
  });
});