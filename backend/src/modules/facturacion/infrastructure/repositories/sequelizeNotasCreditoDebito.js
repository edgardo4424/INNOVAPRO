
const { NotasCreditoDebito } = require("../models/notas-credito-debito/notasCreditoDebitoModel");
const { LegendNotaCreditoDebito } = require("../models/notas-credito-debito/legendNotaCreditoDebitoModel");
const { DetalleNotaCreditoDebito } = require("../models/notas-credito-debito/detalleNotaCreditoDebitoModel");
const { SunatRespuesta } = require("../models/sunatRespuestaModel");
const { Factura } = require("../models/factura-boleta/facturaModel");
const { Filial } = require("../../../filiales/infrastructure/models/filialModel");
const { Ubigeo } = require("../../../ubigeo/infrastructure/models/ubigeoModel");
const db = require("../../../../database/models");
const { Op, fn, col } = require('sequelize');

class SequelizeNotasCreditoDebitoRepository {

    async toNumber(value) {
        return value != null ? parseFloat(value) : 0;
    }
    async crear(data) {
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

            //* 3. Crear las Leyendas de la Nota
            const createdLeyendas = [];
            for (const leyendaData of data.legend) {
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


            //* 5. Anular la factura asociada (MOVIDO DENTRO DE LA TRANSACCIÓN)
            const { factura_id } = data.nota;
            let modelToUpdate = null;

            if (factura_id) {
                modelToUpdate = Factura;
            }

            if (!modelToUpdate) {
                throw new Error("No se encontró ni la factura ni la guía para anular.");
            }

            const toUpdate = await modelToUpdate.findByPk(factura_id);
            if (!toUpdate) {
                throw new Error("No se encontró la factura o guía para anular.");
            }
            // 🔸 Solo afectar la factura si la nota fue EMITIDA
            if (data.nota.estado === "EMITIDA") {
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
                console.log(`Factura ${factura_id} actualizada a estado: ${valueEstado}`);
            } else {
                console.log(
                    `⚠️ Nota ${data.nota.serie}-${data.nota.correlativo} tiene estado '${data.nota.estado}', no se afecta la factura.`
                );
            }

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
                where.empresa_Ruc = { [Op.like]: `%${nEmpresaRuc}%` };
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
                    "factura_id",
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
    async obtenerNotaDetallada(correlativo, serie, empresa_ruc, tipo_doc, id) {
        let whereNota = { correlativo: correlativo, serie: serie, empresa_Ruc: empresa_ruc, tipo_Doc: tipo_doc };
        if (id) whereNota.id = id
        const nota = await NotasCreditoDebito.findAll({
            where: whereNota,
            include: [
                { model: LegendNotaCreditoDebito },
                { model: DetalleNotaCreditoDebito },
            ],
        });

        if (!nota || nota.length === 0) {
            return [];
        }

        const datosFactura = await Factura.findAll({
            where: {
                id: nota[0]?.dataValues?.factura_id,
            },
        });
        
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


        return nota.map(f => ({
            ...f.dataValues,
            empresa_nombre: empresa?.razon_social,
            empresa_direccion: empresa?.direccion,
            empresa_telefono: empresa?.telefono_oficina || null,
            empresa_correo: empresa?.correo || null,
            empresa_cuenta_banco: empresa?.cuenta_banco || null,
            empresa_link_website: empresa?.link_website || null,
            departamento: ubigeo?.departamento || null,
            provincia: ubigeo?.provincia || null,
            distrito: ubigeo?.distrito || null,
            documento_relacionado: datosFactura[0]?.dataValues || null
        }));
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
            // ? LA CANTIDAD DE DIGITOS EN EL CORRELATIVO ES DE 8
            const siguienteCorrelativo = String(ultimoCorrelativo + 1).padStart(8, '0');

            resultados.push({
                ruc: item.ruc,
                serie: item.serie,
                tipo: item.tipo, // Mantén el 'tipo' aquí si es necesario para tu respuesta
                siguienteCorrelativo: siguienteCorrelativo
            });
        }

        return resultados;
    }

    async correlativoPendientes(body) {
        const resultados = [];
        const rucsAndSeries = [];

        // Construir combinaciones de RUC + Serie (ignorar tipoDoc)
        for (const data of body) {
            if (data.credito) {
                for (const serie of data.credito) {
                    rucsAndSeries.push({ ruc: data.ruc, serie: serie.value });
                }
            }
            if (data.debito) {
                for (const serie of data.debito) {
                    rucsAndSeries.push({ ruc: data.ruc, serie: serie.value });
                }
            }
        }

        // Traer correlativos desde BD
        const notas = await NotasCreditoDebito.findAll({
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
        for (const n of notas) {
            const key = `${n.empresa_Ruc}-${n.serie}`;
            if (!agrupados.has(key)) agrupados.set(key, []);
            agrupados.get(key).push(Number(n.correlativo));
        }

        // Detectar pendientes
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

            // 👉 Solo devolver si hay pendientes
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

}

module.exports = SequelizeNotasCreditoDebitoRepository;
