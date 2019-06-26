const passport = require('passport'); //este modulo te da metodos para autenticas a ususarios mediante facebook, twitter, etc 
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/Usuario');
//es para poder deficnir una nueva estrategia de autenticacion, que parametros va a usar el usuario para auteticarse

passport.use('local-registro', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    nombreField: 'nombre',
    apellidoField: 'apellido',
    dniField: 'dni',
    direccionField: 'direccion',
    passReqToCallback: true
  }, async (req, email, password, nombre, apellido, dni, direccion, confimarpassword, done) => {
    const user = await User.findOne({email: email});
    if(user) {
      return done(null, false, req.flash('signupMessage', '<El email ya esta registrado.'));
    }
    // if(passport!=confimarpassword){
    //   done(null, false, req.flash('signupMessage', '<La contraseña no es igual a la confirmacion.'));
    // }
      const newUser = new User({nombre,apellido,email,password,direccion,dni});
      new_password = newUser.encryptPassword(password);
      newUser.password = new_password;
      await newUser.save();
      done(null, newUser);  
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    const user = await User.findOne({email: email});
    if(!user) {
      return done(null, false, req.flash('signinMessage', 'Usuario no encontrado'));
    }
    if(!user.comparePassword(password)) { 
      return done(null, false, req.flash('signinMessage', 'contraseña incorrecta'));
    }
    return done(null, user);
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });