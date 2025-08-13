const { Borrador } = require("../models/borradorModel");
const db = require("../../../../models");
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

    async listarBorradores(
        page = 1,
        limit = 10,
        tipo_borrador,
        empresa_ruc,
        cliente_num_doc,
        cliente_razon_social,
        usuario_id,
        fec_des,
        fec_ast
    ) {
 
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const offset = (pageNumber - 1) * limitNumber;

        let where = {};
        let include = [];


        if (tipo_borrador) {
            where.tipo_borrador = tipo_borrador;
        }

        if (empresa_ruc) {
            where.empresa_ruc = { [Op.like]: `%${empresa_ruc}%` };
        }

        //? Filtro por número de documento del cliente, usando búsqueda parcial.
        if (cliente_num_doc) {
            where.cliente_num_doc = { [Op.like]: `%${cliente_num_doc}%` };
        }

        //? Filtro por razón social del cliente, usando búsqueda parcial.
        if (cliente_razon_social) {
            where.cliente_razon_social = { [Op.like]: `%${cliente_razon_social}%` };
        }

        //? Filtro por usuario asociado al borrador, utilizando la relación.
        if (usuario_id) {
            where.usuario_id = usuario_id;
        }

        //? Filtro por rango de fechas de emisión.
        if (fec_des && fec_ast) {
            where.fecha_Emision = {
                [Op.between]: [fec_des, fec_ast],
            };
        } else if (fec_des) {
            where.fecha_Emision = {
                [Op.gte]: fec_des,
            };
        } else if (fec_ast) {
            where.fecha_Emision = {
                [Op.lte]: fec_ast,
            };
        }

        //? Realiza la consulta a la base de datos con todos los filtros y paginación.
        try {
            const resultado = await Borrador.findAll({
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
                include,
                offset,
                limit: limitNumber,
            });
            //? Retorna el resultado de la consulta.
            return resultado;
        } catch (error) {
            return [];
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
        return {
            success: true,
            message: "El borrador ha sido obtenido con éxito.",
            data: result,
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
