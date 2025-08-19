const { GuiaRemision } = require("../models/guia-remision/guiaRemisionModel");
const { GuiaDetalles } = require("../models/guia-remision/guiaDetallesModel");
const { GuiaChoferes } = require("../models/guia-remision/guiaChoferesModel");
const { SunatRespuesta } = require("../models/sunatRespuestaModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const { Op } = require("sequelize");


class SequelizeGuiaRemisionRepository {
    static toNumber(value) {
        return value != null ? parseFloat(value) : 0;
    }


    async obtenerGuia(id) {
        const guia = await GuiaRemision.findByPk(id, {
            include: [
                { model: GuiaDetalles },
                { model: GuiaChoferes },
                { model: SunatRespuesta },
            ],
        });
        if (!guia) return null;

        return guia;
    }

    async crear(data) {
        const transaction = await db.sequelize.transaction();
        let createdGuia = {};

        try {
            // * 1. Crear la Guia
            const guia = await GuiaRemision.create(data.guia, { transaction });
            if (!guia) {
                throw new Error("No se pudo crear la Guia de Remision.");
            }
            createdGuia.guia = guia;

            // // * 2. Crear los Detalles de la Guia
            // const createdDetalles = [];
            // for (const detalleData of data.detalle) {
            //     const detalle = await GuiaDetalles.create(
            //         {
            //             guia_id: guia.id,
            //             ...detalleData,
            //         },
            //         { transaction }
            //     );
            //     if (!detalle) {
            //         throw new Error(
            //             `No se pudo crear un detalle para el producto ${detalleData.cod_producto || "desconocido"}`
            //         );
            //     }
            //     createdDetalles.push(detalle);
            // }
            // createdGuia.detalles = createdDetalles;

            // // * 3. Crear los Choferes de la Guia
            // const createdChoferes = [];
            // for (const choferData of data.chofer) {
            //     const chofer = await GuiaChoferes.create(
            //         {
            //             guia_id: guia.id,
            //             ...choferData,
            //         },
            //         { transaction }
            //     );
            //     if (!chofer) {
            //         throw new Error(
            //             `No se pudo crear un chofer para el producto ${choferData.cod_producto || "desconocido"}`
            //         );
            //     }
            //     createdChoferes.push(chofer);
            // }
            // createdGuia.choferes = createdChoferes;

            // * 4. Crear la SunatRespuesta
            const sunat = await SunatRespuesta.create(
                {
                    guia_id: guia.id,
                    ...data.sunat_respuesta,
                },
                { transaction });
            if (!sunat) {
                throw new Error("No se pudo crear la SunatRespuesta.");
            }
            createdGuia.sunat_respuesta = sunat;
            // * Si todas las operaciones fueron exitosas, confirma la transacción.
            await transaction.commit();
            return {
                success: true,
                message: "Guia de Remision y sus componentes creados con éxito.",
                data: createdGuia
            }
        } catch (error) {
            await transaction.rollback();
            console.error(
                "Error en SequelizeGuiaRemisionRepository.crear:",
                error.message,
                error.stack
            );
            return {
                success: false,
                message:
                    error.message || "Ocurrio un error inesperado al crear la Guia de Remision.",
                data: null,
            };
        }
    }

    async correlativo() {
        const [lastGuiaRemision] = await GuiaRemision.findAll({
            order: [['id', 'DESC']],
            limit: 1,
            attributes: ['correlativo']
        });
        const correlativoGuia = lastGuiaRemision ? parseInt(lastGuiaRemision.correlativo) + 1 : 1;
        return {
            correlativo_guia: correlativoGuia.toString()
        }
    }
}

module.exports = SequelizeGuiaRemisionRepository;