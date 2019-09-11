var express = require('express');
var router = express.Router();
var tesseract = require('node-tesseract')
var tesseractjs = require('node-tesseract-ocr');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'OCR-summeriser' });
});

router.post('/summarise', function(req, res, next) {
    console.log(req.body.name);
    console.log(req.body.filename);
    var options = {
        l: 'eng'
    };

    //for node-tesseract-ocr package
    tesseractjs
        .recognize(req.body.filename, options)
        .then(text => {
            console.log('Result:', text)
        })
        .catch(err => {
            console.log('error:', err)
        })

    //for node-tessseract package
    tesseract
        .process(req.body.filename, options)
        .then(text => {
            console.log('Result:', text)
        })
        .catch(err => {
            console.log('error:', err)
        })
});


module.exports = router;