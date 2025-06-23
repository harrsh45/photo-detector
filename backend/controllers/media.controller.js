import { validationResult } from 'express-validator';
import * as mediaService from '../services/media.services.js';

/**
 * Controller for uploading media
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadMediaController = async (req, res) => {
    console.log('=== UPLOAD MEDIA CONTROLLER START ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('Request user:', req.user);
    
    try {
        console.log('Validating request...');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array(), text: "nhk" });
        }

        console.log('Checking for file...');
        if (!req.file) {
            console.log('No file found in request');
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        // console.log(upload.single)
        console.log("Uploaded File Details:", JSON.stringify(req.file, null, 2)); // full object with formatting
        console.log('File path/url:', req.file.path);
        console.log('File url:', req.file.url);
        console.log('File mimetype:', req.file.mimetype);
        
        const fileUrl = req.file.path || req.file.url; // supports both local & cloudinary
        console.log('Final fileUrl:', fileUrl);

        console.log('Determining media type...');
        let { type } = req.body;
        console.log('Type from request body:', type);
        
        if (!type) {
            console.log('No type provided, determining from mimetype...');
            if (req.file.mimetype.startsWith('image/')) {
                type = 'image';
                console.log('Determined type as image from mimetype');
            } else if (req.file.mimetype.startsWith('video/')) {
                type = 'video';
                console.log('Determined type as video from mimetype');
            } else {
                console.log('Invalid file type:', req.file.mimetype);
                return res.status(400).json({
                    success: false,
                    message: 'Uploaded file must be an image or video'
                });
            }
        }

        console.log('Checking user authentication...');
        if (!req.user) {
            console.log('User not authenticated');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        console.log('User object:', JSON.stringify(req.user, null, 2));
        const userId = req.user.id || req.user._id || req.user.email || req.user.username;
        console.log('Extracted userId:', userId);

        console.log('Creating media in database...');
        console.log('Media data being sent to service:', { fileUrl, type, userId });
        
        const media = await mediaService.createMedia({
            fileUrl,
            type,
            userId
        });

        console.log('Media created successfully:', JSON.stringify(media, null, 2));
        res.status(201).json({
            success: true,
            data: media
        });
        console.log('=== UPLOAD MEDIA CONTROLLER END ===');

    } catch (error) {
        console.error('=== ERROR IN UPLOAD MEDIA CONTROLLER ===');
        console.error('Error object:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
            text: "hhh"
        });
        console.error('=== UPLOAD MEDIA CONTROLLER ERROR END ===');
    }
};


/**
 * Controller for getting user's media
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserMediaController = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming auth middleware sets req.user

        // Get user's media
        const media = await mediaService.getUserMedia(userId);

        res.status(200).json({
            success: true,
            count: media.length,
            data: media
        });
    } catch (error) {
        console.error('Error in getUserMediaController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

/**
 * Controller for getting a single media by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getMediaByIdController = async (req, res) => {
    try {
        const mediaId = req.params.id;

        // Get media by ID
        const media = await mediaService.getMediaById(mediaId);

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Media not found'
            });
        }

        // Check if the media belongs to the user
        if (media.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this media'
            });
        }

        res.status(200).json({
            success: true,
            data: media
        });
    } catch (error) {
        console.error('Error in getMediaByIdController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

/**
 * Controller for deleting media
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteMediaController = async (req, res) => {
    try {
        const mediaId = req.params.id;
        const userId = req.user.id; // Assuming auth middleware sets req.user

        // Delete media
        const result = await mediaService.deleteMedia(mediaId, userId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Media not found or not authorized to delete'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Media deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteMediaController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

/**
 * Controller for filtering media by AI generation status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getMediaByAIStatusController = async (req, res) => {
    try {
        const isAIGenerated = req.query.isAIGenerated === 'true';
        const userId = req.user.id; // Assuming auth middleware sets req.user

        // Get media filtered by AI status
        const media = await mediaService.getMediaByAIStatus(isAIGenerated, userId);

        res.status(200).json({
            success: true,
            count: media.length,
            data: media
        });
    } catch (error) {
        console.error('Error in getMediaByAIStatusController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

/**
 * Controller for searching media by tags
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const searchMediaByTagsController = async (req, res) => {
    try {
        // Extract tags from query (comma-separated)
        const tags = req.query.tags.split(',').map(tag => tag.trim());
        const userId = req.user.id; // Assuming auth middleware sets req.user

        if (!tags || tags.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No tags provided for search'
            });
        }

        // Search media by tags
        const media = await mediaService.searchMediaByTags(tags, userId);

        res.status(200).json({
            success: true,
            count: media.length,
            data: media
        });
    } catch (error) {
        console.error('Error in searchMediaByTagsController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};