const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads/'); // Specify the upload folder
    },
    filename: function (req, file, cb) {
        console.log("file.fieldname",file.fieldname)
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, "dsjdksjds");
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
