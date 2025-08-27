// Mock del repo de Calculo Quinta
class MockCalculoQuintaRepository {
  async create(entity) {
    return { id: 1, ...entity }; // simula un insert
  }
  async findById(id) {
    if (id === 999) return null; // simula no encontrado
    return { id, dni: '12345678', anio: 2025, mes: 8, retencion_base_mes: 300 };
  }
  async findByWorkerYear({ dni, anio }) {
    return [{ id: 1, dni, anio, mes: 1 }, { id: 2, dni, anio, mes: 2 }];
  }
  async list({ dni, anio, page, limit }) {
    return {
      rows: [{ id: 1, dni, anio, mes: 5 }],
      count: 1,
      page,
      limit
    };
  }
  async getContratoVigente() {
    return {
      trabajador_id: 1,
      sueldo: 2500,
      quinta_categoria: 1,
      numero_documento: '12345678'
    };
  }
}

// Mock de Parametros Tributarios (UIT, deducción fija)
class MockParametrosTributariosRepository {
  async getParametrosTributarios() {
    return { uit: 4950, deduccionFijaUit: 7, from: 'mock' };
  }
}

module.exports = {
  MockCalculoQuintaRepository,
  MockParametrosTributariosRepository
};