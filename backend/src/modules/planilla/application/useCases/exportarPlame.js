const SequelizeFilialRepository = require("../../../filiales/infrastructure/repositories/sequelizeFilialRepository");
const SequelizeTrabajadorRepository = require("../../../trabajadores/infraestructure/repositories/sequelizeTrabajadorRepository");
const SequelizeQuintaCategoriaRepository=require("../../../quintaCategoria/infrastructure/repositories/SequelizeQuintaCategoriaRepository")
/**
 * Genera un archivo ZIP con los TXT de PLAME
 * @param {Object} res - response de Express
 * @param {Object} payload - paramtetros para obtener el cierre de la planilla
 * @param {Class} periodo - Clase de Sequelize planilla repository
 */
const filialRepository = new SequelizeFilialRepository();
const trabajadorRepository= new SequelizeTrabajadorRepository()
const archiver = require("archiver");
const separar_planilla_honorarios = require("../../infrastructure/utils/separar_planilla_honorarios");
const plame_prestadores_cuarta = require("../../infrastructure/utils/plame_prestadores_cuarta");
const contar_dias_laborables_mes  = require("../../infrastructure/utils/calcular_dias_laborales_mes");
const obtenerDatosAsistencia = require("../../infrastructure/services/obtener_datos_asistencia");
const generarRem = require("../../infrastructure/utils/generaRem");
const plame_recibo_por_honorario = require("../../infrastructure/utils/plame_recibos_honorarios");
const quintaRepository=new SequelizeQuintaCategoriaRepository()
function convertirHorasDecimales(valor) {
  const horas = Math.floor(valor);
  const minutos = Math.round((valor - horas) * 60);
  return { horas, minutos };
}
function obtenerInicioYFinDeMes(anio, mes) {
  // Asegurar que el mes esté en el rango 1-12
  if (mes < 1 || mes > 12) {
    throw new Error("El mes debe estar entre 1 y 12");
  }
  // Ajustar mes (JavaScript usa 0-11 para meses)
  const inicio = new Date(anio, mes - 1, 1).toISOString().split("T")[0];
  const fin = new Date(anio, mes, 0).toISOString().split("T")[0]; // Día 0 del mes siguiente = último día del mes actual
  return {
    inicio,
    fin
  };
}

module.exports = async (res, payload, planillaRepository) => {
  const { fecha_anio_mes, filial_id } = payload;
  const desgloce_periodo=fecha_anio_mes.split("-");
  const anio=desgloce_periodo[0];
  const mes=desgloce_periodo[1]
  const dias=new Date(anio, Number(mes), 0).getDate()
  const filial = await filialRepository.obtenerPorId(filial_id);
  if (!filial) {
    throw new Error("La filial enviada no existe.");
  }


  const planillaMensualCerradas =
    await planillaRepository.obtenerPlanillaMensualCerradas(
      fecha_anio_mes,
      filial_id
  );    
  const {pl,rh}=separar_planilla_honorarios(planillaMensualCerradas)
  // archiver("zip") → define que usarás ZIP.
  // Definimos el nivel maximo de compresion.

  const {prestadores_cuarta}=await plame_prestadores_cuarta(trabajadorRepository,rh);

  const {dias_laborales_oficina,dias_laborales_almacen}=contar_dias_laborables_mes(anio,mes);
  const{inicio,fin}=obtenerInicioYFinDeMes(anio,Number(mes));

  let jornadas_laborales=[];
  let subsidiados=[];
  let ingresos_tributos=[];
  let quintas=[];
  let recibos=[];

  for (const t of planillaMensualCerradas) {

        const tipo_documento=t.tipo_documento == "CE" ? "04" : "01";
        const dias_falta=Number(dias)-t.dias_labor;
        const areas_dif=["Almacen","Montadores"];
        let horas_trabajadas=0;
        let horas_extras_trabajadas=0;
        //formato==== yyyy-mm
        // console.log(fecha_anio_mes);
        const response_quinta= await quintaRepository.obtenerMultiempleoInferido({trabajadorId:t.trabajador_id,fechaAnioMes:fecha_anio_mes});
         const quintas_filtradas=response_quinta.filiales.filter((f)=>f.filial_id!=filial_id);
        for (const q of quintas_filtradas) {
            quintas.push(`${tipo_documento}|${t.numero_documento}|${q.ruc||"No implementado"}|${q.monto}`)
        }
         
        
        if(areas_dif.includes(t.area)){            
            horas_trabajadas=(dias_laborales_almacen-dias_falta)*8;
        }
        else{
            horas_trabajadas=(dias_laborales_oficina-dias_falta)*9;
        }
        if(t.h_extras_primera_quincena||t.h_extras_segunda_quincena){
            const suma_horas_extras=t.h_extras_primera_quincena+t.h_extras_segunda_quincena;            
             horas_extras_trabajadas=suma_horas_extras/(t.sueldo_basico>2200?12:10);
        }
        const {horas,minutos}=convertirHorasDecimales(horas_extras_trabajadas);
        const linea_contruida_jor=`${tipo_documento}|${t.numero_documento}|${horas_trabajadas}|0|${horas}|${minutos}`
        jornadas_laborales.push(linea_contruida_jor);
        const {faltas,faltas_justificadas,licencia_con_goce,licencia_sin_goce,vacaciones_g}=await obtenerDatosAsistencia(inicio,fin,t.trabajador_id);
        if(faltas){
            subsidiados.push(`${tipo_documento}|${t.numero_documento}|07|${faltas}`)
        }
        if(faltas_justificadas){
            subsidiados.push(`${tipo_documento}|${t.numero_documento}|06|${faltas_justificadas}`)
        }
        if(licencia_con_goce){
            subsidiados.push(`${tipo_documento}|${t.numero_documento}|24|${licencia_con_goce}`)
        }
        if(licencia_sin_goce){
            subsidiados.push(`${tipo_documento}|${t.numero_documento}|05|${licencia_sin_goce}`)
        }
        if(vacaciones_g){
            subsidiados.push(`${tipo_documento}|${t.numero_documento}|23|${vacaciones_g}`);
        }


        ingresos_tributos.push(...generarRem(t,tipo_documento));   
        
        if(t.tipo_contrato==="HONORARIOS"){          
          const response_recibo=await plame_recibo_por_honorario(trabajadorRepository,t.recibo.recibo_por_honorario);
          recibos.push(response_recibo);
        }
    
    }

  const zipName = `RUC${filial.ruc}_${fecha_anio_mes}.zip`;
  res.setHeader("Content-Type", "application/zip");
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  res.setHeader("Content-Disposition", `attachment; filename="${zipName}"`);
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);


    //!Crear archivo para prestadores de servicios de 4ta categoria osea recibo por honorarios;
    archive.append(prestadores_cuarta.join("\n"), { name: `0601${anio}${mes}${filial.ruc}.ps4` });
    //!Agregando las jornadas laborales
    archive.append(jornadas_laborales.join("\n"), { name: `0601${anio}${mes}${filial.ruc}.jor` });
    //!Agregando los dias no laborados
    archive.append(subsidiados.join("\n"), { name: `0601${anio}${mes}${filial.ruc}.snl` });
    //!Agregando los iNGRESSOS TRIBUTOS Y DECLARACIONES
    archive.append(ingresos_tributos.join("\n"), { name: `0601${anio}${mes}${filial.ruc}.rem` });
     //!Agregando la quinta al plame
    archive.append(quintas.join("\n"), { name: `0601${anio}${mes}${filial.ruc}.or5` });
    archive.append(recibos.join("\n"), { name: `0601${anio}${mes}${filial.ruc}.4ta` });

    
    console.log("Recibos",recibos);
    
    archive.finalize();

}; // Exporta la función para que pueda ser utilizada en otros módulos

