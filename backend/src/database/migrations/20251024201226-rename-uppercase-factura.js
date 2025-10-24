'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // ?FACTURA 
    await queryInterface.renameColumn('factura', 'tipo_operacion', 'tipo_Operacion');
    await queryInterface.renameColumn('factura', 'tipo_doc', 'tipo_Doc');
    await queryInterface.renameColumn('factura', 'tipo_moneda', 'tipo_Moneda');
    await queryInterface.renameColumn('factura', 'fecha_emision', 'fecha_Emision');
    await queryInterface.renameColumn('factura', 'empresa_ruc', 'empresa_Ruc');
    await queryInterface.renameColumn('factura', 'cliente_tipo_doc', 'cliente_Tipo_Doc');
    await queryInterface.renameColumn('factura', 'cliente_num_doc', 'cliente_Num_Doc');
    await queryInterface.renameColumn('factura', 'cliente_razon_social', 'cliente_Razon_Social');
    await queryInterface.renameColumn('factura', 'cliente_direccion', 'cliente_Direccion');
    await queryInterface.renameColumn('factura', 'total_impuestos', 'total_Impuestos');
    await queryInterface.renameColumn('factura', 'valor_venta', 'valor_Venta');
    await queryInterface.renameColumn('factura', 'sub_total', 'sub_Total');
    await queryInterface.renameColumn('factura', 'monto_imp_venta', 'monto_Imp_Venta');
    await queryInterface.renameColumn('factura', 'estado_documento', 'estado_Documento');

    // ? DETALLE
    await queryInterface.renameColumn('detalle_factura', 'cod_producto', 'cod_Producto');
    await queryInterface.renameColumn('detalle_factura', 'monto_valor_unitario', 'monto_Valor_Unitario');
    await queryInterface.renameColumn('detalle_factura', 'monto_base_igv', 'monto_Base_Igv');
    await queryInterface.renameColumn('detalle_factura', 'porcentaje_igv', 'porcentaje_Igv');
    await queryInterface.renameColumn('detalle_factura', 'tip_afe_igv', 'tip_Afe_Igv');
    await queryInterface.renameColumn('detalle_factura', 'total_impuestos', 'total_Impuestos');
    await queryInterface.renameColumn('detalle_factura', 'monto_precio_unitario', 'monto_Precio_Unitario');
    await queryInterface.renameColumn('detalle_factura', 'monto_valor_venta', 'monto_Valor_Venta');
    await queryInterface.renameColumn('detalle_factura', 'factor_icbper', 'factor_Icbper');

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // DOWN
    // ? FACTURA
    await queryInterface.renameColumn('factura', 'tipo_Operacion', 'tipo_operacion');
    await queryInterface.renameColumn('factura', 'tipo_Doc', 'tipo_doc');
    await queryInterface.renameColumn('factura', 'tipo_Moneda', 'tipo_moneda');
    await queryInterface.renameColumn('factura', 'fecha_Emision', 'fecha_emision');
    await queryInterface.renameColumn('factura', 'empresa_Ruc', 'empresa_ruc');
    await queryInterface.renameColumn('factura', 'cliente_Tipo_Doc', 'cliente_tipo_doc');
    await queryInterface.renameColumn('factura', 'cliente_Num_Doc', 'cliente_num_doc');
    await queryInterface.renameColumn('factura', 'cliente_Razon_Social', 'cliente_razon_social');
    await queryInterface.renameColumn('factura', 'cliente_Direccion', 'cliente_direccion');
    await queryInterface.renameColumn('factura', 'total_Impuestos', 'total_impuestos');
    await queryInterface.renameColumn('factura', 'valor_Venta', 'valor_venta');
    await queryInterface.renameColumn('factura', 'sub_Total', 'sub_total');
    await queryInterface.renameColumn('factura', 'monto_Imp_Venta', 'monto_imp_venta');
    await queryInterface.renameColumn('factura', 'estado_Documento', 'estado_documento');

    // ? DETALLE
    await queryInterface.renameColumn('detalle_factura', 'cod_Producto', 'cod_producto');
    await queryInterface.renameColumn('detalle_factura', 'monto_Valor_Unitario', 'monto_valor_unitario');
    await queryInterface.renameColumn('detalle_factura', 'monto_Base_Igv', 'monto_base_igv');
    await queryInterface.renameColumn('detalle_factura', 'porcentaje_Igv', 'porcentaje_igv');
    await queryInterface.renameColumn('detalle_factura', 'tip_Afe_Igv', 'tip_afe_igv');
    await queryInterface.renameColumn('detalle_factura', 'total_Impuestos', 'total_impuestos');
    await queryInterface.renameColumn('detalle_factura', 'monto_Precio_Unitario', 'monto_precio_unitario');
    await queryInterface.renameColumn('detalle_factura', 'monto_Valor_Venta', 'monto_valor_venta');
    await queryInterface.renameColumn('detalle_factura', 'factor_Icbper', 'factor_icbper');

  }
};
