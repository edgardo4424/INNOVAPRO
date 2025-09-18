// REPOSITORIOS (INFRAESTRUCTURA)
const SequelizeCertificadoQuintaRepository = require('../../infrastructure/repositories/SequelizeCertificadoQuintaRepository');
const SequelizeDeclaracionSinPreviosRepository = require('../../infrastructure/repositories/SequelizeDeclaracionSinPreviosRepository');
const SequelizeQuintaCategoriaRepository = require('../../infrastructure/repositories/SequelizeQuintaCategoriaRepository');
const SequelizeDeclaracionMultiempleoRepository = require('../../infrastructure/repositories/SequelizeDeclaracionMultiempleoRepository');
// CASOS DE USO
const ObtenerDeclaracionSinPrevios = require('../../application/useCases/obtenerDeclaracionSinPrevios');
const RegistrarDeclaracionSinPrevios = require('../../application/useCases/registrarDeclaracionSinPrevios');
const ObtenerCertificadoQuinta = require('../../application/useCases/obtenerCertificadoQuinta');
const RegistrarCertificadoQuinta = require('../../application/useCases/registrarCertificadoQuinta');

// INSTANCIAS DE LOS REPOSITORIOS
const certificadoRepo = new SequelizeCertificadoQuintaRepository();
const sinPrevRepo = new SequelizeDeclaracionSinPreviosRepository();
const quintaRepo = new SequelizeQuintaCategoriaRepository();
const multiEmpleoRepo = new SequelizeDeclaracionMultiempleoRepository();
// INSTANCIAS DE LOS CASOS DE USO
const obtenerSinPreviosUC = new ObtenerDeclaracionSinPrevios({ repo: sinPrevRepo });
const insertarSinPreviosUC = new RegistrarDeclaracionSinPrevios({ repo: sinPrevRepo });
const obtenerCertificadoQuinta = new ObtenerCertificadoQuinta({ repo: certificadoRepo });
const registrarCertificadoQuinta = new RegistrarCertificadoQuinta({ repo: certificadoRepo });

//HELPERS
const { num, absolutize, noCache } = require('../../shared/utils/helpers');

module.exports = {
  async obtenerCertificado(req, res) {
    try {
      const { dni, anio } = req.query;
      if (!dni || !anio) {
        return res.status(400).json({ ok: false, message: 'dni y anio son requeridos' });
      }
      const row = await obtenerCertificadoQuinta.execute({ dni: String(dni), anio: Number(anio) });
      if (!row || row.found === false) {
        return res.json({ ok: true, data: { found: false } });
      }
      if (row.archivo_url) row.archivo_url = absolutize(row.archivo_url, req);
      return res.json({ ok: true, data: row});
    } catch (error) {
      console.error('[Certificado] obtener error:', error);
      return res.status(500).json({ ok: false, message: error.message || 'Error' });
    }
  },

  async insertarCertificado(req, res) {
    try {
      const body = req.body || {};
      const dni  = String(body.dni || '').trim();
      const anio = Number.parseInt(body.anio, 10);
      if (!dni || Number.isNaN(anio)) {
        return res.status(400).json({ ok: false, message: 'dni y anio son requeridos' });
      }

      const aplica_desde_mes = 
        (body.aplica_desde_mes === '' || body.aplica_desde_mes == null) ? null : Number.parseInt(body.aplica_desde_mes, 10);

      if (aplica_desde_mes != null && (aplica_desde_mes < 1 || aplica_desde_mes > 12)) {
        return res.status(400).json({ ok: false, message: 'aplica_desde_mes debe estar entre 1 y 12' });
      }

      // Validación opcional de RUC (11 dígitos)
      const empresa_ruc = String(body.empresa_ruc || '').trim();
      if (empresa_ruc && !/^\d{11}$/.test(empresa_ruc)) {
        return res.status(400).json({ ok: false, message: 'empresa_ruc inválido (debe tener 11 dígitos numéricos)' });
      }

      // Componentes
      const remuneraciones       = num(body.remuneraciones);
      const gratificaciones      = num(body.gratificaciones);
      const asignacion_familiar  = num(body.asignacion_familiar);
      const otros                = num(body.otros);
      const retenciones_previas  = num(body.retenciones_previas);

      // Forzar coherencia: renta_bruta_total = suma de componentes
      const renta_bruta_total = Number((remuneraciones + gratificaciones + asignacion_familiar + otros).toFixed(2));

      const payload = {
        dni,
        anio,
        aplica_desde_mes,
        empresa_ruc,
        empresa_razon_social: String(body.empresa_razon_social || '').trim(),
        fecha_emision: body.fecha_emision || null,
        renta_bruta_total,
        remuneraciones,
        gratificaciones,
        asignacion_familiar,
        otros,
        retenciones_previas,
        archivo_url: body.archivo_url || null,
        es_oficial: true,
      };

      const saved = await registrarCertificadoQuinta.execute(payload);
      if (saved?.archivo_url) saved.archivo_url = absolutize(saved.archivo_url, req);
      return res.status(201).json({ ok: true, data: saved });

    } catch (error) {
      console.error('[Certificado] registrar error:', error);
      return res.status(500).json({ ok: false, message: error.message || 'Error' });
    }
  },

  async obtenerSinPrevios(req, res) {
    try {
      const dni = String(req.body?.dni ?? "").trim();
      const anio = Number.parseInt(req.query?.anio ?? "", 10);

      if (!dni || Number.isNaN(anio)) {
        noCache(res);
        return res.status(200).json({ ok: true, data: { found: false }});
      }
      // Consultamos por DNI+AÑO y si no hay registro found:false
      const fila = await obtenerSinPreviosUC.execute({ dni, anio });
      if (fila?.archivo_url) fila.archivo_url = absolutize(fila.archivo_url, req);
      noCache(res);
      return res.status(200).json({ ok: true, data: fila });
    } catch (error) {
      if (error?.status === 400) {
        noCache(res);
        return res.status(200).json({ ok: true, data: { found: false } });
      }
      console.error("[SIN PREVIOS] obtener error: ", error)
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
    } catch (error) { 
      console.error("[SinPrevios] registrar error:", error);
      return res.status(error.status||500).json({ ok:false, message:error.message }); 
    }
  },
};