const mongoose = require('mongoose');
const {Schema}= mongoose;

const RubroSchema = new Schema({
    nombre: {type: String, required:true},
    descripcion: {type: String, required:true},
    estado: {type: Boolean, default:'true'},
    id_servicio: {type:String, required:true},
    fecha: {type: Date,default: Date.now} 
});
module.exports = mongoose.model('Rubro',RubroSchema);