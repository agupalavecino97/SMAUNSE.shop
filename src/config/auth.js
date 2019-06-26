const helpers = {};

helpers.isAuthenticated =(req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/usuario/login'); 
        req.flash('err_msg','No autorizado');
    }
};
module.exports = helpers;