import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Player from './components/Player';
import TrackList from './components/TrackList';
import { useAudio } from './hooks/useAudio';
import { loadTracks, saveTracks } from './utils/storage';
import { glass, natureColors } from './styles/theme';

function App() {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    visualizerData,
    audioRef,
    canvasRef,
    play,
    pause,
    seek,
    setVolume: updateVolume,
    loadTrack
  } = useAudio();

  // Load tracks from localStorage on component mount
  useEffect(() => {
    const savedTracks = loadTracks();
    if (savedTracks.length > 0) {
      setTracks(savedTracks);
    }
    setIsLoading(false);
  }, []);

  // Save tracks to localStorage whenever tracks change
  useEffect(() => {
    if (!isLoading) {
      saveTracks(tracks);
    }
  }, [tracks, isLoading]);

  // Load current track when track index changes
  useEffect(() => {
    if (tracks.length > 0 && tracks[currentTrackIndex]) {
      loadTrack(tracks[currentTrackIndex].url);
    }
  }, [currentTrackIndex, tracks, loadTrack]);

  const handleFileUpload = (files) => {
    const newTracks = Array.from(files).map((file, index) => {
      const url = URL.createObjectURL(file);
      return {
        id: Date.now() + index,
        name: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Unknown Artist',
        url: url,
        file: file,
        duration: 0
      };
    });

    setTracks(prevTracks => [...prevTracks, ...newTracks]);
  };

  const handleDeleteTrack = (trackId) => {
    const trackIndex = tracks.findIndex(track => track.id === trackId);
    const newTracks = tracks.filter(track => track.id !== trackId);
    
    setTracks(newTracks);
    
    // Adjust current track index if necessary
    if (trackIndex === currentTrackIndex && newTracks.length > 0) {
      setCurrentTrackIndex(0);
    } else if (trackIndex < currentTrackIndex) {
      setCurrentTrackIndex(prev => prev - 1);
    } else if (newTracks.length === 0) {
      setCurrentTrackIndex(0);
    }
  };

  const handleTrackSelect = (trackId) => {
    const index = tracks.findIndex(track => track.id === trackId);
    if (index !== -1) {
      setCurrentTrackIndex(index);
    }
  };

  const handleNextTrack = () => {
    if (tracks.length > 0) {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
  };

  const handlePreviousTrack = () => {
    if (tracks.length > 0) {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    }
  };

  const currentTrack = tracks[currentTrackIndex] || null;

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${natureColors.primary}, ${natureColors.secondary})`
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-xl font-medium"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${natureColors.primary}, ${natureColors.secondary})`
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-10"
          style={{ backgroundColor: natureColors.accent }}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 -right-20 w-60 h-60 rounded-full opacity-10"
          style={{ backgroundColor: natureColors.accent }}
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 left-1/3 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: natureColors.accent }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Nature Player
          </h1>
          <p className="text-white/80 text-lg">
            Your personal music sanctuary
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Track List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <TrackList
              tracks={tracks}
              currentTrack={currentTrack}
              onFileUpload={handleFileUpload}
              onTrackSelect={handleTrackSelect}
              onDeleteTrack={handleDeleteTrack}
              isPlaying={isPlaying}
            />
          </motion.div>

          {/* Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Player
              track={currentTrack}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              visualizerData={visualizerData}
              canvasRef={canvasRef}
              onPlay={play}
              onPause={pause}
              onSeek={seek}
              onVolumeChange={updateVolume}
              onNext={handleNextTrack}
              onPrevious={handlePreviousTrack}
              hasNextTrack={tracks.length > 1}
              hasPreviousTrack={tracks.length > 1}
            />
          </motion.div>
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          onEnded={handleNextTrack}
          preload="metadata"
        />
      </div>
    </div>
  );
}

export default App;
