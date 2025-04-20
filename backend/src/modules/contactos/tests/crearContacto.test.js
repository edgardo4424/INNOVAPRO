const CrearContacto = require("../application/useCases/crearContacto");
const SequelizeContactoRepository = require("../infrastructure/repositories/sequelizeContactoRepository");

const contactoRepository = new SequelizeContactoRepository();

describe("Caso de uso: Crear Contacto", () => {
  it("debe crear un contacto válida correctamente", async () => {
    const resultado = await CrearContacto({
          nombre: `Contacto nuevo ${Date.now()}`,
          email: "contacto@gmail.com",
          telefono: "998740214",
          cargo: "GERENTE",
          clientes: [],
          obras: []
    }, contactoRepository);

    expect(resultado.codigo).toBe(201); //Verifica que el resultado tenga un código 201, lo cual indica éxito.
    expect(resultado.respuesta.contacto).toBeDefined(); // ✅ Se espera que exista un objeto 'contacto'
  });

  it("debe fallar si faltan campos obligatorios", async () => {
    const resultado = await CrearContacto({
      nombre: "Solo nombre",
    }, contactoRepository);

    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta.mensaje).toMatch(/son obligatorios/i);
  });
});
