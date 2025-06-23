
import axios from 'axios';
import crypto from 'crypto';

/**
 * Detects if an image is AI-generated using Sightengine API
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Promise<Object>} - Detection results including isAIGenerated and confidence score
 */
export const detectAIGeneratedImage = async (imageUrl) => {
    console.log('=== DETECT AI GENERATED IMAGE START ===');
    console.log('Image URL received:', imageUrl);
    console.log('API User:', process.env.SIGHTENGINE_API_USER ? 'Set' : 'Not set');
    console.log('API Secret:', process.env.SIGHTENGINE_API_SECRET ? 'Set' : 'Not set');
    
    try {
        // This is a placeholder for the actual API call
        // You'll need to sign up for Sightengine and get API credentials
        console.log('Preparing to call Sightengine API...');
        
        try {
            console.log('Making API request to Sightengine...');
            const response = await axios.get('https://api.sightengine.com/1.0/check.json', {
                params: {
                    'url': imageUrl,
                    'models': 'genai',
                    'api_user': process.env.SIGHTENGINE_API_USER,
                    'api_secret': process.env.SIGHTENGINE_API_SECRET,
                }
            });
            
            console.log('Sightengine API response received');
            console.log('Response status:', response.status);
            console.log('Response data:', JSON.stringify(response.data, null, 2));
            
            // Extract the AI generation probability
            if (response.data && response.data.type && response.data.type.ai_generated !== undefined) {
                const aiGeneratedProbability = response.data.type.ai_generated;
                console.log('AI generated probability:', aiGeneratedProbability);
                
                const result = {
                    isAIGenerated: aiGeneratedProbability > 0.70, // Consider it AI-generated if probability > 70%
                    confidence: aiGeneratedProbability,
                    rawResponse: response.data
                };
                
                console.log('Detection result:', JSON.stringify(result, null, 2));
                console.log('=== DETECT AI GENERATED IMAGE END ===');
                return result;
            } else {
                console.log('Unexpected API response format, missing ai_generated property');
                console.log('Returning default values');
                
                const result = {
                    isAIGenerated: false,
                    confidence: 0,
                    rawResponse: response.data || {}
                };
                
                console.log('Default detection result:', JSON.stringify(result, null, 2));
                console.log('=== DETECT AI GENERATED IMAGE END ===');
                return result;
            }
        } catch (apiError) {
            console.error('Error calling Sightengine API:', apiError.message);
            console.error('API error response:', apiError.response?.data);
            console.error('API error status:', apiError.response?.status);
            console.log('Falling back to default values due to API error');
            
            const result = {
                isAIGenerated: false,
                confidence: 0,
                rawResponse: {},
                error: apiError.message
            };
            
            console.log('Default detection result:', JSON.stringify(result, null, 2));
            console.log('=== DETECT AI GENERATED IMAGE END ===');
            return result;
        }
    } catch (error) {
        console.error('=== ERROR IN DETECT AI GENERATED IMAGE ===');
        console.error('Error object:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=== DETECT AI GENERATED IMAGE ERROR END ===');
        throw error;
    }
};

/**
 * Analyzes image content using Clarifai API
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Promise<Object>} - Analysis results including tags and other metadata
 */
export const analyzeImageContent = async (imageUrl) => {
    console.log('=== ANALYZE IMAGE CONTENT (CLARIFAI) START ===');
    console.log('Image URL received:', imageUrl);
    console.log('Clarifai API Key:', process.env.CLARIFAI_API_KEY ? 'Set' : 'Not set');
    
    try {
        // This is a placeholder for the actual API call
        // You'll need to sign up for Clarifai and get API credentials
        console.log('Using placeholder implementation for Clarifai analysis');
        
        
        try {
            console.log('Making API request to Clarifai...');
            const response = await axios.post(
                'https://api.clarifai.com/v2/models/general-image-recognition/outputs',
                {
                    "user_app_id": {
                        "user_id": "clarifai",
                        "app_id": "main"
                    },
                    "inputs": [
                        {
                            "data": {
                                "image": {
                                    "url": `${imageUrl}`
                                }
                            }
                        }
                    ]
                },
                {
                    headers: {
                        'Authorization': `Key ${process.env.CLARIFAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Clarifai API response received');
            console.log('Response status:', response.status);
            
            // Extract tags from concepts
            const concepts = response.data.outputs[0].data.concepts;
            const tags = concepts.map(concept => concept.name);
            
            const result = {
                tags,
                objects: concepts.filter(concept => concept.value > 0.9), // High confidence concepts
                safeSearch: {}, // Clarifai has separate moderation models if needed
                rawResponse: response.data
            };
            
            console.log('Analysis result:', JSON.stringify(result, null, 2));
            console.log('=== ANALYZE IMAGE CONTENT (CLARIFAI) END ===');
            return result;
        } catch (apiError) {
            console.error('Error calling Clarifai API:', apiError.message);
            console.error('API error response:', apiError.response?.data);
            console.error('API error status:', apiError.response?.status);
            console.log('Falling back to placeholder values due to API error');
        }
        
        
        // Placeholder response for development
        // const result = {
        //     tags: ['sample', 'placeholder', 'tags'],
        //     objects: [],
        //     safeSearch: {},
        //     rawResponse: {}
        // };
        
        console.log('Returning placeholder result:', JSON.stringify(result, null, 2));
        console.log('=== ANALYZE IMAGE CONTENT (CLARIFAI) END ===');
        return result;
    } catch (error) {
        console.error('=== ERROR IN ANALYZE IMAGE CONTENT (CLARIFAI) ===');
        console.error('Error object:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=== ANALYZE IMAGE CONTENT (CLARIFAI) ERROR END ===');
        throw error;
    }
};

/**
 * Alternative image analysis using DeepAI API
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Promise<Object>} - Analysis results including tags
 */
export const analyzeImageWithDeepAI = async (imageUrl) => {
    console.log('=== ANALYZE IMAGE WITH DEEPAI START ===');
    console.log('Image URL received:', imageUrl);
    console.log('DeepAI API Key:', process.env.DEEPAI_API_KEY ? 'Set' : 'Not set');
    console.log('USE_DEEPAI flag:', process.env.USE_DEEPAI);
    
    try {
        // This is a placeholder for the actual API call
        // You'll need to sign up for DeepAI and get API credentials
        console.log('Using placeholder implementation for DeepAI analysis');
        
        /*
        try {
            console.log('Making API request to DeepAI...');
            const response = await axios.post(
                'https://api.deepai.org/api/image-classification',
                { image: imageUrl },
                {
                    headers: {
                        'api-key': process.env.DEEPAI_API_KEY,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            
            console.log('DeepAI API response received');
            console.log('Response status:', response.status);
            console.log('Response data:', JSON.stringify(response.data, null, 2));
            
            const result = {
                tags: response.data.output || [],
                rawResponse: response.data
            };
            
            console.log('Analysis result:', JSON.stringify(result, null, 2));
            console.log('=== ANALYZE IMAGE WITH DEEPAI END ===');
            return result;
        } catch (apiError) {
            console.error('Error calling DeepAI API:', apiError.message);
            console.error('API error response:', apiError.response?.data);
            console.error('API error status:', apiError.response?.status);
            console.log('Falling back to placeholder values due to API error');
        }
        */
        
        // Placeholder response for development
        const result = {
            tags: ['deepai', 'sample', 'tags'],
            rawResponse: {}
        };
        
        console.log('Returning placeholder result:', JSON.stringify(result, null, 2));
        console.log('=== ANALYZE IMAGE WITH DEEPAI END ===');
        return result;
    } catch (error) {
        console.error('=== ERROR IN ANALYZE IMAGE WITH DEEPAI ===');
        console.error('Error object:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=== ANALYZE IMAGE WITH DEEPAI ERROR END ===');
        throw error;
    }
};

/**
 * Analyzes video content using Cloudinary's Google Automatic Video Tagging
 * @param {string} videoUrl - URL of the video to analyze
 * @returns {Promise<Object>} - Analysis results including tags and other metadata
 */
export const analyzeVideoContent = async (videoUrl) => {
    console.log('=== ANALYZE VIDEO CONTENT (CLOUDINARY) START ===');
    console.log('Video URL received:', videoUrl);
    console.log('Cloudinary credentials:', 
        process.env.CLOUDINARY_CLOUD_NAME ? 'Cloud Name Set' : 'Cloud Name Not set',
        process.env.CLOUDINARY_API_KEY ? 'API Key Set' : 'API Key Not set',
        process.env.CLOUDINARY_API_SECRET ? 'API Secret Set' : 'API Secret Not set');
    
    try {
        // Extract the public ID from the Cloudinary URL if it's a Cloudinary URL
        // Otherwise, we'll need to upload the video first (not implemented here)
        let publicId = '';
        
        if (videoUrl.includes('cloudinary.com')) {
            // Extract public ID from Cloudinary URL
            const urlParts = videoUrl.split('/');
            const fileNameWithExtension = urlParts[urlParts.length - 1];
            publicId = fileNameWithExtension.split('.')[0]; // Remove extension
            console.log('Extracted public ID from URL:', publicId);
        } else {
            console.log('Not a Cloudinary URL, would need to upload first');
            // For simplicity, we'll return placeholder data
            return {
                tags: ['video', 'content', 'placeholder'],
                objects: [],
                safeSearch: {},
                rawResponse: {}
            };
        }
        
        console.log('Making API request to Cloudinary for video tagging...');
        
        // Construct the Cloudinary API URL for resource details
        // This will include the Google Video Tagging information if it was applied
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        
        const timestamp = Math.floor(Date.now() / 1000);
        
        const signature = crypto
            .createHash('sha1')
            .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
            .digest('hex');
        
        const response = await axios.get(
            `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload/${publicId}`,
            {
                params: {
                    timestamp,
                    api_key: apiKey,
                    signature
                }
            }
        );
        
        console.log('Cloudinary API response received');
        console.log('Response status:', response.status);
        
        // Check if Google Video Tagging data exists
        let tags = [];
        let objects = [];
        
        if (response.data && response.data.tags) {
            tags = response.data.tags;
            console.log('Tags found in response:', tags);
        }
        
        // Check for detailed Google Video Tagging data in the info field
        if (response.data && response.data.info && 
            response.data.info.categorization && 
            response.data.info.categorization.google_video_tagging) {
            
            const taggingData = response.data.info.categorization.google_video_tagging;
            
            if (taggingData.status === 'complete' && taggingData.data) {
                // Extract high-confidence objects
                objects = taggingData.data
                    .filter(item => item.confidence > 0.8) // Only high confidence items
                    .map(item => ({
                        name: item.tag,
                        categories: item.categories || [],
                        confidence: item.confidence,
                        timeframe: {
                            start: item.start_time_offset,
                            end: item.end_time_offset
                        }
                    }));
                
                // Add any tags not already included
                const additionalTags = taggingData.data
                    .filter(item => item.confidence > 0.6) // Lower threshold for tags
                    .map(item => item.tag);
                
                // Combine and deduplicate tags
                tags = [...new Set([...tags, ...additionalTags])];
            }
        }
        
        const result = {
            tags,
            objects,
            safeSearch: {}, // Cloudinary has separate moderation if needed
            rawResponse: response.data
        };
        
        console.log('Analysis result:', JSON.stringify(result, null, 2));
        console.log('=== ANALYZE VIDEO CONTENT (CLOUDINARY) END ===');
        return result;
    } catch (apiError) {
        console.error('Error calling Cloudinary API:', apiError.message);
        console.error('API error response:', apiError.response?.data);
        console.error('API error status:', apiError.response?.status);
        console.log('Falling back to placeholder values due to API error');
        
        // Return placeholder data in case of error
        return {
            tags: ['video', 'content', 'error'],
            objects: [],
            safeSearch: {},
            rawResponse: {},
            error: apiError.message
        };
    }
};