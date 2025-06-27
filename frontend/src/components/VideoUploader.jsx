import React, { useState, useEffect } from 'react';
import axios from '../config/axios';

const VideoUploader = () => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [tags, setTags] = useState([]);
  const [isAIGenerated, setIsAIGenerated] = useState(false);

  // Effect for polling video analysis status
  useEffect(() => {
    let pollingInterval;

    if (isPolling && uploadedVideo) {
      pollingInterval = setInterval(async () => {
        try {
          const response = await axios.get(`/media/${uploadedVideo._id}/analysis-status`);
          
          if (response.data.status === 'complete') {
            setIsPolling(false);
            setAnalysisStatus('complete');
            setTags(response.data.data.tags || []);
            setIsAIGenerated(response.data.data.isAIGenerated || false);
            clearInterval(pollingInterval);
          }
        } catch (err) {
          console.error('Error checking analysis status:', err);
          setError('Failed to check analysis status');
          setIsPolling(false);
          clearInterval(pollingInterval);
        }
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [isPolling, uploadedVideo]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check if file is a video
    if (!selectedFile.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    setFile(selectedFile);
    
    // Create preview
    const previewUrl = URL.createObjectURL(selectedFile);
    setFilePreview(previewUrl);
    
    // Reset states
    setError('');
    setUploadProgress(0);
    setUploadedVideo(null);
    setAnalysisStatus(null);
    setIsPolling(false);
    setTags([]);
    setIsAIGenerated(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a video to upload');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'video');

      const response = await axios.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setIsUploading(false);
      
      // Store the uploaded video data
      if (response.data && response.data.data) {
        setUploadedVideo(response.data.data);
        
        // With Clarifai, analysis is synchronous, but we'll keep the polling mechanism for compatibility
        if (response.data.analysisComplete) {
          // If analysis is already complete, update the UI
          setAnalysisStatus('complete');
          setTags(response.data.data.tags || []);
          setIsAIGenerated(response.data.data.isAIGenerated || false);
        } else {
          // Start polling for analysis status
          setAnalysisStatus('pending');
          setIsPolling(true);
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed');
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFilePreview(null);
    setUploadProgress(0);
    setError('');
    setUploadedVideo(null);
    setAnalysisStatus(null);
    setIsPolling(false);
    setTags([]);
    setIsAIGenerated(false);
  };

  return (
    <section className="mb-12 bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Advanced Video Analysis</h2>
      
      {!uploadedVideo ? (
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition">
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer block w-full h-full">
                  {filePreview ? (
                    <video src={filePreview} controls className="max-h-64 mx-auto rounded"></video>
                  ) : (
                    <div className="py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2">Drag and drop a video here, or click to select</p>
                      <p className="text-sm text-gray-500 mt-1">Supports all video formats</p>
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
              <button 
                type="submit" 
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                disabled={!file || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload & Analyze Video'}
              </button>
              
              <div className="text-sm text-gray-400 mt-2">
                <p>Your video will be analyzed using advanced AI to detect:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>If it's AI-generated</li>
                  <li>Content tags and categories</li>
                  <li>Detailed object recognition</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <video 
                src={uploadedVideo.fileUrl} 
                controls 
                className="w-full rounded-lg shadow-lg"
              ></video>
            </div>
            
            <div className="md:w-1/3 space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Analysis Status</h3>
                {analysisStatus === 'pending' ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span>Analyzing video...</span>
                  </div>
                ) : analysisStatus === 'complete' ? (
                  <div className="text-green-500">Analysis complete</div>
                ) : (
                  <div className="text-yellow-500">Waiting to start analysis</div>
                )}
              </div>
              
              {analysisStatus === 'complete' && (
                <>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">AI Detection</h3>
                    <div className={isAIGenerated ? "text-red-500" : "text-green-500"}>
                      {isAIGenerated ? "AI-generated content detected" : "No AI-generated content detected"}
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Content Tags</h3>
                    {tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-blue-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No tags found</p>
                    )}
                  </div>
                </>
              )}
              
              <button 
                onClick={resetForm}
                className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-md transition"
              >
                Upload Another Video
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoUploader;