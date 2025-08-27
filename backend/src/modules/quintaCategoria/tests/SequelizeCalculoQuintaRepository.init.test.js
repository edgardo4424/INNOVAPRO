const { MockCalculoQuintaRepository } = require('./__mocks__/repositories');

describe('SequelizeCalculoQuintaCategoriaRepository (mock)', () => {
  const repo = new MockCalculoQuintaRepository();

  test('findById retorna null si no existe', async () => {
    const row = await repo.findById(999);
    expect(row).toBeNull();
  });

  test('create retorna objeto con id', async () => {
    const saved = await repo.create({ dni: '12345678', anio: 2025, mes: 8 });
    expect(saved.id).toBe(1);
    expect(saved.dni).toBe('12345678');
  });
});