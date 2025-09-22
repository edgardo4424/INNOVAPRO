"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 🔹 Limpia antes para evitar conflictos (si ya existe id=1)
    await queryInterface.bulkDelete("usuarios", { id: 1 }, {});
    await queryInterface.bulkDelete("trabajadores", { id: 1 }, {});

    // 1) Insertar trabajador con id fijo
    await queryInterface.bulkInsert("trabajadores", [
      {
        id: 1, // 👈 forzamos id fijo
        cargo_id: 14,
        nombres: "Lucas",
        apellidos: "Romero",
        tipo_documento: "DNI",
        numero_documento: "12345678",
        sueldo_base: 3000,
        asignacion_familiar: "2025-08-26",
        sistema_pension: "AFP",
        estado: "activo",
        domiciliado: true,
        tipo_afp: "HABITAT",
        comision_afp: false,
        fecha_nacimiento: "1977-10-28",
        fecha_baja: null,
      },
    ]);

    // 2) Insertar usuario con trabajador_id = 1
    await queryInterface.bulkInsert("usuarios", [
      {
        id: 1, // 👈 también podemos fijar el id si quieres
        email: "lucas@grupoinnova.pe",
        password:
          "$2b$10$pAHKnnkWbj2xOSX/bb0BlO4Y.LaOakLN8wsXf8Ncp4QBwq00h39YS",
        id_chat: "8050626436",
        trabajador_id: 1, // 👈 se enlaza al trabajador con id=1
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Elimina en orden correcto
    await queryInterface.bulkDelete("usuarios", { id: 1 }, {});
    await queryInterface.bulkDelete("trabajadores", { id: 1 }, {});
  },
};