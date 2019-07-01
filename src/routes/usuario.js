const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const passport = require('passport');
const Porducto = require('../models/Producto');
const Venta = require('../models/Venta');
const VentaProducto = require('../models/Venta-Producto');
const Metodo_pago = require('../models/Metodo_pago');
//const {isAuntenticate} = require('../config/auth');

router.get('/usuario/registro',(req, res) =>{
    res.render('usuario/registro');
});


router.post('/usuario/registro',async(req, res) =>{
    const {nombre, apellido, dni, direccion, email, password, confimarpassword} = req.body;
    const mensajes = [];
    if(nombre==""){
        mensajes.push({text:'debes ingresar un nombre'})
    } 
    if(apellido==""){
        mensajes.push({text:'debes ingresar un apellido'})
    }
    if(dni==""){
        mensajes.push({text:'debes ingresar un DNI'})
    }
    if(direccion==""){
        mensajes.push({text:'debes ingresar una direccion'})
    } 
    if(email==""){
        mensajes.push({text:'debes ingresar un email'});
    }
    if(password==""){
        mensajes.push({text:'debes ingresar una contraseña'});
    }
    if(password!=confimarpassword){
        mensajes.push({text:'la confirmacion no coincide con la contraseña'});
    }
    if(mensajes.length>0){
        res.render('usuario/registro',{nombre,apellido, dni, direccion, email,password,confimarpassword,mensajes});
    }else{
        const emailUsuario = await Usuario.findOne({email:email});
        if(emailUsuario){
            mensajes.push({text:'el email ingresado ya existe por favor ingrese otro'});
            res.render('usuario/registro',{nombre,apellido, dni, direccion,password,confimarpassword,mensajes});
        }else{
            const NuevoUsuario = await new Usuario({nombre,apellido, dni, direccion,email,password});
            new_pass = NuevoUsuario.encryptPassword(password);
            NuevoUsuario.password = new_pass;
            NuevoUsuario.save();
            console.log(NuevoUsuario); 
            req.flash('success_msg', 'Te registraste con exito!');
            res.redirect('/usuario/login');
        }
    }
});

router.get('/usuario/login',(req, res) =>{
    res.render('usuario/login');
});

router.post('/usuario/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/usuario/login',
    failureFlash: true
  }));


router.get('/usuario/cuenta', isAuthenticated, (req, res, next) =>{
    res.render('usuario/cuenta');
});


router.delete('/usuario/cuenta/eliminar/:id',isAuthenticated,async(req, res) =>{
    await Usuario.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Tu cuenta fue eliminada con exito');
    res.redirect('/');
});


router.put('/usuario/cuenta/modificar/:id',isAuthenticated,async (req, res) =>{
    var {nombre, email, password, email_actual, apellido, direccion, dni} = req.body;
    const mensajes = [];
    const id = req.params.id;
    if(email!=email_actual){
        const emailExistente = Usuario.findOne({email:email})
        if (emailExistente){
            mensajes.push({text:'el email ingresado ya existe, por favor elige otro'});
            res.render('usuario/cuenta',{nombre,apellido, direccion, dni, email,password,id, mensajes});
        }else{
            await Usuario.findByIdAndUpdate(req.params.id,{nombre,apellido, direccion, dni, email,password});
            req.flash('success_msg', 'Datos actualizados!');
            res.redirect('/');
        }
    }else{
        await Usuario.findByIdAndUpdate(req.params.id,{nombre,apellido, direccion, dni, email,password});
            req.flash('success_msg', 'Datos actualizados!');
            res.redirect('/');
    }
   
});

router.get('/usuario/logout',(req, res)=>{
    req.logout();
    res.redirect('/');
});

router.get('/usuario/carrito', isAuthenticated, async (req, res)=>{
    const id_usuario = req.user.id;
    const venta = await Venta.findOne({id_usuario:id_usuario,estado:'carrito'});
    if(venta){
        const monto = venta.monto;
        const id_venta=venta._id;
        const productos= await VentaProducto.find({id_venta:id_venta});
        productos.forEach(async(producto)=>{
            const prod=await Porducto.findById(producto.id_producto);
            producto.nombre=prod.nombre;
            producto.subtotal=producto.precio_venta*producto.cantidad
        });
        res.render('usuario/carrito',{productos,monto});
    }else{
        res.render('usuario/carrito');
    }
    
});

router.post('/usuario/carrito/modificar/:id',isAuthenticated,async (req, res) =>{
    const id_venta_producto=req.params.id;
    const cantidad=req.body.cantidad;
    const venta = await VentaProducto.findById(id_venta_producto);
    const id_venta = venta.id_venta;
    const id_producto = venta.id_producto;
    const producto = await Producto.findById(id_producto);
    if(producto.cantidad > cantidad){
        const venta_padre = await Venta.findById(id_venta);
        var monto = venta_padre.monto;
        await VentaProducto.findByIdAndUpdate(id_venta_producto,{cantidad});
        if(cantidad>venta.cantidad){
            const cantiadad_a_sumar = cantidad-venta.cantidad;
            monto = monto+(cantiadad_a_sumar*venta.precio_venta);
            
        }else{
            const cantiadad_a_restar = venta.cantidad-cantidad;
            monto = monto-(cantiadad_a_restar*venta.precio_venta);
        } 
        await Venta.findOneAndUpdate(id_venta,{monto:monto})
        res.redirect('/usuario/carrito');
    }else{
        req.flash('error_msg', 'La cantidad ingresada supera el stock existente, por favor ingresa una menor!');
        res.redirect('/usuario/carrito');
    }
    
});

router.post('/usuario/carrito/eliminar/:id',isAuthenticated,async (req, res) =>{
    const id_venta_producto=req.params.id;
    const venta = await VentaProducto.findById(id_venta_producto);
    const id_venta = venta.id_venta;
    const venta_padre = await Venta.findById(id_venta);
    var monto = venta_padre.monto;
    const subtotal = venta.cantidad * venta.precio_venta;
    monto = monto - subtotal;
    await Venta.findByIdAndUpdate(id_venta,{monto:monto});
    await VentaProducto.findByIdAndDelete(id_venta_producto);
    res.redirect('/usuario/carrito');
});

router.get('/usuario/envio_pago',isAuthenticated,(req, res) =>{
    res.render('usuario/envio_pago');
});

router.post('/usuario/envio_pago',isAuthenticated,async(req, res) =>{
    const {metodoDeEnvio,direccion, pago, nombre, numero_tarjeta, vencimiento, cuotas} = req.body;
    const id_usuario = req.user.id;
    const venta = await Venta.findOne({id_usuario:id_usuario,estado:'carrito'});
    const id_venta=venta.id;
    const metodo_pago = await new Metodo_pago({numero_tarjeta,vencimiento,cuotas, id_venta});
    await metodo_pago.save();
    const id_formaDePago = metodo_pago.id;
    await Venta.findByIdAndUpdate(venta.id,{id_formaDePago,metodoDeEnvio,direccion});
    res.redirect('/usuario/confirmar');
});

router.get('/usuario/confirmar',isAuthenticated,async(req, res) =>{
    const id_usuario = req.user.id;
    const venta = await Venta.findOne({id_usuario:id_usuario,estado:'carrito'});
    const id_venta = venta.id;
    const metodo_pago = await Metodo_pago.findOne({id_venta:id_venta});
    const productos = await VentaProducto.find({id_venta:id_venta});
    var cant_productos=0;
    productos.forEach(producto => {
        cant_productos=cant_productos+producto.cantidad;
    });
    res.render('usuario/confirmar',{venta, metodo_pago,cant_productos});  
});

router.post('/usuario/confirmar',isAuthenticated,async(req, res) =>{
    const id_usuario = req.user.id;
    const venta = await Venta.findOne({id_usuario:id_usuario,estado:'carrito'});
    const estado = 'concretada';
    await Venta.findByIdAndUpdate(venta.id,{estado});
    const id_venta = venta.id;
    const productos = await VentaProducto.find({id_venta:id_venta});
    productos.forEach(async(producto)=>{
        const producto_original = await Porducto.findById(producto.id_producto);
        var cantidad = producto_original.cantidad-producto.cantidad;
        await Porducto.findByIdAndUpdate(producto.id_producto,{cantidad});
    });
    res.redirect('/');
});

router.get('/usuario/compras',isAuthenticated,async(req, res) =>{
    const id_usuario = req.user.id;
    const ventas =await  Venta.find({id_usuario:id_usuario,estado:'concretada'});
   // ventas.forEach((venta)=>{
    //     var pago = Metodo_pago.findById(venta.id_formaDePago);
    //     venta.forma_de_pago=pago.nombre;
    // }); esto se tiene que haces cuendo el metodo de pago tenga un nombre xd
    console.log(ventas);
    res.render('usuario/compras',{ventas});
});

function isAuthenticated (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/usuario/login'); 
        req.flash('err_msg','No autorizado');
    }
};

module.exports = router;