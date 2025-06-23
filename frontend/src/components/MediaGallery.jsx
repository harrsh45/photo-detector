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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Media Gallery</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('all')} 
            className={`px-3 py-1 rounded ${activeTab === 'all' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab('ai')} 
            className={`px-3 py-1 rounded ${activeTab === 'ai' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            AI Generated
          </button>
          <button 
            onClick={() => setActiveTab('real')} 
            className={`px-3 py-1 rounded ${activeTab === 'real' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Real Media
          </button>
        </div>
      </div>
      
      {/* Search by tags */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-1.5">
          <input 
            type="text" 
            id="searchTags"
            placeholder="Search by tags (comma separated)" 
            value={searchTags} 
            onChange={(e) => setSearchTags(e.target.value)} 
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading your media...</p>
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-lg">No media found</p>
          <p className="text-gray-500">Upload some media to get started</p>
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