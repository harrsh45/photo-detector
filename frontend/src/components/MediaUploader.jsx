import React, { useState } from 'react';
import axios from '../config/axios';

const MediaUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileType, setFileType] = useState('image');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    // Determine file type
    if (selectedFile.type.startsWith('image/')) {
      setFileType('image');
    } else if (selectedFile.type.startsWith('video/')) {
      setFileType('video');
    }

    // Create preview
    const previewUrl = URL.createObjectURL(selectedFile);
    setFilePreview(previewUrl);
    
    // Reset states
    setError('');
    setUploadProgress(0);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', fileType);

      const response = await axios.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      // Reset form
      setFile(null);
      setFilePreview(null);
      setUploadProgress(0);
      setIsUploading(false);
      
      // Call the success callback with the uploaded media data
      if (response.data && response.data.data) {
        onUploadSuccess(response.data.data);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed');
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  return (
    <section className="mb-12 bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Upload Media</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition">
              <input 
                type="file" 
                accept="image/*,video/*" 
                onChange={handleFileChange} 
                className="hidden" 
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block w-full h-full">
                {filePreview ? (
                  fileType === 'image' ? (
                    <img src={filePreview} alt="Preview" className="max-h-64 mx-auto rounded" />
                  ) : (
                    <video src={filePreview} controls className="max-h-64 mx-auto rounded"></video>
                  )
                ) : (
                  <div className="py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2">Drag and drop a file here, or click to select</p>
                    <p className="text-sm text-gray-500 mt-1">Supports images and videos</p>
                  </div>
                )}
              </label>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <div className="h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-center mt-1">{uploadProgress}% uploaded</p>
              </div>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          
          <div className="md:w-1/3 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">File Type</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="fileType" 
                    value="image" 
                    checked={fileType === 'image'} 
                    onChange={() => setFileType('image')} 
                    className="form-radio h-4 w-4 text-blue-500"
                  />
                  <span className="ml-2">Image</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="fileType" 
                    value="video" 
                    checked={fileType === 'video'} 
                    onChange={() => setFileType('video')} 
                    className="form-radio h-4 w-4 text-blue-500"
                  />
                  <span className="ml-2">Video</span>
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              disabled={!file || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload & Analyze'}
            </button>
            
            <div className="text-sm text-gray-400 mt-2">
              <p>Your media will be analyzed to detect:</p>
              <ul className="list-disc list-inside mt-1">
                <li>If it's AI-generated</li>
                <li>Content tags and categories</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default MediaUploader;