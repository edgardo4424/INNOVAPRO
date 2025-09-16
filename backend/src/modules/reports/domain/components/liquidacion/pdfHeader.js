function pdfHeader({ title, logo }) {
  return {
    columns: [
      { image: logo, width: 80 },
      {
        text: title,
        style: "docTypeHeaderCenter",
        alignment: "center",
        width: "*",
        margin: [0, 20, 0, 0],
      },
    ],
    margin: [0, 0, 0, 20],
  };
}
module.exports = { pdfHeader };
