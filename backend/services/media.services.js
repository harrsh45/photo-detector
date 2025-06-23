import Media from '../model/media.model.js';
import { detectAIGeneratedImage, analyzeImageContent, analyzeImageWithDeepAI, analyzeVideoContent } from './ai.services.js';

/**
 * Creates a new media entry in the database and analyzes it for AI generation
 * @param {Object} mediaData - Media data including fileUrl, type, and userId
 * @returns {Promise<Object>} - Created media document
 */
export const createMedia = async (mediaData) => {
    console.log('=== CREATE MEDIA SERVICE START ===');
    console.log('Media data received:', JSON.stringify(mediaData, null, 2));
    
    try {
        const { fileUrl, type, userId } = mediaData;
        console.log('Extracted fileUrl:', fileUrl);
        console.log('Extracted type:', type);
        console.log('Extracted userId:', userId);
        
        // Initialize media object
        const mediaObject = {
            fileUrl,
            type,
            userId, // Use the provided userId
            tags: [],
            isAIGenerated: false
        };
        console.log('Initialized media object:', JSON.stringify(mediaObject, null, 2));
        
        // Analyze the media based on its type
        console.log('Starting media analysis based on type:', type);
        if (type === 'image') {
            console.log('Processing image...');
            
            // Detect if the image is AI-generated
            console.log('Detecting if image is AI-generated...');
            console.log('File URL being sent to AI detection:', fileUrl);
            try {
                const aiDetectionResult = await detectAIGeneratedImage(fileUrl);
                console.log('AI detection result:', JSON.stringify(aiDetectionResult, null, 2));
                mediaObject.isAIGenerated = aiDetectionResult.isAIGenerated;
            } catch (aiDetectionError) {
                console.error('Error in AI detection:', aiDetectionError);
                console.error('AI detection error stack:', aiDetectionError.stack);
                console.log('Continuing with isAIGenerated set to false');
            }
            
            // Analyze image content to get tags
            console.log('Analyzing image content to get tags...');
            // You can choose between Clarifai and DeepAI for image analysis
            // Default to Clarifai, but you can switch to DeepAI by setting an environment variable
            let analysisResult;
            try {
                if (process.env.USE_DEEPAI === 'true') {
                    console.log('Using DeepAI for image analysis');
                    analysisResult = await analyzeImageWithDeepAI(fileUrl);
                } else {
                    console.log('Using Clarifai for image analysis');
                    analysisResult = await analyzeImageContent(fileUrl); // Clarifai
                }
                console.log('Image analysis result:', JSON.stringify(analysisResult, null, 2));
                mediaObject.tags = analysisResult.tags;
            } catch (analysisError) {
                console.error('Error in image analysis:', analysisError);
                console.error('Image analysis error stack:', analysisError.stack);
                console.log('Continuing with empty tags');
            }
        } else if (type === 'video') {
            console.log('Processing video...');
            
            // For videos, use video analysis service
            try {
                console.log('Analyzing video content...');
                const videoAnalysis = await analyzeVideoContent(fileUrl);
                console.log('Video analysis result:', JSON.stringify(videoAnalysis, null, 2));
                mediaObject.isAIGenerated = videoAnalysis.isAIGenerated;
                mediaObject.tags = videoAnalysis.tags;
            } catch (videoAnalysisError) {
                console.error('Error in video analysis:', videoAnalysisError);
                console.error('Video analysis error stack:', videoAnalysisError.stack);
                console.log('Continuing with default values');
            }
        }
        
        // Create and save the media document
        console.log('Creating new Media document with:', JSON.stringify(mediaObject, null, 2));
        const media = new Media(mediaObject);
        
        console.log('Saving media to database...');
        try {
            await media.save();
            console.log('Media saved successfully with ID:', media._id);
        } catch (saveError) {
            console.error('Error saving media to database:', saveError);
            console.error('Database error code:', saveError.code);
            console.error('Database error message:', saveError.message);
            console.error('Database error stack:', saveError.stack);
            throw saveError; // Re-throw to be caught by the outer catch
        }
        
        console.log('=== CREATE MEDIA SERVICE END ===');
        return media;
    } catch (error) {
        console.error('=== ERROR IN CREATE MEDIA SERVICE ===');
        console.error('Error object:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=== CREATE MEDIA SERVICE ERROR END ===');
        throw error;
    }
};

/**
 * Retrieves all media entries for a specific user
 * @param {string} userId - User ID to filter media by
 * @returns {Promise<Array>} - Array of media documents
 */
export const getUserMedia = async (userId) => {
    try {
        return await Media.find({ userId }).sort({ uploadedAt: -1 });
    } catch (error) {
        console.error('Error getting user media:', error);
        throw error;
    }
};

/**
 * Retrieves a single media entry by ID
 * @param {string} mediaId - Media ID to retrieve
 * @returns {Promise<Object>} - Media document
 */
export const getMediaById = async (mediaId) => {
    try {
        return await Media.findById(mediaId);
    } catch (error) {
        console.error('Error getting media by ID:', error);
        throw error;
    }
};

/**
 * Deletes a media entry by ID
 * @param {string} mediaId - Media ID to delete
 * @param {string} userId - User ID for authorization check
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteMedia = async (mediaId, userId) => {
    try {
        // Ensure the media belongs to the user before deleting
        return await Media.findOneAndDelete({ _id: mediaId, userId });
    } catch (error) {
        console.error('Error deleting media:', error);
        throw error;
    }
};

/**
 * Retrieves media entries filtered by AI generation status
 * @param {boolean} isAIGenerated - Filter by AI generation status
 * @param {string} userId - User ID to filter media by
 * @returns {Promise<Array>} - Array of filtered media documents
 */
export const getMediaByAIStatus = async (isAIGenerated, userId) => {
    try {
        return await Media.find({ isAIGenerated, userId }).sort({ uploadedAt: -1 });
    } catch (error) {
        console.error('Error getting media by AI status:', error);
        throw error;
    }
};

/**
 * Searches media entries by tags
 * @param {Array<string>} tags - Array of tags to search for
 * @param {string} userId - User ID to filter media by
 * @returns {Promise<Array>} - Array of matching media documents
 */
export const searchMediaByTags = async (tags, userId) => {
    try {
        return await Media.find({ 
            tags: { $in: tags },
            userId 
        }).sort({ uploadedAt: -1 });
    } catch (error) {
        console.error('Error searching media by tags:', error);
        throw error;
    }
};
