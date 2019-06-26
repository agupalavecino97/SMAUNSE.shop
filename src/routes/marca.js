const express = require('express');
const router = express.Router();
const Marca = require('../models/Marca');

router.get('/marca/todos',async (req, res)=>{
    const marcas = await Marca.find({estado:'true'});
    res.render('marca/todos',{marcas});
});

router.get('/marca/nuevo',(req, res)=>{
    res.render('marca/nuevo');
});

router.post('/marca/nuevo',async (req, res)=>{
    const {nombre, descripcion} = req.body;
    const mensajes = [];
    if(nombre==""){
        mensajes.push({text:'debes ingresar un nombre'})
    } 
    if(descripcion==""){
        mensajes.push({text:'debes ingresar una descripcion'})
    }
    if(mensajes.length>0){
        res.render('marca/nuevo',{nombre,descripcion,mensajes});
    }else{
        const MarcaExistente = await Marca.findOne({nombre:nombre})
        if(MarcaExistente){
            mensajes.push({text:'La marca ingresada ya existe, por favor ignresa otra'});
            res.render('marca/nuevo',{nombre,descripcion,mensajes});
        }else{
            const nueva_marca = await new Marca({nombre,descripcion});
            await nueva_marca.save();
            mensajes.push({text:'Marca guardada exitosamente'});
            res.render('marca/todos',{mensajes});
        }
    }
});

module.exports = router;