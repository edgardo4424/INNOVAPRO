'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ?? factura
    const fields = [
      'monto_Oper_Gravadas',
      'monto_Oper_Exoneradas',
      'monto_Igv',
      'total_Impuestos',
      'valor_Venta',
      'sub_Total',
      'monto_Imp_Venta',
      'neto_Pagar',
      'detraccion_percent',
      'detraccion_mount',
      'descuento_monto_base',
      'descuento_factor',
      'descuento_monto'
    ];

    for (const field of fields) {
      await queryInterface.changeColumn('factura', field, {
        type: Sequelize.DECIMAL(12, 6),
        allowNull: true
      });
    }


    // ? DETALLE
    const fields2 = [
      'monto_Valor_Unitario',
      'monto_Base_Igv',
      'porcentaje_Igv',
      'igv',
      'total_Impuestos',
      'monto_Precio_Unitario',
      'monto_Valor_Venta',
      'factor_Icbper',
    ];

    for (const field of fields2) {
      await queryInterface.changeColumn('detalle_factura', field, {
        type: Sequelize.DECIMAL(12, 6),
        allowNull: false
      });
    }

    // ? FORMA PAGO
    await queryInterface.changeColumn('forma_pago_factura', 'monto', {
      type: Sequelize.DECIMAL(12, 6),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // ?? factura
    const fields = [
      'monto_Oper_Gravadas',
      'monto_Oper_Exoneradas',
      'monto_Igv',
      'total_Impuestos',
      'valor_Venta',
      'sub_Total',
      'monto_Imp_Venta',
      'neto_Pagar',
      'detraccion_percent',
      'detraccion_mount',
      'descuento_monto_base',
      'descuento_factor',
      'descuento_monto'
    ];

    for (const field of fields) {
      await queryInterface.changeColumn('factura', field, {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      });
    }

    // ? DETALLES
    const fields2 = [
      'monto_Valor_Unitario',
      'monto_Base_Igv',
      'porcentaje_Igv',
      'igv',
      'total_Impuestos',
      'monto_Precio_Unitario',
      'monto_Valor_Venta',
      'factor_Icbper',
    ];

    for (const field of fields2) {
      await queryInterface.changeColumn('detalle_factura', field, {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      });
    }

    // ? FORMA PAGO
    await queryInterface.changeColumn('forma_pago_factura', 'monto', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    });
  }
};
