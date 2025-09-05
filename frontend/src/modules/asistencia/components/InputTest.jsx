import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const InputTest = ({ trabajadores, setTrabajadoresFiltrados }) => {
   const [busqueda, setBusqueda] = useState("");
   useEffect(() => {
      let copy = [...trabajadores];
      if (busqueda) {
         copy = copy.filter((t) => {
            const texto = `${t.nombres} ${t.apellidos}`.toLowerCase();
            return texto.includes(busqueda.toLowerCase());
         });
      }
      setTrabajadoresFiltrados(copy);
   }, [busqueda, trabajadores]);
   return (
      <div>
         <Input
            placeholder="Buscar trabajador...."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
         />
      </div>
   );
};
export default InputTest;
