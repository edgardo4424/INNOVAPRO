const SequelizeCertificadoQuintaRepository = require('../../infrastructure/repositories/SequelizeCertificadoQuintaRepository');
const SequelizeDeclaracionSinPreviosRepository = require('../../infrastructure/repositories/SequelizeDeclaracionSinPreviosRepository');
const SequelizeQuintaCategoriaRepository = require('../../infrastructure/repositories/SequelizeQuintaCategoriaRepository');
const SequelizeDeclaracionMultiempleoRepository = require('../../infrastructure/repositories/SequelizeDeclaracionMultiempleoRepository');

const ObtenerCertificadoQuinta = require('../../application/useCases/obtenerCertificadoQuinta');
const RegistrarCertificadoQuinta = require('../../application/useCases/registrarCertificadoQuinta');
const ObtenerDeclaracionSinPrevios = require('../../application/useCases/obtenerDeclaracionSinPrevios');
const RegistrarDeclaracionSinPrevios = require('../../application/useCases/registrarDeclaracionSinPrevios');

const certificadoRepo = new SequelizeCertificadoQuintaRepository();
const sinPrevRepo = new SequelizeDeclaracionSinPreviosRepository();
const quintaRepo = new SequelizeQuintaCategoriaRepository();
const multiEmpleoRepo = new SequelizeDeclaracionMultiempleoRepository();

const obtenerCertificadoUC = new ObtenerCertificadoQuinta({ repo: certificadoRepo });
const insertarCertificadoUC = new RegistrarCertificadoQuinta({ repo: certificadoRepo });
const obtenerSinPreviosUC = new ObtenerDeclaracionSinPrevios({ repo: sinPrevRepo });
const insertarSinPreviosUC = new RegistrarDeclaracionSinPrevios({ repo: sinPrevRepo });

function absolutize(url, req) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const base = `${req.protocol}://${req.get('host')}`;
  return url.startsWith('/uploads') ? `${base}${url}` : url;
}

module.exports = {
  async obtenerCertificado(req, res) {
    try {
      const { dni, anio } = req.query;
      const certificado = await certificadoRepo.obtenerPorDniAnio({ dni, anio: Number(anio) || 0 });
      if (!certificado) return res.status(200).json({ ok: true, data: { found: false } });
      const data = certificado.toJSON();
      return res.status(200).json({
        ok: true,
        data: {
          found: true,
          id: data.id, empresa_ruc: data.empresa_ruc, empresa_razon_social: data.empresa_razon_social,
          renta_bruta_total: Number(data.renta_bruta_total || 0),
          remuneraciones: Number(data.remuneraciones || 0),
          gratificaciones: Number(data.gratificaciones || 0),
          otros: Number(data.otros || 0),
          asignacion_familiar: Number(data.asignacion_familiar || 0),
          retenciones_previas: Number(data.retenciones_previas || 0),
          fecha_emision: data.fecha_emision || null,
          archivo_url: data.archivo_url || null
        }
      });
    } catch (e) {
      console.error('[Certificado] obtener error:', e);
      return res.status(500).json({ ok: false, message: e.message || 'Error' });
    }
  },

  async insertarCertificado(req, res) {
    try {
      const body = req.body || {};
      const nuevo = await certificadoRepo.registrarOficial({
        dni: body.dni, anio: Number(body.anio),
        empresa_ruc: body.empresa_ruc || null,
        empresa_razon_social: body.empresa_razon_social || null,
        renta_bruta_total: Number(body.renta_bruta_total || 0),
        remuneraciones: Number(body.remuneraciones || 0),
        gratificaciones: Number(body.gratificaciones || 0),
        otros: Number(body.otros || 0),
        asignacion_familiar: Number(body.asignacion_familiar || 0),
        retenciones_previas: Number(body.retenciones_previas || 0),
        fecha_emision: body.fecha_emision || null,
        archivo_url: body.archivo_url || null,
        es_oficial: true,
      });
      return res.status(201).json({ ok: true, data: { id: nuevo.id } });
    } catch (e) {
      console.error('[Certificado] registrar error:', e);
      return res.status(500).json({ ok: false, message: e.message || 'Error' });
    }
  },

  async obtenerSinPrevios(req, res) {
    
    try {
      const dni = String(req.body?.dni ?? "").trim();
      const anioStr = String(req.body?.anio ?? "").trim();
      const anio = Number.parseInt(anioStr, 10);
      if (!dni || Number.isNaN(anio)) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache'); res.set('Expires','0');
        return res.status(200).json({ ok: true, data: { found: false }});
      }
      // Consultamos por DNI+AÑO y si no hay registro found:false
      const fila = await obtenerSinPreviosUC.execute({ dni, anio });
      if (!fila.archivo_url) fila.archivo_url = absolutize(fila.archivo_url, req);
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache'); res.set('Expires','0');
      return res.status(200).json({ ok: true, data: fila });
    } catch (error) {
      if (error?.status === 400) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache'); res.set('Expires','0');
        return res.status(200).json({ ok: true, data: { found: false } });
      }
      return res.status(error.status || 500).json({ ok:true, message: error.message });
    }
  },

  async insertarSinPrevios(req, res) {
    const { dni, anio, aplica_desde_mes } = req.body;
    if (!aplica_desde_mes || aplica_desde_mes < 1 || aplica_desde_mes > 12 ) {
        return res.status(400).json({ ok: false, message:'aplica_desde_mes (1..12) es obligatorio'})
    }
    const ultimoCerrado = Number(await quintaRepo.ultimoMesCerradoPorDniAnio({ dni, anio: Number(anio) })) || 0;
    if (Number(aplica_desde_mes) <= ultimoCerrado) {
        return res.status(409).json({ ok: false, message:`No se puede registrar/editar 'Sin Previos' con aplica_desde_mes <= mes cerrado (${ultimoCerrado}).`})
    }
    const multi = await multiEmpleoRepo.obtenerPorDniAnio({ dni, anio });
    if (multi?.found) {
        return res.status(409).json({ ok: false, message:"No puede registrar 'Sin Previos' porque ya existe Multiempleo en este año."});
    }
    try {
      const guardado = await insertarSinPreviosUC.execute(req.body || {});
      const data = guardado?.toJSON?.() ?? guardado;
      if (data?.archivo_url) data.archivo_url = absolutize(data.archivo_url, req);
      return res.status(201).json({ ok: true, data});
    } catch (error) { return res.status(error.status||500).json({ ok:false, message:error.message }); }
  },
};