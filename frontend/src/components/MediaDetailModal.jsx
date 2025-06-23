import React from 'react';

const MediaDetailModal = ({ media, onClose }) => {
  if (!media) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Media Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              {media.type === 'image' ? (
                <img 
                  src={media.fileUrl} 
                  alt="Media" 
                  className="w-full rounded-lg"
                />
              ) : (
                <video 
                  src={media.fileUrl} 
                  className="w-full rounded-lg" 
                  controls
                ></video>
              )}
            </div>

            <div className="md:w-1/2 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Analysis Result</h3>
                <div className={`inline-block px-3 py-1 rounded text-sm font-medium ${media.isAIGenerated ? 'bg-red-600' : 'bg-green-600'}`}>
                  {media.isAIGenerated ? 'AI Generated' : 'Real Media'}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Date</h3>
                <p>{new Date(media.uploadedAt).toLocaleString()}</p>
              </div>

              {media.tags && media.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {media.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-700 px-2 py-1 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition"
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