"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // --- cierres_planilla_quincenal ---
    await queryInterface.createTable(
      "cierres_planilla_quincenal",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        filial_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "empresas_proveedoras", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        periodo: {
          type: Sequelize.STRING(7),
          allowNull: false,
          comment: "Formato: YYYY-MM",
        },
        locked_at: {
          type: Sequelize.DATE,
          allowNull: true,
          comment: "Fecha de cierre oficial del periodo",
        },
        usuario_cierre_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "usuarios", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        data_mantenimiento_detalle: {
              type: Sequelize.JSON,
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
    );

    await queryInterface.addConstraint("cierres_planilla_quincenal", {
      fields: ["filial_id", "periodo"],
      type: "unique",
      name: "uq_cierre_planilla_quincenal",
    });


    // --- planilla_quincenal ---
    await queryInterface.createTable(
      "planilla_quincenal",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        trabajador_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "trabajadores", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        tipo_contrato: {
          type: Sequelize.ENUM("PLANILLA", "HONORARIOS"),
          allowNull: false,
          defaultValue: "PLANILLA",
        },
        periodo: {
          type: Sequelize.STRING(7),
          allowNull: false,
        },
        fecha_calculo: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        regimen: {
          type: Sequelize.ENUM("GENERAL", "MYPE", "MICRO"),
          allowNull: false,
        },
        fecha_ingreso: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        fecha_fin: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        dias_laborados: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        sueldo_base: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        sueldo_quincenal: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        asignacion_familiar: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        sueldo_bruto: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        onp: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        afp_oblig: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        seguro: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        comision_afp: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        quinta_categoria: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        total_descuentos: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        total_pagar: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        locked_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        banco: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        numero_cuenta: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        contrato_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "contratos_laborales", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        usuario_cierre_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "usuarios", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        filial_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "empresas_proveedoras", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },

        // OJO: nombre alineado con las asociaciones
        cierre_planilla_quincenal_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "cierres_planilla_quincenal", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },

        data_mantenimiento_detalle: {
              type: Sequelize.JSON,
            },

        info_detalle: {
              type: Sequelize.JSON,
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
    );

     await queryInterface.addConstraint("planilla_quincenal", {
      fields: [
        "trabajador_id",
        "periodo",
        "regimen",
        "filial_id",
        "contrato_id",
      ],
      type: "unique",
      name: "uq_planilla_quincenal",
    });
  },

  async down(queryInterface, Sequelize) {
    // Quitar índices/constraints explícitos (ignora si no existen)

    await queryInterface
      .removeConstraint("planilla_quincenal", "uq_planilla_quincenal")
      .catch(() => {});
    await queryInterface
      .removeConstraint(
        "cierres_planilla_quincenal",
        "uq_cierre_planilla_quincenal"
      )
      .catch(() => {});

    // Eliminar tablas (planilla primero por FKs)
    await queryInterface.dropTable("planilla_quincenal");
    await queryInterface.dropTable("cierres_planilla_quincenal");
  },
};
