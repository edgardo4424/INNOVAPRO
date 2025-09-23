"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "bajas_trabajadores",
      {
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
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        contrato_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "contratos_laborales",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        fecha_ingreso: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        fecha_baja: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        motivo: {
          type: Sequelize.ENUM(
            "RENUNCIA",
            "DESPIDO",
            "FIN CONTRATO",
            "MUTUO ACUERDO"
          ),
          allowNull: false,
          defaultValue: "FIN CONTRATO",
        },
        observacion: {
          type: Sequelize.TEXT,
        },
        usuario_registro_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "usuarios",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        estado_liquidacion: {
          type: Sequelize.ENUM("CALCULADA", "PAGADA"),
          allowNull: false,
          defaultValue: "CALCULADA",
        },
        tiempo_laborado_anios: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        tiempo_laborado_meses: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        tiempo_laborado_dias: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        tiempo_computado_anios: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        tiempo_computado_meses: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        tiempo_computado_dias: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        gratificacion_trunca_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "gratificaciones",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
         cts_trunca_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "cts",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        planilla_mensual_trunca_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "planilla_mensual",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },

        cts_trunca_monto: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.00,
        },
        vacaciones_truncas_monto: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.00,
        },
        gratificacion_trunca_monto: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.00,
        },
        remuneracion_trunca_monto: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.00,
        },

        afp_descuento: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.00,
        },
        adelanto_descuento: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.00,
        },
        otros_descuentos: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.00,
        },
        total_liquidacion: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.00,
        },

        detalle_remuneracion_computable: {
          type: Sequelize.JSON,
          allowNull: true,
          // Ejemplo: { sueldo: 1800, asignacion_familiar: 113, promedio_gratificacion: 91.88 }
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        timestamps: true,
        tableName: "bajas_trabajadores",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        engine: "InnoDB",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // Eliminar ENUMs antes de eliminar la tabla para evitar errores en algunos motores
    await queryInterface.dropTable("bajas_trabajadores");
  },
};
