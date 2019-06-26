const mongoose = require('mongoose');
const {Schema}= mongoose;
const bcrypt = require('bcryptjs');

const UsuarioSchema = new Schema({
    nombre: {type: String, required:true},
    apellido: {type: String, required:true},
    dni: {type: Number, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    prioridad: {type: Boolean,default:'false'},
    direccion: {type: String, required:true},
    estado: {type: Boolean, default:'true'},
    fecha: {type: Date,default: Date.now} 
});

UsuarioSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };
  
UsuarioSchema.methods.comparePassword= function (password) {
    return bcrypt.compareSync(password, this.password);
  };
module.exports = mongoose.model('Usuario',UsuarioSchema);