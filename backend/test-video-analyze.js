// Test script for analyzeVideoContent function
import dotenv from 'dotenv';
import { analyzeVideoContent } from './services/ai.services.js';

// Load environment variables
dotenv.config();

async function testVideoAnalyze() {
  try {
    // Replace with an actual Cloudinary video URL from your account
    const videoUrl = 'https://res.cloudinary.com/demo/video/upload/v1/sample-video.mp4';
    
    console.log('Testing analyzeVideoContent with URL:', videoUrl);
    
    const result = await analyzeVideoContent(videoUrl);
    
    console.log('Analysis result:', JSON.stringify(result, null, 2));
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed with error:', error);
    console.error('Error stack:', error.stack);
  }
}

// Run the test
testVideoAnalyze();