const buscarRUC = require("../application/useCases/buscarRUC");

describe("🧪 Caso de uso: buscarRUC", () => {
  const mockSunatRepository = {
    obtenerPorRUC: jest.fn(),
  };

  it("✅ Debe retornar datos formateados si el RUC existe", async () => {
    mockSunatRepository.obtenerPorRUC.mockResolvedValue({
      nombre_razon_social: "INNOVA S.A.C.",
      tipo_via: "AV.",
      nombre_via: "ALFREDO BENAVIDES",
      numero: "1579",
      interior: "602",
      tipo_zona: "URB.",
      codigo_zona: "SAN JORGE",
      ubigeo: "150122",
      ubigeo_info: {
        distrito: "MIRAFLORES",
        provincia: "LIMA",
        departamento: "LIMA"
      }
    });

    const resultado = await buscarRUC("20123456789", mockSunatRepository);

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.razon_social).toBe("INNOVA S.A.C.");
    expect(resultado.respuesta.domicilio_fiscal).toBe(
      "AV. ALFREDO BENAVIDES - NRO. 1579 - INT. 602 - SAN JORGE URB. - MIRAFLORES - LIMA - LIMA"
    );
  });

  it("❌ Debe retornar error si el RUC no existe", async () => {
    mockSunatRepository.obtenerPorRUC.mockResolvedValue(null);

    const resultado = await buscarRUC("00000000000", mockSunatRepository);
    expect(resultado.codigo).toBe(404);
    expect(resultado.respuesta.mensaje).toMatch(/no encontrado/i);
  });

  it("❌ Debe retornar error si el RUC es inválido", async () => {
    const resultado = await buscarRUC("abc", mockSunatRepository);
    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta.mensaje).toMatch(/ruc inválido/i);
  });
});