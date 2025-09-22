import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNota } from "../context/NotaContext";
import NotasCreditoForm from "../emitir/notas-de-credito/NotasCreditoForm";

const NotaCredito = () => {
  const { setNotaCreditoDebito, setDocumentoAAfectar, setIdBorrador } =
    useNota();

  const location = useLocation();
  const documento = location.state || {};

  useEffect(() => {
    const PlasmarBorrador = async () => {
      if (documento.length > 0) {
        console.log(documento);
        let { documento_Afectado, ...notaBorrador } = documento[0];

        setNotaCreditoDebito(notaBorrador);
        setDocumentoAAfectar(documento_Afectado);
        setIdBorrador(documento[1].borr_id_delete);
      }
    };
    PlasmarBorrador();
  }, []);

  return (
    <div className="flex w-full flex-col items-center bg-gray-100 px-4 py-6 md:px-8">
      <div className="w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-600 md:text-3xl">
            Generar Notas de Credito
          </h2>
        </div>

        <NotasCreditoForm />
      </div>
    </div>
  );
};

export default NotaCredito;
