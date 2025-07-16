
import { createContext, useContext, useEffect, useState } from "react";

const GuiaTransporteContext = createContext();

export function GuiaTransporteProvider({ children }) {

    const [guiaTransporte, setGuiaTransporte] = useState({});

    return <GuiaTransporteContext.Provider value={{guiaTransporte, setGuiaTransporte}}>{children}</GuiaTransporteContext.Provider>;
}

export function useGuiaTransporte() {
    return useContext(GuiaTransporteContext);
}