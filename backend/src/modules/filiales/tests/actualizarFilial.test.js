const ActualizarFilial = require("../application/useCases/actualizarFilial");
const SequelizeFilialRepository = require("../infrastructure/repositories/sequelizeFilialRepository");
const { verificarDuplicadosRUC } = require("../infrastructure/services/entidadService");

const filialRepository = new SequelizeFilialRepository();

describe("Caso de uso: Actualizar Filial", () => {
  let filialCreado;

  beforeAll(async () => {
    const datosIniciales = {
      razon_social: `Empresa Test ${Date.now()}`,
      ruc: `20${Math.floor(100000000 + Math.random() * 900000000)}`,
      direccion: "Av. Siempre Viva 123",
      representante_legal: "Luis Ramírez",
      dni_representante: "77889966",
      cargo_representante: "Gerente",
      telefono_representante: "987654321",
      telefono_oficina: "012345678",
      creado_por: 1
    };

    filialCreado = await filialRepository.crear(datosIniciales);
  });

  it("debe actualizar correctamente una filial existente", async () => {
    const nuevosDatos = {
      telefono_oficina: "011111111",
      direccion: "Calle Actualizada 456",
    };

    const resultado = await ActualizarFilial(filialCreado.id, nuevosDatos, filialRepository, { verificarDuplicadosRUC });

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.filial.telefono_oficina).toBe("011111111");
    expect(resultado.respuesta.filial.direccion).toBe("Calle Actualizada 456");
  });

  it("debe retornar 404 si la filial no existe", async () => {
    const resultado = await ActualizarFilial(999999, { telefono_oficina: "999999" }, filialRepository, { verificarDuplicadosRUC });
    expect(resultado.codigo).toBe(404);
  });

  it("debe fallar si no se envían campos válidos", async () => {
    const resultado = await ActualizarFilial(filialCreado.id, {}, filialRepository, { verificarDuplicadosRUC });
    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta.mensaje).toMatch(/al menos un campo válido/i);
  });
});