import ModalPagos from '../modal/ModalPagos';
import TablaPagos from '../tabla/TablaPagos';

import { motion } from "framer-motion"; // ✅ Importar motion

const FormaDePago = () => {


    return (
        <motion.div className="max-h-[80dvh] min-h-[40dvh] overflow-y-auto  p-2  "
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <ModalPagos />
            <TablaPagos />
        </motion.div>
    )
}

export default FormaDePago