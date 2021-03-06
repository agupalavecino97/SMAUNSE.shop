const mongoose = require('mongoose');
const {Schema}= mongoose;

const MarcaSchema = new Schema({
    nombre: {type: String, required:true},
    descripcion: {type: String, required:true},
    estado: {type: Boolean, default:'true'},
    fecha: {type: Date,default: Date.now} 
});
module.exports = mongoose.model('Marca',MarcaSchema);