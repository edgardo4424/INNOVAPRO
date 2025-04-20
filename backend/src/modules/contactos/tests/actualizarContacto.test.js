const CrearContacto = require("../application/useCases/crearContacto");
const ActualizarContacto = require("../application/useCases/actualizarContacto");
const SequelizeContactoRepository = require("../infrastructure/repositories/sequelizeContactoRepository");

const contactoRepository = new SequelizeContactoRepository();

describe("Caso de uso: Actualizar Contacto", () => {
  it("debe actualizar correctamente un contacto existente", async () => {
    const contactoCreada = await CrearContacto(
      {
        nombre: `Contacto para actualizar ${Date.now()}`,
        email: "contacto@gmail.com",
        telefono: "998740214",
        cargo: "GERENTE",
        clientes: [],
        obras: [],
      },
      contactoRepository
    );

    const contactoId = contactoCreada.respuesta.contacto.id;

    const resultado = await ActualizarContacto(
      contactoId,
      {
        email: "contacto@gmail.com",
      },
      contactoRepository
    );

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.contacto.email).toBe("contacto@gmail.com");
  });

  it("debe retornar 404 si la contacto no existe", async () => {
    const resultado = await ActualizarContacto(
      999999,
      {
        email: "contacto@gmail.com",
      },
      contactoRepository
    );

    expect(resultado.codigo).toBe(404);
    expect(resultado.respuesta.mensaje).toMatch(/Contacto no encontrado/i);
  });
});
