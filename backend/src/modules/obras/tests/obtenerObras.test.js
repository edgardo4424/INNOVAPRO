const CrearObra = require("../application/useCases/crearObra");
const ObtenerObras = require("../application/useCases/obtenerObras");
const SequelizeObraRepository = require("../infrastructure/repositories/sequelizeObraRepository");

const obraRepository = new SequelizeObraRepository();

describe("Caso de uso: Obtener Obras", () => {
  it("debe retornar un array de obras", async () => {
    await CrearObra({
      nombre: `Obra listable ${Date.now()}`,
      ubicacion: "Trujillo",
      direccion: "Av. Central",
      estado: "Cimentación y estructura",
      creado_por: 1,
    }, obraRepository);

    const resultado = await ObtenerObras(obraRepository);

    expect(resultado.codigo).toBe(200);
    expect(Array.isArray(resultado.respuesta)).toBe(true);
    expect(resultado.respuesta.length).toBeGreaterThan(0);
  });
});