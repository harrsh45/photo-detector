import React from 'react';

const MediaCard = ({ media, onDelete, onClick }) => {
  return (
    <div 
      className="bg-surface border border-border rounded-[10px] overflow-hidden cursor-pointer transition hover:border-border-hover hover:translate-y-[-2px]"
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
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-[6px] ${media.isAIGenerated ? 'bg-danger-subtle text-danger border border-danger/10' : 'bg-success-subtle text-success border border-success/10'}`}>
              {media.isAIGenerated ? 'AI Generated' : 'Real Media'}
            </span>
            <span className="text-xs text-text-tertiary block mt-2">
              {new Date(media.uploadedAt).toLocaleDateString()}
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when delete button is clicked
              onDelete(media._id);
            }}
            className="text-text-tertiary hover:text-danger transition p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {media.tags && media.tags.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-text-tertiary uppercase tracking-widest mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {media.tags.slice(0, 5).map((tag, index) => (
                <span key={index} className="text-xs bg-surface-elevated border border-border text-text-secondary px-2 py-0.5 rounded-[6px]">
                  {tag}
                </span>
              ))}
              {media.tags.length > 5 && (
                <span className="text-xs bg-surface-elevated border border-border text-text-tertiary px-2 py-0.5 rounded-[6px]">+{media.tags.length - 5} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCard;