const {
  proyectarIngresosAnuales,
  calcularRetencionBaseMes,
  calcularRetencionAdicionalMes,
  impuestoProgresivoDesdeRentaNeta,
  denominadorFraccionamiento
} = require('../shared/utils/tax/calculadorQuinta');

describe('Utils Quinta Categoría', () => {
  test('retorna 0 si renta neta anual <= 0', () => {
  expect(impuestoProgresivoDesdeRentaNeta(0, 4950).total).toBe(0);
});

test('calcula impuesto en primer tramo', () => {
  const uit = 4950;
  const renta = 20000; // ~4 UIT
  const impuesto = impuestoProgresivoDesdeRentaNeta(renta, uit);
  expect(impuesto.total).toBeGreaterThan(0);
});

test('calcularRetencionAdicionalMes retiene extra gravado', () => {
  const parametros = { uit: 4950, deduccionFijaUit: 7 };
  const result = calcularRetencionAdicionalMes({
    anio: 2025,
    rentaNetaAnual: 40000,
    montoExtraGravadoMes: 5000,
    parametros
  });
  expect(result).toBeGreaterThan(0);
});

  test('proyectarIngresosAnuales calcula bien con grati y otros ingresos', () => {
    const result = proyectarIngresosAnuales({
      mes: 6,
      remuneracionMensualActual: 1500,
      ingresosPreviosAcumulados: 3000,
      gratiJulioProj: 1500,
      gratiDiciembreProj: 1500,
      otrosIngresosProyectados: 2000
    });
    expect(result).toBe(3000 + (1500 * 7) + 1500 + 1500 + 2000); // validación exacta
  });

  test('denominadorFraccionamiento retorna divisor correcto', () => {
    expect(denominadorFraccionamiento(2)).toEqual({ divisor: 12, etiqueta: 'ENE-MAR' });
    expect(denominadorFraccionamiento(8)).toEqual({ divisor: 5, etiqueta: 'AGO' });
    expect(denominadorFraccionamiento(12)).toEqual({ divisor: 1, etiqueta: 'DIC' });
  });

  test('calcularRetencionBaseMes proyecta renta e impuesto base', () => {
    const parametros = { uit: 4950, deduccionFijaUit: 7 };
    const result = calcularRetencionBaseMes({
      anio: 2025, mes: 8,
      brutoAnualProyectado: 36000,
      retencionesAcumuladas: 0,
      deduccionAdicionalAnual: 0,
      parametros
    });
    expect(result).toHaveProperty('rentaNetaAnual');
    expect(result).toHaveProperty('impuestoAnual');
    expect(result).toHaveProperty('retencionBaseMes');
  });
});