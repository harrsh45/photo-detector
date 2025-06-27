# Clarifai Video Tagging Implementation

This document provides a comprehensive guide on how the Clarifai video tagging system is implemented in the photo-detector application.

## Overview

The application now uses Clarifai's general video recognition model to analyze uploaded videos. This implementation:

1. Analyzes videos synchronously using Clarifai's API
2. Extracts tags and concepts from video frames
3. Determines if the video might be AI-generated
4. Maintains API compatibility with the previous polling-based system

## Setup Instructions

### 1. Obtain a Clarifai API Key

1. Sign up for a free account at [Clarifai](https://www.clarifai.com/)
2. Create a new application in your Clarifai account
3. Generate an API key for your application

### 2. Configure Environment Variables

Add your Clarifai API key to the `.env` file in the backend directory:

```
CLARIFAI_API_KEY=your_clarifai_api_key
```

### 3. Test the Integration

Run the test script to verify that the Clarifai integration is working correctly:

```bash
node test-clarifai-video.js
```

This script will analyze a sample video and display the results.

## Backend Implementation

### AI Services (`ai.services.js`)

The `analyzeVideoContent` function has been refactored to use Clarifai's general video recognition model. Key features include:

- Direct API call to Clarifai's video recognition endpoint
- Processing of concepts from video frames
- Aggregation of concepts by confidence level
- Extraction of tags and objects
- AI-generated content detection based on specific indicators

The `checkVideoAnalysisStatus` and `updateVideoAnalysis` functions have been updated to reflect Clarifai's synchronous analysis approach, removing the need for polling but maintaining API compatibility.

### Media Controller (`media.controller.js`)

The `checkVideoAnalysisStatus` controller function:

- Retrieves media by ID
- Validates user authorization and media type
- Calls `updateVideoAnalysis` to re-analyze the video if needed
- Always returns a 'complete' status with the video's tags and AI-generated status

The `uploadMediaController` function has been updated to reflect the synchronous nature of Clarifai's video analysis, immediately returning `analysisComplete: true` in the response.

### Media Routes (`media.routes.js`)

A new GET route `/media/:mediaId/analysis-status` has been added for checking video analysis status, which uses:

- `authenticate` middleware for user authentication
- Validation of `mediaId` as a Mongo ID
- The `checkVideoAnalysisStatus` controller function

## Frontend Implementation

### VideoUploader Component

A new React component `VideoUploader.jsx` has been created to demonstrate video upload and analysis with Clarifai. This component:

- Handles video file selection and preview
- Uploads videos to the `/api/media/upload` endpoint
- Maintains compatibility with the polling mechanism (even though Clarifai's analysis is synchronous)
- Displays analysis results including tags and AI-generated status

### Home Screen Integration

The Home screen has been updated to include a toggle between the standard MediaUploader and the new VideoUploader component:

```jsx
{uploaderType === 'standard' ? (
  <MediaUploader onUploadSuccess={handleUploadComplete} />
) : (
  <VideoUploader />
)}
```

## Technical Details

### Clarifai API Integration

The application uses Clarifai's `general-video-recognition` model, which:

- Processes video frames to identify objects, scenes, and concepts
- Returns confidence scores for each concept
- Works synchronously, providing immediate results

### Video Analysis Process

1. The video is uploaded to Cloudinary for storage
2. The Cloudinary URL is sent to Clarifai's API
3. Clarifai processes the video and returns concepts for each frame
4. The application aggregates concepts across frames and calculates average confidence scores
5. Tags are extracted from concepts with confidence > 0.5
6. Objects are extracted from concepts with confidence > 0.8
7. AI-generated content is detected based on specific indicators in the tags

### AI-Generated Content Detection

The system identifies potential AI-generated videos by looking for specific indicators in the tags, including:

- animation
- computer graphics
- cgi
- digital art
- artificial
- synthetic
- cartoon

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure your Clarifai API key is correctly set in the `.env` file
   - Verify the API key is active in your Clarifai account

2. **Video Upload Fails**
   - Check file size and format compatibility
   - Ensure proper network connectivity
   - Verify Cloudinary configuration

3. **Analysis Results Not Showing**
   - Check browser console for errors
   - Verify that the video was successfully uploaded
   - Check server logs for API call errors
   - If you encounter a "Request failed with status code 404" error, ensure you're using the correct model ID. Clarifai uses `general-image-recognition` for both image and video analysis, not `general-video-recognition`

4. **Inaccurate Tags**
   - Clarifai's model may not recognize all objects or concepts
   - Video quality affects recognition accuracy
   - Consider using a more specialized Clarifai model for specific use cases
   - For testing, use known working samples like `https://samples.clarifai.com/beer.mp4`

### Debugging

To debug issues with the Clarifai video tagging:

1. Run the test script: `node test-clarifai-video.js`
2. Check server logs for API call errors
3. Verify Clarifai API key and configuration
4. Test with different video files to isolate issues

## Future Improvements

1. Add support for custom Clarifai models
2. Implement video frame selection for more targeted analysis
3. Add confidence score thresholds for tag filtering
4. Improve AI-generated content detection accuracy
5. Add support for Clarifai's moderation models for content safety analysis
6. Implement caching to reduce API calls for previously analyzed videos

## Resources

- [Clarifai API Documentation](https://docs.clarifai.com/)
- [Clarifai Video Recognition Models](https://www.clarifai.com/models/video-recognition)
- [Cloudinary Documentation](https://cloudinary.com/documentation)