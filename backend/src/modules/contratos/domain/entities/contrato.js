class Contrato{
    constructor({id,cotizacion_id,notas_legales}){
        this.id=id;
        this.cotizacion_id=cotizacion_id;
        this.notas_legales=notas_legales;
    }
    validar(editar=false){
        let errores=[]
        if(editar){
            if(!this.id){
                errores.push("Al actualizar un contrato id es requerrido")
            }
        }
        if(!this.cotizacion_id){
            errores.push("Para crear un contrato es necesario una cotización")
        }
        if(!this.notas_legales){
            errores.push("Ingrese las notas legales")
        }

    }
    
    get(editar=false){
        const payload={
            notas_legales:this.notas_legales,
            cotizacion_id:this.cotizacion_id
        }
        if(editar){
            delete payload.cotizacion_id;
            payload.contrato_id=this.id;
        }
        return payload;
    }
}

module.exports =Contrato;