const { Vehiculos } = require("../models/vehiculosModel");
const { Transportistas } = require("../models/transportistasModel");
const { Choferes } = require("../models/choferesModel");

class SequelizeVehiculosRepository {

    async listar() {
        try {
            const listaVehiculos = await Vehiculos.findAll({
                attributes: ['id', 'nro_placa', 'id_transportista', 'id_chofer'],
                include: [{
                    model: Transportistas,
                    attributes: ['nro_doc', ['razon_social', 'razon_Social'], 'nro_mtc']
                }, {
                    model: Choferes,
                    attributes: ['nombres', 'apellidos', 'nro_doc', 'tipo_doc', ['nro_licencia', 'licencia']]
                }],
            });
            return {
                success: true,
                message: `${listaVehiculos.length} vehiculos encontrados`,
                total: listaVehiculos.length,
                data: listaVehiculos
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            }
        }
    }

    async obtener(id) {
        const vehiculo = await Vehiculos.findByPk(id, {
            include: {
                model: Transportistas,
            },
        });
        if (!vehiculo) {
            return {
                success: false,
                message: "El vehiculo no existe",
                data: null
            }
        }
        return {
            success: true,
            message: "El vehiculo se obtuvo correctamente",
            data: vehiculo
        }
    }

    async eliminar(id) {
        try {
            const deleted = await Vehiculos.destroy({ where: { id } });
            if (!deleted) {
                return { success: false, message: "El vehículo no existe", data: null };
            }
            return { success: true, message: "El vehículo fue eliminado", data: null };
        } catch (error) {
            return { success: false, message: error.message, data: null };
        }
    }

};

module.exports = SequelizeVehiculosRepository;