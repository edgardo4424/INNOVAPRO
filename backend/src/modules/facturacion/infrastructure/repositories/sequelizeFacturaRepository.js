const { Factura } = require("../models/facturaModel");
const { FacturaDetalle } = require("../models/facturaDetalleModel");
const { FormaPago } = require("../models/formaPagoModel");
const { Leyenda } = require("../models/leyendaModel");
const { SunatRespuesta } = require("../models/sunatRespuestaModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const { Op } = require("sequelize");

class SequelizeFacturaRepository {
    static toNumber(value) {
        return value != null ? parseFloat(value) : 0;
    }

    async obtenerFacturas(tipo = "TODAS", page = 1, limit = 10, num_doc, tip_doc, fec_des, fec_ast) {
        console.log("🚚 Atributos para obtener facturas desde el repository:", {
            tipo,
            page,
            limit,
            num_doc,
            tip_doc,
            fec_des,
            fec_ast,
        });

        // ? CONVERTIMOS A NÚMEROS los parámetros de paginación
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // ? Aplica paginación
        const offset = (pageNumber - 1) * limitNumber;

        // ? Aplica condicional
        let where = {};
        let include = [];

        if (tipo.toUpperCase() === "TODAS") {
            include.push({
                model: SunatRespuesta,
                attributes: ["hash", "cdr_response_id"],
            });
        } else {
            where = {
                [Op.and]: [
                    { estado: tipo },
                ],
            };
            include.push({
                model: SunatRespuesta,
                attributes: ["hash", "cdr_response_id"],
            });
        }

        // ? Aplica filtros
        // 🔍 Filtros adicionales opcionales
        if (num_doc) {
            where.cliente_num_doc = { [Op.like]: `%${num_doc}%` };
        }

        if (tip_doc) {
            where.tipo_doc = tip_doc;
        }

        if (fec_des && fec_ast) {
            where.fecha_emision = {
                [Op.between]: [fec_des, fec_ast],
            };
        } else if (fec_des) {
            where.fecha_emision = {
                [Op.gte]: fec_des,
            };
        } else if (fec_ast) {
            where.fecha_emision = {
                [Op.lte]: fec_ast,
            };
        }
        const facturas = await Factura.findAll({
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
            include,
            offset,
            limit: limitNumber,
        });

        console.log("FACTURAS ENCONTRADAS CON FILTRO", facturas.length);

        return facturas.map((factura) => {
            const plain = factura.get({ plain: true });

            return {
                ...plain,
                monto_igv: parseFloat(plain.monto_igv),
                total_impuestos: parseFloat(plain.total_impuestos),
                valor_venta: parseFloat(plain.valor_venta),
                sub_total: parseFloat(plain.sub_total),
                monto_imp_venta: parseFloat(plain.monto_imp_venta),
            };
        });
    }

    async obtenerFactura(id) {
        const factura = await Factura.findByPk(id, {
            include: [
                { model: FacturaDetalle },
                { model: FormaPago },
                { model: Leyenda },
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
            console.log(
                "**************************DATA DE FACTURA ANTES DE LA TRANSACCION",
                data.factura
            );
            const factura = await Factura.create(data.factura, { transaction });
            if (!factura) {
                throw new Error("No se pudo crear la factura principal.");
            }
            createdInvoice.factura = factura;
            console.log("FACTURA CREADA", factura);

            //* 2. Crear los Detalles de la Factura
            const createdDetalles = [];
            for (const detalleData of data.detalle) {
                const detalle = await FacturaDetalle.create(
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
                const formaPago = await FormaPago.create(
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
                const leyenda = await Leyenda.create(
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
            if (factura.estado === 'EMITIDA') {

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
            }
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

    async correlativo() {
        const correlativoFactura = await Factura.max('correlativo', {
            where: {
                tipo_Doc: '01',
                estado: 'EMITIDA'
            }
        });
        const correlativoBoleta = await Factura.max('correlativo', {
            where: {
                tipo_Doc: '03',
                estado: 'EMITIDA'
            }
        });

        return {
            factura: correlativoFactura + 1,
            boleta: correlativoBoleta + 1
        }
    }

}

module.exports = SequelizeFacturaRepository;
