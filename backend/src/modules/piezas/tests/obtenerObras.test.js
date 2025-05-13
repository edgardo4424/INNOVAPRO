const CrearObra = require("../application/useCases/crearObra");
const ObtenerObras = require("../application/useCases/obtenerStock");
const SequelizeObraRepository = require("../infrastructure/repositories/sequelizePiezaRepository");

const obraRepository = new SequelizeObraRepository();

describe("Caso de uso: Obtener Stock", () => {
  it("debe retornar un array de piezas del stock", async () => {

    const resultado = await ObtenerStock(obraRepository);

    expect(resultado.codigo).toBe(200);
    expect(Array.isArray(resultado.respuesta)).toBe(true);
    expect(resultado.respuesta.length).toBeGreaterThan(0);
  });
});