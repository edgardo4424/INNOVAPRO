const Cliente = require("../domain/entities/cliente"); // Importamos la entidad Cliente

describe("🧪 Entidad Cliente", () => {

    describe("📌 validarCamposObligatorios()", () => {
      it("✅ debe validar correctamente los campos obligatorios en modo crear", () => {
        const error = Cliente.validarCamposObligatorios({
          razon_social: "INNOVA SAC",
          tipo: "Persona Jurídica",
          creado_por: 1
        }, "crear");
  
        expect(error).toBeNull();
      });
  
      it("❌ debe fallar si falta razón social o tipo en modo crear", () => {
        const error = Cliente.validarCamposObligatorios({
          creado_por: 1
        }, "crear");
  
        expect(error).toBe("Razón social y tipo de entidad son obligatorios.");
      });
  
      it("❌ debe fallar si no se proporciona ningún campo válido en modo editar", () => {
        const error = Cliente.validarCamposObligatorios({}, "editar");
        expect(error).toBe("Debe proporcionar al menos un campo válido para actualizar.");
      });
  
      it("✅ debe pasar si se proporciona al menos un campo válido en modo editar", () => {
        const error = Cliente.validarCamposObligatorios({ telefono: "999999999" }, "editar");
        expect(error).toBeNull();
      });
    });
  
    describe("📌 validarTipoEntidad()", () => {
      it("✅ debe validar correctamente Persona Jurídica", () => {
        const error = Cliente.validarTipoEntidad({
          tipo: "Persona Jurídica",
          ruc: "20123456789",
          domicilio_fiscal: "Av. Siempre Viva 123",
          representante_legal: "Juan Pérez",
          dni_representante: "12345678"
        });
        expect(error).toBeNull();
      });
  
      it("❌ debe fallar si faltan datos en Persona Jurídica", () => {
        const error = Cliente.validarTipoEntidad({
          tipo: "Persona Jurídica",
          ruc: "",
          domicilio_fiscal: "",
          representante_legal: "",
          dni_representante: ""
        });
        expect(error).toBe("Los datos de la Persona Jurídica son obligatorios.");
      });
  
      it("✅ debe validar correctamente Persona Natural", () => {
        const error = Cliente.validarTipoEntidad({
          tipo: "Persona Natural",
          dni: "12345678"
        });
        expect(error).toBeNull();
      });
  
      it("❌ debe fallar si falta DNI en Persona Natural", () => {
        const error = Cliente.validarTipoEntidad({
          tipo: "Persona Natural"
        });
        expect(error).toBe("El DNI es obligatorio para Personas Naturales.");
      });
  
      it("❌ debe fallar si el tipo es inválido", () => {
        const error = Cliente.validarTipoEntidad({ tipo: "Entidad Fantasma" });
        expect(error).toBe("Tipo de entidad inválido. Debe ser 'Persona Jurídica' o 'Persona Natural'.");
      });
    });
  
    describe("📌 construirDatosCliente()", () => {
      it("✅ debe construir correctamente los datos para Persona Jurídica", () => {
        const datos = Cliente.construirDatosCliente({
          tipo: "Persona Jurídica",
          razon_social: "INNOVA",
          telefono: "999999999",
          email: "",
          creado_por: 1,
          ruc: "20123456789",
          domicilio_fiscal: "Av. Perú",
          representante_legal: "Lucas",
          dni_representante: "12345678"
        });
  
        expect(datos).toMatchObject({
          tipo: "Persona Jurídica",
          ruc: "20123456789",
          domicilio_fiscal: "Av. Perú",
          representante_legal: "Lucas",
          creado_por: 1,
        });
  
        expect(datos).not.toHaveProperty("email");
      });
  
      it("✅ debe construir correctamente los datos para Persona Natural", () => {
        const datos = Cliente.construirDatosCliente({
          tipo: "Persona Natural",
          razon_social: "Pedro",
          telefono: "123",
          email: "pedro@mail.com",
          creado_por: 1,
          dni: "12345678"
        });
  
        expect(datos).toMatchObject({
          tipo: "Persona Natural",
          dni: "12345678",
          ruc: null,
          domicilio_fiscal: null,
          representante_legal: null,
          dni_representante: null,
        });
      });
    });
  
    describe("📌 Constructor Cliente", () => {
      it("✅ debe crear una instancia de Cliente con todos los datos", () => {
        const cliente = new Cliente(
          "INNOVA SAC", "Persona Jurídica", "20123456789", "12345678",
          "999999999", "contacto@innova.com", "Av. Siempre Viva",
          "Lucas", "11112222", 1
        );
  
        expect(cliente.razon_social).toBe("INNOVA SAC");
        expect(cliente.ruc).toBe("20123456789");
        expect(cliente.creado_por).toBe(1);
      });
    });
  
  });