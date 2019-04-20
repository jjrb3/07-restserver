
const express = require('express');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');



// ============================
// Obtener productos
// ============================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
        desde = Number(desde);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }

            res.status(201).json({
                success: true,
                productos: productos
            });
        });
});


// ============================
// Obtener producto por ID
// ============================
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            success: true,
            producto: productoDB
        });

    });
});


// ============================
// Buscar productos
// ============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino,
        regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }

            res.json({
                success: true,
                productos: productoDB
            });
        });
});


// ============================
// Crear producto
// ============================
app.post('/producto/', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    });


    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }

        res.status(201).json({
            success: true,
            producto: productoDB
        });
    });
});


// ============================
// Actualizar producto
// ============================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id,
        body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }


        if (!productoDB) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }

            res.json({
                success: true,
                producto: productoGuardado
            });
        });
    });
});


// ============================
// Borrar producto
// ============================
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }


        if (!productoDB) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }

            res.json({
                success: true,
                producto: productoBorrado,
                message: 'Producto borrado'
            })
        });
    });
});


module.exports = app;