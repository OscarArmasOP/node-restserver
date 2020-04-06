const express = require('express');
const Usuario = require('../models/usuario');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const bodyParser = require('body-parser')
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {



    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //Mostrar campos con exclusiones 
    //{} para filtrar
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //Contando los registros
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });


        });

});

//Crear usuarios
app.post('/usuario', function(req, res) {

    let body = req.body;
    //Grabando en nuestro esquema de usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    //Grabando en la BD de moongose nuestro esquema con la funcion save()
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;
        //Regresando el esquema que guardamos
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});


//Actualización del registro
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    //Filtrando lo que podremos actualizar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // delete body.password;
    // delete body.google;

    //Buscando y actualizando con un id de parametro de búsqueda
    //Corriendo las validaciones de nuestro esquema y mostrando el nuevo usuario
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //Mostrando usuario actializado
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    //--------------------------Eliminación fisica----------------------------------------------------
    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    });
*/

    //----------------------Eliminación logica------------------------------------------------
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //Mostrando usuario borrado
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});


module.exports = app;