var express = require('express');
var router = express.Router();
var tesseract = require('node-tesseract')
var tesseractjs = require('node-tesseract-ocr');
var dotenv = require('dotenv');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
dotenv.config()
var mongoose = require('mongoose');
var Image = require('../models/model');
var mongoURI = 'mongodb://localhost:27017/ocr_summariser';
// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);  
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
    });
  }
});

const upload = multer({ storage });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'OCR-summeriser' });
});

router.post('/summarise', upload.single('file'), function(req, res, next) {
    console.log(req.body.name);
    console.log(req.file);
    var image  = new Image();
    image.name = req.body.name;
    image.image = req.file.filename;
    image.save(function(err) {
        if(err) console.log(err);
        else console.log("Successfuly Saved in Database");
    });
    var options = {
        l: 'eng'
    };
    const config = {
        lang: 'eng',
        oem: 1,
        psm: 3
      }

    //for node-tesseract-ocr package
    tesseractjs
        .recognize('________/imagelocation', config) //give image location here
        .then(text => {
            console.log('Result:')
        })
        .catch(err => {
            console.log('error:', err)
        })

    //for node-tessseract package
    // tesseract
    //     .process(req.body.filename, options)
    //     .then(text => {
    //         console.log('Result:', text)
    //     })
    //     .catch(err => {
    //         console.log('error:', err)
    //     })
    // res.send("Success");
});

router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // If File exists this will get executed
      const readstream = gfs.createReadStream(file.filename);
      return readstream.pipe(res);
    });
  });
  
  
  
  
  router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if the input is a valid image or not
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // If the file exists then check whether it is an image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
        // console.log("SID")
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });


module.exports = router;