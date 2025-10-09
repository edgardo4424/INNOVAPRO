const { Factura } = require("../models/factura-boleta/facturaModel");
const { DetalleFactura } = require("../models/factura-boleta/facturaDetalleModel");
const { FormaPagoFactura } = require("../models/factura-boleta/formaPagoModel");
const { LegendFactura } = require("../models/factura-boleta/legendFacturaModel");
const { SunatRespuesta } = require("../models/sunatRespuestaModel");
const { GuiaRemision } = require("../models/guia-remision/guiaRemisionModel");
const { NotasCreditoDebito } = require("../models/notas-credito-debito/notasCreditoDebitoModel");
const { Filial } = require("../../../filiales/infrastructure/models/filialModel");
const { Ubigeo } = require("../../../ubigeo/infrastructure/models/ubigeoModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const { Op, fn, col, literal, DataTypes } = require('sequelize');

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

            const where = {};

            if (nTipoDoc) {
                if (nTipoDoc == "99") {
                    where.estado = {
                        [Op.or]: [
                            "ANULADA-NOTA",
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
                order: [["id", "DESC"]],
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
            where: {
                empresa_ruc: ruc, tipo_Doc: tipo_Doc,
                estado: {
                    [Op.notIn]: ['ANULADA', 'ANULADA-NOTA']
                }
            },
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


        return facturas.map(f => ({
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
        }));

    }

    async buscarExistencia(serie, correlativo, estado) {

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

            return {
                success: false,
                message:
                    error.message || "Ocurrió un error inesperado al crear la factura.",
                data: null,
            };
        }
    }

    async verificarCorrelativoRegistrado(body) {

        const resultado = await Factura.findOne({
            attributes: ['serie', 'correlativo'],
            where: {
                empresa_ruc: body.empresa_ruc,
                serie: body.serie,
                correlativo: body.correlativo
            },
            order: [['correlativo', 'DESC']],
            limit: 1
        })

        return resultado
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

        // Armar las combinaciones de RUC y Serie
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

        // Traer todos los correlativos de esas series
        const facturas = await Factura.findAll({
            attributes: ["empresa_ruc", "serie", "correlativo"],
            where: {
                [Op.or]: rucsAndSeries.map(item => ({
                    empresa_ruc: item.ruc,
                    serie: item.serie
                }))
            },
            raw: true
        });

        // Agrupar por RUC-SERIE
        const agrupados = new Map();
        for (const f of facturas) {
            const key = `${f.empresa_ruc}-${f.serie}`;
            if (!agrupados.has(key)) agrupados.set(key, []);
            agrupados.get(key).push(Number(f.correlativo));
        }

        // Detectar correlativos pendientes
        for (const { ruc, serie } of rucsAndSeries) {
            const key = `${ruc}-${serie}`;
            const correlativos = (agrupados.get(key) || []).sort((a, b) => a - b);

            const pendientes = [];
            if (correlativos.length > 0) {
                const min = correlativos[0];
                const max = correlativos[correlativos.length - 1];

                // Usamos Set para eficiencia
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

    async cdrzip(id_factura) {
        const cdr_zip = await SunatRespuesta.findOne({
            attributes: ['cdr_zip'],
            where: {
                factura_id: id_factura
            },
        });

        return cdr_zip;
    }

    async anular(body) {
        const { empresa_ruc, correlativo, serie, tipo_Doc, anulacion_Motivo, sunat_respuesta } = body;

        //? Iniciar transacción
        const transaction = await db.sequelize.transaction();
        let documento = null; // Variable para almacenar el documento encontrado

        try {
            if (tipo_Doc !== "09") {
                //? Buscar la factura o boleta si el tipo de documento no es '09'
                documento = await Factura.findOne({
                    where: {
                        empresa_ruc: empresa_ruc,
                        correlativo: correlativo,
                        serie: serie,
                        tipo_Doc: tipo_Doc
                    },
                    transaction
                });

                if (!documento) {
                    throw new Error(`No se encontró la factura/boleta con serie ${serie} y correlativo ${correlativo}`);
                }

            } else if (tipo_Doc === "09") {
                //? Si el tipo de documento es '09', buscar la Guía de Remisión
                documento = await GuiaRemision.findOne({
                    where: {
                        empresa_ruc: empresa_ruc,
                        correlativo: correlativo,
                        serie: serie,
                        tipo_Doc: tipo_Doc
                    },
                    transaction
                });

                //? Validar si la Guía de Remisión existe
                if (!documento) {
                    throw new Error(`No se encontró la Guía de Remisión con serie ${serie} y correlativo ${correlativo}`);
                }

            } else if (tipo_Doc === "07" || tipo_Doc === "08") {
                //? Si el tipo de documento es '09', buscar la Guía de Remisión
                documento = await NotasCreditoDebito.findOne({
                    where: {
                        empresa_ruc: empresa_ruc,
                        correlativo: correlativo,
                        serie: serie,
                        tipo_Doc: tipo_Doc
                    },
                    transaction
                });

                const toUpdate = await Factura.findByPk(documento.factura_id);
                if (!toUpdate) {
                    throw new Error("No se encontró la factura para anular.");
                }
                // Se cambia el valor "ANULADO" a "A" para evitar el error de truncamiento de datos
                await toUpdate.update({ estado: "EMITIDA" }, { transaction });


                //? Validar si la Guía de Remisión existe
                if (!documento) {
                    throw new Error(`No se encontró la Nota de Remisión con serie ${serie} y correlativo ${correlativo}`);
                }

            }
            else {
                // Manejar otros tipos de documentos no soportados si es necesario
                throw new Error('Tipo de documento no soportado para anulación.');
            }

            //? Verificar si el documento ya está anulado
            if (documento.estado === 'ANULADA') {
                throw new Error(`El documento con serie ${serie} y correlativo ${correlativo} ya se encuentra anulado.`);
            }

            //? Actualizar el estado del documento a 'ANULADA'
            await documento.update(
                {
                    estado: 'ANULADA',
                    anulacion_Motivo: anulacion_Motivo
                },
                { transaction }
            );

            //? Crear la respuesta de SUNAT para la anulación
            let sunatRespuestaCreated = null;
            if (sunat_respuesta) {
                // Crear el objeto de datos para SunatRespuesta
                const sunatData = { ...sunat_respuesta };

                // Determinar la clave foránea correcta
                if (tipo_Doc === "09") {
                    sunatData.guia_id = documento.id;
                } else {
                    sunatData.factura_id = documento.id;
                }

                sunatRespuestaCreated = await SunatRespuesta.create(sunatData, { transaction });

                if (!sunatRespuestaCreated) {
                    throw new Error("No se pudo crear la respuesta de SUNAT para la anulación.");
                }
            }

            //? Si todo salió bien, confirmar la transacción
            await transaction.commit();

            const tipoDocumentoAnulado = (tipo_Doc === "09") ? "Guía de Remisión" : "Factura/Boleta";
            return {
                success: true,
                message: `${tipoDocumentoAnulado} anulada correctamente.`,
                data: {
                    documento: documento,
                    sunat_respuesta: sunatRespuestaCreated
                }
            };

        } catch (error) {
            //? Si ocurre algún error, revertir la transacción
            await transaction.rollback();

            return {
                success: false,
                message: error.message || "Ocurrió un error inesperado al anular el documento.",
                data: null
            };
        }
    }

    async reporte(query) {
        try {
            const {
                ac_factura = false,
                ac_boleta = false,
                ac_n_credito = false,
                ac_n_debito = false,
                ac_guia = false,
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
            const nEmpresaRuc = sane(empresa_ruc);
            const nAcFactura = sane(ac_factura);
            const nAcBoleta = sane(ac_boleta);
            const nAcNCredito = sane(ac_n_credito);
            const nAcNDebito = sane(ac_n_debito);
            const nAcGuia = sane(ac_guia);
            const nClienteNumDoc = sane(cliente_num_doc);
            const nClienteRazonSocial = sane(cliente_razon_social);
            const nUsuarioId = sane(usuario_id);
            const nFecDes = sane(fec_des);
            const nFecAst = sane(fec_ast);

            const whereFactura = {};
            const whereGuia = {};
            const whereNota = {};


            if (nEmpresaRuc) {
                whereFactura.empresa_ruc = { [Op.like]: `%${nEmpresaRuc}%` };
                whereGuia.empresa_ruc = { [Op.like]: `%${nEmpresaRuc}%` };
                whereNota.empresa_ruc = { [Op.like]: `%${nEmpresaRuc}%` };
            }
            if (nClienteNumDoc) {
                whereFactura.cliente_num_doc = { [Op.like]: `%${nClienteNumDoc}%` };
                whereGuia.cliente_num_doc = { [Op.like]: `%${nClienteNumDoc}%` };
                whereNota.cliente_num_doc = { [Op.like]: `%${nClienteNumDoc}%` };
            }
            if (nClienteRazonSocial) {
                whereFactura.cliente_razon_social = { [Op.like]: `%${nClienteRazonSocial}%` };
                whereGuia.cliente_razon_social = { [Op.like]: `%${nClienteRazonSocial}%` };
                whereNota.cliente_razon_social = { [Op.like]: `%${nClienteRazonSocial}%` };
            }
            if (nUsuarioId) {
                whereFactura.usuario_id = nUsuarioId;
                whereGuia.usuario_id = nUsuarioId;
                whereNota.usuario_id = nUsuarioId;
            }

            // ? Rango de fechas (asegúrate que el atributo del modelo sea exactamente 'fecha_Emision')
            if (nFecDes && nFecAst) {
                whereFactura.fecha_Emision = { [Op.between]: [nFecDes, nFecAst] };
                whereGuia.fecha_Emision = { [Op.between]: [nFecDes, nFecAst] };
                whereNota.fecha_Emision = { [Op.between]: [nFecDes, nFecAst] };
            } else if (nFecDes) {
                whereFactura.fecha_Emision = { [Op.gte]: nFecDes };
                whereGuia.fecha_Emision = { [Op.gte]: nFecDes };
                whereNota.fecha_Emision = { [Op.gte]: nFecDes };
            } else if (nFecAst) {
                whereFactura.fecha_Emision = { [Op.lte]: nFecAst };
                whereGuia.fecha_Emision = { [Op.lte]: nFecAst };
                whereNota.fecha_Emision = { [Op.lte]: nFecAst };
            }

            // ? filtro tipo de documento
            if (!nAcFactura & nAcBoleta) {
                whereFactura.tipo_doc = "03";
            } else if (nAcFactura & !nAcBoleta) {
                whereFactura.tipo_doc = "01";
            }

            if (!nAcNDebito & nAcNCredito) {
                whereNota.tipo_doc = "07";
            } else if (nAcNDebito & !nAcNCredito) {
                whereNota.tipo_doc = "08";
            }

            // ? COUNT ROWS
            let facturaResultado = { count: 0, rows: [] };
            let guiaResultado = { count: 0, rows: [] };
            let notaResultado = { count: 0, rows: [] };

            // ? filiales
            const { count, rows: filiales } = await Filial.findAndCountAll({})

            if (nAcFactura || nAcBoleta) {
                const { count, rows } = await Factura.findAndCountAll({
                    attributes: [
                        ["empresa_ruc", "filial"],
                        ["cliente_razon_social", "razon_social"],
                        ["cliente_num_doc", "ruc_cliente"],
                        [
                            literal(`CASE 
                            WHEN tipo_doc = '01' THEN 'Factura'
                            WHEN tipo_doc = '03' THEN 'Boleta'
                            ELSE tipo_doc
                        END`),
                            "tipo_doc"
                        ],
                        "fecha_emision",
                        [literal("CONCAT(serie, '-', correlativo)"), "comprobante_serie_correlativo"],
                        "fecha_vencimiento",
                        ["valor_venta", "base"],
                        ["monto_igv", "igv"],
                        ["monto_imp_venta", "total"],
                        ["detraccion_mount", "detraccion"],
                        ["descuento_monto", "retencion"],
                        [
                            literal(`CASE 
                            WHEN detraccion_mount IS NOT NULL OR descuento_monto IS NOT NULL 
                            THEN COALESCE(neto_Pagar, 0) 
                            ELSE NULL 
                            END`),
                            "neto"
                        ],
                        [
                            literal(`CASE 
                                    WHEN estado = 'ANULADA' THEN 'Dado de baja'
                                    WHEN estado = 'EMITIDA' THEN 'Validado'
                                    WHEN estado = 'RECHAZADA' THEN 'Error'
                                    WHEN estado = 'PENDIENTE' THEN 'Pendiente'
                                    ELSE 'Validado'
                                END`),
                            'estado'
                        ],
                        "tipo_moneda",
                        [
                            literal(`CASE WHEN tipo_moneda = 'USD' THEN precio_dolar ELSE NULL END`),
                            "precio_dolar"
                        ],
                        [
                            literal(`CASE WHEN tipo_moneda = 'USD' THEN monto_imp_venta * precio_dolar ELSE NULL END`),
                            "monto_en_soles"
                        ],
                        ["estado_documento", "codigo"],
                        [
                            literal(`(
                                        SELECT sr.cdr_response_description
                                        FROM sunat_respuesta AS sr
                                        WHERE sr.factura_id = factura.id
                                        ORDER BY sr.id DESC
                                        LIMIT 1
                                        )`),
                            "mensaje"
                        ],
                        [literal('NULL'), 'doc_de_referencia'],
                        [literal('NULL'), 'doc_de_referencia'],
                        [literal('NULL'), 'tipo_doc_de_referencia']
                    ],
                    include: [
                        {
                            model: SunatRespuesta,
                            attributes: [],
                            required: false
                        }
                    ],
                    where: whereFactura,
                    order: [["id", "DESC"]],
                });
                facturaResultado = { count, rows };
            }


            if (nAcGuia) {
                const { count, rows } = await GuiaRemision.findAndCountAll({
                    attributes: [
                        ["empresa_ruc", "filial"],
                        ["cliente_razon_social", "razon_social"],
                        ["cliente_num_doc", "ruc_cliente"],
                        [
                            literal(`CASE 
                            WHEN tipo_doc = '09' THEN 'Guía de Remisión'
                            ELSE tipo_doc
                        END`),
                            "tipo_doc"
                        ],
                        "serie",
                        [literal("CONCAT(serie, '-', correlativo)"), "comprobante_serie_correlativo"],
                        "fecha_emision",
                        [literal('NULL'), "base"],
                        [literal('NULL'), "igv"],
                        [literal('NULL'), "total"],
                        [literal('NULL'), "detraccion"],
                        [literal('NULL'), "retencion"],
                        [literal('NULL'), "neto"],
                        [literal('NULL'), 'fecha_vencimiento'],
                        [literal('NULL'), 'base'],
                        [
                            literal(`CASE 
                                    WHEN estado = 'ANULADA' THEN 'Dado de baja'
                                    WHEN estado = 'EMITIDA' THEN 'Validado'
                                    WHEN estado = 'RECHAZADA' THEN 'Error'
                                    WHEN estado = 'PENDIENTE' THEN 'Pendiente'
                                    ELSE 'Validado'
                                END`),
                            'estado'
                        ],
                        [literal('NULL'), 'tipo_moneda'],
                        [literal('NULL'), 'precio_dolar'],
                        [literal('NULL'), 'monto_en_soles'],
                        ["estado_documento", "codigo"],
                        [
                            literal(`(
                                        SELECT sr.cdr_response_description
                                        FROM sunat_respuesta AS sr
                                        WHERE sr.guia_id = guias_de_remision.id
                                        ORDER BY sr.id DESC
                                        LIMIT 1
                                    )`),
                            "mensaje"
                        ],
                        [literal('NULL'), 'doc_de_referencia'],
                        [literal('NULL'), 'fec_doc_de_referencia'],
                        [literal('NULL'), 'tipo_doc_de_referencia']
                    ],
                    include: [
                        {
                            model: SunatRespuesta,
                            attributes: [],
                            required: false
                        }
                    ],
                    where: whereGuia,
                    order: [["id", "DESC"]],
                });
                guiaResultado = { count, rows };
            }

            if (nAcNDebito || nAcNCredito) {
                const { count, rows } = await NotasCreditoDebito.findAndCountAll({
                    attributes: [
                        ["empresa_ruc", "filial"],
                        ["cliente_razon_social", "razon_social"],
                        ["cliente_num_doc", "ruc_cliente"],
                        [
                            literal(`CASE 
                            WHEN tipo_doc = '07' THEN 'Nota de Crédito'
                            WHEN tipo_doc = '08' THEN 'Nota de Débito'
                            ELSE tipo_doc
                        END`),
                            "tipo_doc"
                        ],
                        [literal("CONCAT(serie, '-', correlativo)"), "comprobante_serie_correlativo"],
                        "fecha_emision",
                        [literal('NULL'), 'fecha_vencimiento'],
                        ["valor_venta", "base"],
                        ["monto_igv", "igv"],
                        ["monto_imp_venta", "total"],
                        [literal('NULL'), "detraccion"],
                        [literal('NULL'), "retencion"],
                        [literal('NULL'), "neto"],
                        [
                            literal(`CASE 
                                    WHEN estado = 'ANULADA' THEN 'Dado de baja'
                                    WHEN estado = 'EMITIDA' THEN 'Validado'
                                    WHEN estado = 'RECHAZADA' THEN 'Error'
                                    WHEN estado = 'PENDIENTE' THEN 'Pendiente'
                                    ELSE 'Validado'
                                END`),
                            'estado'
                        ],
                        "tipo_moneda",
                        [
                            literal(`CASE WHEN tipo_moneda = 'USD' THEN precio_dolar ELSE NULL END`),
                            "precio_dolar"
                        ],
                        [
                            literal(`CASE WHEN tipo_moneda = 'USD' THEN monto_imp_venta * precio_dolar ELSE NULL END`),
                            "monto_en_soles"
                        ],
                        ["estado_documento", "codigo"],
                        [
                            literal(`(
                                    SELECT sr.cdr_response_description
                                    FROM sunat_respuesta AS sr
                                    WHERE sr.nota_id = notas_credito_debito.id
                                    ORDER BY sr.id DESC
                                    LIMIT 1
                                )`),
                            "mensaje"
                        ], ["fecha_Emision_Afectado", 'fec_doc_de_referencia'],
                        ["afectado_Num_Doc", 'doc_de_referencia'],
                        [
                            literal(`CASE 
                            WHEN afectado_tipo_doc = '01' THEN 'Factura'
                            WHEN afectado_tipo_doc = '03' THEN 'Boleta'
                            ELSE afectado_tipo_doc
                        END`),
                            "afectado_tipo_doc"
                        ],
                    ],
                    include: [
                        {
                            model: SunatRespuesta,
                            attributes: [],
                            required: false
                        }
                    ],
                    where: whereNota,
                    order: [["id", "DESC"]],
                });
                notaResultado = { count, rows };
            }

            // Unificamos resultados de documentos
            const documentos = [
                ...facturaResultado.rows,
                ...guiaResultado.rows,
                ...notaResultado.rows
            ];

            // Convertimos filiales en un mapa { ruc: razon_social }
            const filialMap = {};
            filiales.forEach(f => {
                filialMap[f.ruc] = f.razon_social;
            });

            // Armamos dataFinal con la transformación y ordenada por fecha_emision
            let dataFinal = documentos
                .map(item => {
                    const plain = item.get ? item.get({ plain: true }) : item;
                    return {
                        ...plain,
                        filial: filialMap[plain.filial] || plain.filial // reemplaza el RUC por la razón social
                    };
                })
                .sort((a, b) => new Date(b.fecha_emision) - new Date(a.fecha_emision));


            const totalRecords = facturaResultado.count + guiaResultado.count + notaResultado.count;

            return {
                success: true,
                message: "Documentos listados correctamente.",
                data: dataFinal,
                metadata: {
                    totalRecords,
                    total_facturas_boleta: facturaResultado.count,
                    total_guia: guiaResultado.count,
                    total_notas: notaResultado.count,
                    filtros: query
                }
            };

        } catch (error) {
            return {
                success: false,
                message: "Error al listar los documentos.",
                data: [],
                message: error.message,
                error: error
            };
        }
    }

    async documentosPendiente() {
        try {
            // 1. Obtener Filiales
            // El campo 'rows' se renombra a 'filiales'
            const { rows: filiales } = await Filial.findAndCountAll({
                attributes: ['ruc', 'razon_social'] // Solo necesitamos estos dos campos
            })

            // Convertimos filiales en un mapa { ruc: razon_social }
            const filialMap = {};
            filiales.forEach(f => {
                // Asumo que 'f.get({ plain: true })' o similar se usa si el objeto es un modelo Sequelize,
                // pero si 'filiales' ya es un array de objetos simples, se simplifica.
                // Usamos la notación directa para simplificar:
                filialMap[f.ruc] = f.razon_social;
            });

            // 2. Definir los atributos comunes a extraer (incluyendo la fecha de emisión para ordenar)
            const commonAttributes = [
                ["empresa_ruc", "filial"],
                ["empresa_ruc", "empresa_ruc"],
                ["tipo_doc", "tipo_Doc"],
                ["serie", "serie"],
                ["correlativo", "correlativo"],
                ["estado", "estado"],
                ["fecha_emision", "fecha_emision"] // Necesario para ordenar
            ];

            // 3. Obtener documentos pendientes (usando los atributos comunes)
            const baseOptions = {
                where: { estado: 'PENDIENTE' },
            };

            const facturasPendiente = await Factura.findAll({
                ...baseOptions,
                attributes: [
                    ...commonAttributes.map(([db, as]) => (db === 'empresa_ruc' ? ['empresa_ruc', as] : [db, as]))
                ]
            })

            const guiasPendiente = await GuiaRemision.findAll({
                ...baseOptions,
                attributes: [
                    ...commonAttributes.map(([db, as]) => (db === 'empresa_Ruc' ? ['empresa_Ruc', as] : [db, as])) // Ajuste de mayúsculas/minúsculas
                ]
            })

            const notasPendiente = await NotasCreditoDebito.findAll({
                ...baseOptions,
                attributes: [
                    ...commonAttributes.map(([db, as]) => (db === 'empresa_Ruc' ? ['empresa_Ruc', as] : [db, as])) // Ajuste de mayúsculas/minúsculas
                ]
            })

            // 4. Unificar y Transformar Resultados
            const documentos = [
                ...facturasPendiente,
                ...guiasPendiente,
                ...notasPendiente
            ];

            // Armamos dataFinal con la transformación y ordenada por fecha_emision
            let dataFinal = documentos
                .map(item => {
                    // Usa item.get({ plain: true }) para obtener un objeto JS plano de la instancia Sequelize
                    const plain = item.get({ plain: true });
                    // 'plain.filial' contendrá el RUC, lo reemplazamos por la razón social
                    return {
                        ...plain,
                        // Reemplaza el RUC por la razón social. Si no encuentra el RUC, mantiene el RUC original.
                        filial: filialMap[plain.filial] || plain.filial
                    };
                })
                .sort((a, b) => new Date(b.fecha_emision) - new Date(a.fecha_emision));


            return {
                success: true,
                message: "Documentos pendientes listados correctamente.",
                data: dataFinal
            };
        } catch (error) {
            console.error("Error en documentosPendiente:", error);
            return {
                success: false,
                message: "Error al listar los documentos pendientes.",
                data: [],
                error: error.message
            };
        }
    }

}

module.exports = SequelizeFacturaRepository;