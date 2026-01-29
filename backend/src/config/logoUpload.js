// backend/src/config/logoUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Normalize the upload directory to use an absolute path correctly
const uploadDir = path.resolve(__dirname, '../../uploads/logos');
console.log('--- Multer Storage Initializing ---');
console.log('Target Upload Directory:', uploadDir);

// Check if directory exists, if not create it
try {
  if (!fs.existsSync(uploadDir)) {
    console.log('Upload directory does not exist, creating...');
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Upload directory created successfully');
  } else {
    console.log('Upload directory already exists');
  }

  // Check directory permissions
  fs.access(uploadDir, fs.constants.W_OK, (err) => {
    if (err) {
      console.error('No write permission to upload directory:', err);
    } else {
      console.log('Write permission is granted to upload directory');
    }
  });
} catch (err) {
  console.error('Error setting up upload directory:', err);
  throw err;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Saving file to:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = 'logo-' + uniqueSuffix + ext;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('Multer filtering file:', {
    originalname: file.originalname,
    mimetype: file.mimetype
  });

  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    console.error('File rejection:', { mimetype, extname, fileMime: file.mimetype });
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;