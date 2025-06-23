# Photo Detector - AI-Generated Content Detection App

## Overview

Photo Detector is a full-stack MERN (MongoDB, Express, React, Node.js) application that detects whether photos or videos are AI-generated and identifies elements within the content using AI technologies.

## Features

- User authentication (register, login, logout)
- Upload images and videos
- Automatic detection of AI-generated content
- Content analysis and tagging
- Filter media by AI-generated status
- Search media by tags

## AI Services Used

### Sightengine

Sightengine is used for detecting AI-generated images and videos with high accuracy (98.3% according to independent benchmarks).

**Key features:**
- Detects images from popular AI generators (MidJourney, DALL-E, Stable Diffusion, etc.)
- Works by analyzing pixel content without relying on metadata or watermarks
- Can detect manipulation, deepfakes, and inappropriate content
- Provides confidence scores for AI generation probability

### Clarifai

Clarifai is used for analyzing image content and generating tags to identify objects, scenes, and other elements.

**Key features:**
- Object detection and visual content analysis
- Image labeling and tagging
- Face and landmark detection
- Pre-trained models for various domains
- High accuracy image classification
- Content moderation capabilities

### DeepAI (Alternative)

DeepAI is an alternative service for image tagging and analysis that can be used instead of Clarifai.

**Key features:**
- Image classification and tagging
- Simple API for integration
- Affordable pricing with free tier available
- Fast processing of images

## Project Structure

### Backend

- **Models**:
  - `user.model.js`: User schema and authentication methods
  - `media.model.js`: Media schema for storing uploaded content

- **Services**:
  - `user.services.js`: User-related operations
  - `media.services.js`: Media-related operations
  - `ai.services.js`: Integration with AI detection and analysis APIs

- **Controllers**:
  - `user.controller.js`: User authentication controllers
  - `media.controller.js`: Media operation controllers

- **Routes**:
  - `user.routes.js`: User authentication routes
  - `media.routes.js`: Media operation routes

### Frontend (To be implemented)

- User authentication screens
- Media upload component
- Media gallery with AI detection results
- Detailed analysis view

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB
- API keys for Sightengine and Google Cloud Vision AI

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SIGHTENGINE_API_USER=your_sightengine_api_user
   SIGHTENGINE_API_SECRET=your_sightengine_api_secret
   CLARIFAI_API_KEY=your_clarifai_api_key
   DEEPAI_API_KEY=your_deepai_api_key
   USE_DEEPAI=false  # Set to 'true' to use DeepAI instead of Clarifai
   ```
4. Start the backend server:
   ```
   npm start
   ```

## API Endpoints

### User Routes

- `POST /users/register`: Register a new user
- `POST /users/login`: Login a user
- `POST /users/logout`: Logout a user

### Media Routes

- `POST /media/upload`: Upload a new media file
- `GET /media`: Get all media for the authenticated user
- `GET /media/:id`: Get a specific media by ID
- `DELETE /media/:id`: Delete a media by ID
- `GET /media/filter/ai?isAIGenerated=true|false`: Filter media by AI generation status
- `GET /media/search/tags?tags=tag1,tag2,tag3`: Search media by tags

## Future Enhancements

- Real-time AI detection during upload
- More detailed analysis of AI-generated content
- Video frame-by-frame analysis
- User feedback mechanism for improving detection accuracy
- Integration with more AI services for comprehensive analysis

## License

This project is licensed under the MIT License.