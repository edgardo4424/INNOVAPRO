const marcarComoLeida = require("../application/useCases/marcarComoLeida");

describe("🧪 marcarComoLeida", () => {
    const mockRepo = {
      marcarComoLeida: jest.fn(),
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("✅ debe marcar una notificación como leída si existe", async () => {
      const notificacionId = 1;
      mockRepo.marcarComoLeida.mockResolvedValue({
        id: 1,
        leida: true,
      });
  
      const resultado = await marcarComoLeida(notificacionId, mockRepo);
  
      expect(mockRepo.marcarComoLeida).toHaveBeenCalledWith(notificacionId);
      expect(resultado.codigo).toBe(200);
      expect(resultado.respuesta.mensaje).toBe("Notificación marcada como leída");
    });
  
    it("❌ debe retornar 404 si la notificación no existe", async () => {
      mockRepo.marcarComoLeida.mockResolvedValue(null);
  
      const resultado = await marcarComoLeida(999, mockRepo);
  
      expect(resultado.codigo).toBe(404);
      expect(resultado.respuesta.mensaje).toBe("Notificación no encontrada");
    });
  });