import { motion } from "framer-motion"; // ✅ Importar motion
import { useState } from "react";
import ModalProducto from '../modal/ModalProducto';
import TablaProductos from '../tabla/TablaProductos';

const MontoyProductos = () => {
    const [open, setOpen] = useState(false);


    return (
        <motion.div className='min-h-[40dvh] '
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >

            <ModalProducto open={open} setOpen={setOpen} />

            <TablaProductos setOpen={setOpen} />


        </motion.div>)
}

export default MontoyProductos