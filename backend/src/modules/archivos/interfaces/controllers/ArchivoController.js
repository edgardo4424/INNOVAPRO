const path = require('path');
const multer = require('multer');
const { MAX_MB } = 10;

module.exports = {
  uploadQuinta(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          ok: false,
          message: 'Debes seleccionar un archivo para subir.',
        });
      }

      const rel = path // acá creamos la ruta relativa para las URL públicas
        .relative(path.resolve(process.cwd(), "uploads"), req.file.path)
        .split(path.sep)
        .join("/");
      const publicPath = `/uploads/${rel}`; // está será la ruta pública para acceder a los archivos
      const absolute = `${req.protocol}://${req.get('host')}${publicPath}`;

      return res.status(201).json({ ok: true, url: absolute });
    } catch (err) {
      console.error("Error en uploadQuinta:", err);
      return res.status(500).json({ // EN CASO EL ERROR NO VENGA DE MULTER LO CAPTURAMOS DE FORMA GENÉRICA
        ok: false,
        message: "Ocurrió un error inesperado al subir el archivo. Inténtalo de nuevo.",
      });
    }
  },
};