const express = require("express");
const router = express.Router();
const whatsappController = require("../controllers/whatsappController");

router.post("/probar", whatsappController.enviarPrueba);

module.exports = router; 

