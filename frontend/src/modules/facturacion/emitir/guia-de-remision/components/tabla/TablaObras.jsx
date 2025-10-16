import obraService from "@/modules/facturacion/service/ObraService";
import { useEffect, useState } from "react";

const TablaObras = () => {
  const [ListaObras, setListaObras] = useState([]);

  const obtenerObras = async () => {
    try {
      const obras = await obraService.obtenerObras();
      console.log(obras);
    } catch (error) {
        console.log(error);
    }
  };
  useEffect(() => {
    obtenerObras();
  }, []);
  return <div></div>;
};

export default TablaObras;
