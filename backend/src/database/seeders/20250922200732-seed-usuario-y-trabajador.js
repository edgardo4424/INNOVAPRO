"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

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

    try {
      // 2) Insertar usuario con trabajador_id = 1
    await queryInterface.bulkInsert("usuarios", [
      {
       // id: 1, // 👈 también podemos fijar el id si quieres
        email: "lucas@grupoinnova.pe",
        password:
          "$2b$10$pAHKnnkWbj2xOSX/bb0BlO4Y.LaOakLN8wsXf8Ncp4QBwq00h39YS",
        id_chat: "8050626436",
        trabajador_id: 1, // 👈 se enlaza al trabajador con id=1
      },
    ]);
    } catch (err) {
       console.error("❌ Error insertando en usuarios:", err.errors || err);
      throw err;
    }
    

    try {
      
     await queryInterface.bulkInsert("empresas_proveedoras", [
      {
        id: 1, 
        razon_social: "ENCOFRADOS INNOVA S.A.C.",
        ruc: "20562974998",
        direccion: "AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE",
        representante_legal: "GARCIA DE LA CRUZ GENARO ALONSO",
        tipo_documento: "DNI",
        dni_representante: "47176659",
        cargo_representante: "GERENTE GENERAL",
        telefono_representante: "",
        creado_por: 1,
        telefono_oficina: "(01) 747 5109",
        cuenta_banco: "",
        correo: "Info@grupoinnova.pe",
        link_website: "https://grupoinnova.pe",
        codigo_ubigeo: "150122"
      },
      {
       id:2,
       razon_social:'ANDAMIOS ELECTRICOS INNOVA S.A.C.',
       ruc:'20602696643',
       direccion:'AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE',
       representante_legal:'GARCIA DE LA CRUZ GENARO ALONSO',
       tipo_documento: "DNI",
       dni_representante:'47176659',
       cargo_representante:'GERENTE GENERAL',
       telefono_representante:'',
       creado_por:1,
       telefono_oficina:'(01) 747 5109',
       cuenta_banco:'00-048-059414',
       correo:'Info@grupoinnova.pe',
       link_website:'hhttps://grupoinnova.pe',
       codigo_ubigeo:'150122'
      },
      {
        id:3,
        razon_social:'INDEK ANDINA E.I.R.L',
        ruc:'20555389052',
        direccion:'AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE',
        representante_legal:'ROMERO SANCHEZ LUCAS RAMON',
        tipo_documento: "DNI",
        dni_representante:'00918141',
        cargo_representante:'TITULAR GERENTE',
        telefono_representante:'',
        creado_por:1,
        telefono_oficina:'(01) 747 5109',
        cuenta_banco:'00-046-138929',
        correo:'Info@grupoinnova.pe',
        link_website:'https://grupoinnova.pe',
        codigo_ubigeo:'150122'
      },
      {
        id:4,
        razon_social:'INNOVA RENTAL MAQUINARIA S.A.C.',
        ruc:'20603021933',
        direccion:'AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE',
        representante_legal:'ROMERO SANCHEZ LUCAS RAMON',
        tipo_documento: "DNI",
        dni_representante:'00918141',
        cargo_representante:'GERENTE GENERAL',
        telefono_representante:'',
        creado_por:1,
        telefono_oficina:'(01) 747 5109',
        cuenta_banco:'00-021-098418',
        correo:'Info@grupoinnova.pe',
        link_website:'https://grupoinnova.pe',
        codigo_ubigeo:'150122'
      },
      {
        id:5,
        razon_social:'INNOVA GREEN ENERGY S.A.C.',
        ruc:'20610202358',
        direccion:'AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE',
        representante_legal:'ROMERO SANCHEZ LUCAS RAMON',
        tipo_documento: "DNI",
        dni_representante:'00918141',
        cargo_representante:'GERENTE GENERAL',
        telefono_representante:'',
        creado_por:1,
        telefono_oficina:'(01) 747 5109',
        cuenta_banco:'00-021-098418',
        correo:'Info@grupoinnova.pe',
        link_website:'https://grupoinnova.pe',
        codigo_ubigeo:'150122'
      },
      {
        id:15,
        razon_social:'RUC PRUEBA FACTALIZA',
        ruc:'10749283781',
        direccion:'AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE',
        representante_legal:'DESARROLLO',
        tipo_documento: "DNI",
        dni_representante:'00021242',
        cargo_representante:'GERENTE GENERAL',
        telefono_representante:'222222213',
        creado_por:1,
        telefono_oficina:'(01) 747 5109',
        cuenta_banco:'99-999-999999',
        correo:'Info@grupoinnova.pe',
        link_website:'https://grupoinnova.pe',
        codigo_ubigeo:'150122'
      }
    ]);
    } catch (err) {
      console.error("❌ Error insertando en empresas_proveedoras:", err.errors || err);
      throw err;
    }

  },

  async down(queryInterface, Sequelize) {
    // Elimina en orden correcto
    await queryInterface.bulkDelete("usuarios", { id: 1 }, {});
    await queryInterface.bulkDelete("trabajadores", { id: 1 }, {});
    await queryInterface.bulkDelete("empresas_proveedoras", null, {});
  },
};