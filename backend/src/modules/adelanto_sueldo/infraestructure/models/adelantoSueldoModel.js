const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const AdelantoSueldo = sequelize.define(
   "adelanto_sueldo",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      trabajador_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "trabajadores",
            key: "id",
         },
      },
      fecha: {
         type: DataTypes.DATEONLY,
         allowNull: false,
      },
      monto: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },
      observacion: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      estado: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: true, // activo
      },
      tipo: {
         type: DataTypes.ENUM("simple", "gratificacion", "cts"),
         allowNull: false,
         defaultValue: "simple",
      },
      primera_cuota: {
         type: DataTypes.DATEONLY,
         allowNull: false,
      },
      forma_descuento: {
         type: DataTypes.ENUM("mensual", "quincenal"),
         allowNull: false,
      },
      cuotas: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      cuotas_pagadas: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   },
   {
      tableName: "adelanto_sueldo",
      timestamps: false,
   }
);

AdelantoSueldo.associate = (models) => {
   AdelantoSueldo.belongsTo(models.trabajadores, {
      foreignKey: "trabajador_id",
      as: "trabajadores",
   });
};

module.exports = { AdelantoSueldo };
