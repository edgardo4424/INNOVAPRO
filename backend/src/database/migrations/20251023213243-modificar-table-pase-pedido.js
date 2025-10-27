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
    
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.changeColumn("pases_pedidos", "estado", {
      type: Sequelize.ENUM(
        "Por confirmar",
        "Pre confirmado",
        "Confirmado",
        "En despacho",
        "Despacahdo"
      ),
      allowNull: true,
      defaultValue: "Por confirmar",
    });

    await queryInterface.changeColumn("pases_pedidos", "fecha_emision", {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.removeColumn("pases_pedidos", "tarea_id");
  },
};
