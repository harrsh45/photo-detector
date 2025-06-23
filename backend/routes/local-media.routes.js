import express from 'express';
import { body } from 'express-validator';
import { authUser as authenticate } from '../middleware/auth.middleware.js';
import upload from '../middleware/local-upload.middleware.js';
import { uploadMediaController } from '../controllers/media.controller.js';

const router = express.Router();

// Route for uploading media with local storage
// POST /local-media/upload
router.post(
    '/upload',
    authenticate, // Add authentication middleware
    upload.single('file'), // Use local upload middleware to handle file upload
    [
        body('type').optional().isIn(['image', 'video'])
    ],
    uploadMediaController
);

export default router;