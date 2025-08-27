// Mock explícito de sequelize con query como jest.fn()
jest.mock('../../../database/sequelize', () => ({
  query: jest.fn()
}));

const sequelize = require('../../../database/sequelize');
const SequelizeParametrosTributariosRepository = require('../infrastructure/repositories/SequelizeParametrosTributariosRepository');

describe('SequelizeParametrosTributariosRepository', () => {
  let repo;

  beforeEach(() => {
    repo = new SequelizeParametrosTributariosRepository();
    sequelize.query.mockReset(); // <-- importante, limpiamos mocks
  });

  test('retorna parámetros tributarios válidos', async () => {
    sequelize.query.mockResolvedValue([
      { uit: '4950', deduccionFijaUit: '7' }
    ]);

    const result = await repo.getParametrosTributarios();

    expect(result).toEqual({
      uit: 4950,
      deduccionFijaUit: 7,
      from: 'db'
    });
    expect(sequelize.query).toHaveBeenCalledTimes(1);
  });

  test('lanza error si no hay parámetros', async () => {
    sequelize.query.mockResolvedValue([{}]);

    await expect(repo.getParametrosTributarios())
      .rejects
      .toThrow('No se encontraron parámetros tributarios');

    expect(sequelize.query).toHaveBeenCalledTimes(1);
  });
});