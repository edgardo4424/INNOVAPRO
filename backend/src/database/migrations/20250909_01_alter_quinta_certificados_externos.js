// INNOVA PRO+ v1.2.0
/** Ajusta la tabla `quinta_certificados_externos` para conciliar con CertificadoQuintaModel.js */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = "quinta_certificados_externos";
    const desc = await queryInterface.describeTable(table).catch(() => ({}));
    const has = (c) => !!desc[c];

    // Nuevas columnas (si no existen)
    if (!has("empresa_ruc")) {
      await queryInterface.addColumn(table, "empresa_ruc", {
        type: Sequelize.STRING(20),
        allowNull: true,
      });
    }
    if (!has("empresa_razon_social")) {
      await queryInterface.addColumn(table, "empresa_razon_social", {
        type: Sequelize.STRING(150),
        allowNull: true,
      });
    }
    if (!has("remuneraciones")) {
      await queryInterface.addColumn(table, "remuneraciones", {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
        defaultValue: 0,
      });
    }
    if (!has("gratificaciones")) {
      await queryInterface.addColumn(table, "gratificaciones", {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
        defaultValue: 0,
      });
    }
    if (!has("otros")) {
      await queryInterface.addColumn(table, "otros", {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
        defaultValue: 0,
      });
    }
    if (!has("asignacion_familiar")) {
      await queryInterface.addColumn(table, "asignacion_familiar", {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
        defaultValue: 0,
      });
    }
    if (!has("fecha_emision")) {
      await queryInterface.addColumn(table, "fecha_emision", {
        type: Sequelize.DATEONLY,
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

    // Ajuste de largo de URL a 500
    if (has("archivo_url")) {
      await queryInterface.changeColumn(table, "archivo_url", {
        type: Sequelize.STRING(500),
        allowNull: true,
      });
    }

    // Índice único (dni, anio)
    // Si ya existe, ignoramos el error.
    try {
      await queryInterface.addIndex(table, {
        name: "uq_quinta_cert_ext_dni_anio",
        unique: true,
        fields: ["dni", "anio"],
      });
    } catch (_) {}
  },

  async down(queryInterface, Sequelize) {
    const table = "quinta_certificados_externos";
    const desc = await queryInterface.describeTable(table).catch(() => ({}));
    const has = (c) => !!desc[c];

    // Revertir largo de URL (opcional: 512 si era el valor previo)
    if (has("archivo_url")) {
      await queryInterface.changeColumn(table, "archivo_url", {
        type: Sequelize.STRING(512),
        allowNull: true,
      });
    }

    // Remover columnas agregadas
    for (const col of [
      "empresa_ruc",
      "empresa_razon_social",
      "remuneraciones",
      "gratificaciones",
      "otros",
      "asignacion_familiar",
      "fecha_emision",
      "es_oficial",
    ]) {
      const exists = await queryInterface
        .describeTable(table)
        .then((d) => !!d[col])
        .catch(() => false);
      if (exists) await queryInterface.removeColumn(table, col);
    }

    // Quitar índice único
    try {
      await queryInterface.removeIndex(table, "uq_quinta_cert_ext_dni_anio");
    } catch (_) {}
  },
};