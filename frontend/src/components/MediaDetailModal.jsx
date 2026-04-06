import React from 'react';

const MediaDetailModal = ({ media, onClose }) => {
  if (!media) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6" onClick={onClose}>
      <div className="bg-surface border border-border rounded-[12px] max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-semibold tracking-tight">Media Details</h2>
            <button 
              onClick={onClose}
              className="text-text-tertiary hover:text-text-primary transition p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              {media.type === 'image' ? (
                <img 
                  src={media.fileUrl} 
                  alt="Media" 
                  className="w-full rounded-[10px] border border-border"
                />
              ) : (
                <video 
                  src={media.fileUrl} 
                  className="w-full rounded-[10px] border border-border" 
                  controls
                ></video>
              )}
            </div>

            <div className="md:w-1/2 space-y-6">
              <div>
                <h3 className="text-xs font-medium text-text-secondary uppercase tracking-widest mb-3">Analysis Result</h3>
                <div className={`inline-block px-3 py-1.5 rounded-[6px] text-xs font-medium ${media.isAIGenerated ? 'bg-danger-subtle text-danger border border-danger/10' : 'bg-success-subtle text-success border border-success/10'}`}>
                  {media.isAIGenerated ? 'AI Generated' : 'Real Media'}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-text-secondary uppercase tracking-widest mb-3">Upload Date</h3>
                <p className="text-sm text-text-primary">{new Date(media.uploadedAt).toLocaleString()}</p>
              </div>

              {media.tags && media.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-text-secondary uppercase tracking-widest mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {media.tags.map((tag, index) => (
                      <span key={index} className="bg-surface-elevated border border-border text-text-secondary px-2.5 py-1 rounded-[6px] text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-border-hover rounded-[8px] transition text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailModal;