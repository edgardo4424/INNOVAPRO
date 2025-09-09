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
            const { dni, anio } = req.query || {};
            const out = await obtenerUC.execute({ dni, anio: Number(anio) });
            if (out?.archivo_url) out.archivo_url = absolutize(out.archivo_url, req);
            return res.status(200).json({ ok: true, data: out });
        } catch (err) {
            return res.status(err.status || 500).json({ ok: false, message: err.message || "Error interno al obtener declaración de quinta categoría"})
        }
    },

    async insertarDeclaracion(req, res) {
        try {
            const { dni, anio } = req.body;
            // Validamos
            const certificado = await obtenerCertificadoUC.execute({ dni, anio: Number(anio) });
            if (certificado?.found) {
                return res.status(409).json({ ok: false, message:"No puede registrar Multiempleo porque ya exite un Certificado de Quinta."});
            }
            const sinPrevios = await obtenerSinPreviosUC.execute({ dni, anio: Number(anio) });
            if (sinPrevios?.found) {
                return res.status(409).json({ ok: false, message:"No puede registrar Multiempleo porque ya existe una Declaración Jurada 'Sin ingresos previos'."});
            }
            
            const guardado = await registrarUC.execute(req.body || {});
            const data = (guardado && typeof guardado.toJSON === 'function') ? guardado.toJSON() : guardado;
            if (data?.archivo_url) data.archivo_url = absolutize(data.archivo_url, req);
            return res.status(201).json({ ok: true, data });
        } catch(err) {
            console.error("Error insertarDeclaración Multiempleo: ", err);
            return res.status(err.status || 500).json({ ok: false, message: err.message || "Error interno al insertar declaración de quinta"})
        }
    },
}