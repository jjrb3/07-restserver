
const express = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();


app.get('/usuario', verificaToken, (req, res) => {

    let desde = (req.query.desde || 0),
        limite = req.query.limite || 5;


    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(Number(desde))
        .limit(Number(limite))
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    success: true,
                    cuantos: conteo,
                    usuarios

                })
            });
        });
});


app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        res.json({
            success: true,
            usuario: usuarioDB
        });
    });
});


app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Usuario.findByIdAndUpdate(id, body, {new: true}, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        res.json({
            success: true,
            usuario: usuarioDB
        });
    });
});


app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            success: true,
            usuario: usuarioBorrado
        });
    });
});


module.exports = app;