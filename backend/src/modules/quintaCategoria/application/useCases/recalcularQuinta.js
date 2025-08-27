const { empresas_proveedoras } = require('../../../../database/models');
const CalcularQuintaProyectada = require('./calcularQuintaProyectada');
const ObtenerIngresosPrevios = require('./obtenerIngresosPrevios');

module.exports = class RecalcularQuinta {
  constructor(repo) {
    this.repo = repo;
    this.calcular = new CalcularQuintaProyectada();
    this.obtenerPrevios = new ObtenerIngresosPrevios();
  }

  /**
   * @param {Object} p
   * @param {number} p.id
   * @param {Object} [p.overrideInput]
   * @param {number} [p.creadoPor]
   */
  async execute({ id, overrideInput, creadoPor }) {
    // Buscamos el cálculo anterior en la base de datos
    const prev = await this.repo.findById(id);
    // En caso no exista, devolvemos el error
    if (!prev) {
        const err = new Error("Cálculo no encontrado");
        err.status = 404;
        throw err;
    }

    // Remuneración vigente (override > previo)
    const remuneracionMensualActual = Number(
      overrideInput.remuneracionMensualActual ?? prev.remuneracion_mensual
    );

    // Fuente de previos y certificado (si llega)
    const fuentePrevios = overrideInput.fuentePrevios || 'AUTO';
    const certificadoQuinta = overrideInput.certificadoQuinta || null;

    // Reconstruimos ingresos previos para el mismo mes/año
    const ingresosPrevios = await this.obtenerPrevios.execute({
      trabajadorId: prev.trabajador_id,
      anio: prev.anio,
      mes: prev.mes,
      remuneracionMensualActual,
      fuentePrevios,
      certificadoQuinta
    })

    // Retenciones previas (override > cálculo actual en BD)
    let retencionesPrevias = Number(overrideInput.retencionesPrevias);
    if (!Number.isFinite(retencionesPrevias)) {
      retencionesPrevias = await this.obtenerPrevios._getRetencionesPrevias({
        trabajadorId: prev.trabajador_id,
        anio: prev.anio,
        mes: prev.mes,
      });
    }

    // Ejecutamos el cálculo con el INPUT esperado por el UC de cálculo
    const dto = await this.calcular.execute({
      anio: prev.anio,
      mes: prev.mes,
      dni: prev.dni,
      trabajadorId: prev.trabajador_id,

      remuneracionMensualActual,
      ingresosPrevios,

      otrosIngresosProyectados: Number(overrideInput.otrosIngresosProyectados ?? prev.otros_ingresos_proj ?? 0),
      retencionesPrevias: Number(retencionesPrevias || 0),
      deduccionAdicionalAnual: Number(overrideInput.deduccionAdicionalAnual ?? prev.deduccion_adicional_anual ?? 0),

      extraGravadoMes: Number(overrideInput.extraGravadoMes ?? prev.extra_gravado_mes ?? 0),
      agregadoTodasFiliales: overrideInput.agregadoTodasFiliales ?? prev.agregado_todas_filiales,

      creadoPor: creadoPor || prev.creado_por,
      esProyeccion: ingresosPrevios.es_proyeccion,
      fuentePrevios,
      
    })

    // Marcamos que es recalculo
    dto.es_recalculo = true;
    dto.fuente = 'oficial';
    dto.tramos_usados_json = {
        impuestoTotal: prev.impuesto_anual,
        tramos_usados: prev.tramos_usados
    }
    // Guardamos el nuevo registro
    return await this.repo.create(dto);
  }
};