const crearGuia = require("../../application/useCases/guia-remision/crearGuia");
const SequelizeGuiaRemisionRepository = require("../../infrastructure/repositories/sequelizeGuiaRemisionRepository");

const guiaRemisionRepository = new SequelizeGuiaRemisionRepository();

const guiaRemisionController = {
    async crearGuiaRemision(req, res) {
        try {
            console.log("🚚 Atributos para crear Guia de Remision:", req.body);
            const { codigo, respuesta } = await crearGuia(req.body, guiaRemisionRepository);
            res.status(codigo).json(respuesta);
            res.status(200).json({
                success: true,
                message: "La guia de remision se creo correctamente.",
                data: null,
                status: 200
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

}

module.exports = guiaRemisionController;