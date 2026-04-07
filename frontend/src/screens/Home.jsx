import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'

// Import components
import MediaUploader from '../components/MediaUploader'
import VideoUploader from '../components/VideoUploader'
import MediaGallery from '../components/MediaGallery'
import MediaDetailModal from '../components/MediaDetailModal'
import AnalysisResultModal from '../components/AnalysisResultModal'

const Home = () => {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTags, setSearchTags] = useState('')
  const [error, setError] = useState('')
  const [uploaderType, setUploaderType] = useState('standard') // 'standard' or 'clarifai'
  
  // Modal states
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [showAnalysisModal, setShowAnalysisModal] = useState(false)

  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      console.log("lajdflajfdl")
      navigate('/login')
      return
    }
    fetchMedia()
  }, [activeTab])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      let response

      if (activeTab === 'all') {
        response = await axios.get('/media')
      } else if (activeTab === 'ai') {
        response = await axios.get('/media/filter/ai?isAIGenerated=true')
      } else if (activeTab === 'real') {
        response = await axios.get('/media/filter/ai?isAIGenerated=false')
      } else if (activeTab === 'search' && searchTags) {
        response = await axios.get(`/media/search/tags?tags=${searchTags}`)
      }

      if (response && response.data) {
        setMedia(response.data.data)
      }
      setLoading(false)
    } catch (err) {
      console.error('Error fetching media:', err)
      setError('Failed to load media')
      setLoading(false)
    }
  }

  const handleUploadComplete = (mediaData) => {
    // Show analysis result modal
    setAnalysisResult(mediaData)
    setShowAnalysisModal(true)
    
    // Refresh media list
    fetchMedia()
  }

  const handleAnalysisModalClose = () => {
    setShowAnalysisModal(false)
    setAnalysisResult(null)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    
    // Determine file type
    if (selectedFile.type.startsWith('image/')) {
      setFileType('image')
    } else if (selectedFile.type.startsWith('video/')) {
      setFileType('video')
    }

    // Create preview
    const previewUrl = URL.createObjectURL(selectedFile)
    setFilePreview(previewUrl)
    
    // Reset states
    setError('')
    setUploadSuccess(false)
    setUploadProgress(0)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file to upload')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', fileType)

      const response = await axios.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentCompleted)
        }
      })

      setUploadSuccess(true)
      setFile(null)
      setFilePreview(null)
      setUploadProgress(0)
      
      // Refresh media lis
      fetchMedia()
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.response?.data?.message || 'Upload failed')
      setUploadProgress(0)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media?')) return
    
    try {
      await axios.delete(`/media/${id}`)
      // Refresh media list
      fetchMedia()
      
      // If the deleted media is currently selected, close the detail modal
      if (selectedMedia && selectedMedia._id === id) {
        setShowDetailModal(false)
        setSelectedMedia(null)
      }
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to delete media')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setActiveTab('search')
    fetchMedia()
  }
  
  const handleMediaClick = (media) => {
    setSelectedMedia(media)
    setShowDetailModal(true)
  }
  
  const handleDetailModalClose = () => {
    setShowDetailModal(false)
    setSelectedMedia(null)
  }

  return (
    <div className="min-h-screen bg-base text-text-primary">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-tight">Photo Detector</h1>
          <div className="flex items-center space-x-5">
            <span className="text-sm text-text-secondary">Welcome, {user?.username || 'User'}</span>
            <button 
              onClick={() => {
                localStorage.removeItem('token')
                navigate('/login')
              }}
              className="px-4 py-2 text-sm bg-surface-elevated border border-border text-text-secondary hover:text-danger hover:border-danger/30 rounded-[8px] transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        {/* Media Uploader Section */}
        <div className="mb-8 bg-surface border border-border rounded-[10px] p-5">
          <div className="flex space-x-3">
            <button
              onClick={() => setUploaderType('standard')}
              className={`px-5 py-2.5 rounded-[8px] text-sm font-medium transition ${uploaderType === 'standard' ? 'bg-accent text-base' : 'bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-border-hover'}`}
            >
              Image & Video Uploader
            </button>
            <button
              onClick={() => setUploaderType('clarifai')}
              className={`px-5 py-2.5 rounded-[8px] text-sm font-medium transition ${uploaderType === 'clarifai' ? 'bg-accent text-base' : 'bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-border-hover'}`}
            >
              Advanced Video Analysis
            </button>
          </div>
        </div>

        {/* Media Uploader Component */}
        {uploaderType === 'standard' ? (
          <MediaUploader onUploadSuccess={handleUploadComplete} />
        ) : (
          <VideoUploader />
        )}

        {/* Media Gallery Component */}
        <MediaGallery 
          media={media}
          loading={loading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTags={searchTags}
          setSearchTags={setSearchTags}
          handleSearch={handleSearch}
          handleDelete={handleDelete}
          onMediaClick={handleMediaClick}
        />
      </main>

      {/* Analysis Result Modal */}
      {showAnalysisModal && analysisResult && (
        <AnalysisResultModal 
          media={analysisResult} 
          onClose={handleAnalysisModalClose} 
        />
      )}

      {/* Media Detail Modal */}
      {showDetailModal && selectedMedia && (
        <MediaDetailModal 
          media={selectedMedia} 
          onClose={handleDetailModalClose} 
        />
      )}

      <footer className="bg-surface border-t border-border py-8 mt-16">
        <div className="container mx-auto px-6 text-center text-text-tertiary text-sm">
          <p>© {new Date().getFullYear()} Photo Detector — AI-Generated Content Detection</p>
        </div>
      </footer>
    </div>
  )
}

export default Home