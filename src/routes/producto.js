const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Rubro = require('../models/Rubro');
const Servicio = require('../models/Servicio');
const Marca = require('../models/Marca');
const Venta = require('../models/Venta');
const VentaProducto = require('../models/Venta-Producto');


router.get('/producto/todos/:rubro',async(req, res)=>{
    const rubro = await Rubro.findOne({nombre:req.params.rubro});
    if(rubro){
        const id_rubro = rubro.id;
        const productos = await Producto.find({id_rubro:id_rubro});
        var productos_mostrar =[];
        productos.forEach((producto)=>{
            if(producto.cantidad>0){
                productos_mostrar.push(producto);
            }
        });
        res.render('producto/todos',{productos_mostrar});
    }else{
        req.flash('error_msg', 'Actualmente no hay stock de los productos de este rubro!');
        res.render('producto/todos');
    }
    
});

router.post('/producto/todos',async(req, res)=>{
    const {busqueda} = req.body;    
    const servicio = await Servicio.findOne({nombre:busqueda});
    if(servicio){
        const id_servicio = servicio.id;
        const rubros = await Rubro.find({id_servicio:id_servicio});
        console.log(rubros);
        var productos_mostrar = [];
        rubros.forEach(async (rubro)=>{
            const id_rubro = rubro.id;
            const productos = await Producto.find({id_rubro:id_rubro});
            console.log(productos);
            productos.forEach((producto)=>{
                if(producto.cantidad>0){
                    productos_mostrar.push(producto);
                }
            });
            console.log('productos a mostrar',productos_mostrar);
        });
        res.render('producto/todos',{productos_mostrar});
    }else{
        const rubro = await Rubro.findOne({nombre:busqueda});
        if(rubro){
            const id_rubro = rubro.id;
            const productos = await Producto.find({id_rubro:id_rubro});
            var productos_mostrar =[];
            productos.forEach((producto)=>{
                if(producto.cantidad>0){
                    productos_mostrar.push(producto);
                }
            });
            res.render('producto/todos',{productos_mostrar});
        }else{
            const producto = await Producto.findOne({nombre:busqueda})
            if(producto){
                id = producto.id
                var url = ('/producto/detalle/'+id);
                res.redirect(url);
            }else{
                req.flash('error_msg', 'No existe ningun producto, rubro o servicio con ese nombre!');
                res.redirect('/');
            }
        }
    }
});

router.get('/producto/nuevo',(req, res)=>{
    res.render('producto/nuevo');
});

router.post('/producto/nuevo',async (req, res)=>{
    const {nombre, codigo_barra, precio, cantidad, rubro, marca} = req.body;
    const mensajes = [];
    if(nombre==""){
        mensajes.push({text:'debes ingresar un nombre'})
    } 
    if(codigo_barra==""){
        mensajes.push({text:'debes ingresar un codigo'})
    }
    if(precio==""){
        mensajes.push({text:'debes ingresar un precio'})
    }
    if(cantidad==""){
        mensajes.push({text:'debes ingresar una cantidad'})
    } 
    if(rubro==""){
        mensajes.push({text:'debes ingresar un rubro'});
    }
    if(marca==""){
        mensajes.push({text:'debes ingresar una marca'});
    }
    if(mensajes.length>0){
        res.render('producto/nuevo',{nombre,codigo_barra,precio,cantidad,rubro,marca,mensajes});
    }else{
        const productoExistente = await Producto.findOne({codigo_barra:codigo_barra})
        if(productoExistente){
            mensajes.push({text:'El codigo ingresado ya existe, por favor ignresa otro'});
            res.render('usuario/registro',{nombre,precio,cantidad,rubro,marca,mensajes});
        }else{
            const rubroIngresdo = await Rubro.findOne({nombre:rubro});
            console.log(rubroIngresdo);
            const id_rubro = rubroIngresdo.id;
            const marcaIngresada = await Marca.findOne({nombre:marca});
            const id_marca = marcaIngresada.id;
            const nuevo_producto = await new Producto({nombre, codigo_barra, precio, cantidad, id_rubro,id_marca});
            await nuevo_producto.save();
            mensajes.push({text:'Producto guardado exitosamente'});
            res.render('producto/todos',{mensajes});
        }
    }
});

router.get('/producto/detalle/:id',async (req, res)=>{
    const producto  = await Producto.findById(req.params.id);
    res.render('producto/detalle',{producto});
});

router.post('/producto/carrito',isAuthenticated, async (req, res)=>{
    const {id_producto}= req.body;
    const id_usuario = req.user.id;
    const verificacion = await Venta.findOne({id_usuario:id_usuario, estado:'carrito'}); // y estado = carrito
    var monto = 0;
    if(verificacion){  //corregir esto
        if(verificacion.estado=='carrito'){
            var id_venta=verificacion.id;
            monto=verificacion.monto;
        }else{
            res.redirect('/');
        }
    }else{
        const estado='carrito';
        const new_venta = await new Venta({estado, id_usuario, monto});
        await new_venta.save();
        var id_venta=new_venta.id;
    }
    const verificacion2 = await VentaProducto.findOne({id_venta:id_venta,id_producto:id_producto}); //si ya hay este producto en el carrito
    if(verificacion2){
        const cantidad=verificacion2.cantidad+1;
        const precio_venta= verificacion2.precio_venta;
        id_ventaPorducto=verificacion2._id;
        await VentaProducto.findByIdAndDelete(id_ventaPorducto);
        const new_ventaProducto = await new VentaProducto({id_venta, id_producto, precio_venta, cantidad});
        await new_ventaProducto.save();
        monto = monto + precio_venta;
        if(verificacion){
            await Venta.findByIdAndUpdate(id_venta,{monto});
        }else{
            await Venta.findByIdAndUpdate(id_venta,{monto});
        }
    }else{
        const producto = await Producto.findById(id_producto);
        const precio_venta = producto.precio;
        const cantidad = 1;
        monto = monto+precio_venta;  
        if(verificacion){
            await Venta.findByIdAndUpdate(id_venta,{monto});
        }else{
            await Venta.findByIdAndUpdate(id_venta,{monto});
        }
        const new_ventaProducto = await new VentaProducto({id_venta, id_producto, precio_venta, cantidad});
        new_ventaProducto.save();
    }
    res.redirect('/usuario/carrito');
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