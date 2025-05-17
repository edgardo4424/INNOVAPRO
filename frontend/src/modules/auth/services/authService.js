import api from "../../../shared/services/api";

export async function loginService(email, password, recaptchaToken) {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
      recaptchaToken,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error en loginService:", error.response?.data || error.message);
    return {
      error: true,
      mensaje: error.response?.data?.mensaje || "Error desconocido",
    };
  }
}