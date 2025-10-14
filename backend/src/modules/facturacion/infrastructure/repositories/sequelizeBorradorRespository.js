const { Borrador } = require("../models/borrador/borradorModel");
const { Filial } = require("../../../filiales/infrastructure/models/filialModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const { Op } = require("sequelize");

class SequelizeBorradorRepository {

    async crearBorrador(data) {
        const createdBorrador = await Borrador.create(data);
        if (!createdBorrador) {
            return {
                success: false,
                message: "El borrador no se creo correctamente.",
                data: null,
            }
        }
        return {
            success: true,
            message: "El borrador se creo correctamente.",
            data: createdBorrador
        };
    }


    async listarBorradores(query) {
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

            const { count, rows } = await Borrador.findAndCountAll({
                attributes: [
                    "id",
                    "tipo_borrador",
                    "serie",
                    "correlativo",
                    "empresa_ruc",
                    "cliente_num_doc",
                    "cliente_razon_social",
                    "fecha_Emision",
                ],
                where,
                offset,
                limit: limitNumber,
            });

            return {
                success: true,
                message: "Borradores listados correctamente.",
                data: rows,
                metadata: {
                    totalRecords: count,
                    currentPage: pageNumber,
                    totalPages: limitNumber ? Math.ceil(count / limitNumber) : 1,
                },
            };
        } catch (error) {
            console.error("Error al listar borradores:", error);
            return {
                success: false,
                message: "Error al listar los borradores.",
                data: null,
                error: error.message,
            };
        }
    }



    async obtenerBorradorPorId(id) {
        const result = await Borrador.findOne({
            where: {
                id,
            },
        });

        if (!result) {
            return {
                success: false,
                message: "El borrador no existe.",
                data: null,
            };
        }

        const empresa = await Filial.findOne({
            where: { ruc: result.empresa_ruc },
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



        const borradorMapeado = {
            ...result.dataValues,
            empresa_ruc: empresa?.ruc,
            empresa_razon_social: empresa?.razon_social,
            empresa_direccion: empresa?.direccion,
            empresa_telefono_oficina: empresa?.telefono_oficina,
            empresa_correo: empresa?.correo,
            empresa_cuenta_banco: empresa?.cuenta_banco,
            empresa_link_website: empresa?.link_website,
            empresa_codigo_ubigeo: empresa?.codigo_ubigeo,
        };

        return {
            success: true,
            message: "El borrador ha sido obtenido con éxito.",
            data: borradorMapeado,
        };
    }
    async eliminar(id) {
        const result = await Borrador.findOne({
            where: {
                id,
            },
        });
        if (!result) {
            return {
                success: false,
                message: "El Borradorr a borrar no existe.",
                data: null,
            };
        }
        await result.destroy();
        return {
            success: true,
            message: "El borrador ha sido eliminado con éxito.",
            data: null,
        };
    }
}

module.exports = SequelizeBorradorRepository;
