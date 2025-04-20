const CrearContacto = require("../application/useCases/crearContacto");
const ObtenerContactos = require("../application/useCases/obtenerContactos");
const SequelizeContactoRepository = require("../infrastructure/repositories/sequelizeContactoRepository");

const contactoRepository = new SequelizeContactoRepository();

describe("Caso de uso: Obtener Contactos", () => {
  it("debe retornar un array de contactos", async () => {
    await CrearContacto({
      nombre: `Contacto listable ${Date.now()}`,
      email: "contacto@gmail.com",
      telefono: "998740214",
      cargo: "GERENTE",
      clientes: [],
      obras: []
    }, contactoRepository);

    const resultado = await ObtenerContactos(contactoRepository);

    expect(resultado.codigo).toBe(200); //Verifica que el resultado tenga un código 200, lo cual indica éxito.
    expect(Array.isArray(resultado.respuesta)).toBe(true); //Verifica que la propiedad respuesta sea un array (donde vendrán los contactos).
    expect(resultado.respuesta.length).toBeGreaterThan(0); //Se asegura que el array de contactos no esté vacío.
  });
});