"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("pases_pedidos", "estado", {
      type: Sequelize.ENUM(
        "Por confirmar",
        "Pre confirmado",
        "Confirmado",
        "Rechazado",
        "Stock Confirmado",
        "Incompleto",
        "Finalizado"
      ),
      allowNull: false,
      defaultValue: "Por confirmar",
    });
    await queryInterface.changeColumn("pases_pedidos", "fecha_emision", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
    await queryInterface.addColumn("pases_pedidos", "tarea_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "tareas",
        key: "id",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    await queryInterface.createTable("pedidos_guias", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      guia_remision_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "guias_de_remision",
          key: "id",
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      contrato_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "contratos",
          key: "id",
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      pase_pedido_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "pases_pedidos",
          key: "id",
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      fecha_despacho: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      tipo_guia: {
        type: Sequelize.ENUM("alquiler", "venta"),
        allowNull: false,
      },
      tipo_pedido: {
        type: Sequelize.ENUM("envio", "devolucion"),
        allowNull: false,
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

    // === Tabla: stock_pedidos_piezas ===
    await queryInterface.createTable("stock_pedidos_piezas", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      pase_pedido_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "pases_pedidos",
          key: "id",
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      pieza_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "piezas",
          key: "id",
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      stock_fijo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      stock_disponible: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    // === Tabla: movimientos_stock_pedido ===
    await queryInterface.createTable("movimientos_stock_pedido", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      stock_pedido_pieza_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "stock_pedidos_piezas",
          key: "id",
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      tipo: {
        type: Sequelize.ENUM("alquiler", "devolucion", "venta"),
        allowNull: false,
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      stock_pre_movimiento: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      stock_post_movimiento: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tipo_stock: {
        type: Sequelize.ENUM("disponible", "fijo"),
        allowNull: false,
      },
      motivo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.dropTable("movimientos_stock_pedido");
    await queryInterface.dropTable("stock_pedidos_piezas");
    await queryInterface.dropTable("pedidos_guias");
  },
};
