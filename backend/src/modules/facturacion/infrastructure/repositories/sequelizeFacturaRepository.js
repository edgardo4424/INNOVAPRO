const { Factura } = require("../models/facturaModel");
const { FacturaDetalle } = require("../models/facturaDetalleModel");
const { FormaPago } = require("../models/formaPagoModel");
const { Leyenda } = require("../models/leyendaModel");
const { SunatRespuesta } = require("../models/sunatRespuestaModel");
const db = require("../../../../models");
const { Op } = require("sequelize");

class SequelizeFacturaRepository {
    static toNumber(value) {
        return value != null ? parseFloat(value) : 0;
    }

    async obtenerFacturas(tipo = "TODAS", page = 1, limit = 10) {
        console.log("🚚 Atributos para obtener facturas desde el repository:", {
            tipo,
            page,
            limit,
        });

        // ? CONVERTIMOS A NÚMEROS los parámetros de paginación
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // ? Aplica paginación
        const offset = (pageNumber - 1) * limitNumber;

        // ? Aplica condicional
        let where = {};
        let include = [];

        if (tipo.toUpperCase() === "BORRADOR") {
            where = { estado: "BORRADOR" };
        } else if (tipo.toUpperCase() === "TODAS") {
            where = { estado: { [Op.not]: "BORRADOR" } };
            include.push({
                model: SunatRespuesta,
                attributes: [
                    "hash",
                    // "cdr_zip",
                    // "cdr_response_description",
                    "cdr_response_id",
                ],
            });
        } else {
            // ? APLICA FILTRO POR TIPO
            where = { estado: tipo, estado: { [Op.not]: "BORRADOR" } };

            // Forma correcta:
            where = {
                estado: tipo,
            };

            where = {
                [Op.and]: [{ estado: tipo }, { estado: { [Op.not]: "BORRADOR" } }],
            };

            include.push({
                model: SunatRespuesta,
                attributes: [
                    "hash",
                    // "cdr_zip",
                    // "cdr_response_description",
                    "cdr_response_id",
                ],
            });
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

    async buscarExistencia(serie, correlativo, estado = "BORRADOR") {
        const factura = await Factura.findOne({
            where: {
                serie: serie,
                correlativo: correlativo,
                estado: estado,
            },
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
}

module.exports = SequelizeFacturaRepository;
