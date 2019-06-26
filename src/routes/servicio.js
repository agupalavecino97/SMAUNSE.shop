const express = require('express');
const router = express.Router();
const Servicio = require('../models/Servicio');

router.get('/servicio/todos',async (req, res)=>{
    const servicios = await Servicio.find({estado:'true'});
    res.render('servicio/todos',{servicios});
});

router.get('/servicio/nuevo',(req, res)=>{
    res.render('servicio/nuevo');
});

router.post('/servicio/nuevo',async (req, res)=>{
    const {nombre, descripcion} = req.body;
    const mensajes = [];
    if(nombre==""){
        mensajes.push({text:'debes ingresar un nombre'})
    } 
    if(descripcion==""){
        mensajes.push({text:'debes ingresar una descripcion'})
    }
    if(mensajes.length>0){
        res.render('servicio/nuevo',{nombre,descripcion,mensajes});
    }else{
        const servicioExistente = await Servicio.findOne({nombre:nombre})
        if(servicioExistente){
            mensajes.push({text:'El servicio ingresada ya existe, por favor ignresa otra'});
            res.render('servicio/nuevo',{nombre,descripcion,mensajes});
        }else{
            const nuevo_servicio = await new Servicio({nombre,descripcion});
            await nuevo_servicio.save();
            mensajes.push({text:'Servicio guardado exitosamente'});
            res.render('servicio/todos',{mensajes});
        }
    }
});

module.exports = router;