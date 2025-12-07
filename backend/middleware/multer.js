const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const uploadsDir = path.join(__dirname, '..', 'uploads');

// Create uploads folder if it doesn't exist
fs.ensureDirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;
