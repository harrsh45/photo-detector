# Clarifai Video Tagging Implementation

This document explains how the Clarifai video tagging system is implemented in the photo-detector application.

## Overview

The application now uses Clarifai's general video recognition model to analyze uploaded videos. This implementation:

1. Analyzes videos synchronously using Clarifai's API
2. Extracts tags and concepts from video frames
3. Determines if the video might be AI-generated
4. Maintains API compatibility with the previous polling-based system

## Backend Implementation

### AI Services (`ai.services.js`)

The `analyzeVideoContent` function has been refactored to use Clarifai's general video recognition model instead of Cloudinary's Google Video Tagging. Key changes include:

- Direct API call to Clarifai's video recognition endpoint
- Processing of concepts from video frames
- Aggregation of concepts by confidence level
- Extraction of tags and objects
- AI-generated content detection

The `checkVideoAnalysisStatus` and `updateVideoAnalysis` functions have been updated to reflect Clarifai's synchronous analysis approach, removing the need for polling but maintaining API compatibility.

### Media Controller (`media.controller.js`)

The `checkVideoAnalysisStatus` controller function has been added to:

- Retrieve media by ID
- Validate user authorization and media type
- Call `updateVideoAnalysis` to re-analyze the video if needed
- Always return a 'complete' status with the video's tags and AI-generated status

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

## Usage

1. Import and use the `VideoUploader` component in your React application:

```jsx
import VideoUploader from './components/VideoUploader';

function App() {
  return (
    <div className="App">
      <VideoUploader />
    </div>
  );
}
```

2. Upload a video using the component
3. The video will be analyzed using Clarifai's general video recognition model
4. Results will be displayed once analysis is complete

## Technical Details

### Clarifai API Integration

The application uses Clarifai's `general-video-recognition` model, which:

- Processes video frames to identify objects, scenes, and concepts
- Returns confidence scores for each concept
- Works synchronously, providing immediate results

### Polling Mechanism

Although Clarifai's video analysis is synchronous, the application maintains the polling mechanism for API compatibility. The frontend still polls the `/media/:mediaId/analysis-status` endpoint, but the backend always returns a 'complete' status.

## Troubleshooting

### Common Issues

1. **Video Upload Fails**
   - Check file size and format compatibility
   - Ensure proper network connectivity

2. **Analysis Results Not Showing**
   - Check browser console for errors
   - Verify that the video was successfully uploaded
   - Ensure Clarifai API key is properly configured

3. **Inaccurate Tags**
   - Clarifai's model may not recognize all objects or concepts
   - Video quality affects recognition accuracy

### Debugging

To debug issues with the Clarifai video tagging:

1. Check server logs for API call errors
2. Verify Clarifai API key and configuration
3. Test with different video files to isolate issues

## Future Improvements

1. Add support for custom Clarifai models
2. Implement video frame selection for more targeted analysis
3. Add confidence score thresholds for tag filtering
4. Improve AI-generated content detection accuracy