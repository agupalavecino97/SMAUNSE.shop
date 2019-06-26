const mongoose = require('mongoose');
const {Schema}= mongoose;

const CarritoSchema = new Schema({
    id_producto: {type: String, required:true},
    id_usuario: {type: String, required:true},
    fecha: {type: Date,default: Date.now} 
});
module.exports = mongoose.model('Carrito',CarritoSchema);