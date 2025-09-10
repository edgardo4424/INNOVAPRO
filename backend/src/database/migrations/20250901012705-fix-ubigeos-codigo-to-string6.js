'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      // 1) Estado actual
      const table = await queryInterface.describeTable('ubigeos');
      const hasCodigo = !!table['codigo'];
      const hasCodigoStr = !!table['codigo_str'];

      // Helper: ¿hay PK?
      const [pkRows] = await queryInterface.sequelize.query(
        `SHOW KEYS FROM ubigeos WHERE Key_name = 'PRIMARY'`,
        { transaction: t }
      );
      const hasPrimary = pkRows.length > 0;

      // ¿'codigo' ya es VARCHAR?
      const isCodigoString = hasCodigo && /char|varchar|text/i.test(table['codigo'].type);

      if (isCodigoString) {
        // Ya está como string: asegurar PK y limpiar 'codigo_str' si quedó
        if (!hasPrimary) {
          try {
            await queryInterface.sequelize.query(
              `ALTER TABLE ubigeos ADD PRIMARY KEY (codigo)`,
              { transaction: t }
            );
          } catch (_) { }
        }
        if (hasCodigoStr) {
          await queryInterface.removeColumn('ubigeos', 'codigo_str', { transaction: t });
        }
        return;
      }

      // Si 'codigo' es INT, hacemos el plan con columna temporal
      if (!hasCodigoStr) {
        await queryInterface.addColumn(
          'ubigeos',
          'codigo_str',
          { type: Sequelize.STRING(6), allowNull: false },
          { transaction: t }
        );
      }

      // Copiar valores con padding
      await queryInterface.sequelize.query(
        `UPDATE ubigeos SET codigo_str = LPAD(codigo, 6, '0')`,
        { transaction: t }
      );

      // Soltar PK solo si existe
      if (hasPrimary) {
        try {
          await queryInterface.sequelize.query(
            `ALTER TABLE ubigeos DROP PRIMARY KEY`,
            { transaction: t }
          );
        } catch (_) {
          // si falla, continúa (quizá no existía)
        }
      }

      // Eliminar 'codigo' si existe
      if (hasCodigo) {
        await queryInterface.removeColumn('ubigeos', 'codigo', { transaction: t });
      }

      // Renombrar 'codigo_str' -> 'codigo' si aún no está hecho
      const table2 = await queryInterface.describeTable('ubigeos');
      if (!table2['codigo']) {
        await queryInterface.renameColumn('ubigeos', 'codigo_str', 'codigo', { transaction: t });
      } else if (table2['codigo_str']) {
        await queryInterface.removeColumn('ubigeos', 'codigo_str', { transaction: t });
      }

      // Asegurar PK en 'codigo' si no existe
      const [pkRows2] = await queryInterface.sequelize.query(
        `SHOW KEYS FROM ubigeos WHERE Key_name = 'PRIMARY'`,
        { transaction: t }
      );
      const hasPrimary2 = pkRows2.length > 0;
      if (!hasPrimary2) {
        await queryInterface.sequelize.query(
          `ALTER TABLE ubigeos ADD PRIMARY KEY (codigo)`,
          { transaction: t }
        );
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      const table = await queryInterface.describeTable('ubigeos');
      const hasCodigo = !!table['codigo'];

      if (!hasCodigo) return;

      // Si 'codigo' es VARCHAR, volver a INT (pierdes ceros a la izquierda)
      const isCodigoString = /char|varchar|text/i.test(table['codigo'].type);
      if (!isCodigoString) return;

      // Soltar PK si existe
      const [pkRows] = await queryInterface.sequelize.query(
        `SHOW KEYS FROM ubigeos WHERE Key_name = 'PRIMARY'`,
        { transaction: t }
      );
      if (pkRows.length > 0) {
        try {
          await queryInterface.sequelize.query(
            `ALTER TABLE ubigeos DROP PRIMARY KEY`,
            { transaction: t }
          );
        } catch (_) { }
      }

      // Crear temporal INT
      if (!table['codigo_int']) {
        await queryInterface.addColumn(
          'ubigeos',
          'codigo_int',
          { type: Sequelize.INTEGER, allowNull: false },
          { transaction: t }
        );
      }

      await queryInterface.sequelize.query(
        `UPDATE ubigeos SET codigo_int = CAST(codigo AS UNSIGNED)`,
        { transaction: t }
      );

      await queryInterface.removeColumn('ubigeos', 'codigo', { transaction: t });
      await queryInterface.renameColumn('ubigeos', 'codigo_int', 'codigo', { transaction: t });

      // Restaurar PK
      await queryInterface.sequelize.query(
        `ALTER TABLE ubigeos ADD PRIMARY KEY (codigo)`,
        { transaction: t }
      );
    });
  },
};
