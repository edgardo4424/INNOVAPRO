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

            // * 2. Crear los Detalles de la Guia
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

    async listarGuias(query) {
        try {
            const {
                page = 1,
                limit,
                tipo_doc,
                empresa_ruc,
                cliente_num_doc,
                cliente_razon_social,
                usuario_id,
                fec_des,
                fec_ast,
            } = query;

            const sane = (v) => {
                if (v === null || v === undefined) return undefined;
                if (typeof v === "string") {
                    const t = v.trim();
                    if (!t || t.toLowerCase() === "null" || t.toLowerCase() === "undefined") return undefined;
                    return t;
                }
                return v;
            };

            // Usa NUEVAS variables (no reasignes las const del destructuring)
            const nTipoDoc = sane(tipo_doc);
            const nEmpresaRuc = sane(empresa_ruc);
            const nClienteNumDoc = sane(cliente_num_doc);
            const nClienteRazonSocial = sane(cliente_razon_social);
            const nUsuarioId = sane(usuario_id);
            const nFecDes = sane(fec_des);
            const nFecAst = sane(fec_ast);

            const pageNumber = Number.parseInt(page, 10) || 1;
            const limitNumber = limit ? Number.parseInt(limit, 10) : undefined;
            const offset = limitNumber ? (pageNumber - 1) * limitNumber : undefined;

            const where = {};

            if (nTipoDoc && nTipoDoc.toLowerCase() !== "todos") {
                where.tipo_borrador = nTipoDoc;
            }
            if (nEmpresaRuc) {
                where.empresa_ruc = { [Op.like]: `%${nEmpresaRuc}%` };
            }
            if (nClienteNumDoc) {
                where.cliente_num_doc = { [Op.like]: `%${nClienteNumDoc}%` };
            }
            if (nClienteRazonSocial) {
                where.cliente_razon_social = { [Op.like]: `%${nClienteRazonSocial}%` };
            }
            if (nUsuarioId) {
                where.usuario_id = nUsuarioId;
            }

            // Rango de fechas (asegúrate que el atributo del modelo sea exactamente 'fecha_Emision')
            if (nFecDes && nFecAst) {
                where.fecha_Emision = { [Op.between]: [nFecDes, nFecAst] };
            } else if (nFecDes) {
                where.fecha_Emision = { [Op.gte]: nFecDes };
            } else if (nFecAst) {
                where.fecha_Emision = { [Op.lte]: nFecAst };
            }

            const { count, rows } = await GuiaRemision.findAndCountAll({
                attributes: [
                    "id",
                    "tipo_doc",
                    "serie",
                    "correlativo",
                    "fecha_emision",
                    "empresa_ruc",
                    "cliente_num_doc",
                    "cliente_razon_social",
                    "usuario_id",
                    "estado",
                ],
                where,
                offset,
                limit: limitNumber,
            })

            return {
                success: true,
                message: "Guias listadas correctamente.",
                data: rows,
                metadata: {
                    totalRecords: count,
                    currentPage: pageNumber,
                    totalPages: limitNumber ? Math.ceil(count / limitNumber) : 1,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Error al listar los documentos.",
                data: null,
                error: error.message,
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