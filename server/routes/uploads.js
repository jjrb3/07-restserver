
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload());

app.put('/upload', function(req, res) {

    if (Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                success: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo,
        nombreCortado = archivo.name.split('.'),
        extension = nombreCortado[nombreCortado.length - 1];


    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];


    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            success: false,
            err: {
                message: 'La extensiones permitidas son ' + extensionesValidas.join(', ')
            }
        });
    }


    // Use the mv() method to place the file somewhere on your server
    archivo.mv('uploads/filename.jpg', (err) => {

        if (err)
            return res.status(500).json({
                success: false,
                err
            });

        res.json({
            success: true,
            message: 'Imagen subida correctamente'
        });
    });
});


module.exports = app;