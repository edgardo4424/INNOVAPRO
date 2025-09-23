const customLightLayout = {
  hLineWidth: function (i, node) {
    return i === 0 ? 0 : 0.5; // ❌ Sin línea superior, ✅ líneas finas después
  },
  vLineWidth: function () {
    return 0;
  },
  hLineColor: function () {
    return '#aaa';
  },
  paddingLeft: function () {
    return 5;
  },
  paddingRight: function () {
    return 5;
  },
  paddingTop: function () {
    return 3;
  },
  paddingBottom: function () {
    return 3;
  }
};

module.exports = customLightLayout;