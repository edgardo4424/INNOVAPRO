const CrearFilial = require("../application/useCases/crearFilial");
const SequelizeFilialRepository = require("../infrastructure/repositories/sequelizeFilialRepository");
const { verificarDuplicadosRUC } = require("../infrastructure/services/entidadService");

const filialRepository = new SequelizeFilialRepository();

describe("Caso de uso: Crear Filial", () => {
  it("debe crear una filial válida correctamente", async () => {
    const resultado = await CrearFilial({
      razon_social: `Empresa Test ${Date.now()}`,
      ruc: "10" + Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, "0"),
      direccion: "Calle 123",
      representante_legal: "Luis Gómez",
      dni_representante: "78945612",
      cargo_representante: "Gerente",
      telefono_representante: "987654321",
      telefono_oficina: null,
      creado_por: 1,
    }, filialRepository, { verificarDuplicadosRUC });

    expect(resultado.codigo).toBe(201);
    expect(resultado.respuesta.empresa).toBeDefined();
  });

  it("debe fallar si faltan campos obligatorios", async () => {
    const resultado = await CrearFilial({
      ruc: "20400000000",
      creado_por: 1
    }, filialRepository, { verificarDuplicadosRUC });

    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta.mensaje).toMatch(/Faltan campos obligatorios/i);
  });

  it("debe fallar si se intenta crear una filial con un RUC ya registrado", async () => {
    const rucDuplicado = `20${Math.floor(Math.random() * 1000000000)}`;
    
    const datosBase = {
      razon_social: `Filial Base ${Date.now()}`,
      ruc: rucDuplicado,
      direccion: "Calle Falsa 123",
      representante_legal: "Pedro Castillo",
      dni_representante: "12345678",
      cargo_representante: "Director",
      telefono_representante: "987654321",
      telefono_oficina: null,
      creado_por: 1,
    };

    const primeraRespuesta = await CrearFilial(datosBase, filialRepository, { verificarDuplicadosRUC });

    expect(primeraRespuesta.codigo).toBe(201);

    const duplicado = await CrearFilial(datosBase, filialRepository, { verificarDuplicadosRUC });

    expect(duplicado.codigo).toBe(400);
    expect(duplicado.respuesta.mensaje).toMatch(/ya está registrado/i);
  });
});