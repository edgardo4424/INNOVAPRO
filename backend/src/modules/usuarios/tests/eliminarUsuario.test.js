const eliminarUsuario = require("../application/useCases/eliminarUsuario");

describe("🧪 eliminarUsuario", () => {
  const mockUsuarioRepository = {
    obtenerPorId: jest.fn(),
    eliminarUsuario: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe eliminar el usuario correctamente", async () => {
    mockUsuarioRepository.obtenerPorId.mockResolvedValue({ id: 1 });

    const resultado = await eliminarUsuario(1, mockUsuarioRepository);

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.mensaje).toBe("Usuario eliminado exitosamente");
  });

  it("❌ debe retornar error si el usuario no existe", async () => {
    mockUsuarioRepository.obtenerPorId.mockResolvedValue(null);

    const resultado = await eliminarUsuario(999, mockUsuarioRepository);

    expect(resultado.codigo).toBe(404);
    expect(resultado.respuesta.mensaje).toBe("Usuario no encontrado");
  });
});