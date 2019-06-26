const mongoose = require('mongoose');
const {Schema}= mongoose;

const ProductoSchema = new Schema({
    nombre: {type: String, required:true},
    codigo_barra: {type: Number, required:true},
    precio: {type: Number, required:true},
    cantidad: {type: Number, required:true},
    habilitado: {type: Boolean,default:'true'},
    //eliminado: {type: String,default:'cliente'},???
    id_rubro: {type: String, required:true},
    id_marca: {type: String, required:true},
    fecha: {type: Date,default: Date.now} 
});
module.exports = mongoose.model('Producto',ProductoSchema);