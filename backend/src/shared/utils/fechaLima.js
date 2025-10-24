// utils/fechaLima.js
export const getFechaHoraLima = () => {
  const now = new Date();

  // Convertir a Lima: UTC-5
  const limaTime = new Date(now.getTime() - (5 * 60 * 60 * 1000));

  // Formatear a yyyy-MM-dd HH:mm:ss
  const yyyy = limaTime.getFullYear();
  const mm = String(limaTime.getMonth() + 1).padStart(2, "0");
  const dd = String(limaTime.getDate()).padStart(2, "0");
  const hh = String(limaTime.getHours()).padStart(2, "0");
  const min = String(limaTime.getMinutes()).padStart(2, "0");
  const sec = String(limaTime.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
};
