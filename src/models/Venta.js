const mongoose = require('mongoose');
const {Schema}= mongoose;

const VentaSchema = new Schema({
    estado: {type: String, required:true},
    monto: {type: Number},
    porcentaje_descuento: {type: Number},
    id_formaDePago: {type: String,default:""},
    metodoDeEnvio: {type: String,default:""},
    direccion: {type: String,default:""},
    id_usuario: {type: String, required:true},
    fecha: {type: Date,default: Date.now} 
});
module.exports = mongoose.model('Venta',VentaSchema);