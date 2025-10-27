const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const Tarea = sequelize.define(
  "tareas",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "usuarios", key: "id" },
    },
    empresaProveedoraId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "empresas_proveedoras", key: "id" },
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "clientes", key: "id" },
    },
    obraId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "obras", key: "id" },
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipoTarea: {
      type: DataTypes.ENUM(
        "Apoyo Técnico",
        "Apoyo Administrativo",
        "Pase de Pedido",
        "Servicios Adicionales",
        "Tarea Interna"
      ),
      allowNull: false,
    },
  /*   urgencia: {
      type: DataTypes.ENUM("Prioridad", "Normal", "Baja prioridad"),
      allowNull: false,
    }, */
    estado: {
      type: DataTypes.ENUM(
        "Pendiente",
        "En proceso",
        "Finalizada",
        "Devuelta",
        "Cancelada"
      ),
      defaultValue: "Pendiente",
    },
    detalles: {
      type: DataTypes.JSON, // Permite almacenar la info de cada tarea como JSON
      allowNull: false,
      defaultValue: {},
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    asignadoA: {
      type: DataTypes.INTEGER, // Usuario de OT que tomó la tarea
      allowNull: true,
    },
    motivoDevolucion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    correccionComercial: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactoId: {
      type: DataTypes.INTEGER,
       allowNull: true,
      references: { model: "contactos", key: "id" },
    },
     usoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "usos", key: "id" },
    },
    atributos_valor_zonas: {
       type: DataTypes.JSON,
      defaultValue: [],
    },
    cotizacionId:{
    type: DataTypes.INTEGER,
    allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: "tareas",
  }
);

Tarea.associate = (models) => {
  Tarea.hasMany(models.pases_pedidos,{
    foreignKey:"tarea_id",
    as:"pases_pedidos"
  })
  Tarea.belongsTo(models.usuarios, {
    foreignKey: "usuarioId",
    as: "usuario_solicitante",
  });
  Tarea.belongsTo(models.usuarios, {
    foreignKey: "asignadoA",
    as: "tecnico_asignado",
  });
  Tarea.belongsTo(models.empresas_proveedoras, {
    foreignKey: "empresaProveedoraId",
    as: "empresa_proveedora",
  });
  Tarea.belongsTo(models.clientes, {
    foreignKey: "clienteId",
    as: "cliente",
  });
  Tarea.belongsTo(models.obras, {
    foreignKey: "obraId",
    as: "obra",
  });
    Tarea.belongsTo(models.usos, {
    foreignKey: "usoId",
    as: "uso",
  });
   Tarea.belongsTo(models.contactos, {
    foreignKey: "contactoId",
    as: "contacto",
  });
};

module.exports = { Tarea }; // Exporta el modelo para que pueda ser utilizado en otros módulos
