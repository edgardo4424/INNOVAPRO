import { toast } from "react-toastify";

/**
 * confirmToast
 * Muestra un toast de confirmación con botones SÍ y NO.
 * Ejecuta `onConfirm()` solo si el usuario acepta.
 */
export function confirmToast(message, onConfirm) {
  const toastId = toast.warn(
    ({ closeToast }) => (
      <div>
        <p>{message}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 5 }}>
          <button
            onClick={async () => {
              toast.dismiss(toastId); // ✅ Cierra el toast al confirmar
              await onConfirm();     // ✅ Ejecuta callback una sola vez
            }}
            style={{
              marginRight: 10,
              backgroundColor: "#d9534f",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sí
          </button>
          <button
            onClick={() => toast.dismiss(toastId)} // ✅ Cierra sin hacer nada
            style={{
              backgroundColor: "#5bc0de",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      position: "top-center",
    }
  );
}