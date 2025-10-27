import api from "@/shared/services/api";

export async function renderPlantillaContrato({ file, data, nombreBase, generarPdf = false }) {
  const form = new FormData();
  form.append("file", file);
  form.append("data", JSON.stringify(data));
  if (nombreBase) form.append("nombreBase", nombreBase);
  form.append("generarPdf", generarPdf ? "true" : "false");

  const { data: resp } = await api.post("/documentos/contratos/render", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return resp;
}