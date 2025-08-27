module.exports = class GuardarCalculoQuinta {
  // El repo es la capa de acceso a la BD SequelizeQuintaCategoriaRepository
  constructor(repo) { this.repo = repo; }
  // CalculoDTO: objeto con todos los cálculos generados que salió de CalcularQuintaProyectada
  // segundo argumento opcional con:
  // esRecalculo: marca si este guardado corresponde a un reproceso
  // fuente: indica si es oficial (se guarda como calculo valido para retenciones) o
  //         informativo (solo consulta previa)
  async execute(calculoDTO, { esRecalculo = false, fuente = 'oficial', tramos_usados_json = {} } = {}) {
    // Modificamos el objeto para asegurarnos de que estos campos queden seteados
    // antes de guardar
    calculoDTO.es_recalculo = !!esRecalculo;
    calculoDTO.fuente = fuente;
    calculoDTO.tramos_usados_json = tramos_usados_json;
    console.log("DATOS LISTOS PARA GUARDAR EN BASE DE DATOS: ", calculoDTO)
    // Usamos el repo para crear el registro en la tabla quinta_calculos
    return await this.repo.create(calculoDTO);
  }
};