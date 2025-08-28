const SequelizeCalculoQuintaCategoriaRepository = require("../../infrastructure/repositories/SequelizeQuintaCategoriaRepository");
const CalcularQuintaProyectada = require('../../application/useCases/calcularQuintaProyectada');
const GuardarCalculoQuinta = require('../../application/useCases/guardarCalculoQuinta');
const RecalcularQuinta = require('../../application/useCases/recalcularQuinta');
const ObtenerIngresosPrevios = require('../../application/useCases/obtenerIngresosPrevios');
const ObtenerRetencionBaseMesPorDni = require('../../application/useCases/obtenerRetencionBaseMesPorDni');

const repo = new SequelizeCalculoQuintaCategoriaRepository();
const calcularUC = new CalcularQuintaProyectada();
const guardarUC = new GuardarCalculoQuinta(repo);
const recalcularUC = new RecalcularQuinta(repo);
const obtenerIngresosUC = new ObtenerIngresosPrevios();
const obtenerBaseMesUC = new ObtenerRetencionBaseMesPorDni({ repo });

const enriquecerConContratoOFalla = require('../../shared/utils/enriquecerConContratoOFalla'); // Si no llega remuneración, la tomamos del contrato vigente (y validamos quinta_categoria)
const { mapCalculoQuintaToResponse } = require('../../shared/mappers/mapCalculoQuintaToResponse'); // Para devolver ordenado al frontend
const buildQuintaInput = require('./_buildQuintaInput');

module.exports = {
  async previsualizar(req, res) {
    try {
      console.log(req.body)
      // Antes de calcular verificamos el contrato vigente
      const error = await enriquecerConContratoOFalla(req);
      // Si no aplica quinta categoría cortamos la ejecución con error
      if (error) return res.status(error.status).json({ ok: false, message: error.message });
    
      const { ingresosPrevios, retencionesPrevias, esProyeccion, fuentePrevios } = await buildQuintaInput({ body: req.body, obtenerIngresosUC });

      // Si aplica para quinta, pasamos al caso de uso todo el req.body 
      // mas el contratoId obtenido en enriquecerConContratoOFalla
      const dto = await calcularUC.execute({
        ...req.body, 
        contratoId: req.body.__contratoId,
        ingresosPrevios,
        retencionesPrevias,
        esProyeccion: ingresosPrevios.es_proyeccion,
        fuentePrevios: req.body.fuentePrevios
      });

      // Ordenamos antes de mandar al front
      const response = mapCalculoQuintaToResponse(dto);
      
      //Respondemos al frontend con el OK y la data
      return res.json({ ok: true, data: {...response, ingresos_previos: ingresosPrevios} });

    } catch (error) { 
      console.error("Error en previsualizar quinta categoría:", error);
      return res.status(error.status || 500).json({
        ok: false,
        message: error.message || "Error interno al calcular la retención de quinta categoría."
      });
    }
  },

  async crear(req, res) {
    try {
      console.log(req.body)
      // Antes de calcular verificamos el contrato vigente
      const error = await enriquecerConContratoOFalla(req);
      // Si no aplica quinta categoría cortamos la ejecución con error
      if (error) return res.status(error.status).json({ ok: false, message: error.message });

      const { ingresosPrevios, retencionesPrevias, esProyeccion, fuentePrevios } = await buildQuintaInput({ body: req.body, obtenerIngresosUC });

      // Si aplica para quinta, pasamos al caso de uso todo el req.body 
      // mas el contratoId obtenido en enriquecerConContratoOFalla
      const dto = await calcularUC.execute({
        ...req.body, 
        contratoId: req.body.__contratoId,
        ingresosPrevios,
        retencionesPrevias,
        esProyeccion: ingresosPrevios.es_proyeccion,
        fuentePrevios: req.body.fuentePrevios
      });


      // Validamos si aplica quinta 
      const aplicaQuinta = (dto.retencion_base_mes !== 0 || dto.retencion_adicional_mes !== 0);
      if (!aplicaQuinta) {
          const err = new Error("El trabajador no aplica retención de quinta categoría.");
          err.status = 400;
          throw err;
      }

      console.log("DATOS LISTOS PARA GUARDAR EN BASE DE DATOS: ", dto)
      // Guardamos el cálculo en la base de datos como oficial
      const saved = await guardarUC.execute(dto, { 
        esRecalculo: false, 
        fuente: 'oficial',
        tramos_usados_json: {
          impuestoTotal: dto.impuesto_anual,
          tramos_usados: dto.tramos_usados
        }
      });

      console.log(saved)

      return res.status(201).json({ ok: true, data: { ...saved.toJSON?.() ?? saved , ingresos_previos: ingresosPrevios } });

    } catch (error) { 
      console.error("Error en al crear registro de quinta categoría:", error);
      return res.status(error.status || 500).json({
        ok: false,
        message: error.message || "Error interno al calcular la retención de quinta categoría."
      });
    }
  },


  async recalcular(req, res) {
    try {
      console.log("REQUEST PARA RECALCULAR QUE VIENE DEL FRONT: ", req.body)
      let prev = await repo.findById(req.params.id);
      // Si no existe, respondemos el error
      if (!prev) return res.status(404).json({ ok: false, message: 'No encontrado' });
      
      // Si no llega nuevo sueldo, usamos contrato vigente del registro a recalcular
      if (!Number(req.body?.remuneracionMensualActual)) {
        // Buscamos el cálculo previo en la base de datos
        const contrato = await repo.getContratoVigente({
          trabajadorId: prev.trabajador_id,
          dni: prev.dni,
          anio: prev.anio,
          mes: prev.mes,
        });
        if (!contrato) return res.status(400).json({ ok: false, message: 'No existe contrato vigente para el registro a recálcular.'});
        // Si hay, verificamos si aplica para quinta categoría
        if (prev.retencion_base_mes === 0 && prev.retencion_adicional_mes === 0) {
          return res.status(400).json({ ok: false, message: "El trabajador no aplica retención de quinta categoría."})
        }
        req.body.remuneracionMensualActual = Number(contrato.sueldo);
      }

        // Fuente/certificado que vienen del body o por defecto
        const fuentePrevios = req.body.fuentePrevios || 'AUTO';
        const certificadoQuinta = req.body.certificadoQuinta || null;

        // Retenciones previas reales a la fecha del registro
        let retencionesPrevias = await obtenerIngresosUC._getRetencionesPrevias({
          trabajadorId: prev.trabajador_id,
          anio: prev.anio,
          mes: prev.mes,
        })
        if (fuentePrevios === "CERTIFICADO") {
          retencionesPrevias += Number(certificadoQuinta?.retenciones_previas || 0);
        }
        // Inyectamos en overrideInput para el recálculo
        req.body.retencionesPrevias = Number(retencionesPrevias || 0);
  

        // Ejecutamos el recálculo pasándole el id del cálculo a recalcular
        // los datos que vienen del req enriquecidos con el contrato vigente
        // el user.id del usuario que está haciendo el recálculo
        // Guardamos un nuevo registro en quinta_calculos marcado como es_recalculo=true
        const saved = await recalcularUC.execute({
          id: req.params.id,
          overrideInput: req.body,
          creadoPor: req.user?.id
        });

      return res.status(201).json({ ok: true, data: saved });

    } catch (error) {
      console.error("Error en el recálculo de quinta categoría:", error);

      return res.status(error.status || 500).json({
        ok: false,
        message: error.message || "Error interno al recalcular la retención de quinta categoría."
      });
    }
  },

  async getById(req, res) {
    try {
      // Buscamos en el repo un cálculo de quinta categoría por su id
      const row = await repo.findById(req.params.id);
      // Si no existe respondemos el error
      if (!row) return res.status(404).json({ ok: false, message: 'No encontrado' });
      // Si existe, lo enviamos
      return res.json({ ok: true, data: row });
    } catch (error) {
      console.error("Error buscando el cálculo de quinta categoría:", error);

      return res.status(500).json({
        ok: false,
        message: "Error interno al buscar el cálculo de quinta categoría."
      });
    }
  },

  async list(req, res) {
    try {
      // Extraemos los parámetros de la solicitud
      const { dni, anio, page, limit } = req.query;

      // Llamamos al repositorio para obtener el listado
      const response = await repo.list({ 
        dni, // Para filtrar por trabajador
        anio: anio ? Number(anio) : undefined, // Para filtrar por año
        page: Number(page) || 1, // Por defecto pagina 1
        limit: Number(limit) || 20 // Por defecto 20 filas por pagina
      });

      // Devolvemos la respuesta json con datos paginados
      return res.json({ ok: true, ...response });

    } catch (error) {
      console.error("Error listando los cálculos de quinta categoría:", error);

      return res.status(500).json({
        ok: false,
        message: "Error interno listando los cálculos de quinta categoría."
      });
    }
  },

  async getRetencionBaseMesPorDni(req, res) {
    try {
      const { dni, anio, mes } = req.query || {};
      const out = await obtenerBaseMesUC.execute({ dni, anio: Number(anio), mes: Number(mes) });
      return res.status(200).json({ ok: true, ...out });
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({ ok: false, message: err.message || "Error interno al consultar retención base del trabajador"})
    }
  },
};