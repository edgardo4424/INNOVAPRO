const { GuiaRemision } = require("../models/guia-remision/guiaRemisionModel");
const { GuiaDetalles } = require("../models/guia-remision/guiaDetallesModel");
const { GuiaChoferes } = require("../models/guia-remision/guiaChoferesModel");
const { GuiaTranportista } = require("../models/guia-remision/guiaTransportistaModel");
const { Filial } = require("../../../filiales/infrastructure/models/filialModel");
const { Ubigeo } = require("../../../ubigeo/infrastructure/models/ubigeoModel");
const { Pieza } = require("../../../piezas/infrastructure/models/piezaModel");
const { SunatRespuesta } = require("../models/sunatRespuestaModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const { Op, fn, col } = require('sequelize');


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

    async relacionRemision(body) {
        const { ruc } = body
        const guias = await GuiaRemision.findAll({
            where: { empresa_ruc: ruc },
            include: [
                { model: GuiaDetalles },
                { model: GuiaChoferes },
                // { model: SunatRespuesta },
            ],
            oder: [["id", "DESC"]],
        })

        return guias
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
            const createdDetalles = [];
            for (const detalleData of data.detalle) {
                const detalle = await GuiaDetalles.create(
                    {
                        guia_id: guia.id,
                        ...detalleData,
                    },
                    { transaction }
                );
                if (!detalle) {
                    throw new Error(
                        `No se pudo crear un detalle para el producto ${detalleData.cod_producto || "desconocido"}`
                    );
                }
                createdDetalles.push(detalle);
            }
            createdGuia.detalles = createdDetalles;

            // * 3. Crear los Choferes de la Guia, solo si se proporcionaron choferes
            const createdChoferes = [];
            for (const choferData of data.chofer) {
                const chofer = await GuiaChoferes.create(
                    {
                        guia_id: guia.id,
                        ...choferData,
                    },
                    { transaction }
                );
                if (!chofer) {
                    throw new Error(
                        `No se pudo crear un chofer para el producto ${choferData.cod_producto || "desconocido"}`
                    );
                }
                createdChoferes.push(chofer);
            }
            createdGuia.choferes = createdChoferes;


            // * 4. Crear los Transportistas de la Guia, solo si se proporcionaron choferes
            if (data.transportista) {

                const transportista = await GuiaTranportista.create(
                    {
                        guia_id: guia.id,
                        ...data.transportista,
                    },
                    { transaction }
                );
                if (!transportista) {
                    throw new Error(
                        `No se pudo crear el transportista.`
                    );
                }
                createdGuia.transportista = transportista;
            }

            // * 5. Crear la SunatRespuesta
            if (data.sunat_respuesta) {

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
            }
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

            if (nTipoDoc) {
                if (nTipoDoc == "99") {
                    where.estado = {
                        [Op.or]: [
                            "ANULADA",
                        ],
                    };
                } else if (nTipoDoc == "66") {
                    where.estado = {
                        [Op.or]: [
                            "RECHAZADA",
                        ],
                    };
                } else if (nTipoDoc == "88") {
                    where.estado = {
                        [Op.or]: [
                            "PENDIENTE",
                        ],
                    };
                }
                else {
                    where.tipo_doc = nTipoDoc;
                }
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
                order: [["id", "DESC"]],
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

    async correlativo(body) {
        const resultados = [];
        const rucsAndSeries = [];

        for (const data of body) {
            if (data.serie) {
                for (const serie of data.serie) {
                    rucsAndSeries.push({ ruc: data.ruc, serie: serie.value });
                }
            }
        }

        const correlativosPorSerie = await GuiaRemision.findAll({
            attributes: [
                'empresa_Ruc',
                'serie',
                // Aplica CAST para convertir el string 'correlativo' a un número antes de obtener el máximo
                [db.sequelize.literal('MAX(CAST(correlativo AS UNSIGNED))'), 'ultimo_correlativo']
            ],
            where: {
                [Op.or]: rucsAndSeries.map(item => ({
                    empresa_Ruc: item.ruc,
                    serie: item.serie
                }))
            },
            group: ['empresa_Ruc', 'serie'],
            raw: true
        });

        const correlativosMap = new Map();
        for (const result of correlativosPorSerie) {
            const key = `${result.empresa_Ruc}-${result.serie}`;
            correlativosMap.set(key, Number(result.ultimo_correlativo));
        }

        for (const item of rucsAndSeries) {
            const key = `${item.ruc}-${item.serie}`;
            const ultimoCorrelativo = correlativosMap.get(key) || 0;
            // ? LA CANTIDAD DE DIGITOS EN EL CORRELATIVO ES DE 8
            const siguienteCorrelativo = String(ultimoCorrelativo + 1).padStart(8, '0');

            resultados.push({
                ruc: item.ruc,
                serie: item.serie,
                siguienteCorrelativo: siguienteCorrelativo
            });
        }

        return resultados;
    }

    async correlativoPendientes(body) {
        const resultados = [];
        const rucsAndSeries = [];

        // Armar combinaciones de RUC y Serie
        for (const data of body) {
            if (data.serie) {
                for (const serie of data.serie) {
                    rucsAndSeries.push({ ruc: data.ruc, serie: serie.value });
                }
            }
        }

        // Traer correlativos de GuiaRemision
        const guias = await GuiaRemision.findAll({
            attributes: ["empresa_Ruc", "serie", "correlativo"],
            where: {
                [Op.or]: rucsAndSeries.map(item => ({
                    empresa_Ruc: item.ruc,
                    serie: item.serie
                }))
            },
            raw: true
        });

        // Agrupar por RUC-SERIE
        const agrupados = new Map();
        for (const g of guias) {
            const key = `${g.empresa_Ruc}-${g.serie}`;
            if (!agrupados.has(key)) agrupados.set(key, []);
            agrupados.get(key).push(Number(g.correlativo));
        }

        // Detectar correlativos pendientes
        for (const { ruc, serie } of rucsAndSeries) {
            const key = `${ruc}-${serie}`;
            const correlativos = (agrupados.get(key) || []).sort((a, b) => a - b);

            const pendientes = [];
            if (correlativos.length > 0) {
                const min = correlativos[0];
                const max = correlativos[correlativos.length - 1];

                // Usamos Set para mejor rendimiento
                const existentes = new Set(correlativos);

                for (let i = min; i <= max; i++) {
                    if (!existentes.has(i)) {
                        pendientes.push(String(i).padStart(8, "0"));
                    }
                }
            }

            // 👉 Solo guardar si tiene pendientes
            if (pendientes.length > 0) {
                resultados.push({
                    ruc,
                    serie,
                    pendientes
                });
            }
        }

        return resultados;
    }


    async obtenerGuiaPorInformacion(correlativo, serie, empresa_ruc, tipo_doc, id) {
        const whereGuia = { correlativo: correlativo, serie: serie, empresa_ruc: empresa_ruc, tipo_doc: tipo_doc };
        if (id) whereGuia.id = id

        const guias = await GuiaRemision.findAll({
            where: whereGuia,
            include: [
                { model: GuiaDetalles },
                { model: GuiaChoferes },
                { model: GuiaTranportista },
            ],
        });


        // 🚨 Si no hay resultados, retornamos arreglo vacío inmediatamente
        if (!guias || guias.length === 0) {
            return [];
        }

        const empresa = await Filial.findOne({
            where: { ruc: empresa_ruc },
            attributes: [
                "ruc",
                "razon_social",
                "direccion",
                "telefono_oficina",
                "correo",
                "cuenta_banco",
                "link_website",
                "codigo_ubigeo"],
        });

        const ubigeo = await Ubigeo.findOne({ where: { Codigo: empresa?.codigo_ubigeo } });
        const ubigeoPartida = await Ubigeo.findOne({ where: { Codigo: guias[0]?.guia_Envio_Partida_Ubigeo } });
        const ubigeoDestino = await Ubigeo.findOne({ where: { Codigo: guias[0]?.guia_Envio_Llegada_Ubigeo } });

        //? Mapear el resultado final con la información adicional
        return guias.map(guia => ({
            ...guia.dataValues,
            empresa_nombre: empresa?.razon_social,
            empresa_direccion: empresa?.direccion,
            empresa_telefono: empresa?.telefono_oficina || null,
            empresa_correo: empresa?.correo || null,
            empresa_cuenta_banco: empresa?.cuenta_banco || null,
            empresa_link_website: empresa?.link_website || null,
            departamento: ubigeo?.departamento || null,
            provincia: ubigeo?.provincia || null,
            distrito: ubigeo?.distrito || null,
            partidaUbigeo: `(${ubigeoPartida?.codigo}) ${ubigeoPartida?.departamento} - ${ubigeoPartida?.provincia} - ${ubigeoPartida?.distrito}` || null,
            llegadaUbigeo: `(${ubigeoDestino?.codigo}) ${ubigeoDestino?.departamento} - ${ubigeoDestino?.provincia} - ${ubigeoDestino?.distrito}` || null
        }));
    }

    async obtenerPeso(items) {
        const { id, guia_id, unidad, cantidad, cod_Producto, descripcion } = items;

        try {
            let piezas = await Pieza.findAll({
                where: {
                    item: cod_Producto
                }
            });
            return piezas;
        } catch (error) {
            console.error(`Error al obtener peso para ${cod_Producto}:`, error);
            return [];
        }
    }
}

module.exports = SequelizeGuiaRemisionRepository;