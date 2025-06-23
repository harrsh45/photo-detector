import multer from 'multer';
import path from 'path';
import fs from 'fs';

console.log('=== INITIALIZING LOCAL UPLOAD MIDDLEWARE ===');

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
console.log('Upload directory path:', uploadDir);

try {
  if (!fs.existsSync(uploadDir)) {
    console.log('Upload directory does not exist, creating it...');
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Upload directory created successfully');
  } else {
    console.log('Upload directory already exists');
  }
} catch (dirError) {
  console.error('Error creating upload directory:', dirError);
  console.error('Directory error stack:', dirError.stack);
  throw dirError; // This is critical, so we rethrow
}

// Configure local storage
console.log('Configuring local storage...');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Setting destination for file:', file.originalname);
    console.log('Destination directory:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log('Generating filename for:', file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const newFilename = file.fieldname + '-' + uniqueSuffix + ext;
    console.log('Generated filename:', newFilename);
    cb(null, newFilename);
  }
});
console.log('Local storage configured successfully');

// File filter
const fileFilter = (req, file, cb) => {
  console.log('=== LOCAL FILE FILTER CALLED ===');
  console.log('File received:', file.originalname);
  console.log('File mimetype:', file.mimetype);
  console.log('File size (if available):', file.size);
  
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    console.log('File accepted: Valid image or video type');
    cb(null, true);
  } else {
    console.log('File rejected: Invalid file type');
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

// Create multer instance
console.log('Creating local multer upload instance...');
const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

console.log('Local multer upload instance created successfully');
console.log('=== LOCAL UPLOAD MIDDLEWARE INITIALIZED ===');

export default upload;