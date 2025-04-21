const Contacto = require("../domain/entities/contacto"); // Importamos la entidad Contacto

describe("🧪 Entidad Contacto", () => {

    describe("📌 validarCamposObligatorios()", () => {
      it("✅ debe validar correctamente los campos obligatorios en modo crear", () => {
        const error = Contacto.validarCamposObligatorios({
          nombre: "Pedro Pérez",
          email: "pedro@innova.com",
          telefono: "999999999",
          cargo: "Ingeniero",
          clientes: [1],
          obras: [3]
        }, "crear");
  
        expect(error).toBeNull();
      });
  
      it("❌ debe fallar si falta el nombre o email en modo crear", () => {
        const error = Contacto.validarCamposObligatorios({
          telefono: "999999999"
        }, "crear");
  
        expect(error).toBe("Nombre y email son obligatorios");
      });
  
      it("✅ debe validar si hay al menos un campo válido en modo editar", () => {
        const error = Contacto.validarCamposObligatorios({ cargo: "Supervisor" }, "editar");
        expect(error).toBeNull();
      });
  
      it("❌ debe fallar si no hay ningún campo válido en modo editar", () => {
        const error = Contacto.validarCamposObligatorios({}, "editar");
        expect(error).toBe("Debe proporcionar al menos un campo válido para actualizar.");
      });
    });
  
    describe("📌 construirDatosContacto()", () => {
      it("✅ debe construir correctamente los datos del contacto", () => {
        const datos = Contacto.construirDatosContacto({
          nombre: "Lucía",
          email: "lucia@empresa.com",
          telefono: "912345678",
          cargo: "Arquitecta",
          clientes: [1, 2],
          obras: [5, 8]
        });
  
        expect(datos).toEqual({
          nombre: "Lucía",
          email: "lucia@empresa.com",
          telefono: "912345678",
          cargo: "Arquitecta",
          clientesIds: [1, 2],
          obrasIds: [5, 8]
        });
      });
    });
  
    describe("📌 Constructor", () => {
      it("✅ debe crear una instancia con los datos proporcionados", () => {
        const contacto = new Contacto(
          "Andrés",
          "andres@innova.com",
          "987654321",
          "Técnico",
          [1],
          [2]
        );
  
        expect(contacto.nombre).toBe("Andrés");
        expect(contacto.email).toBe("andres@innova.com");
        expect(contacto.telefono).toBe("987654321");
        expect(contacto.clientes).toEqual([1]);
        expect(contacto.obras).toEqual([2]);
      });
    });
  
  });