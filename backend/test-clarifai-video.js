// Test script for Clarifai video analysis
import dotenv from 'dotenv';
import { analyzeVideoContent } from './services/ai.services.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file in the backend directory
const result = dotenv.config({ path: path.join(__dirname, '.env') });

// Log environment loading results
console.log('Environment loading result:', result.error ? 'Error: ' + result.error.message : 'Success');
console.log('Current directory:', __dirname);
console.log('Env file path:', path.join(__dirname, '.env'));

async function testClarifaiVideoAnalysis() {
  try {
    // Check if Clarifai API key is set
    if (!process.env.CLARIFAI_API_KEY) {
      console.error('Error: CLARIFAI_API_KEY is not set in your .env file');
      console.log('Please add your Clarifai API key to the .env file:');
      console.log('CLARIFAI_API_KEY=your_clarifai_api_key');
      return;
    }

    console.log('Using Clarifai API Key:', process.env.CLARIFAI_API_KEY.substring(0, 5) + '...' + process.env.CLARIFAI_API_KEY.substring(process.env.CLARIFAI_API_KEY.length - 5));

    // Sample video URL - using Clarifai's sample video
    // Note: Using a known working sample from Clarifai's documentation
    const videoUrl = 'https://samples.clarifai.com/beer.mp4';
    
    console.log('Testing Clarifai video analysis with URL:', videoUrl);
    console.log('This may take a moment depending on the video size...');
    
    const result = await analyzeVideoContent(videoUrl);
    
    console.log('\nAnalysis result:');
    console.log('Tags:', result.tags);
    console.log('AI-Generated:', result.isAIGenerated);
    console.log('Objects:', result.objects.slice(0, 5), '...');
    
    if (result.error) {
      console.log('\nWarning: Analysis completed with errors:', result.error);
    } else {
      console.log('\nTest completed successfully!');
    }
  } catch (error) {
    console.error('\nTest failed with error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received. Request details:', error.request);
    }
    console.error('Error stack:', error.stack);
  }
}

// Run the test
testClarifaiVideoAnalysis();