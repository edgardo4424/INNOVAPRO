class CalculoQuintaRepository {
  async create(entity) { throw new Error('Método no implementado'); }
  async findById(id) { throw new Error('Método no implementado'); }
  async findByWorkerYear({ dni, trabajadorId, anio }) { throw new Error('Método no implementado'); }
  async list({ dni, trabajadorId, anio, page=1, limit=20 }) { throw new Error('Método no implementado'); }
}
module.exports = CalculoQuintaRepository;