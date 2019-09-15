var express = require('express');
var router = express.Router();
// var tesseract = require('node-tesseract')
var tesseractjs = require('node-tesseract-ocr');
var dotenv = require('dotenv');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
dotenv.config()
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var upload = require('../multer/storage');
var Image = require('../models/model');
var mongoURI = 'mongodb://localhost:27017/ocr_summariser';
var fs = require('fs');
// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
    // Init stream
    // gfs = Grid(conn.db, mongoose.mongo);
    // gfs.collection('uploads');
    //console.log("collection created")
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'OCR-summeriser' });
});

//Use of async function to execute according to a promise
router.post('/summarise', upload.single('file'), async function(req, res, next) {
    var image = new Image();
    image.image = req.file.filename;
    await image.save(function(err) {  //await
        if (err) console.log(err);
        else {
            console.log("Successfuly Saved in Database");
        }
    });

//for node-tesseract-ocr package
    var config = {
        lang: "eng",
        oem: 1,
        psm: 3
    }
    console.log(image);
    console.log(__dirname);
    await tesseractjs //await 
    //folder access
    .recognize(__dirname + '/../public/uploads/file-' + req.file.originalname, config)
    //database access
        // .recognize(image.image, config)
        .then(text => {
            // console.log('Result:', text)
            
            //Save the output to a txt file inside public/output
            fs.writeFile(__dirname + '/../public/output/file-' + req.file.originalname + '.txt', text, function(err) {
            if(err) {
                return console.log(err);
                }
            res.send("The text of the image file is extracted and saved inside public/output/"+ req.file.originalname + '.txt');
         }); 
        })
        .catch(err => {
            console.log('error:', err)
        })
    // var config = {
    //     lang: "eng",
    //     oem: 1,
    //     psm: 3
    // }
    // Image.findOne({ image: 'file-' + req.file.originalname })
    //     .then(response => {
    //         console.log(response);
    //         //for node-tesseract-ocr package
    //         tesseractjs
    //         //folder access
    //             .recognize('../public/uploads/file-' + req.file.originalname, config)
    //             //database access
    //             // .recognize(response.image, config)
    //             .then(text => {
    //                 console.log('Result:', text)
    //             })
    //             .catch(err => {
    //                 console.log('error:', err)
    //             })
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
});

module.exports = router;