const express = require('express');
const router = express.Router();
const upload = require('../../infrastructure/middleware/upload');
const ctrl = require('../controllers/ArchivoController');

// POST /api/archivos/quinta/upload?categoria=multiempleo|certificado|sinprevios&dni=&anio=
router.post('/quinta/upload', upload.single('file'), ctrl.uploadQuinta);

module.exports = router;