const path = require('path');
const fs = require('fs');
const multer = require('multer');

const PERMITIDO = ['application/pdf','image/jpeg','image/png'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const base = path.resolve(process.cwd(), 'uploads', 'quinta');
    const { categoria = 'general', dni = 'nd', anio = 'nd' } = req.query;
    const dest = path.join(base, categoria, String(anio), String(dni));
    fs.mkdirSync(dest, { recursive: true }); // recursive: true permite que si no existen los directorios padres, se creen.
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${file.originalname.replace(/\s+/g,'_')}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  if (!PERMITIDO.includes(file.mimetype)) return cb(new Error('Formato no permitido (solo PDF/JPG/PNG)'));
  cb(null, true);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 10*1024*1024 } }); // 10MB