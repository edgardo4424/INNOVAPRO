process.env.JWT_SECRET = "clave_test";

jest.mock("../../../shared/middlewares/captchaMiddleware", () => ({
    validarCaptcha: jest.fn(), // Mockeamos la función validarCaptcha
}));

const loginUsuario = require("../application/useCases/loginUsuario"); // Importamos el caso de uso para iniciar sesión
const { validarCaptcha } = require("../../../shared/middlewares/captchaMiddleware"); // Importamos la función de validación del captcha
const bcrypt = require("bcryptjs"); // Importamos bcrypt para comparar contraseñas

describe("🧪 loginUsuario", () => {
  const mockUsuarioRepository = {
    obtenerPorEmail: jest.fn(),
  };

  const mockEntidadService = {
    validarLogin: jest.fn(),
  };

  const usuarioReal = {
    id: 1,
    nombre: "Lucas",
    email: "lucas@grupoinnova.pe",
    password: bcrypt.hashSync("admin123", 10), // Hashed password
    rol: "Gerencia",
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe loguear correctamente con datos válidos", async () => {
    mockEntidadService.validarLogin.mockReturnValue(null);
    mockUsuarioRepository.obtenerPorEmail.mockResolvedValue(usuarioReal);
    validarCaptcha.mockResolvedValue(true); // Simulamos que el captcha es válido

    const datosLogin = {
      email: "lucas@grupoinnova.pe",
      password: "admin123",
      recaptchaToken: "token_valido",
    };

    const resultado = await loginUsuario(datosLogin, mockUsuarioRepository, mockEntidadService);

    expect(resultado.codigo).toBe(200);
    expect(resultado.respuesta.token).toBeDefined();
    expect(resultado.respuesta.usuario.email).toBe("lucas@grupoinnova.pe");
  });

  it("❌ debe fallar si falta un campo", async () => {
    mockEntidadService.validarLogin.mockReturnValue("Todos los campos son obligatorios");

    const resultado = await loginUsuario({}, mockUsuarioRepository, mockEntidadService);

    expect(resultado.codigo).toBe(401);
    expect(resultado.respuesta.mensaje).toBe("Todos los campos son obligatorios, incluyendo el reCAPTCHA");
  });

  it("❌ debe fallar si captcha es inválido", async () => {
    mockEntidadService.validarLogin.mockReturnValue(null);
    validarCaptcha.mockResolvedValue(false); // Simulamos que el captcha es inválido

    const resultado = await loginUsuario(
      { email: "lucas@grupoinnova.pe", password: "admin123", recaptchaToken: "invalido" },
      mockUsuarioRepository,
      mockEntidadService
    );

    expect(resultado.codigo).toBe(403);
    expect(resultado.respuesta.mensaje).toBe("Captcha inválido");
  });

  it("❌ debe fallar si el usuario no existe", async () => {
    mockEntidadService.validarLogin.mockReturnValue(null);
    validarCaptcha.mockResolvedValue(true);
    mockUsuarioRepository.obtenerPorEmail.mockResolvedValue(null);

    const resultado = await loginUsuario(
      { email: "noexiste@mail.com", password: "Password123", recaptchaToken: "ok" },
      mockUsuarioRepository,
      mockEntidadService
    );

    expect(resultado.codigo).toBe(401);
    expect(resultado.respuesta.mensaje).toBe("Credenciales inválidas");
  });

  it("❌ debe fallar si la contraseña es incorrecta", async () => {
    mockEntidadService.validarLogin.mockReturnValue(null);
    validarCaptcha.mockResolvedValue(true);

    const usuarioIncorrecto = { ...usuarioReal, password: bcrypt.hashSync("$2a$10$incorrecta", 10) }; // Hashed incorrectamente
    mockUsuarioRepository.obtenerPorEmail.mockResolvedValue(usuarioIncorrecto);

    const resultado = await loginUsuario(
      { email: "lucas@grupoinnova.pe", password: "admin123", recaptchaToken: "ok" },
      mockUsuarioRepository,
      mockEntidadService
    );

    expect(resultado.codigo).toBe(401);
    expect(resultado.respuesta.mensaje).toBe("Credenciales inválidas");
  });
});
