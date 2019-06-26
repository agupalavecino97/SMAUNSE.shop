const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/SMAUNSE-shop',{
    useCreateIndex: true,
    useNewUrlParser: true,
    userFindAndModify: false
})
    .then(db => console.log('db is connected'))
    .catch(err => console.error(err));