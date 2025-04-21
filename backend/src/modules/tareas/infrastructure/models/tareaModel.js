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
      allowNull: false,
      references: { model: "empresas_proveedoras", key: "id" },
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "clientes", key: "id" },
    },
    obraId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "obras", key: "id" },
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: false,
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
    urgencia: {
      type: DataTypes.ENUM("Prioridad", "Normal", "Baja prioridad"),
      allowNull: false,
    },
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
  },
  {
    timestamps: false,
    tableName: "tareas",
  }
);

Tarea.associate = (models) => {
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
};

module.exports = { Tarea }; // Exporta el modelo para que pueda ser utilizado en otros módulos
