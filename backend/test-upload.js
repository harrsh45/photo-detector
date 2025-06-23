import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';

// Create a form data object
const formData = new FormData();

// Add the file to the form data
const filePath = path.join(process.cwd(), 'test.jpg');
const fileStream = fs.createReadStream(filePath);
formData.append('file', fileStream, 'test.jpg');

// Add the type to the form data
formData.append('type', 'image');

// Set up the request headers with cookies for authentication
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjQ0YzQ5ZTY4NmRkZDRhZDRhYWFhYSIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc1MDQwMjAxOX0.RVuRSLdCC5fRs_gl45w2MD6rzOLoaQVvLlBw110UUIs';

// Log what we're sending
console.log('Sending file with name:', 'test.jpg');
console.log('Form data contains:');
console.log('- file: [File stream]');
console.log('- type: image');

// Make the request
axios.post('http://localhost:3000/media/upload', formData, {
  headers: {
    ...formData.getHeaders(),
    'Authorization': `Bearer ${token}`,
    'Cookie': `token=${token}`
  },
  withCredentials: true,
  maxContentLength: Infinity,
  maxBodyLength: Infinity
})
.then(response => {
  console.log('Success:', response.data);
})
.catch(error => {
  console.error('Error:', error.response ? error.response.data : error.message);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Headers:', error.response.headers);
    console.error('Data:', error.response.data);
  }
  if (error.request) {
    console.error('Request was made but no response was received');
  } else {
    console.error('Error setting up the request:', error.message);
  }
});