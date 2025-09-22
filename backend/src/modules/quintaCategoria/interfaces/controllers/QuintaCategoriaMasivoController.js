const ProcesarMasivoFilialQuinta = require('../../application/useCases/procesarMasivoFilialQuinta');

module.exports = {
  async crearMasivo(req, res) {
    try {
      const anio = Number(req.body?.anio);
      const mes  = Number(req.body?.mes);
      const filialId = Number(req.body?.filialId);
      const usuarioId = Number(req.user?.id || 0);

      const uc = new ProcesarMasivoFilialQuinta();
      const out = await uc.execute({ anio, mes, filialId, usuarioId });

      return res.status(201).json({ ok: true, ...out });
    } catch (error) {
      const status = error.status || 500;
      console.error('[QuintaCategoria][Masivo] Error:', error);
      return res.status(status).json({ ok: false, message: error?.message || 'Error interno en proceso masivo.' });
    }
  }
};