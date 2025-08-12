import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Music, Play, Pause, Trash2, Volume2 } from 'lucide-react';

const TrackList = ({ 
  tracks, 
  currentTrack, 
  isPlaying, 
  onTrackSelect, 
  onTrackUpload, 
  onTrackDelete 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        const track = {
          id: Date.now() + Math.random(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          file: file,
          url: url,
          duration: 0
        };
        onTrackUpload(track);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      <motion.div
        className={`relative mb-8 p-8 border-2 border-dashed rounded-2xl transition-all duration-300 backdrop-blur-md ${
          isDragOver 
            ? 'border-emerald-400 bg-emerald-500/20' 
            : 'border-emerald-300/50 bg-white/10 hover:bg-white/20'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: isDragOver ? 1.1 : 1,
              rotate: isDragOver ? 180 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragOver ? 'Drop your music here!' : 'Upload Music'}
          </h3>
          
          <p className="text-emerald-200/80">
            Drag & drop audio files or click to browse
          </p>
          
          <p className="text-sm text-emerald-300/60 mt-2">
            Supports MP3, WAV, FLAC, and more
          </p>
        </div>
      </motion.div>

      {/* Track List */}
      <div className="space-y-3">
        <AnimatePresence>
          {tracks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 text-emerald-200/60"
            >
              <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No tracks uploaded yet</p>
              <p className="text-sm mt-2">Upload some music to get started</p>
            </motion.div>
          ) : (
            tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative p-4 rounded-xl backdrop-blur-md border transition-all duration-300 cursor-pointer ${
                  currentTrack?.id === track.id
                    ? 'bg-emerald-500/30 border-emerald-400/50 shadow-lg shadow-emerald-500/20'
                    : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-emerald-300/30'
                }`}
                onClick={() => onTrackSelect(track)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Play/Pause Button */}
                    <motion.div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        currentTrack?.id === track.id && isPlaying
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/20 text-emerald-200 group-hover:bg-emerald-500/50'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </motion.div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">
                        {track.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-emerald-200/60">
                        <span>{formatDuration(track.duration)}</span>
                        {currentTrack?.id === track.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center space-x-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span className="text-emerald-400">Now Playing</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTrackDelete(track.id);
                    }}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/30 hover:text-red-300 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Progress Bar for Current Track */}
                {currentTrack?.id === track.id && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-b-xl"
                    style={{ transformOrigin: 'left' }}
                  />
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Track Count */}
      {tracks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center text-sm text-emerald-200/60"
        >
          {tracks.length} track{tracks.length !== 1 ? 's' : ''} in your library
        </motion.div>
      )}
    </div>
  );
};

export default TrackList;