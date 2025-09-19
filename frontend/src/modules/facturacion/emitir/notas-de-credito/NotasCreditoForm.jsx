import { toast } from "react-toastify";
import { useNota } from "../../context/NotaContext";
import facturaService from "../../service/FacturaService";
import { formatearBorrador } from "../../utils/formatearBorrador";
import ModalEmitirNota from "./components/modal/ModalEmitirNota";
import DatosDeClienteForm from "./forms/DatosDeClienteForm";
import DetallesForm from "./forms/DetallesForm";
import DocumentoAfectadoForm from "./forms/DocumentoAfectadoForm";
import InfDocumentoForm from "./forms/InfDocumentoForm";
import {
  notaInical,
  ValorInicialDetalleNota,
} from "./utils/valoresInicialNota";

const NotasCreditoForm = () => {
  const {
    notaCreditoDebito,
    setNotaCreditoDebito,
    setDocumentoAAfectar,
    documentoAAfectar,
    idBorrador,
  } = useNota();

  const handleRegister = async () => {
    if (idBorrador) {
      toast.error(
        "Estas tratando de registrar la nota como un borrardor, pero esta fue rellenada con un borrador previo",
      );
      return;
    }
    // *conseguir id usuario
    const user = localStorage.getItem("user");
    const userData = JSON.parse(user);
    let tipo_borrador = "";
    if (notaCreditoDebito.tipo_Doc == "07") {
      tipo_borrador = "notaCredito";
    }
    if (notaCreditoDebito.tipo_Doc == "08") {
      tipo_borrador = "notaDebito";
    }
    let nuevoBorrador = {
      ...notaCreditoDebito,
      documento_Afectado: documentoAAfectar,
    };
    console.log(nuevoBorrador);

    const formateado = await formatearBorrador(
      tipo_borrador,
      nuevoBorrador,
      userData.id,
    );

    try {
      const { message, status, success } =
        await facturaService.registrarBorrador(formateado);
      if (status == 201 && success) {
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setNotaCreditoDebito(notaInical);
        setDocumentoAAfectar(ValorInicialDetalleNota);
      }
      if (status == 400 && !success) {
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelar = () => {};
  return (
    <div className="container mx-auto max-w-6xl">
      {/* Form content */}
      <div className="mb-6 rounded-3xl border border-gray-400 bg-white p-4 shadow-xl transition-all duration-300">
        {/* Sección de Documento Principal */}
        <InfDocumentoForm />

        {/* Seccion de Documento Afectado */}
        <DocumentoAfectadoForm />

        {/*  //? LOS DATOS DEL CLIENTE SE COLOCAN DE MANERA AUTOMATICA AL SELECCIONAR EL DOCUMENTO A AFECTAR*/}
        {/* <DatosDeClienteForm /> */}

        {/* Sección de Detalle de Productos */}
        <DetallesForm />

        <div className="flex justify-between">
          <div className="flex gap-x-8">
            <button
              onClick={handleRegister}
              className="cursor-pointer rounded-xl bg-innova-blue px-4 py-3 font-semibold text-white"
            >
              Guardar
            </button>
            <button
              onClick={handleCancelar}
              className="cursor-pointer rounded-xl bg-innova-orange px-4 py-3 font-semibold text-white"
            >
              Cancelar
            </button>
          </div>
          <ModalEmitirNota />
        </div>
      </div>
    </div>
  );
};

export default NotasCreditoForm;
