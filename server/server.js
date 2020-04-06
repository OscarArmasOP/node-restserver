require('./config/config');

const express = require('express');
const mongoose = require('mongoose');


const app = express();
app.use(require('./routes/usuario'));

const bodyParser = require('body-parser')

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true // Se agrega por collection.ensureIndex esta depreciada
}

//Cada peticion que nosotros hagamos siempre pasan por estas lineas (middleware)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Conexión a la BD
mongoose.connect(process.env.URLDB, mongooseOptions, (err, res) => {

    if (err) throw err;
    console.log('Base de datos ONLINE nene!!');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puertoo: ', process.env.PORT);
});