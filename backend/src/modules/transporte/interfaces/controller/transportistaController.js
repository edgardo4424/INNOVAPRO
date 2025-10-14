const eliminarTransportista = require("../../application/useCases/transportistas/eliminarTransportista");
const guardarTransportista = require("../../application/useCases/transportistas/guardarTransportista");
const listarTransportista = require("../../application/useCases/transportistas/listarTransportista");

const SequelizeTransporteRepository = require("../../insfrastructure/repositories/sequelizaTransporteRepository");

const transportistaRepository = new SequelizeTransporteRepository();

const transporteController = {
    async guardar(req, res) {
        try {
            // * Controlador para crear un Transportista
            // * recibe los datos del Transportista por body y llamar al caso de uso
            // * "crearTransportista" y devolver su respuesta
            const { codigo, respuesta } = await guardarTransportista(req.body, transportistaRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },
    async listar(_, res) {
        try {
            // * Controlador para listar los Transportista
            // * usa el caso de uso "listarTransportista" y devuelve su respuesta
            const { codigo, respuesta } = await listarTransportista(transportistaRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },
    async eliminar(req, res) {
        try {
            // * Controlador para eliminar un Transportista
            // * recibe el id del Transportista y llamar al caso de uso
            // * "eliminarTransportista" y devolver su respuesta
            console.log("body", req.body)
            const { codigo, respuesta } = await eliminarTransportista(req.body, transportistaRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    }
};

module.exports = transporteController;