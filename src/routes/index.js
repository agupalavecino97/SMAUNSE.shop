const express = require('express');
const router = express.Router();

router.get('/',(req, res) =>{
    const mensajes = req.params.mensajes;
    res.render('index',{mensajes});
});

router.get('/aboutUs',(req, res) =>{
    res.render('aboutUs');
});
module.exports = router;