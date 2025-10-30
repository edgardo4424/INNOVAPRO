const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Contrato = sequelize.define(
   "contratos",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
         unique: true,
      },
      cotizacion_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         unique:false,
         references:{
            model:"cotizaciones",
            key:"id"
         }
      },
       despiece_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: "despieces",
              key: "id",
            },
          },
        contacto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "contactos",
              key: "id",
            },
          },
          cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "clientes",
              key: "id",
            },
          },
          obra_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "obras",
              key: "id",
            },
          },
          filial_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "empresas_proveedoras",
              key: "id",
            },
          },
          usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "usuarios",
              key: "id",
            },
          },
          uso_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "usos",
               key: "id",
            },
            },
      ref_contrato: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      fecha_inicio: {
         type: DataTypes.DATEONLY,
         allowNull: false, 
      },
      fecha_fin: {
         type: DataTypes.DATEONLY,
         allowNull: false,
      },
      clausulas_adicionales: {
         type: DataTypes.JSON,
         allowNull: true,
      },
      requiere_valo_adelantada: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      },
      condiciones_alquiler: {
         type: DataTypes.JSON,
         allowNull: true,
      },
     
      renovaciones: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      firmas: {
         type: DataTypes.JSON,
         allowNull: true,
      },
      envio: {
         type: DataTypes.JSON,
         allowNull: true,
      },
      estado: {
         type: DataTypes.ENUM(
            'PROGRAMADO',
            'VIGENTE',
            'POR VENCER',
            'VENCIDO',
            'FIRMADO'
         ),
         allowNull: false,
         defaultValue: 'PROGRAMADO',
      },
      estado_condiciones: {
         type: DataTypes.ENUM(
            'Creado',
            'Condiciones Solicitadas',
            'Validando Condiciones',
            'Condiciones Cumplidas'
         ),
         allowNull: false,
         defaultValue: 'Creado',
      },
      
   },
   {
      tableName: "contratos",
      timestamps: true,
   }
);

Contrato.associate = (models) => {
   Contrato.hasOne(models.pases_pedidos, {
      foreignKey: "contrato_id",
      as: "pase_pedido",
   });
   Contrato.belongsTo(models.cotizaciones,{
        foreignKey:"cotizacion_id",
        as:"cotizacion"
   });
   Contrato.belongsTo(models.clientes,{
         foreignKey:"cliente_id",
         as:"cliente"
   });
   Contrato.belongsTo(models.obras,{
         foreignKey:"obra_id",
         as:"obra"
   });
   Contrato.belongsTo(models.empresas_proveedoras, {
      foreignKey: "filial_id",
      as: "filial",
   });
   Contrato.belongsTo(models.usuarios, {
      foreignKey: "usuario_id",
      as: "usuario",
   });
   Contrato.belongsTo(models.usos, {
      foreignKey: "uso_id",
      as: "uso",
   });
   Contrato.belongsTo(models.despieces, {
      foreignKey: "despiece_id",
      as: "despiece",
   });

   Contrato.hasOne(models.condiciones_alquiler, {
      foreignKey: "contrato_id",
      as: "condiciones_alquiler_relacionado",
   });

   Contrato.belongsTo(models.contactos, {
      foreignKey: "contacto_id",
      as: "contacto",
   });

   Contrato.hasMany(models.documentos, {   
      foreignKey: "contrato_id",
      as: "documentos",
   });
};

module.exports = { Contrato };
