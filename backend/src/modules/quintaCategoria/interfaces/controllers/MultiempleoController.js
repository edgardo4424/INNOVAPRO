const SequelizeDeclaracionMultiempleoRepository = require('../../infrastructure/repositories/SequelizeDeclaracionMultiempleoRepository');
const ObtenerDeclaracionMultiempleo = require('../../application/useCases/obtenerDeclaracionMultiempleo');
const RegistrarDeclaracionMultiempleo = require('../../application/useCases/registrarDeclaracionMultiempleo');

const repo = new SequelizeDeclaracionMultiempleoRepository();
const obtenerUC = new ObtenerDeclaracionMultiempleo({ repo });
const registrarUC = new RegistrarDeclaracionMultiempleo({ repo });

module.exports = {
    async obtenerDeclaracion(req, res) {
        try {
            const { dni, anio } = req.query;
            const dj = await obtenerUC.execute({ dni, anio: Number(anio) || 0 });
            if (!dj?.found) return res.status(200).json({ ok: true, data: { found: false } });
            return res.status(200).json({ ok: true, data: dj });
        } catch (e) {
            console.error('[Multiempleo] obtener error:', e);
            return res.status(500).json({ ok: false, message: e.message || 'Error' });
        }
    },

    async insertarDeclaracion(req, res) {
        try {
            const nuevo = await registrarUC.execute(req.body || {});
            return res.status(201).json({ ok: true, data: { id: nuevo.id } });
        } catch (e) {
            console.error('[Multiempleo] registrar error:', e);
            return res.status(500).json({ ok: false, message: e.message || 'Error' });
        }
    },
}