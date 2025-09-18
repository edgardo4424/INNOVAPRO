const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = require('../../infrastructure/middleware/upload');
const controlador = require('../controllers/ArchivoController');

const MAX_MB = 10;

router.post('/quinta/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            ok: false,
            message: `El archivo supera el límite permitido de ${MAX_MB} MB.`,
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            ok: false,
            message: 'Tipo de archivo no permitido. Solo PDF, JPG o PNG.',
          });
        }
      }
      console.error('[Upload Quinta] error:', err);
      return res.status(500).json({
        ok: false,
        message: 'Ocurrió un error inesperado al subir el archivo. Inténtalo de nuevo.',
      });
    }

    return controlador.uploadQuinta(req, res);
  });
});

module.exports = router;