import React from 'react';

const MediaCard = ({ media, onDelete, onClick }) => {
  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition hover:shadow-xl hover:scale-[1.02]"
      onClick={() => onClick(media)}
    >
      <div className="relative">
        {media.type === 'image' ? (
          <img 
            src={media.fileUrl} 
            alt="Media" 
            className="w-full h-48 object-cover"
          />
        ) : (
          <video 
            src={media.fileUrl} 
            className="w-full h-48 object-cover" 
            controls
            onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with video controls
          ></video>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className={`inline-block px-2 py-1 text-xs rounded ${media.isAIGenerated ? 'bg-red-600' : 'bg-green-600'}`}>
              {media.isAIGenerated ? 'AI Generated' : 'Real Media'}
            </span>
            <span className="text-xs text-gray-400 block mt-1">
              {new Date(media.uploadedAt).toLocaleDateString()}
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when delete button is clicked
              onDelete(media._id);
            }}
            className="text-red-500 hover:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {media.tags && media.tags.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-400 mb-1">Tags:</p>
            <div className="flex flex-wrap gap-1">
              {media.tags.slice(0, 5).map((tag, index) => (
                <span key={index} className="text-xs bg-gray-700 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {media.tags.length > 5 && (
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">+{media.tags.length - 5} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCard;