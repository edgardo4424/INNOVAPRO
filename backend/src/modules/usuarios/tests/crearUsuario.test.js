const crearUsuario = require("../application/useCases/crearUsuario");
const bcrypt = require("bcryptjs");

describe("crearUsuario", () => {
    const mockUsuarioRepository = {
      obtenerPorEmail: jest.fn(),
      crear: jest.fn(),
    }

    const mockEntidadService = {
      validarCamposObligatorios: jest.fn(),
    }

    const datosValidos = {
      nombre: "Lucas Romero",
      email: "lucas@grupoinnova.pe",
      password: "Admin123",
      rol: "Gerencia",
    }

    beforeEach(() => {
      jest.clearAllMocks();
    })

  it("debe crear el usuario correctamente con datos válidos", async () => {
    mockEntidadService.validarCamposObligatorios.mockReturnValue(null);
    mockUsuarioRepository.obtenerPorEmail.mockResolvedValue(null); // Simulamos que no existe el usuario
    mockUsuarioRepository.crear.mockImplementation(async (data) => ({
      id: 1,
      ...data, // Simulamos la creación del usuario
    }))

    const resultado = await crearUsuario(datosValidos, mockUsuarioRepository, mockEntidadService);

    expect(resultado.codigo).toBe(201);
    expect(resultado.respuesta.usuario).toBeDefined();
    expect(resultado.respuesta.usuario.email).toBe(datosValidos.email);
    expect(resultado.respuesta.usuario.password).not.toBe(datosValidos.password); // Verificamos que la contraseña no sea la misma
  });

  it("debe fallar si faltan campos obligatorios", async () => {
    mockEntidadService.validarCamposObligatorios.mockReturnValue("Todos los campos son obligatorios");

    const resultado = await crearUsuario({}, mockUsuarioRepository, mockEntidadService);

    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta.mensaje).toBe("Ingresar password");
  })

  it("debe fallar si la contraseña es insegura", async () => {
    const datos = { ...datosValidos, password: "123" }; // Contraseña insegura

    mockEntidadService.validarCamposObligatorios.mockReturnValue(
      "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número"
    )

    const resultado = await crearUsuario(datos, mockUsuarioRepository, mockEntidadService);

    expect(resultado.codigo).toBe(400);
    expect(resultado.respuesta.mensaje).toBe("La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número.");
  })
});
