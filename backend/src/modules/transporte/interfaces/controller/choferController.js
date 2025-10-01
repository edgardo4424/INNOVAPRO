const guardarChofer = require("../../application/useCases/choferes/guardarChofer");
const eliminarChofer = require("../../application/useCases/choferes/eliminarChofer");
const listarChoferes = require("../../application/useCases/choferes/listarChoferes");
const SequelizeChoferesRepository = require("../../insfrastructure/repositories/sequelizeChoferesRepository");

const choferRepository = new SequelizeChoferesRepository();


const choferController = {
    async guardar(req, res) {
        try {
            // * Controlador para crear un chofer
            // * recibe los datos del chofer por body y llamar al caso de uso
            // * "crearChofer" y devolver su respuesta
            const { codigo, respuesta } = await guardarChofer(req.body, choferRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async listar(_, res) {
        try {
            // * Controlador para listar los chofer
            // * usa el caso de uso "listarChoferes" y devuelve su respuesta
            const { codigo, respuesta } = await listarChoferes(choferRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async eliminar(req, res) {
        try {
            // * Controlador para eliminar un chofer
            // * recibe el id del chofer y llamar al caso de uso
            // * "eliminarChofer" y devolver su respuesta
            console.log("body", req.body)
            const { codigo, respuesta } = await eliminarChofer(req.body, choferRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

}

module.exports = choferController