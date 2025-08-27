const SequelizeCalculoQuintaCategoriaRepository = require("../../infrastructure/repositories/SequelizeQuintaCategoriaRepository");
const CalcularQuintaProyectada = require('../../application/useCases/calcularQuintaProyectada');
const GuardarCalculoQuinta = require('../../application/useCases/guardarCalculoQuinta');
const RecalcularQuinta = require('../../application/useCases/recalcularQuinta');
const ObtenerIngresosPrevios = require('../../application/useCases/obtenerIngresosPrevios');

const repo = new SequelizeCalculoQuintaCategoriaRepository();
const calcularUC = new CalcularQuintaProyectada();
const guardarUC = new GuardarCalculoQuinta(repo);
const recalcularUC = new RecalcularQuinta(repo);
const obtenerIngresosUC = new ObtenerIngresosPrevios();

const enriquecerConContratoOFalla = require('../../shared/utils/enriquecerConContratoOFalla'); // Si no llega remuneración, la tomamos del contrato vigente (y validamos quinta_categoria)
const { mapCalculoQuintaToResponse } = require('../../shared/mappers/mapCalculoQuintaToResponse'); // Para devolver ordenado al frontend

module.exports = {
  async previsualizar(req, res) {
    try {
      console.log(req.body)
      // Antes de calcular verificamos el contrato vigente
      const error = await enriquecerConContratoOFalla(req);
      // Si no aplica quinta categoría cortamos la ejecución con error
      if (error) return res.status(error.status).json({ ok: false, message: error.message });
    
      let ingresosPrevios;
      console.log("Ingresos previos acumulados del frontend:", typeof req.body.ingresosPreviosAcumulados)

     ingresosPrevios = await obtenerIngresosUC.execute({
      trabajadorId: req.body.trabajadorId,
      anio: req.body.anio,
      mes: req.body.mes,
      remuneracionMensualActual: req.body.remuneracionMensualActual,
      fuentePrevios: req.body.fuentePrevios,
      certificadoQuinta: req.body.certificadoQuinta || null
    })
      
      const retencionesPreviasDB = await obtenerIngresosUC._getRetencionesPrevias({
        trabajadorId: req.body.trabajadorId,
        anio: req.body.anio,
        mes: req.body.mes,
      });

      const retencionesPrevias = Number(retencionesPreviasDB || 0) +
        (req.body?.fuentePrevios === 'CERTIFICADO' ? Number(req.body?.certificadoQuinta?.retenciones_previas || 0) : 0);

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
      /* const aplicaQuinta = (dto.retencion_base_mes !== 0 || dto.retencion_adicional_mes !== 0);
      if (!aplicaQuinta) {
          const err = new Error("El trabajador no aplica retención de quinta categoría.");
          err.status = 400;
          throw err;
      } */

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

      let ingresosPrevios = await obtenerIngresosUC.execute({
        trabajadorId: req.body.trabajadorId,
        anio: req.body.anio,
        mes: req.body.mes,
        remuneracionMensualActual: req.body.remuneracionMensualActual,
        fuentePrevios: req.body.fuentePrevios,
        certificadoQuinta: req.body.certificadoQuinta || null
      })
      
      const retencionesPreviasDB = await obtenerIngresosUC._getRetencionesPrevias({
        trabajadorId: req.body.trabajadorId,
        anio: req.body.anio,
        mes: req.body.mes,
      });

      const retencionesPrevias = Number(retencionesPreviasDB || 0) +
        (req.body?.fuentePrevios === 'CERTIFICADO' ? Number(req.body?.certificadoQuinta?.retenciones_previas || 0) : 0);

      console.log(
        "DATOS MANDADOS A CALCULAR: ", req.body, "Adicionalmente el contrato: ", req.body.__contratoId,
        "Los ingresos previos acumulados: ", ingresosPrevios.total_ingresos, "Y las retenciones previas: ", retencionesPrevias
      )

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
      // Si no llega nuevo sueldo, usamos contrato vigente del registro a recalcular
      if (!Number(req.body?.remuneracionMensualActual)) {
        // Buscamos el cálculo previo en la base de datos
        const prev = await repo.findById(req.params.id);
        // Si no existe, respondemos el error
        if (!prev) return res.status(404).json({ ok: false, message: 'No encontrado' });
        // Si existe, con la info buscamos el contrato vigente
        // del trabajador al mes/año del registro
        const contrato = await repo.getContratoVigente({
          trabajadorId: prev.trabajador_id,
          dni: prev.dni,
          anio: prev.anio,
          mes: prev.mes
        });
        // Si no hay contrato vigente devolvemos el error
        if (!contrato) return res.status(400).json({ ok: false, message: 'No existe contrato vigente para el registro a recálculo.' });
        // Si hay, verificamos si aplica para quinta categoría
        const aplicaQuinta = (prev.retencion_base_mes !== 0 || prev.retencion_adicional_mes !== 0);
        // Y si no aplica devolvemos el error
        if (!aplicaQuinta) {
          const err = new Error("El trabajador no aplica retención de quinta categoría.");
          err.status = 400;
          throw err;
        }
        // Pero si aplica, insertamos el sueldo vigente en la remuneración mensual actual del body
        req.body = { ...req.body, remuneracionMensualActual: Number(contrato.sueldo) };
      }

      const prev = await repo.findById(req.params.id);
      if (!prev) return res.status(404).json({ ok: false, message: "No encontrado"});

      // Calculamos las retenciones previas reales a la fecha del registro
      const retPreviasDB = await obtenerIngresosUC._getRetencionesPrevias({
        trabajadorId: prev.trabajador_id,
        anio: prev.anio,
        mes: prev.mes,
      });

      // Mezclamos en el body (si el front no manda otra cosa)
      req.body = { ...req.body, retencionesPrevias: Number(retPreviasDB || 0)};

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

      return res.status(500).json({
        ok: false,
        message: "Error interno al recalcular quinta categoría."
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
};