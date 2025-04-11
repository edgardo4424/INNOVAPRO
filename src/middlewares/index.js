const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require("helmet");

module.exports = (app) => {
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(helmet()) // 🛡️ Protege contra ataques comunes
};
