const CrearObra = require("../application/useCases/crearObra");
const ActualizarObra = require("../application/useCases/actualizarObra");
const SequelizeObraRepository = require("../infrastructure/repositories/sequelizeObraRepository");

const obraRepository = new SequelizeObraRepository();

describe("Caso de uso: Actualizar Obra", () => {
  it("debe actualizar correctamente una obra existente", async () => {
    const obraCreada = await CrearObra({
      nombre: "Obra para actualizar",
      ubicacion: "Arequipa",
      direccion: "Calle 456",
      estado: "Demolición",
      creado_por: 1,
    }, obraRepository);

    const obraId = obraCreada.respuesta.obra.id;

    const resultado = await ActualizarObra(obraId, {
      direccion: "Dirección Actualizada",
      estado: "Acabados",
    }, obraRepository);

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.obra.estado).toBe("Acabados");
    expect(resultado.respuesta.obra.direccion).toBe("Dirección Actualizada");
  });

  it("debe retornar 404 si la obra no existe", async () => {
    const resultado = await ActualizarObra(999999, {
      direccion: "Nueva dirección",
    }, obraRepository);

    expect(resultado.codigo).toBe(404);
    expect(resultado.respuesta.mensaje).toMatch(/Obra no encontrada/i);
  });
});