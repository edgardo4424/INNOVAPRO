const listarVehiculos = require("../../application/useCases/vehiculos/listarVehiculos");

const SequealizeVehiculosRepository = require("../../insfrastructure/repositories/sequelizaVehiculosRepository");

const vehiculosRepository = new SequealizeVehiculosRepository();



const vehiculosController = {
    async listar(_, res) {
        try {
            // * Controlador para listar los vehiculos
            // * usa el caso de uso "listarVehiculos" y devuelve su respuesta
            const { codigo, respuesta } = await listarVehiculos(vehiculosRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    }
}

module.exports = vehiculosController;