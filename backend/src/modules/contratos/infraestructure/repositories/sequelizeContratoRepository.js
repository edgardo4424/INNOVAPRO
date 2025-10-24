const { Contrato } = require("../models/contratoModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

class SequelizeContratoRepository {
  async crearContrato(payload, transaction = null) {
    const contrato_creado = await Contrato.create(payload, { transaction });
    return contrato_creado;
  }
  async actualizarContrato(payload, transaction = null) {
    const options = {
      where: {
        id: payload.contrato_id,
      },
    };
    if (transaction) options.transaction = transaction;
    await Contrato.update(payload, options);
  }

  async buscarContratoPorCotizacionId(cotizacion_id, transaction = null) {
    const options = {
      where: {
        cotizacion_id,
      },
    };
    if (transaction) options.transaction = transaction;
    const contratoEncontrado = await Contrato.findOne(options);
    return contratoEncontrado;
  }

  async obtenerContratos(transaction = null) {
    const options = {};
    if (transaction) options.transaction = transaction;
    const contratos = await Contrato.findAll(
      {
        // Incluir asociaciones si es necesario
        include: [
          {
            model: db.clientes,
            as: "cliente",
            attributes: ["id", "razon_social", "ruc"],
          },
          {
            model: db.obras,
            as: "obra",
            attributes: ["id", "nombre", "direccion"],
          },
          {
            model: db.usuarios,
            as: "usuario",
            attributes: ["id"],
            include: [
              {
                model: db.trabajadores,
                as: "trabajador",
                attributes: ["nombres", "apellidos"],
              },
            ],
          },
          {
            model: db.usos,
            as: "uso",
            attributes: ["id", "descripcion"],
          },
          {
            model: db.despieces,
            as: "despiece",
            attributes: ["id", "cp"],
          },
          {
            model: db.cotizaciones,
            as: "cotizacion",
          },
        ],
        order: [["createdAt", "DESC"]], //Ordenar del más nuevo al más viejo
      },
      options
    );
    return contratos;
  }

  async autocompletarCotizacionParaCrearContrato(
    cotizacion_id,
    transaction = null
  ) {
    // Obtener la cotizacion por ID y estado "Por Aprobar"

    const cotizacion = await db.cotizaciones.findOne({
      where: {
        id: cotizacion_id,
        //estados_cotizacion_id: 3, // Estado "Por Aprobar"
      },
         include: [
          {
            model: db.obras,
            as: "obra",
          },
          {
            model: db.clientes,
            as: "cliente",
          },
          {
            model: db.contactos,
            as: "contacto",
          },
          {
            model: db.empresas_proveedoras,
            
          },
          {
            model: db.usuarios,
            as: "usuario",
            include: [
              {
                model: db.trabajadores,
                as: "trabajador",
              },
            ],
          },
          {
            model: db.usos,
            as: "uso",
          },
          {
            model: db.despieces,
            as: "despiece",
          }
        ],
     
    }, { transaction });
    
    return cotizacion;
  }

  // Este método se usa para actualizar el estado de un contrato de acuerdo a los parámetros que recibe
  async actualizarEstadoCondiciones(id, nuevoEstado) {
    const contrato = await this.obtenerPorId(id);
   
    if (!contrato) return null;
    contrato.estado_condiciones = nuevoEstado;
    await contrato.save();
    return contrato;
  }

  async obtenerPorId(id, transaction = null) {
    return await Contrato.findByPk(id, {
      include: [
        {
          model: db.cotizaciones,
          as: "cotizacion",
        },
      ],
      ...(transaction && { transaction }),
    }); // Llama al método del repositorio para obtener un contrato por ID
  }

  
}

module.exports = SequelizeContratoRepository;
