const mongoose = require('mongoose');
const {Schema}= mongoose;

const VentaProductoSchema = new Schema({
    id_venta: {type: String, required:true},
    id_producto: {type: String, required:true},
    precio_venta: {type: Number, required:true},
    cantidad: {type: Number, required:true}
});
module.exports = mongoose.model('VentaProducto',VentaProductoSchema);