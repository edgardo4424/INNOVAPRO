const EliminarFilial = require("../application/useCases/eliminarFilial");
const SequelizeFilialRepository = require("../infrastructure/repositories/sequelizeFilialRepository");

const filialRepository = new SequelizeFilialRepository();

describe("Caso de uso: Eliminar Filial", () => {
  it("debe eliminar correctamente una filial existente", async () => {
    const filialCreado = await filialRepository.crear({
      razon_social: `Empresa Test ${Date.now()}`,
      ruc: "10" + Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, "0"),
      direccion: "Calle Test",
      representante_legal: "Pedro Pérez",
      dni_representante: "12345678",
      cargo_representante: "Gerente",
      telefono_representante: "987654321",
      telefono_oficina: null,
      creado_por: 1,
    });

    const resultado = await EliminarFilial(filialCreado.id, filialRepository);

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.mensaje).toBe("Filial eliminado exitosamente");
  });

  it("debe retornar 404 si la filial no existe", async () => {
    const resultado = await EliminarFilial(999999, filialRepository);

    expect(resultado.codigo).toBe(404);
    expect(resultado.respuesta.mensaje).toBe("Filial no encontrado");
  });
});