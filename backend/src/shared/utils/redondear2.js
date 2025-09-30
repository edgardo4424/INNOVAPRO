function redondear2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

module.exports = { redondear2 };