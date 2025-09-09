// INNOVA PRO+ v1.2.0
/** Ajusta la tabla `quinta_multiempleo_declaraciones` para conciliar con DeclaracionMultiempleoModel.js */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = "quinta_multiempleo_declaraciones";
    const desc = await queryInterface.describeTable(table).catch(() => ({}));
    const has = (c) => !!desc[c];

    // Columna base obligatoria
    if (!has("aplica_desde_mes")) {
      await queryInterface.addColumn(table, "aplica_desde_mes", {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      });
    }

    // Nuevas columnas del modelo
    if (!has("es_secundaria")) {
      await queryInterface.addColumn(table, "es_secundaria", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
    if (!has("principal_ruc")) {
      await queryInterface.addColumn(table, "principal_ruc", {
        type: Sequelize.STRING(20),
        allowNull: true,
      });
    }
    if (!has("principal_razon_social")) {
      await queryInterface.addColumn(table, "principal_razon_social", {
        type: Sequelize.STRING(150),
        allowNull: true,
      });
    }
    if (!has("observaciones")) {
      await queryInterface.addColumn(table, "observaciones", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
    if (!has("archivo_url")) {
      await queryInterface.addColumn(table, "archivo_url", {
        type: Sequelize.STRING(500),
        allowNull: true,
      });
    } else {
      // Ajustar largo a 500 si ya existía
      await queryInterface.changeColumn(table, "archivo_url", {
        type: Sequelize.STRING(500),
        allowNull: true,
      });
    }
    if (!has("es_oficial")) {
      await queryInterface.addColumn(table, "es_oficial", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }

    // Índice único (dni, anio)
    try {
      await queryInterface.addIndex(table, {
        name: "uq_quinta_multi_dni_anio",
        unique: true,
        fields: ["dni", "anio"],
      });
    } catch (_) {}
  },

  async down(queryInterface, Sequelize) {
    const table = "quinta_multiempleo_declaraciones";
    const desc = await queryInterface.describeTable(table).catch(() => ({}));
    const has = (c) => !!desc[c];

    // Revertir largo de URL a 512 si quieres volver al estado anterior
    if (has("archivo_url")) {
      await queryInterface.changeColumn(table, "archivo_url", {
        type: Sequelize.STRING(512),
        allowNull: true,
      });
    }

    for (const col of [
      "aplica_desde_mes",
      "es_secundaria",
      "principal_ruc",
      "principal_razon_social",
      "observaciones",
      "es_oficial",
    ]) {
      const exists = await queryInterface
        .describeTable(table)
        .then((d) => !!d[col])
        .catch(() => false);
      if (exists) await queryInterface.removeColumn(table, col);
    }

    try {
      await queryInterface.removeIndex(table, "uq_quinta_multi_dni_anio");
    } catch (_) {}
  },
};