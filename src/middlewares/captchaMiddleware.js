const axios = require("axios");
require("dotenv").config({ path: "../.env" });

async function validarCaptcha(token) {
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  );
  return response.data.success;
}

module.exports = { validarCaptcha };