import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

console.log('=== INITIALIZING CLOUDINARY UPLOAD MIDDLEWARE ===');
console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set');
console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
console.log('Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');

// Configure Cloudinary
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log(process.env.CLOUDINARY_CLOUD_NAME)
  console.log('Cloudinary configuration applied successfully');
} catch (configError) {
  console.error('Error configuring Cloudinary:', configError);
  console.error('Cloudinary configuration error stack:', configError.stack);
}

// ✅ Cloudinary Storage Configuration
let cloudinaryStorage;
try {
  console.log('Setting up CloudinaryStorage...');
  cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'photo-detector',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'webm'],
      resource_type: 'auto'
    }
  });
  console.log('CloudinaryStorage configured successfully');
} catch (storageError) {
  console.error('Error creating CloudinaryStorage:', storageError);
  console.error('CloudinaryStorage error stack:', storageError.stack);
  throw storageError; // This is critical, so we rethrow
}

// ✅ File filter
const fileFilter = (req, file, cb) => {
  console.log('=== FILE FILTER CALLED ===');
  console.log('File received:', file.originalname);
  console.log('File mimetype:', file.mimetype);
  
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    console.log('File accepted: Valid image or video type');
    cb(null, true);
  } else {
    console.log('File rejected: Invalid file type');
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

// ✅ Multer instance with correct key
console.log('Creating multer upload instance...');
const upload = multer({
  storage: cloudinaryStorage, 
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

console.log('Multer upload instance created successfully');
console.log('=== CLOUDINARY UPLOAD MIDDLEWARE INITIALIZED ===');

export default upload;
