const express = require('express');
const router = express.Router();
const Rubro = require('../models/Rubro');
const Servicio = require('../models/Servicio');


router.get('/rubro/todos',async (req, res)=>{
    const rubros = await Rubro.find({estado:'true'});
    res.render('rubro/todos',{rubros});
});

router.get('/rubro/nuevo',(req, res)=>{
    res.render('rubro/nuevo');
});

router.post('/rubro/nuevo',async (req, res)=>{
    const {nombre, descripcion, servicio} = req.body;
    const mensajes = [];
    if(nombre==""){
        mensajes.push({text:'debes ingresar un nombre'})
    } 
    if(descripcion==""){
        mensajes.push({text:'debes ingresar una descripcion'})
    }
    if(servicio==""){
        mensajes.push({text:'debes ingresar un servicio'})
    }
    if(mensajes.length>0){
        res.render('rubro/nuevo',{nombre,descripcion,servicio,mensajes});
    }else{
        const rubroExistente = await Rubro.findOne({nombre:nombre})
        if(rubroExistente){
            mensajes.push({text:'El rubro ingresada ya existe, por favor ingresa otro'});
            res.render('rubro/nuevo',{nombre,descripcion,servicio,mensajes});
        }else{
            const servicio_ingresado = await Servicio.findOne({nombre:servicio});
            if(servicio_ingresado){
                const id_servicio = servicio_ingresado.id;
                const nuevo_rubro = await new Rubro({nombre,descripcion, id_servicio});
                await nuevo_rubro.save();
                mensajes.push({text:'rubro guardada exitosamente'});
                res.render('rubro/todos',{mensajes});
            }else{
                mensajes.push({text:'El servicio ingresado no existe, por favor ingresa uno correcto'});
                res.render('rubro/nuevo',{nombre,descripcion,mensajes});
                }
        }
    }
});

module.exports = router;