jest.mock("../../../shared/utils/websockets", () => ({
    getIo: jest.fn(),
  }));
  
  const { emitirNotificacionPrivada } = require("../infrastructure/services/emisorNotificaciones");
  const { getIo } = require("../../../shared/utils/websockets");
  
  describe("🧪 emitirNotificacionPrivada", () => {
    let mockEmit;
  
    beforeEach(() => {
      mockEmit = jest.fn();
      getIo.mockReturnValue({
        to: jest.fn(() => ({
          emit: mockEmit,
        })),
      });
    });
  
    it("✅ debe emitir notificación al canal del usuario correspondiente", () => {
      const notificacion = {
        titulo: "Tarea finalizada",
        mensaje: "La tarea #123 ha sido finalizada.",
        tipo: "tarea_finalizada",
        usuarioId: 5,
      };
  
      emitirNotificacionPrivada(notificacion.usuarioId, notificacion);
  
      expect(getIo).toHaveBeenCalled();
      expect(getIo().to).toHaveBeenCalledWith("usuario_5");
      expect(mockEmit).toHaveBeenCalledWith("nuevaNotificacion", notificacion);
    });
  
    it("❌ no debe emitir si falta el usuarioId", () => {
      emitirNotificacionPrivada(null, { mensaje: "invalida" });
  
      expect(getIo().to).not.toHaveBeenCalled();
      expect(mockEmit).not.toHaveBeenCalled();
    });
  
    it("❌ no debe emitir si falta la notificación", () => {
      emitirNotificacionPrivada(5, null);
  
      expect(getIo().to).not.toHaveBeenCalled();
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });
  