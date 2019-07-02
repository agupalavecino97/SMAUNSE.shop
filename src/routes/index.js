const express = require('express');
const router = express.Router();

router.get('/', async (req, res) =>{
    res.render('index');
});

router.get('/aboutUs',(req, res) =>{
    res.render('aboutUs');
});
module.exports = router;