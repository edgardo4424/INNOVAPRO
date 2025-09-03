const { Factura } = require("../models/factura-boleta/facturaModel");
const { DetalleFactura } = require("../models/factura-boleta/facturaDetalleModel");
const { FormaPagoFactura } = require("../models/factura-boleta/formaPagoModel");
const { LegendFactura } = require("../models/factura-boleta/legendFacturaModel");
const { SunatRespuesta } = require("../models/sunatRespuestaModel");
const { Filial } = require("../../../filiales/infrastructure/models/filialModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const { Op, fn, col } = require('sequelize');

class SequelizeFacturaRepository {
    static toNumber(value) {
        return value != null ? parseFloat(value) : 0;
    }

    async obtenerFacturas(query) {
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

            const where = {
                estado: {
                    [Op.not]: "ANULADA",
                },
            };

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


            const { count, rows } = await Factura.findAndCountAll({
                attributes: [
                    "id",
                    "tipo_operacion",
                    "tipo_doc",
                    "serie",
                    "correlativo",
                    "tipo_moneda",
                    "fecha_emision",
                    "empresa_ruc",
                    "cliente_num_doc",
                    "cliente_razon_social",
                    "monto_igv",
                    "total_impuestos",
                    "valor_venta",
                    "sub_total",
                    "monto_imp_venta",
                    "estado",
                ],
                where,
                offset,
                limit: limitNumber,
                order: [["correlativo", "DESC"]],
            });

            return {
                success: true,
                message: "Documentos listados correctamente.",
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

    async documentosPorRuc(body) {
        const { ruc, tipo_Doc } = body

        const facturas = await Factura.findAll({
            where: { empresa_ruc: ruc, tipo_Doc: tipo_Doc, estado: 'EMITIDA' },
            include: [
                {
                    model: DetalleFactura,
                    attributes: {
                        exclude: ["factura_id"],
                    },

                },
                { model: FormaPagoFactura },
                {
                    model: LegendFactura,
                    attributes: ["legend_Code", "legend_Value"]
                },
                // { model: SunatRespuesta },
            ],
            oder: [["correlativo", "ASC"]],
        })

        return facturas
    }

    async obtenerFactura(id) {
        const factura = await Factura.findByPk(id, {
            include: [
                { model: DetalleFactura },
                { model: FormaPagoFactura },
                { model: LegendFactura },
                { model: SunatRespuesta },
            ],
        });

        if (!factura) return null;

        // Extraer y mapear los datos anidados a objetos planos
        const plainFactura = factura.get({ plain: true });

        // Función para convertir a float si es string numérico
        const toFloat = (value) => {
            return typeof value === "string" && !isNaN(value)
                ? parseFloat(value)
                : value;
        };

        // Campos numéricos a convertir (de la cabecera)
        const camposNumericosFactura = [
            "monto_Oper_Gravadas",
            "monto_Oper_Exoneradas",
            "monto_Igv",
            "total_Impuestos",
            "valor_Venta",
            "sub_Total",
            "monto_Imp_Venta",
        ];

        // Transformar cabecera
        const facturaTransformada = {
            ...plainFactura,
            ...Object.fromEntries(
                camposNumericosFactura.map((campo) => [
                    campo,
                    toFloat(plainFactura[campo]),
                ])
            ),
            factura_detalles: plainFactura.factura_detalles?.map((item) => ({
                ...item,
                monto_Valor_Unitario: toFloat(item.monto_Valor_Unitario),
                monto_Base_Igv: toFloat(item.monto_Base_Igv),
                porcentaje_Igv: toFloat(item.porcentaje_Igv),
                igv: toFloat(item.igv),
                total_Impuestos: toFloat(item.total_Impuestos),
                monto_Precio_Unitario: toFloat(item.monto_Precio_Unitario),
                monto_Valor_Venta: toFloat(item.monto_Valor_Venta),
                factor_Icbper: toFloat(item.factor_Icbper),
            })),
            formas_pagos: plainFactura.formas_pagos?.map((item) => ({
                ...item,
                monto: toFloat(item.monto),
            })),
            leyendas: plainFactura.leyendas?.map((item) => ({ ...item })),
        };

        return facturaTransformada;
    }

    async obtenerFacturaPorInformacion(correlativo, serie, empresa_ruc, tipo_doc) {
        const facturas = await Factura.findAll({
            where: { correlativo, serie, tipo_doc, empresa_ruc },
            include: [
                { model: DetalleFactura },
                { model: FormaPagoFactura },
                { model: LegendFactura },
            ],
        });

        const empresa = await Filial.findOne({
            where: { ruc: empresa_ruc },
            attributes: ["ruc", "razon_social", "direccion"],
        });

        return facturas.map(f => ({
            ...f.dataValues,
            empresa_nombre: empresa?.razon_social,
            empresa_direccion: empresa?.direccion,
        }));

    }

    async buscarExistencia(serie, correlativo, estado) {
        console.log("🚚 Atributos para buscar existencia:", serie, correlativo, estado);
        const where = {
            serie: serie,
            correlativo: correlativo,
        };
        if (estado) {
            where.estado = estado;
        }
        const factura = await Factura.findOne({
            where
        });
        return factura;
    }

    async crear(data) {
        const transaction = await db.sequelize.transaction();
        let createdInvoice = {};

        try {
            //* 1. Crear la Factura principal
            const factura = await Factura.create(data.factura, { transaction });
            if (!factura) {
                throw new Error("No se pudo crear la factura principal.");
            }
            createdInvoice.factura = factura;
            // console.log("FACTURA CREADA", factura);

            //* 2. Crear los Detalles de la Factura
            const createdDetalles = [];
            for (const detalleData of data.detalle) {
                const detalle = await DetalleFactura.create(
                    {
                        factura_id: factura.id,
                        ...detalleData,
                    },
                    { transaction }
                );
                if (!detalle) {
                    throw new Error(
                        `No se pudo crear un detalle para el producto ${detalleData.cod_producto || "desconocido"
                        }.`
                    );
                }
                createdDetalles.push(detalle);
            }
            createdInvoice.detalles = createdDetalles;

            //* 3. Crear las Formas de Pago
            const createdFormasPago = [];
            for (const formaPagoData of data.formas_pagos) {
                const formaPago = await FormaPagoFactura.create(
                    {
                        factura_id: factura.id,
                        ...formaPagoData,
                    },
                    { transaction }
                );
                if (!formaPago) {
                    throw new Error("No se pudo crear una forma de pago.");
                }
                createdFormasPago.push(formaPago);
            }
            createdInvoice.formas_pago = createdFormasPago;

            //* 4. Crear las Leyendas
            const createdLeyendas = [];
            for (const leyendaData of data.leyendas) {
                const leyenda = await LegendFactura.create(
                    {
                        factura_id: factura.id,
                        ...leyendaData,
                    },
                    { transaction }
                );
                if (!leyenda) {
                    throw new Error("No se pudo crear una leyenda.");
                }
                createdLeyendas.push(leyenda);
            }
            createdInvoice.legendas = createdLeyendas;

            // *5. Crear Respuesta Sunat
            const sunat = await SunatRespuesta.create(
                {
                    factura_id: factura.id,
                    ...data.sunat_respuesta,
                },
                { transaction }
            );
            if (!sunat) {
                throw new Error("No se pudo crear la respuesta sunat.");
            }
            createdInvoice.sunat_respuesta = sunat;
            // console.log("FACTURA RESPUESTA SUNAT DESDE SEQUELIZE", sunat);
            //* Si todas las operaciones fueron exitosas, confirma la transacción.
            await transaction.commit();

            return {
                success: true,
                message: "Factura y sus componentes creados con éxito.",
                data: createdInvoice,
            };
        } catch (error) {
            //! Si ocurre algún error en cualquier punto, revierte la transacción.
            await transaction.rollback();
            console.error(
                "Error en SequelizeFacturaRepository.crear:",
                error.message,
                error.stack
            );
            return {
                success: false,
                message:
                    error.message || "Ocurrió un error inesperado al crear la factura.",
                data: null,
            };
        }
    }

    async correlativo(body) {
        const resultados = [];
        const rucsAndSeries = [];

        // Combinar las series de boleta y factura para cada RUC
        for (const data of body) {
            if (data.serieBoleta) {
                for (const serie of data.serieBoleta) {
                    rucsAndSeries.push({ ruc: data.ruc, serie: serie.value });
                }
            }
            if (data.serieFactura) {
                for (const serie of data.serieFactura) {
                    rucsAndSeries.push({ ruc: data.ruc, serie: serie.value });
                }
            }
        }

        // Usar una sola consulta para optimizar el rendimiento
        const correlativosPorSerie = await Factura.findAll({
            attributes: [
                'empresa_ruc',
                'serie',
                [db.sequelize.literal('MAX(CAST(correlativo AS UNSIGNED))'), 'ultimo_correlativo']
            ],
            where: {
                [Op.or]: rucsAndSeries.map(item => ({
                    empresa_ruc: item.ruc,
                    serie: item.serie
                }))
            },
            group: ['empresa_ruc', 'serie'],
            raw: true
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
                siguienteCorrelativo: siguienteCorrelativo
            });
        }

        return resultados;
    }

    async cdrzip(id_factura) {
        const cdr_zip = await SunatRespuesta.findOne({
            attributes: ['cdr_zip'],
            where: {
                factura_id: id_factura
            },
        });

        return cdr_zip;
    }
}

module.exports = SequelizeFacturaRepository;
