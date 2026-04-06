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
    <section className="mb-14 bg-surface border border-border rounded-[10px] p-8">
      <h2 className="text-lg font-semibold mb-6 tracking-tight">Image & Video Uploader</h2>
      <form onSubmit={handleUpload} className="space-y-5">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="border border-dashed border-border-hover rounded-[10px] p-5 text-center cursor-pointer hover:border-accent/40 transition">
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
                    <img src={filePreview} alt="Preview" className="max-h-64 mx-auto rounded-[8px]" />
                  ) : (
                    <video src={filePreview} controls className="max-h-64 mx-auto rounded-[8px]"></video>
                  )
                ) : (
                  <div className="py-14">
                    <svg className="mx-auto h-10 w-10 text-text-tertiary" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-3 text-sm text-text-secondary">Drag and drop a file here, or click to select</p>
                    <p className="text-xs text-text-tertiary mt-1.5">Supports images and videos</p>
                  </div>
                )}
              </label>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-3">
                <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-text-secondary text-center mt-2">{uploadProgress}% uploaded</p>
              </div>
            )}
            {error && <p className="text-danger text-sm mt-3">{error}</p>}
          </div>
          
          <div className="md:w-1/3 space-y-5">
            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-widest mb-2.5">File Type</label>
              <div className="flex space-x-5">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="fileType" 
                    value="image" 
                    checked={fileType === 'image'} 
                    onChange={() => setFileType('image')} 
                    className="form-radio h-4 w-4 text-accent accent-accent"
                  />
                  <span className="ml-2.5 text-sm text-text-secondary">Image</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="fileType" 
                    value="video" 
                    checked={fileType === 'video'} 
                    onChange={() => setFileType('video')} 
                    className="form-radio h-4 w-4 text-accent accent-accent"
                  />
                  <span className="ml-2.5 text-sm text-text-secondary">Video</span>
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full py-3 px-5 bg-accent hover:bg-accent-hover text-base font-medium rounded-[8px] transition focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!file || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload & Analyze'}
            </button>
            
            <div className="text-xs text-text-tertiary mt-3 leading-relaxed">
              <p className="text-text-secondary mb-1.5">Your media will be analyzed to detect:</p>
              <ul className="list-none space-y-1">
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-text-tertiary inline-block"></span>If it's AI-generated</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-text-tertiary inline-block"></span>Content tags and categories</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default MediaUploader;