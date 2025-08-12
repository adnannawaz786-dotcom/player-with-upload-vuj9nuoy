import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';
import { glass, natureColors } from '../styles/theme';


const Player = ({ currentTrack, playlist, onTrackChange }) => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    audioData,
    play,
    pause,
    seek,
    setVolume,
    loadTrack
  } = useAudio();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Load current track when it changes
  useEffect(() => {
    if (currentTrack?.url) {
      loadTrack(currentTrack.url);
    }
  }, [currentTrack, loadTrack]);

  // Audio visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioData) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const barWidth = width / audioData.length;
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, natureColors.primary.emerald);
      gradient.addColorStop(0.5, natureColors.primary.sage);
      gradient.addColorStop(1, natureColors.accent.moss);
      
      ctx.fillStyle = gradient;

      audioData.forEach((value, index) => {
        const barHeight = (value / 255) * height * 0.8;
        const x = index * barWidth;
        const y = height - barHeight;
        
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      draw();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioData, isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handlePrevious = () => {
    if (!playlist || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack?.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    onTrackChange(playlist[previousIndex]);
  };

  const handleNext = () => {
    if (!playlist || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack?.id);
    const nextIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
    onTrackChange(playlist[nextIndex]);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, percent)));
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${glassMorphism.container} p-8 text-center`}
      >
        <div className="text-gray-400">
          <Volume2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No track selected</p>
          <p className="text-sm mt-2">Upload a track to start listening</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${glassMorphism.container} p-6 space-y-6`}
    >
      {/* Visualizer */}
      <div className="relative h-32 rounded-lg overflow-hidden bg-black/20">
        <canvas
          ref={canvasRef}
          width={800}
          height={128}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Track Info */}
      <div className="text-center space-y-2">
        <motion.h3
          key={currentTrack.name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-semibold text-white truncate"
        >
          {currentTrack.name}
        </motion.h3>
        <p className="text-gray-300 text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div
          className="h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden"
          onClick={handleSeek}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${natureColors.gradients.primary} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          disabled={!playlist || playlist.length <= 1}
        >
          <SkipBack className="w-5 h-5 text-white" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayPause}
          className={`p-4 rounded-full bg-gradient-to-r ${natureColors.gradients.primary} shadow-lg`}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Pause className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Play className="w-6 h-6 text-white ml-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          disabled={!playlist || playlist.length <= 1}
        >
          <SkipForward className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </motion.button>

        <AnimatePresence>
          {showVolumeSlider && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 100 }}
              exit={{ opacity: 0, width: 0 }}
              className="h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden"
              onClick={handleVolumeChange}
            >
              <div
                className={`h-full bg-gradient-to-r ${natureColors.gradients.primary} rounded-full transition-all duration-150`}
                style={{ width: `${volume * 100}%` }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <span className="text-xs text-gray-400 w-8 text-center">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </motion.div>
  );
};

export default Player;
