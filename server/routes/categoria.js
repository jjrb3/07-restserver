
const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }

            res.json({
                success: true,
                categorias
            });
        });
});


// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                success: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            success: true,
            categoria : categoriaDB
        })
    });
});


// ============================
// Crear nueva categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body,
        categoria = new Categoria({
           descripcion: body.descripcion,
           usuario: req.usuario._id
        });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                success: false,
                err
            });
        }


        res.json({
            success: true,
            categoria: categoriaDB
        });
    });
});


// ============================
// Actualizar categoria
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id,
        body = req.body,
        descCategoria = { descripcion: body.descripcion };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        res.json({
            success: true,
            categoria: categoriaDB
        });
    });
});


// ============================
// Eliminar categoria
// ============================
app.delete('/categoria/:id', [ verificaToken, verificaAdminRole ], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            success: true,
            message: 'Categoria eliminada'
        })
    });
});


module.exports = app;