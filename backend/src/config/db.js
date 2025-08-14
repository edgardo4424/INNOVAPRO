//Con esto, no dañamos la configuracion que teniamos en models/index.js que hace 
// const sequelize = require("../config/db"), pero ahora usa la config del CLI (y por ende, las migraciones).
module.exports = require('../database/sequelize');