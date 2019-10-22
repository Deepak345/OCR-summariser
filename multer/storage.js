var multer = require('multer');
var path = require('path');

//for multer storage and uploads
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'public/uploads');
    },
    filename: function(req, file, callback) {
        callback(null, 'file_for_summary'+ path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

module.exports = upload;