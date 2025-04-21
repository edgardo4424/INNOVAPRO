const actualizarUsuario = require("../application/useCases/actualizarUsuario");

describe("🧪 actualizarUsuario", () => {
  const mockUsuarioRepository = {
    obtenerPorId: jest.fn(),
    obtenerPorEmail: jest.fn(),
    actualizarUsuario: jest.fn(),
  };

  const datosValidos = {
    nombre: "Lucas Actualizado",
    email: "lucas_actualizado@grupoinnova.pe",
    rol: "Gerencia",
  };

  const usuarioActualizado = {
    id: 1,
    ...datosValidos,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe actualizar el usuario correctamente", async () => {
    mockUsuarioRepository.obtenerPorId.mockResolvedValue({ id: 1 });
    mockUsuarioRepository.obtenerPorEmail.mockResolvedValue(null); // No hay duplicado
    mockUsuarioRepository.actualizarUsuario.mockResolvedValue(usuarioActualizado);

    const resultado = await actualizarUsuario(
      1,
      datosValidos,
      mockUsuarioRepository
    );

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.usuario).toBeDefined();
    expect(resultado.respuesta.usuario.email).toBe(datosValidos.email);
  });

  it("❌ debe fallar si el usuario no existe", async () => {
    mockUsuarioRepository.obtenerPorId.mockResolvedValue(null);

    const resultado = await actualizarUsuario(
      1,
      datosValidos,
      mockUsuarioRepository
    );

    expect(resultado.codigo).toBe(404);
    expect(resultado.respuesta.mensaje).toBe("Usuario no encontrado");
  });

  it("❌ debe fallar si faltan campos obligatorios", async () => {
    mockUsuarioRepository.obtenerPorId.mockResolvedValue({ id: 1 });

    const resultado = await actualizarUsuario(
      1,
      {},
      mockUsuarioRepository
    );

    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta.mensaje).toMatch(/campos.*obligatorios/i);
  });

  it("❌ debe fallar si el email es inválido", async () => {
    mockUsuarioRepository.obtenerPorId.mockResolvedValue({ id: 1 });

    const datos = { ...datosValidos, email: "correo_invalido" };

    const resultado = await actualizarUsuario(
      1,
      datos,
      mockUsuarioRepository
    );

    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta.mensaje).toBe("Formato de correo inválido");
  });

  it("❌ debe fallar si el rol no es válido", async () => {
    mockUsuarioRepository.obtenerPorId.mockResolvedValue({ id: 1 });

    const datos = { ...datosValidos, rol: "Inválido" };

    const resultado = await actualizarUsuario(
      1,
      datos,
      mockUsuarioRepository
    );

    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta.mensaje).toBe("Rol no permitido");
  });

  it("❌ debe fallar si el email ya está en uso", async () => {
    mockUsuarioRepository.obtenerPorId.mockResolvedValue({ id: 1 });
    mockUsuarioRepository.obtenerPorEmail.mockResolvedValue({ id: 2 }); // Simula duplicado

    const resultado = await actualizarUsuario(
      1,
      datosValidos,
      mockUsuarioRepository
    );

    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta.mensaje).toBe("El correo ya está registrado");
  });
});