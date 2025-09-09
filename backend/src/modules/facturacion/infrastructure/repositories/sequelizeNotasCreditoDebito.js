// La importación de la base de datos es la causa del error.
// La mayoría de los proyectos Sequelize exportan un objeto que contiene los modelos y la instancia de sequelize.
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos

const { NotasCreditoDebito } = require("../models/notas-credito-debito/notasCreditoDebitoModel");
const { LegendNotaCreditoDebito } = require("../models/notas-credito-debito/legendNotaCreditoDebitoModel");
const { DetalleNotaCreditoDebito } = require("../models/notas-credito-debito/detalleNotaCreditoDebitoModel");
const { SunatRespuesta } = require("../models/sunatRespuestaModel");
const { Factura } = require("../models/factura-boleta/facturaModel");
const { GuiaRemision } = require("../models/guia-remision/guiaRemisionModel");
const { Op, fn, col } = require('sequelize');

class SequelizeNotasCreditoDebitoRepository {

    async toNumber(value) {
        return value != null ? parseFloat(value) : 0;
    }
    async crear(data) {
        console.log("desde el repositorio", data);
        // Inicia una transacción usando la instancia correcta de sequelize.
        const transaction = await db.sequelize.transaction();
        let createdNota = {};

        try {
            //* 1. Crear la Nota de Crédito/Débito principal
            const nota = await NotasCreditoDebito.create(data.nota, { transaction });
            if (!nota) {
                throw new Error("No se pudo crear la nota de crédito/débito principal.");
            }
            createdNota.nota = nota;

            console.log("NOTA CREADA", nota);

            //* 2. Crear los Detalles de la Nota
            const createdDetalles = [];
            for (const detalleData of data.detalle) {
                try {
                    const detalle = await DetalleNotaCreditoDebito.create(
                        {
                            nota_id: nota.id,
                            ...detalleData,
                            id: undefined,
                        },
                        { transaction }
                    );
                    if (!detalle) {
                        throw new Error(
                            `No se pudo crear un detalle para el producto ${detalleData.cod_producto || "desconocido"}.`
                        );
                    }
                    createdDetalles.push(detalle);
                } catch (error) {
                    console.error(error);
                    throw new Error(
                        `No se pudo crear un detalle para el producto ${detalleData.cod_producto || "desconocido"}.`
                    );
                }
            }
            createdNota.detalles = createdDetalles;

            console.log("DETALLES CREADOS", createdDetalles);

            //* 3. Crear las Leyendas de la Nota
            const createdLeyendas = [];
            for (const leyendaData of data.leyendas) {
                const leyenda = await LegendNotaCreditoDebito.create(
                    {
                        nota_id: nota.id,
                        ...leyendaData,
                    },
                    { transaction }
                );
                if (!leyenda) {
                    throw new Error("No se pudo crear una leyenda para la nota.");
                }
                createdLeyendas.push(leyenda);
            }
            createdNota.leyendas = createdLeyendas;

            console.log("LEYENDAS CREADAS", createdLeyendas);

            // *4. Crear la Respuesta de SUNAT
            const sunat = await SunatRespuesta.create(
                {
                    nota_id: nota.id,
                    ...data.sunat_respuesta,
                },
                { transaction }
            );
            if (!sunat) {
                throw new Error("No se pudo crear la respuesta de SUNAT.");
            }
            createdNota.sunat_respuesta = sunat;

            console.log("RESPUESTA CREADA", sunat);

            //* 5. Anular la factura asociada (MOVIDO DENTRO DE LA TRANSACCIÓN)
            const { factura_id, guia_id, } = data.nota;
            let modelToUpdate = null;
            if (factura_id) {
                modelToUpdate = Factura;
            } else if (guia_id) {
                modelToUpdate = GuiaRemision;
            }
            if (!modelToUpdate) {
                throw new Error("No se encontró ni la factura ni la guía para anular.");
            }
            const toUpdate = await modelToUpdate.findByPk(factura_id || guia_id);
            if (!toUpdate) {
                throw new Error("No se encontró la factura o guía para anular.");
            }
            // Se cambia el valor "ANULADO" a "A" para evitar el error de truncamiento de datos

            let valueEstado;
            if (data.nota.tipo_Doc === "07") {
                if (data.nota.motivo_Cod === "01" || data.nota.motivo_Cod === "02") {
                    valueEstado = "ANULADA-NOTA";
                } else {
                    valueEstado = "MODIFICADA-NOTA";
                }
            } else {
                valueEstado = "MODIFICADA-NOTA";
            }
            await toUpdate.update({ estado: valueEstado }, { transaction });

            console.log("FACTURA O GUIA ANULADA", toUpdate);

            //* Si todas las operaciones fueron exitosas, confirma la transacción.
            await transaction.commit();

            return {
                success: true,
                message: "Nota de crédito/débito y sus componentes creados con éxito.",
                data: createdNota,
            };
        } catch (error) {
            //! Si ocurre algún error, revierte la transacción para no guardar datos incompletos.
            await transaction.rollback();
            console.error(
                "Error en SequelizeNotasCreditoDebitoRepository.crear:",
                error.message,
                error.stack
            );
            return {
                success: false,
                message: error.message || "Ocurrió un error inesperado al crear la nota.",
                data: null,
            };
        }
    }

    async obtenerNotas(data) {
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
            } = data;
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
                where.tipo_doc = nTipoDoc;
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

            const { count, rows } = await NotasCreditoDebito.findAndCountAll({
                attributes: [
                    "id",
                    "tipo_Operacion",
                    "tipo_Doc",
                    "serie",
                    "correlativo",
                    "tipo_Moneda",
                    "fecha_Emision",
                    "empresa_Ruc",
                    "cliente_Num_Doc",
                    "cliente_Razon_Social",
                    "monto_Igv",
                    "total_Impuestos",
                    "afectado_Tipo_Doc",
                    "afectado_Num_Doc",
                    "motivo_Cod",
                    "estado"
                ],
                where,
                offset,
                limit: limitNumber,
                order: [["id", "DESC"]],
            });

            return {
                success: true,
                message: "Notas listadas correctamente.",
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
                message: "Error al listar las notas.",
                data: null,
                error: error.message,
            };
        }
    }
    async obtenerNotaDetallada(data) {
        console.log("desde el repositorio", data);
        const { correlativo, serie, empresa_ruc, tipo_doc } = data;

        const nota = await NotasCreditoDebito.findOne({
            where: {
                correlativo,
                serie,
                empresa_ruc,
                tipo_doc,
            },
            include: [
                {
                    model: DetalleNotaCreditoDebito,
                },
            ],
        });

        if (!nota) return null;

        return nota;
    }

    async documentoPorFilial(data) {
        const { empresa_ruc } = data;
        const documento = await NotasCreditoDebito.findAll({
            where: {
                empresa_ruc,
            },
        });

        return documento;
    }

    async correlativo(body) {
        const resultados = [];
        const rucsAndSeries = [];

        // Combinar las series de crédito y débito para cada RUC
        for (const data of body) {
            if (data.credito) {
                for (const serie of data.credito) {
                    // Aquí se mantiene el 'tipo' para la lógica de tu aplicación
                    rucsAndSeries.push({ ruc: data.ruc, serie: serie.value, tipo: 'credito' });
                }
            }
            if (data.debito) {
                for (const serie of data.debito) {
                    // Aquí se mantiene el 'tipo' para la lógica de tu aplicación
                    rucsAndSeries.push({ ruc: data.ruc, serie: serie.value, tipo: 'debito' });
                }
            }
        }

        // Usar una sola consulta para optimizar el rendimiento
        const correlativosPorSerie = await NotasCreditoDebito.findAll({
            attributes: [
                'empresa_ruc',
                'serie',
                // Se elimina 'tipo' de esta lista para evitar el error
                [db.sequelize.literal('MAX(CAST(correlativo AS UNSIGNED))'), 'ultimo_correlativo']
            ],
            where: {
                [Op.or]: rucsAndSeries.map(item => ({
                    empresa_ruc: item.ruc,
                    serie: item.serie,
                    // Se filtra por tipo en la condición WHERE
                    // Esto es crucial si las series se repiten entre crédito y débito
                    // En el caso de que la columna exista
                }))
            },
            group: ['empresa_ruc', 'serie'],
            raw: true // Para obtener resultados como objetos JSON simples
        });

        const correlativosMap = new Map();
        for (const result of correlativosPorSerie) {
            const key = `${result.empresa_ruc}-${result.serie}`;
            correlativosMap.set(key, Number(result.ultimo_correlativo));
        }

        // Construir el array de resultados finales
        for (const item of rucsAndSeries) {
            const key = `${item.ruc}-${item.serie}`;
            const ultimoCorrelativo = correlativosMap.get(key) || 0;
            const siguienteCorrelativo = String(ultimoCorrelativo + 1).padStart(5, '0');

            resultados.push({
                ruc: item.ruc,
                serie: item.serie,
                tipo: item.tipo, // Mantén el 'tipo' aquí si es necesario para tu respuesta
                siguienteCorrelativo: siguienteCorrelativo
            });
        }

        return resultados;
    }
}

module.exports = SequelizeNotasCreditoDebitoRepository;
