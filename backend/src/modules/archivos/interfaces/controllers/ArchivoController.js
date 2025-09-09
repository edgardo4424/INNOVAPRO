const path = require('path');

module.exports = {
  uploadQuinta(req, res) {
    try {
      if (!req.file) return res.status(400).json({ ok:false, message:'Archivo requerido' });

      // relativo desde carpeta /uploads
      // ej: /uploads/quinta/multiempleo/2025/DOCF1-10000005/169334234234-archivo.pdf
      const rel = path
        .relative(path.resolve(process.cwd(), "uploads"), req.file.path)
        .split(path.sep)
        .join("/");
      const publicPath = `/uploads/${rel}`;
      const absolute = `${req.protocol}://${req.get('host')}${publicPath}`;
      return res.status(201).json({ ok:true, url: absolute });
    } catch (e) {
      console.error("Error en uploadQuinta:", e);
      return res.status(500).json({ ok:false, message: e.message || 'Error al subir archivo' });
    }
  }
}