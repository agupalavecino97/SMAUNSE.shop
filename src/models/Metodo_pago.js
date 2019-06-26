const mongoose = require('mongoose');
const {Schema}= mongoose;

const Metodo_pagoSchema = new Schema({
    numero_tarjeta: {type: Number, required:true},
    vencimiento: {type: Number, required:true},
    cuotas: {type: Number, required:true},
    id_venta: {type: String, required:true} 
});
module.exports = mongoose.model('Metodo_pago',Metodo_pagoSchema);