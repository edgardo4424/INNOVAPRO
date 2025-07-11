const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const TipoTrabajo = sequelize.define(
   "tipos_trabajo",
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      nombre: {
         type: DataTypes.STRING,
         allowNull: false,
      },
   },
   {
      tableName: "tipos_trabajo",
      timestamps: false,
   }
);

TipoTrabajo.associate = (models) => {
   TipoTrabajo.hasMany(models.jornadas, {
      foreignKey: "tipo_trabajo_id",
      as: "jornadas",
   });

};
module.exports = { TipoTrabajo };