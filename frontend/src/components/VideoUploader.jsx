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
    <section className="mb-14 bg-surface border border-border rounded-[10px] p-8">
      <h2 className="text-lg font-semibold mb-6 tracking-tight">Advanced Video Analysis</h2>
      
      {!uploadedVideo ? (
        <form onSubmit={handleUpload} className="space-y-5">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="border border-dashed border-border-hover rounded-[10px] p-5 text-center cursor-pointer hover:border-accent/40 transition">
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer block w-full h-full">
                  {filePreview ? (
                    <video src={filePreview} controls className="max-h-64 mx-auto rounded-[8px]"></video>
                  ) : (
                    <div className="py-14">
                      <svg className="mx-auto h-10 w-10 text-text-tertiary" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-3 text-sm text-text-secondary">Drag and drop a video here, or click to select</p>
                      <p className="text-xs text-text-tertiary mt-1.5">Supports all video formats</p>
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
              <button 
                type="submit" 
                className="w-full py-3 px-5 bg-accent hover:bg-accent-hover text-base font-medium rounded-[8px] transition focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!file || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload & Analyze Video'}
              </button>
              
              <div className="text-xs text-text-tertiary mt-3 leading-relaxed">
                <p className="text-text-secondary mb-1.5">Your video will be analyzed using advanced AI to detect:</p>
                <ul className="list-none space-y-1">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-text-tertiary inline-block"></span>If it's AI-generated</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-text-tertiary inline-block"></span>Content tags and categories</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-text-tertiary inline-block"></span>Detailed object recognition</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <video 
                src={uploadedVideo.fileUrl} 
                controls 
                className="w-full rounded-[10px] border border-border"
              ></video>
            </div>
            
            <div className="md:w-1/3 space-y-4">
              <div className="bg-surface-elevated border border-border p-5 rounded-[10px]">
                <h3 className="font-medium text-sm text-text-secondary uppercase tracking-widest mb-3">Analysis Status</h3>
                {analysisStatus === 'pending' ? (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-surface-hover border-t-accent"></div>
                    <span className="text-sm text-text-secondary">Analyzing video...</span>
                  </div>
                ) : analysisStatus === 'complete' ? (
                  <div className="text-success text-sm font-medium">Analysis complete</div>
                ) : (
                  <div className="text-warning text-sm">Waiting to start analysis</div>
                )}
              </div>
              
              {analysisStatus === 'complete' && (
                <>
                  <div className="bg-surface-elevated border border-border p-5 rounded-[10px]">
                    <h3 className="font-medium text-sm text-text-secondary uppercase tracking-widest mb-3">AI Detection</h3>
                    <div className={`text-sm font-medium ${isAIGenerated ? "text-danger" : "text-success"}`}>
                      {isAIGenerated ? "AI-generated content detected" : "No AI-generated content detected"}
                    </div>
                  </div>
                  
                  <div className="bg-surface-elevated border border-border p-5 rounded-[10px]">
                    <h3 className="font-medium text-sm text-text-secondary uppercase tracking-widest mb-3">Content Tags</h3>
                    {tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2.5 py-1 bg-accent-subtle text-accent text-xs rounded-[6px] border border-accent/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-text-tertiary text-sm">No tags found</p>
                    )}
                  </div>
                </>
              )}
              
              <button 
                onClick={resetForm}
                className="w-full py-3 px-5 bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-border-hover rounded-[8px] transition text-sm font-medium"
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