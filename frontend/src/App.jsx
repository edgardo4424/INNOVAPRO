// Este archivo es el punto de entrada visual, es el contenedor principal de toda la app.
// Su unica responsabilidad es cargar las rutas del sistema mediante <AppRoutes /> 
// No tiene lógica, solo conecta. Aquí es donde el usuario empieza a navegar

import React from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />; // Aquí están definidas todas las rutas del sistema
}

export default App;