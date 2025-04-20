const CrearContacto = require("../application/useCases/crearContacto");
const EliminarContacto = require("../application/useCases/eliminarContacto");
const SequelizeContactoRepository = require("../infrastructure/repositories/sequelizeContactoRepository");

const contactoRepository = new SequelizeContactoRepository();

describe("Caso de uso: Eliminar Contacto", () => {
  it("debe eliminar correctamente una contacto existente", async () => {
    const contactoCreada = await CrearContacto(
      {
        nombre: `Contacto para eliminar ${Date.now()}`,
        email: "contacto@gmail.com",
        telefono: "998740214",
        cargo: "GERENTE",
        clientes: [1, 2],
        obras: [6],
      },
      contactoRepository
    );

    const contactoId = contactoCreada.respuesta.contacto.id;

    const resultado = await EliminarContacto(contactoId, contactoRepository);

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.mensaje).toBe("Contacto eliminado exitosamente"); // corregido para coincidir
  });

  it("debe retornar 404 si la contacto no existe", async () => {
    const resultado = await EliminarContacto(999999, contactoRepository);

    expect(resultado.codigo).toBe(404);
    expect(resultado.respuesta.mensaje).toMatch(/Contacto no encontrado/i); // corregido para coincidir
  });
});
