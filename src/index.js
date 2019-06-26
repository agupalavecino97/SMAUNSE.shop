const express = require('express');
const path = require('path');
const expresshbs = require('express-handlebars');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');

//inicializaciones 
const app = express();
require('./database');
require('./config/passport');

//configuraciones

app.set('port',process.env.PORT || 3000);

//configurar ubicacion de las vistas
app.set('views',path.join(__dirname,'vistas'));


app.engine('.hbs',expresshbs({
    defaultLayout: 'main', 
    layoutsDir: path.join(app.get('views'),'layouts'),   
    partialsDir: path.join(app.get('views'),'partials'), 
    extname:'.hbs'
}))

app.set('view engine','.hbs');

//middleware

app.use(express.static(__dirname+'/public'));

app.use(express.urlencoded({extended: false})); //extended: false para solo aceptar los datos y no imagenes y eso 

app.use(methodOverride('_method')); //_method es un input para enviar los otros metodos que no son get y post

app.use(session({
    secret: 'misecreto',
    resave: false,
    saveUninitialized: false
  }));

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  


//variables globales 
app.use((req, res, next)=>{
    //para guardar una dato de manera global
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.signupMessage = req.flash('signupMessage');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.success_msg = req.flash('success_msg');
    app.locals.user = req.user;
    next();
});


//rutas
app.use(require('./routes/index'));
app.use(require('./routes/usuario'));
app.use(require('./routes/producto'));
app.use(require('./routes/marca'));
app.use(require('./routes/rubro'));
app.use(require('./routes/servicio'));

app.listen(app.get('port'),()=>{
    console.log('el servidor esta escuchando en el puerto', app.get('port'));
})