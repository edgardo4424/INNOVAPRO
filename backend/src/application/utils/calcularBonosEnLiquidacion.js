const conteoBonosMesesLiquidacion = (bonos,tipos_admitidos, ) => {
   
   const sumaTipoBono=new Map();
   for (const b of bonos) {
      if(tipos_admitidos.includes(b.tipo)){
         if(!sumaTipoBono.has(b.tipo)){
            sumaTipoBono.set(b.tipo,0);
         }
          sumaTipoBono.set(b.tipo, sumaTipoBono.get(b.tipo) +parseInt(b.monto));
      }
   }
   const montos = Array.from(sumaTipoBono.values());
   let MONTO_FINAL=0;
   for (const m of montos){
      const promedio=m/6;
      MONTO_FINAL+=promedio;
   }
   
   return MONTO_FINAL;
};

module.exports = conteoBonosMesesLiquidacion;