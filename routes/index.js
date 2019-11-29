var express = require('express');
var router = express.Router();
var tesseractjs = require('node-tesseract-ocr');
var dotenv = require('dotenv');
var path = require('path')
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
dotenv.config()
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Image = require('../models/model');
var mongoURI = 'mongodb://localhost:27017/ocr_summariser';
var fs = require('fs');
// Create mongo connection
const conn = mongoose.createConnection(mongoURI);
const { spawn } = require('child_process');

conn.once('open', () => {});

var title = "OCR-Summariser";
//for output of summary
var final = {}

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);  
  gfs.collection('uploads');
});

// Create storage engine
var storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
      console.log(file)
    if(file){
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
    else console.log()
}
});

var upload = multer({ storage });
    /* GET home page. */
router.get('/', function(req, res, next) {
    var data = {}
    var image = {}
    console.log(data, image)
    res.render('index', { title: title, subject: "Save Your Time", summary: data, image: image });
});

//Use of async function to execute according to a promise
router.post('/summarise', upload.single('file'), async function(req, res, next) {
    var image = new Image();
    image.image = req.file.filename;
    await image.save(function(err) { //await
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
    // console.log(image);
    // console.log(__dirname);
    await tesseractjs //await
        .recognize(__dirname + '/../public/uploads/file_for_summary' + path.extname(req.file.originalname), config)
        .then(text => {
            var image = __dirname + '/../public/uploads/file_for_summary' + path.extname(req.file.originalname);
            const process = spawn('python', ['./text_summarisation.py', text]);
            process.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
                console.log(image)
                res.render('output', { title: title, subject: "The Summary", summary: data, image: image });
            });

            process.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
            });
        })
        .catch(err => {
            console.log('ERROR:', err)
        })
});
module.exports = router;