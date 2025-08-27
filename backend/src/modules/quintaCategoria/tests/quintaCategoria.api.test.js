const express = require('express');
const request = require('supertest');

// Mock del middleware verificarToken para que no bloquee con 401
jest.mock('../../../shared/middlewares/authMiddleware', () => ({
  verificarToken: (req, res, next) => next()
}));

// Mockeamos el controller para no depender de DB ni casos de uso reales
jest.mock('../interfaces/controllers/quintaCategoriaController', () => ({
  previsualizar: (req, res) =>
    res.json({ ok: true, data: { bruto_anual_proyectado: 18000 } }),

  crear: (req, res) =>
    res.status(201).json({ ok: true, data: { id: 1, fuente: 'oficial' } }),

  recalcular: (req, res) =>
    res.status(201).json({ ok: true, data: { id: 1, es_recalculo: true } }),

  getById: (req, res) =>
    res.json({ ok: true, data: { id: Number(req.params.id), bruto_anual_proyectado: 18000 } }),

  list: (req, res) =>
    res.json({
      ok: true,
      rows: [
        { id: 1, dni: '004345625', anio: 2025 },
        { id: 2, dni: '004345625', anio: 2025 },
      ],
      count: 2,
      page: 1,
      limit: 20,
    }),
}));

const router = require('../interfaces/routes/quintaCategoriaRoutes');
const app = express();
app.use(express.json());
app.use('/api/quintaCategoria', router);

describe('API Quinta Categoría', () => {
  test('POST /previsualizar devuelve cálculo informativo', async () => {
    const res = await request(app)
      .post('/api/quintaCategoria/previsualizar')
      .send({ anio: 2025, mes: 8, dni: '004345625', remuneracionMensualActual: 1500 });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toHaveProperty('bruto_anual_proyectado');
  });

  test('POST / crea cálculo oficial', async () => {
    const res = await request(app)
      .post('/api/quintaCategoria')
      .send({ anio: 2025, mes: 8, dni: '004345625', remuneracionMensualActual: 2000 });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.fuente).toBe('oficial');
  });

  test('POST /:id/recalcular recalcula un cálculo', async () => {
    const res = await request(app)
      .post('/api/quintaCategoria/1/recalcular')
      .send({ remuneracionMensualActual: 2500 });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toHaveProperty('es_recalculo', true);
  });

  test('GET /:id devuelve cálculo por id', async () => {
    const res = await request(app).get('/api/quintaCategoria/1');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toHaveProperty('id', 1);
  });

  test('GET / lista cálculos filtrados', async () => {
    const res = await request(app).get('/api/quintaCategoria?dni=004345625&anio=2025');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(Array.isArray(res.body.rows)).toBe(true);
    expect(res.body.count).toBe(2);
  });
});