const CrearObra = require("../application/useCases/crearObra");
const EliminarObra = require("../application/useCases/eliminarObra");
const SequelizeObraRepository = require("../infrastructure/repositories/sequelizeObraRepository");

const obraRepository = new SequelizeObraRepository();

describe("Caso de uso: Eliminar Obra", () => {
  it("debe eliminar correctamente una obra existente", async () => {
    const obraCreada = await CrearObra({
      nombre: "Obra para eliminar",
      ubicacion: "Cusco",
      direccion: "Calle S/N",
      estado: "Planificación",
      creado_por: 1,
    }, obraRepository);

    const obraId = obraCreada.respuesta.obra.id;

    const resultado = await EliminarObra(obraId, obraRepository);

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.mensaje).toBe("Obra eliminada exitosamente"); // corregido para coincidir
  });

  it("debe retornar 404 si la obra no existe", async () => {
    const resultado = await EliminarObra(999999, obraRepository);

    expect(resultado.codigo).toBe(404);
    expect(resultado.respuesta.mensaje).toMatch(/no encontrada/i); // corregido para coincidir
  });
});