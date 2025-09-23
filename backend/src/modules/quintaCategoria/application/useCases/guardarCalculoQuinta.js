module.exports = class GuardarCalculoQuinta {
  constructor(repo) { this.repo = repo; }
  async execute(calculoDTO, { esRecalculo = false, fuente = 'oficial', tramos_usados_json = {} } = {}) {
    calculoDTO.es_recalculo = !!esRecalculo;
    calculoDTO.fuente = fuente;
    calculoDTO.tramos_usados_json = tramos_usados_json;
    return await this.repo.create(calculoDTO);
  }
};