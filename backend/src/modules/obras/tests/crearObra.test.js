const CrearObra = require("../application/useCases/crearObra");
const SequelizeObraRepository = require("../infrastructure/repositories/sequelizeObraRepository");

const obraRepository = new SequelizeObraRepository();

describe("Caso de uso: Crear Obra", () => {
  it("debe crear una obra válida correctamente", async () => {
    const resultado = await CrearObra({
      nombre: "Obra Test INNOVA",
      ubicacion: "Lima - San Isidro",
      direccion: "Av. Primavera 123",
      estado: "Planificación", // ⚠️ Tiene que coincidir EXACTAMENTE con uno de los ENUM del modelo
      creado_por: 1,
    }, obraRepository);

    console.log("Resultado:", resultado); // Puedes dejar este console.log temporalmente

    expect(resultado.codigo).toBe(201);
    expect(resultado.respuesta.obra).toBeDefined();
  });

  it("debe fallar si faltan campos obligatorios", async () => {
    const resultado = await CrearObra({
      nombre: "Solo nombre",
    }, obraRepository);

    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta.mensaje).toMatch(/faltan campos obligatorios/i);
  });
});
