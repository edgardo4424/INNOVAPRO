"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // ✅ Eliminar columna stock_disponible de stock_pedidos_piezas
    await queryInterface.removeColumn(
      "stock_pedidos_piezas",
      "stock_disponible"
    );

    // ✅ Eliminar columna tipo de movimientos_stock_pedido
    await queryInterface.removeColumn("movimientos_stock_pedido", "tipo_stock");

    await queryInterface.changeColumn("movimientos_stock_pedido", "tipo", {
      type: Sequelize.ENUM("alquiler", "devolucion", "compra"),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // 🔄 Revertir los cambios (agregar columnas de nuevo)

    await queryInterface.addColumn("stock_pedidos_piezas", "stock_disponible", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn("movimientos_stock_pedido", "tipo_stock", {
      type: Sequelize.ENUM("disponible", "fijo"),
      allowNull: false,
    });
    await queryInterface.changeColumn("movimientos_stock_pedido", "tipo", {
      type: Sequelize.ENUM("alquiler", "devolucion", "venta"),
      allowNull: false,
    });
  },
};
