const calcular_periodo_grati_cts=(anio_mes_dia)=>{

    let periodograti = null;
      if (
         anio_mes_dia >= `${anio_mes_dia.slice(0, -6)}-07-01` &&
         anio_mes_dia <= `${anio_mes_dia.slice(0, -6)}-07-31`
      ) {
         periodograti = "JULIO";
      }
      if (
         anio_mes_dia >= `${anio_mes_dia.slice(0, -6)}-12-01` &&
         anio_mes_dia <= `${anio_mes_dia.slice(0, -6)}-12-31`
      ) {
         periodograti = "DICIEMBRE";
      }
      let periodocts = null;
      if (
         anio_mes_dia >= `${anio_mes_dia.slice(0, -6)}-05-01` &&
         anio_mes_dia <= `${anio_mes_dia.slice(0, -6)}-05-31`
      ) {
         periodocts = "MAYO";
      }
      if (
         anio_mes_dia >= `${anio_mes_dia.slice(0, -6)}-11-01` &&
         anio_mes_dia <= `${anio_mes_dia.slice(0, -6)}-11-31`
      ) {
         periodocts = "NOVIEMBRE";
      }

      return{
        periodocts,
        periodograti
      }
}

module.exports=calcular_periodo_grati_cts