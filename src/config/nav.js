const servicio = require('../models/Servicio'); 
const rubro = require('../models/Rubro');

async function nav (req, res, next){
    var todosServicios = await servicio.find({estado:'true'});
    const rubros = await rubro.find({estado:'true'});
    var servicios = [];
    todosServicios.forEach(function(servicio, servicioIndex){
    
        servicios[servicioIndex] = {
            id: servicio.id,
            nombre: servicio.nombre,
            rubros: []
        }
        rubros.forEach(rub => {
            if(servicio.id == rub.id_servicio){
                servicios[servicioIndex].rubros.push(rub);
            }
        });
       
    });
     return servicios;
};
 module.exports = nav();