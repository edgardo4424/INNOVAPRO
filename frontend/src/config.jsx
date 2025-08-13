// En este archivo vamos a definir rutas protegidas, roles, menus dinámicos, etc
// Separación de constantes = código limpio 
// Aquí viven las constantes del sistema que no deben estar regadas por todo el código.

export const APP_VERSION = "INNOVA-PRO+ v1.2.0"; 

// Tipos válidos de notificaciones para WebSocket
export const tiposValidos = ["error", "info", "tarea", "exito", "advertencia", "sistema", "cliente", "admin"];