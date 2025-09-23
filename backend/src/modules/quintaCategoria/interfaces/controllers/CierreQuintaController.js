const cierreQuintaCategoria = require('../../application/useCases/cierreQuintaCategoria');
const SequelizeCalculoQuintaCategoriaRepository = require('../../infrastructure/repositories/SequelizeQuintaCategoriaRepository');

const repo = new SequelizeCalculoQuintaCategoriaRepository();

module.exports = {
  async cerrar(req, res) {
    try {
      const { periodo, filial_id } = req.body || {};
      if (!periodo || !filial_id) {
        return res.status(400).json({
          ok: false,
          message: 'Periodo (YYYY-MM) y filial_id son obligatorios.'
        });
      }
      const usuarioId = req.usuario?.id ?? null;
      if (!usuarioId) {
        return res.status(401).json({ ok: false, message: 'Usuario no autenticado.' });
      }

      // Caso de uso (maneja crear/actualizar el cierre)
      const resp = await cierreQuintaCategoria(
        usuarioId,
        periodo,
        Number(filial_id),
        repo
      );

      return res.status(resp.codigo || 200).json({ ok: true, ...(resp.respuesta || {}) });
    } catch (error) {
      console.error('Error al cerrar quinta:', error);
      return res.status(500).json({ ok: false, message: 'Error interno al cerrar quinta.' });
    }
  },

  async listar(req, res) {
    try {
      const { filialId, anio } = req.query || {};
      const list = await repo.listarCierres({
        filialId: filialId ? Number(filialId) : undefined,
        anio: anio ? String(anio) : undefined,
      });
      return res.status(200).json({ ok: true, data: list });
    } catch (error) {
      console.error('Error listando cierres de quinta:', error);
      return res.status(500).json({ ok: false, message: 'Error interno listando cierres.' });
    }
  },

  async estado(req, res) {
    try {
      const { filialId, periodo, anio, mes } = req.query || {};
      if (!filialId || (!periodo && (!anio || !mes))) {
        return res.status(400).json({ ok: false, message: 'Parámetros insuficientes.' });
      }
      const cerrado = await repo.estaCerrado({ filialId: Number(filialId), periodo, anio: Number(anio), mes: Number(mes) });
      return res.status(200).json({ ok: true, cerrado });
    } catch (error) {
      console.error('Error consultando estado de cierre:', error);
      return res.status(500).json({ ok: false, message: 'Error interno consultando estado de cierre.' });
    }
  },
};