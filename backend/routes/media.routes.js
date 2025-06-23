import express from 'express';
import { body, query, param } from 'express-validator';
import { authUser as authenticate } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import {
    uploadMediaController,
    getUserMediaController,
    getMediaByIdController,
    deleteMediaController,
    getMediaByAIStatusController,
    searchMediaByTagsController
} from '../controllers/media.controller.js';

const router = express.Router();

// Route for uploading media
// POST /media/upload
router.post(
    '/upload',
    authenticate, // Add authentication middleware
    upload.single('file'), // Use upload middleware to handle file upload
    [
        body('type').isIn(['image', 'video'])
    ],
    uploadMediaController
);

// Route for getting user's media
// GET /media
router.get(
    '/',
    authenticate,
    getUserMediaController
);

// Route for getting a single media by ID
// GET /media/:id
router.get(
    '/:id',
    authenticate,
    [
        param('id').isMongoId().withMessage('Invalid media ID')
    ],
    getMediaByIdController
);

// Route for deleting media
// DELETE /media/:id
router.delete(
    '/:id',
    authenticate,
    [
        param('id').isMongoId().withMessage('Invalid media ID')
    ],
    deleteMediaController
);

// Route for filtering media by AI generation status
// GET /media/filter/ai?isAIGenerated=true|false
router.get(
    '/filter/ai',
    authenticate,
    [
        query('isAIGenerated').isBoolean().withMessage('isAIGenerated must be a boolean')
    ],
    getMediaByAIStatusController
);

// Route for searching media by tags
// GET /media/search/tags?tags=tag1,tag2,tag3
router.get(
    '/search/tags',
    authenticate,
    [
        query('tags').notEmpty().withMessage('Tags are required for search')
    ],
    searchMediaByTagsController
);

export default router;