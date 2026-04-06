import React from 'react';
import MediaCard from './MediaCard';

const MediaGallery = ({ 
  media, 
  loading, 
  activeTab, 
  setActiveTab, 
  searchTags, 
  setSearchTags,
  handleSearch,
  handleDelete,
  onMediaClick
}) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-semibold tracking-tight">Your Media Gallery</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('all')} 
            className={`px-4 py-2 rounded-[8px] text-sm font-medium transition ${activeTab === 'all' ? 'bg-accent text-base' : 'bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-border-hover'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab('ai')} 
            className={`px-4 py-2 rounded-[8px] text-sm font-medium transition ${activeTab === 'ai' ? 'bg-accent text-base' : 'bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-border-hover'}`}
          >
            AI Generated
          </button>
          <button 
            onClick={() => setActiveTab('real')} 
            className={`px-4 py-2 rounded-[8px] text-sm font-medium transition ${activeTab === 'real' ? 'bg-accent text-base' : 'bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-border-hover'}`}
          >
            Real Media
          </button>
        </div>
      </div>
      
      {/* Search by tags */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            id="searchTags"
            placeholder="Search by tags (comma separated)" 
            value={searchTags} 
            onChange={(e) => setSearchTags(e.target.value)} 
            className="flex-1 px-4 py-3 bg-surface border border-border rounded-[8px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border-focus transition text-sm"
          />
          <button 
            type="submit" 
            className="px-6 py-3 bg-accent hover:bg-accent-hover text-base rounded-[8px] text-sm font-medium transition"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-surface-elevated border-t-accent mx-auto"></div>
          <p className="mt-5 text-sm text-text-secondary">Loading your media...</p>
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-[10px]">
          <svg className="mx-auto h-10 w-10 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-5 text-text-secondary">No media found</p>
          <p className="text-text-tertiary text-sm mt-1">Upload some media to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <MediaCard 
              key={item._id} 
              media={item} 
              onDelete={handleDelete}
              onClick={onMediaClick}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MediaGallery;