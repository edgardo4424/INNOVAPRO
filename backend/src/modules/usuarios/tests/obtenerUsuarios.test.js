const obtenerUsuarios = require("../application/useCases/obtenerUsuarios");

describe("🧪 obtenerUsuarios", () => {
  const mockUsuarioRepository = {
    obtenerUsuarios: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar una lista de usuarios", async () => {
    const listaSimulada = [
      { id: 1, nombre: "Lucas", email: "lucas@grupoinnova.pe", rol: "Gerencia" },
      { id: 2, nombre: "Andrés", email: "andres@grupoinnova.pe", rol: "Ventas" },
    ];

    mockUsuarioRepository.obtenerUsuarios.mockResolvedValue(listaSimulada);

    const resultado = await obtenerUsuarios(mockUsuarioRepository);

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta).toEqual(listaSimulada);
  });

  it("✅ debe retornar una lista vacía si no hay usuarios", async () => {
    mockUsuarioRepository.obtenerUsuarios.mockResolvedValue([]);

    const resultado = await obtenerUsuarios(mockUsuarioRepository);

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta).toEqual([]);
  });
});