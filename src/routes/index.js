const express = require('express');
const router = express.Router();
const servicio = require('../models/Servicio'); 
const rubro = require('../models/Rubro');

router.get('/', async (req, res) =>{
    const mensajes = req.params.mensajes;
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
    console.log(servicios);
    
    res.render('index',{mensajes, servicios});
});

router.get('/aboutUs',(req, res) =>{
    res.render('aboutUs');
});
module.exports = router;