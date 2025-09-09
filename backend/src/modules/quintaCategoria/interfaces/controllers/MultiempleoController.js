const SequelizeDeclaracionMultiempleoRepository = require('../../infrastructure/repositories/SequelizeDeclaracionMultiempleoRepository');
const ObtenerDeclaracionMultiempleo = require('../../application/useCases/obtenerDeclaracionMultiempleo');
const RegistrarDeclaracionMultiempleo = require('../../application/useCases/registrarDeclaracionMultiempleo');
const ObtenerCertificadoQuinta = require('../../application/useCases/obtenerCertificadoQuinta');
const ObtenerDeclaracionSinPrevios = require('../../application/useCases/obtenerDeclaracionSinPrevios');
const SequelizeCertificadoQuintaRepository = require('../../infrastructure/repositories/SequelizeCertificadoQuintaRepository');
const SequelizeDeclaracionSinPreviosRepository = require('../../infrastructure/repositories/SequelizeDeclaracionSinPreviosRepository');

const repo = new SequelizeDeclaracionMultiempleoRepository();
const obtenerUC = new ObtenerDeclaracionMultiempleo({ repo });
const registrarUC = new RegistrarDeclaracionMultiempleo({ repo });
const obtenerCertificadoUC = new ObtenerCertificadoQuinta({ repo: new SequelizeCertificadoQuintaRepository() });
const obtenerSinPreviosUC = new ObtenerDeclaracionSinPrevios({ repo: new SequelizeDeclaracionSinPreviosRepository() });

function absolutize(url, req) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const base = `${req.protocol}://${req.get('host')}`;
  return url.startsWith('/uploads') ? `${base}${url}` : url;
}

module.exports = {
    async obtenerDeclaracion(req, res) {
        try {
            const { dni, anio } = req.query;
            const dj = await obtenerUC.obtenerPorDniAnio({ dni, anio: Number(anio) || 0 });
            if (!dj) return res.status(200).json({ ok: true, data: { found: false } });
            const d = dj.toJSON();
            return res.status(200).json({
            ok: true,
            data: {
                found: true,
                id: d.id,
                aplica_desde_mes: Number(d.aplica_desde_mes || 0),
                es_secundaria: !!d.es_secundaria,
                principal_ruc: d.principal_ruc || null,
                principal_nombre: d.principal_nombre || null,
                observaciones: d.observaciones || null,
                archivo_url: d.archivo_url || null,
            }
            });
        } catch (e) {
            console.error('[Multiempleo] obtener error:', e);
            return res.status(500).json({ ok: false, message: e.message || 'Error' });
        }
    },

    async insertarDeclaracion(req, res) {
        try {
            const b = req.body || {};
            const nuevo = await obtenerUC.registrarOficial({
            dni: b.dni,
            anio: Number(b.anio),
            aplica_desde_mes: Number(b.aplica_desde_mes),
            es_secundaria: !!b.es_secundaria,
            principal_ruc: b.principal_ruc || null,
            principal_nombre: b.principal_nombre || null,
            observaciones: b.observaciones || null,
            archivo_url: b.archivo_url || null,
            es_oficial: true,
            });
            return res.status(201).json({ ok: true, data: { id: nuevo.id } });
        } catch (e) {
            console.error('[Multiempleo] registrar error:', e);
            return res.status(500).json({ ok: false, message: e.message || 'Error' });
        }
    },
}