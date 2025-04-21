const obtenerUsuarioPorId = require("../application/useCases/obtenerUsuarioPorId");

describe("🧪 obtenerUsuarioPorId", () => {
  const mockUsuarioRepository = {
    obtenerPorId: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe obtener un usuario por ID", async () => {
    const usuarioSimulado = {
      id: 1,
      nombre: "Lucas",
      email: "lucas@grupoinnova.pe",
      rol: "Gerencia",
    };

    mockUsuarioRepository.obtenerPorId.mockResolvedValue(usuarioSimulado);

    const resultado = await obtenerUsuarioPorId(1, mockUsuarioRepository);

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.usuario).toEqual(usuarioSimulado);
  });

  it("❌ debe retornar error si el usuario no existe", async () => {
    mockUsuarioRepository.obtenerPorId.mockResolvedValue(null);

    const resultado = await obtenerUsuarioPorId(999, mockUsuarioRepository);

    expect(resultado.codigo).toBe(404);
    expect(resultado.respuesta.mensaje).toBe("Usuario no encontrado");
  });
});