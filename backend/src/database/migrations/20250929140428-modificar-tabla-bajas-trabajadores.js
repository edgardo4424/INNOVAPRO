'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      // 1. Intentar eliminar solo si existen las columnas
      const table = await queryInterface.describeTable('bajas_trabajadores');

      const columnasAEliminar = [
        'tiempo_laborado_anios',
        'tiempo_laborado_meses',
        'tiempo_laborado_dias',
        'tiempo_computado_anios',
        'tiempo_computado_meses',
        'tiempo_computado_dias',
        'gratificacion_trunca_id',
        'cts_trunca_id',
        'planilla_mensual_trunca_id',
        'cts_trunca_monto',
        'vacaciones_truncas_monto',
        'gratificacion_trunca_monto',
        'remuneracion_trunca_monto',
        'afp_descuento',
        'adelanto_descuento',
        'otros_descuentos',
        'detalle_remuneracion_computable',
      ];

      for (const col of columnasAEliminar) {
        if (table[col]) {
          await queryInterface.removeColumn('bajas_trabajadores', col, { transaction: t });
        }
      }

      // 2. Agregar nueva columna
      if (!table.detalles_liquidacion) {
        await queryInterface.addColumn(
          'bajas_trabajadores',
          'detalles_liquidacion',
          {
            type: Sequelize.JSON,
            allowNull: true,
            comment: 'JSON con toda la información de liquidación (gratificación, CTS, vacaciones, etc.)',
          },
          { transaction: t }
        );
      }

      // 👇 Agregar filial_id si no existe
      if (!table.filial_id) {
        await queryInterface.addColumn(
          "bajas_trabajadores",
          "filial_id",
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            // Si quieres relación explícita con filiales:
            references: {
                    model: "empresas_proveedoras",
                    key: "id",
                  },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
            comment: "Filial al momento de la baja",
          },
          { transaction: t }
        );
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      const table = await queryInterface.describeTable('bajas_trabajadores');

      // Eliminar columnas nuevas
      if (table.detalles_liquidacion) {
        await queryInterface.removeColumn('bajas_trabajadores', 'detalles_liquidacion', { transaction: t });
      }
      if (table.filial_id) {
        await queryInterface.removeColumn('bajas_trabajadores', 'filial_id', { transaction: t });
      }

      // Volver a crear columnas eliminadas
      const columnasAgregar = [
        ['tiempo_laborado_anios', { type: Sequelize.INTEGER, defaultValue: 0 }],
        ['tiempo_laborado_meses', { type: Sequelize.INTEGER, defaultValue: 0 }],
        ['tiempo_laborado_dias', { type: Sequelize.INTEGER, defaultValue: 0 }],
        ['tiempo_computado_anios', { type: Sequelize.INTEGER, defaultValue: 0 }],
        ['tiempo_computado_meses', { type: Sequelize.INTEGER, defaultValue: 0 }],
        ['tiempo_computado_dias', { type: Sequelize.INTEGER, defaultValue: 0 }],
        ['gratificacion_trunca_id', {
          type: Sequelize.INTEGER,
          references: { model: 'gratificaciones', key: 'id' },
          allowNull: true,
        }],
        ['cts_trunca_id', {
          type: Sequelize.INTEGER,
          references: { model: 'cts', key: 'id' },
          allowNull: true,
        }],
        ['planilla_mensual_trunca_id', {
          type: Sequelize.INTEGER,
          references: { model: 'planilla_mensual', key: 'id' },
          allowNull: true,
        }],
        ['cts_trunca_monto', { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.0 }],
        ['vacaciones_truncas_monto', { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.0 }],
        ['gratificacion_trunca_monto', { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.0 }],
        ['remuneracion_trunca_monto', { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.0 }],
        ['afp_descuento', { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.0 }],
        ['adelanto_descuento', { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.0 }],
        ['otros_descuentos', { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.0 }],
        ['detalle_remuneracion_computable', { type: Sequelize.JSON, allowNull: true }],
      ];

      for (const [col, def] of columnasAgregar) {
        if (!table[col]) {
          await queryInterface.addColumn('bajas_trabajadores', col, def, { transaction: t });
        }
      }
    });
  },
};
