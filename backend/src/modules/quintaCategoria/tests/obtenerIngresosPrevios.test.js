const ObtenerIngresosPrevios = require("../application/useCases/obtenerIngresosPrevios");

describe("ObtenerIngresosPrevios UseCase", () => {
  let useCase;
  let mockQuintaRepo, mockBonoRepo, mockGratiRepo;

  beforeEach(() => {
    // Mocks de repositorios
    mockQuintaRepo = {
      getContratoVigente: jest.fn(),
      findByWorkerYear: jest.fn(),
    };
    mockBonoRepo = {
      obtenerBonoTotalDelTrabajadorPorRangoFecha: jest.fn(),
    };
    mockGratiRepo = {
      calcularGratificaciones: jest.fn(),
    };

    // Inyectamos mocks directamente en el constructor
    useCase = new ObtenerIngresosPrevios({
      quintaRepo: mockQuintaRepo,
      bonoRepo: mockBonoRepo,
      gratiRepo: mockGratiRepo,
    });
  });

  it("✅ retorna ingresos previos detallados cuando existen datos", async () => {
    const trabajadorId = 1;
    const anio = 2025;
    const mes = 5; // Mayo → primer semestre

    // Mock contrato vigente
    mockQuintaRepo.getContratoVigente.mockResolvedValue({
      trabajador_id: trabajadorId,
      sueldo: 3000,
      filial_id: 10,
      numero_documento: "12345678",
      asignacion_familiar: 102.5,
    });

    // Mock bonos acumulados
    mockBonoRepo.obtenerBonoTotalDelTrabajadorPorRangoFecha.mockResolvedValue(1500);

    // Mock gratificación JULIO
    mockGratiRepo.calcularGratificaciones.mockResolvedValue({
      planilla: {
        trabajadores: [
          {
            numero_documento: "12345678",
            consolidado: { total: 3000 },
          },
        ],
      },
    });

    // Mock retenciones previas
    mockQuintaRepo.findByWorkerYear.mockResolvedValue([
      { mes: 1, retencion_base_mes: 500, retencion_adicional_mes: 0 },
      { mes: 2, retencion_base_mes: 700, retencion_adicional_mes: 0 },
    ]);

    const result = await useCase.execute({ trabajadorId, anio, mes });

    expect(result).toEqual({
      remuneraciones: 3000 * (mes - 1), // 4 meses previos
      gratificaciones: 3000,
      bonos: 1500,
      es_proyeccion: true,
      asignacion_familiar: 102.5,
      otros: 0,
      total_ingresos: 3000 * 4 + 3000 + 1500 + 102.5,
    });

    expect(mockQuintaRepo.getContratoVigente).toHaveBeenCalled();
    expect(mockBonoRepo.obtenerBonoTotalDelTrabajadorPorRangoFecha).toHaveBeenCalled();
    expect(mockGratiRepo.calcularGratificaciones).toHaveBeenCalledWith("JULIO", anio, 10);
  });

  it("❌ lanza error si no existe contrato vigente", async () => {
    mockQuintaRepo.getContratoVigente.mockResolvedValue(null);

    await expect(
      useCase.execute({ trabajadorId: 1, anio: 2025, mes: 3 })
    ).rejects.toThrow("No existe contrato vigente para este trabajador en la fecha indicada");
  });
});