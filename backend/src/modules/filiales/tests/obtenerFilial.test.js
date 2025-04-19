const ObtenerFiliales = require("../application/useCases/obtenerFiliales");
const SequelizeFilialRepository = require("../infrastructure/repositories/sequelizeFilialRepository");

const filialRepository = new SequelizeFilialRepository();

describe("Caso de uso: Obtener Filiales", () => {
  it("debe retornar un array de filiales", async () => {
    const resultado = await ObtenerFiliales(filialRepository);

    expect(resultado.codigo).toBe(200);
    expect(Array.isArray(resultado.respuesta)).toBe(true);
  });
});