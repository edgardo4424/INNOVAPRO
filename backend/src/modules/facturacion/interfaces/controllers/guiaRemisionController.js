const crearGuia = require("../../application/useCases/guia-remision/crearGuia");
const obtenerCorrelativo = require("../../application/useCases/guia-remision/obtenerCorrelativo");
const SequelizeGuiaRemisionRepository = require("../../infrastructure/repositories/sequelizeGuiaRemisionRepository");

const guiaRemisionRepository = new SequelizeGuiaRemisionRepository();

const guiaRemisionController = {
    async crearGuiaRemision(req, res) {
        try {
            console.log("🚚 Atributos para crear Guia de Remision:", req.body);
            const { codigo, respuesta } = await crearGuia(req.body, guiaRemisionRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    async obtenerCorrelativo(_, res) {
        try {
            const { codigo, respuesta } = await obtenerCorrelativo(guiaRemisionRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

}

module.exports = guiaRemisionController;