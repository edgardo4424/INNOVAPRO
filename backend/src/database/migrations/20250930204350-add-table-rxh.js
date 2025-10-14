"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ✅ Tabla principal: recibos_por_honorarios
    await queryInterface.createTable("recibos_por_honorarios", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      trabajador_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "trabajadores", 
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate:"RESTRICT"
      },
      tipo_comprobante_emitido: {
        // Texto (Ver Tabla 23), longitud 1
        type: Sequelize.STRING(1),
        allowNull: true,
      },
      serie_comprobante_emitido: {
        // Alfanumérico, longitud 4
        type: Sequelize.STRING(4),
        allowNull: true,
      },
      numero_comprobante_emitido: {
        // Texto, longitud 8
        type: Sequelize.STRING(8),
        allowNull: true,
      },
      monto_total_servicio: {
        // Numérico (12,2)
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      fecha_emision: {
        // Fecha (dd/mm/aaaa)
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fecha_pago: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      indicador_retencion_cuarta_categoria: {
        // Texto (1) -> 1=SÍ / 0=NO
        type: Sequelize.STRING(1),
        allowNull: true,
      },
      indicador_retencion_regimen_pensionario: {
        // Texto (1) -> 1=ONP / 2=Privado / 3=Sin retención
        type: Sequelize.STRING(1),
        allowNull: true,
      },
      importe_aporte_regimen_pensionario: {
        // Numérico (7,2)
        type: Sequelize.DECIMAL(7, 2),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // ✅ Tabla pivote/intermedia
    await queryInterface.createTable("planilla_mensual_recibo_honorario", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      planilla_mensual_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "planilla_mensual", // Ajusta si el nombre es diferente
          key: "id",
        },
        onDelete: "CASCADE",
      },
      recibo_por_honorarios_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "recibos_por_honorarios",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("planilla_mensual_recibo_honorario");
    await queryInterface.dropTable("recibos_por_honorarios");
  },
};
