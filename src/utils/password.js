const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const encriptarPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

const validarPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  encriptarPassword,
  validarPassword,
};
