
import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import FormData from 'form-data';

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
 * Analyzes video content using Clarifai's General Model
 * @param {string} videoUrl - URL of the video to analyze
 * @returns {Promise<Object>} - Analysis results including tags and other metadata
 */
export const analyzeVideoContent = async (videoUrl) => {
    console.log('=== ANALYZE VIDEO CONTENT (CLARIFAI) START ===');
    console.log('Video URL received:', videoUrl);
    console.log('Clarifai API Key:', process.env.CLARIFAI_API_KEY ? 'Set' : 'Not set');
    
    try {
        // Initialize default result in case of errors
        let result = {
            tags: ['video', 'content'],
            objects: [],
            isAIGenerated: false,
            safeSearch: {},
            rawResponse: {},
            pendingAnalysis: false
        };
        
        console.log('Making API request to Clarifai for video analysis...');
        
        try {
            // Call Clarifai's Video API with the general-image-recognition model
            // Note: Clarifai uses the same model for both image and video analysis
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
                                "video": {
                                    "url": videoUrl
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
            
            console.log('Clarifai API response received successfully');
            console.log('Response status:', response.status);
            
            // Process the response data
            if (response.data && response.data.outputs && response.data.outputs.length > 0) {
                const output = response.data.outputs[0];
                
                // Check if the status is successful
                if (output.status && output.status.code === 10000) { // 10000 is success code for Clarifai
                    // Extract frames data if available
                    if (output.data && output.data.frames) {
                        const frames = output.data.frames;
                        console.log(`Received data for ${frames.length} video frames`);
                        
                        // Process all concepts from all frames
                        let allConcepts = [];
                        frames.forEach(frame => {
                            if (frame.data && frame.data.concepts) {
                                allConcepts = [...allConcepts, ...frame.data.concepts];
                            }
                        });
                        
                        // Aggregate concepts and calculate average confidence per concept
                        const conceptMap = new Map();
                        allConcepts.forEach(concept => {
                            if (!conceptMap.has(concept.name)) {
                                conceptMap.set(concept.name, {
                                    name: concept.name,
                                    id: concept.id,
                                    confidenceSum: concept.value,
                                    count: 1
                                });
                            } else {
                                const existing = conceptMap.get(concept.name);
                                existing.confidenceSum += concept.value;
                                existing.count += 1;
                            }
                        });
                        
                        // Convert to array and calculate average confidence
                        const aggregatedConcepts = Array.from(conceptMap.values()).map(item => ({
                            name: item.name,
                            id: item.id,
                            confidence: item.confidenceSum / item.count
                        }));
                        
                        // Sort by confidence (highest first)
                        aggregatedConcepts.sort((a, b) => b.confidence - a.confidence);
                        
                        // Extract tags (all concepts with confidence > 0.5)
                        const tags = aggregatedConcepts
                            .filter(concept => concept.confidence > 0.5)
                            .map(concept => concept.name);
                        
                        // Extract high-confidence objects (confidence > 0.8)
                        const objects = aggregatedConcepts
                            .filter(concept => concept.confidence > 0.8)
                            .map(concept => ({
                                name: concept.name,
                                confidence: concept.confidence,
                                id: concept.id
                            }));
                        
                        // Check for AI-generated content indicators in tags
                        const aiIndicators = ['animation', 'computer graphics', 'cgi', 'digital art', 'artificial', 'synthetic', 'cartoon'];
                        const foundAiIndicators = aiIndicators.filter(indicator => 
                            tags.some(tag => tag.toLowerCase().includes(indicator.toLowerCase()))
                        );
                        
                        const isAIGenerated = foundAiIndicators.length > 0;
                        if (isAIGenerated) {
                            console.log('AI-generated content indicators found:', foundAiIndicators);
                        }
                        
                        // Update result with processed data
                        result = {
                            tags,
                            objects,
                            isAIGenerated,
                            safeSearch: {}, // Clarifai has separate moderation models if needed
                            rawResponse: response.data,
                            pendingAnalysis: false
                        };
                    } else {
                        console.log('No frames data found in the response');
                    }
                } else {
                    console.warn('Clarifai API returned non-success status:', output.status);
                }
            } else {
                console.warn('Unexpected API response format, missing outputs');
            }
            
            console.log('Analysis result:', JSON.stringify(result, null, 2));
            console.log('=== ANALYZE VIDEO CONTENT (CLARIFAI) END ===');
            return result;
            
        } catch (apiError) {
            console.error('Error calling Clarifai API:', apiError.message);
            if (apiError.response) {
                console.error('API error response data:', apiError.response.data);
                console.error('API error response status:', apiError.response.status);
            }
            console.error('Using default result values');
            
            // Return default result in case of API error
            return result;
        }
        
    } catch (error) {
        console.error('=== ERROR IN ANALYZE VIDEO CONTENT ===');
        console.error('Error:', error.message);
        console.error('Error stack:', error.stack);
        
        console.error('=== END ERROR IN ANALYZE VIDEO CONTENT ===');
        console.log('Falling back to placeholder values due to error');
        
        // Return placeholder data in case of error
        return {
            tags: ['video', 'content', 'error'],
            objects: [],
            isAIGenerated: false,
            safeSearch: {},
            rawResponse: {},
            error: error.message
        };
    }
};

/**
 * Checks the status of video analysis for a given video ID
 * This is a placeholder function as Clarifai doesn't require polling
 * @param {string} videoId - Identifier for the video
 * @returns {Promise<Object>} - Status and results
 */
export const checkVideoAnalysisStatus = async (videoId) => {
    console.log('=== CHECK VIDEO ANALYSIS STATUS START ===');
    console.log('Checking analysis status for video ID:', videoId);
    
    // With Clarifai, analysis is synchronous, so we don't need to poll
    // This function is kept for API compatibility with the previous implementation
    
    return {
        status: 'complete', // Always complete since Clarifai returns results immediately
        result: {
            tags: [],
            objects: [],
            isAIGenerated: false
        }
    };
};

/**
 * Updates media with the latest video analysis results
 * @param {string} mediaId - Database ID of the media document
 * @param {string} videoUrl - URL of the video
 * @returns {Promise<Object>} - Updated media document
 */
export const updateVideoAnalysis = async (mediaId, videoUrl) => {
    console.log('=== UPDATE VIDEO ANALYSIS START ===');
    console.log('Updating analysis for media ID:', mediaId);
    
    try {
        // Analyze the video directly with Clarifai
        const analysisResult = await analyzeVideoContent(videoUrl);
        
        // Import Media model dynamically to avoid circular dependencies
        const Media = (await import('../model/media.model.js')).default;
        
        // Find and update the media document with new analysis results
        const updatedMedia = await Media.findByIdAndUpdate(
            mediaId,
            {
                tags: analysisResult.tags,
                isAIGenerated: analysisResult.isAIGenerated,
                // Add any other fields you want to update
            },
            { new: true } // Return the updated document
        );
        
        console.log('Media updated successfully with new analysis results');
        console.log('=== UPDATE VIDEO ANALYSIS END ===');
        
        return { 
            updated: true, 
            status: 'complete',
            media: updatedMedia 
        };
        
    } catch (error) {
        console.error('Error updating video analysis:', error.message);
        console.error('Error stack:', error.stack);
        
        return { 
            updated: false, 
            status: 'error',
            error: error.message 
        };
    }
};