jest.mock('../infrastructure/repositories/SequelizeParametrosTributariosRepository', () => {
  const { MockParametrosTributariosRepository } = require('./__mocks__/repositories');
  return MockParametrosTributariosRepository;
});

const CalcularQuintaProyectada = require('../application/useCases/calcularQuintaProyectada');

describe('CalcularQuintaProyectada', () => {
  test('calcula DTO básico', async () => {
    const useCase = new CalcularQuintaProyectada();
    const dto = await useCase.execute({
      anio: 2025,
      mes: 8,
      dni: '12345678',
      trabajadorId: 1,
      remuneracionMensualActual: 3000,
      ingresosPreviosAcumulados: 0,
      gratiJulioProj: 0,
      gratiDiciembreProj: 0,
      otrosIngresosProyectados: 0,
      retencionesPrevias: 0
    });

    expect(dto).toHaveProperty('bruto_anual_proyectado');
    expect(dto).toHaveProperty('retencion_base_mes');
    expect(dto.uit_valor).toBe(4950); // viene del mock
  });
});
