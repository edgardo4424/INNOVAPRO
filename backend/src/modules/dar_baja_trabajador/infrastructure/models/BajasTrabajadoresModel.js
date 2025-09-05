const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const BajasTrabajadores = sequelize.define(
   "bajas_trabajadores",
   {
       id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    trabajador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
       references: {
        model: "trabajadores",
        key: "id",
      },
    },
    contrato_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
       references: {
        model: "contratos_laborales",
        key: "id",
      },
    },
     fecha_baja: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    motivo: {
      type: DataTypes.ENUM('RENUNCIA', 'DESPIDO', 'FIN CONTRATO', 'MUTUO ACUERDO'),
      allowNull: false,
      defaultValue: 'FIN CONTRATO'
    },
    observacion: {
      type: DataTypes.TEXT,
    },
   
    usuario_registro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
       references: {
        model: "usuarios",
        key: "id",
      },
    },
    estado_liquidacion: {
      type: DataTypes.ENUM('CALCULADA', 'PAGADA'),
      allowNull: false,
      defaultValue: 'CALCULADA'
    }
  },
   {
      timestamps: true,
      tableName: "bajas_trabajadores",
   }
);

BajasTrabajadores.associate = (models) => {
    BajasTrabajadores.belongsTo(models.trabajadores, {
        foreignKey: 'trabajador_id',
        as: 'trabajador'
      });

      BajasTrabajadores.belongsTo(models.contratos_laborales, {
        foreignKey: 'contrato_id',
        as: 'contrato'
      });

      BajasTrabajadores.belongsTo(models.usuarios, {
        foreignKey: 'usuario_registro_id',
        as: 'usuarioRegistro'
      });
};

module.exports = { BajasTrabajadores }; // Exporta el modelo para que pueda ser utilizado en otros módulos
