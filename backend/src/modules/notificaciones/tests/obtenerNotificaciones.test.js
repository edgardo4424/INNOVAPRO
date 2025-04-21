const obtenerNotificaciones = require("../application/useCases/obtenerNotificaciones");

describe("🧪 obtenerNotificaciones", () => {
  const mockRepo = {
    obtenerPorUsuario: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar notificaciones ordenadas para el usuario", async () => {
    const usuarioId = 1;
    const notificacionesSimuladas = [
      { id: 1, titulo: "Bienvenido", leida: false },
      { id: 2, titulo: "Nuevo mensaje", leida: true },
    ];

    mockRepo.obtenerPorUsuario.mockResolvedValue(notificacionesSimuladas);

    const resultado = await obtenerNotificaciones(usuarioId, mockRepo);

    expect(mockRepo.obtenerPorUsuario).toHaveBeenCalledWith(usuarioId);
    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.notificaciones).toEqual(notificacionesSimuladas);
  });
});