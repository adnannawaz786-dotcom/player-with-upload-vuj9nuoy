import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';
import { glass, gradients, colors, natureColors, visualizer, animations } from '../styles/theme';

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

  useEffect(() => {
    if (currentTrack?.url) loadTrack(currentTrack.url);
  }, [currentTrack, loadTrack]);

  // Draw audio visualizer bars
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

      // Use natureColors forest shades for gradient
      gradient.addColorStop(0, colors.forest[500]);
      gradient.addColorStop(0.5, colors.forest[400]);
      gradient.addColorStop(1, colors.forest[300]);

      ctx.fillStyle = gradient;

      audioData.forEach((value, index) => {
        const barHeight = (value / 255) * height * 0.8;
        const x = index * barWidth;
        const y = height - barHeight;

        ctx.fillRect(x, y, barWidth - 1, barHeight);
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [audioData, isPlaying]);

  const handlePlayPause = () => (isPlaying ? pause() : play());
  const handlePrevious = () => {
    if (!playlist || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    onTrackChange(playlist[prevIndex]);
  };
  const handleNext = () => {
    if (!playlist || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
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
    setVolume(Math.min(1, Math.max(0, percent)));
  };
  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <motion.div
        initial={animations.slideUp.initial}
        animate={animations.slideUp.animate}
        transition={animations.slideUp.transition}
        style={{
          background: glass.nature.background,
          backdropFilter: glass.nature.backdropFilter,
          border: glass.nature.border,
          boxShadow: glass.nature.boxShadow,
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          color: colors.sage[700],
        }}
      >
        <Volume2 size={64} className="mx-auto opacity-50 mb-4" />
        <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>No track selected</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Upload a track to start listening</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={animations.slideUp.initial}
      animate={animations.slideUp.animate}
      transition={animations.slideUp.transition}
      style={{
        background: glass.nature.background,
        backdropFilter: glass.nature.backdropFilter,
        border: glass.nature.border,
        boxShadow: glass.nature.boxShadow,
        borderRadius: '1rem',
        padding: '1.5rem',
        color: colors.sage[900],
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Visualizer */}
      <div style={{ position: 'relative', height: 128, borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: visualizer.background }}>
        <canvas ref={canvasRef} width={800} height={128} style={{ width: '100%', height: '100%' }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: gradients.ethereal,
          opacity: 0.3,
          pointerEvents: 'none',
        }} />
      </div>

      {/* Track Info */}
      <div style={{ textAlign: 'center' }}>
        <motion.h3
          key={currentTrack.name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: colors.forest[700],
          }}
        >
          {currentTrack.name}
        </motion.h3>
        <p style={{ fontSize: '0.875rem', color: colors.sage[600] }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </p>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: 8,
          borderRadius: 9999,
          backgroundColor: colors.sage[200],
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onClick={handleSeek}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.15 }}
          style={{
            height: '100%',
            borderRadius: 9999,
            background: gradients.forest,
          }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', alignItems: 'center' }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          disabled={!playlist || playlist.length <= 1}
          style={{
            backgroundColor: 'rgba(255 255 255 / 0.1)',
            borderRadius: '9999px',
            padding: 8,
            cursor: 'pointer',
            border: 'none',
            color: colors.forest[700],
            opacity: (!playlist || playlist.length <= 1) ? 0.5 : 1,
          }}
          aria-label="Previous track"
        >
          <SkipBack size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayPause}
          style={{
            background: gradients.forest,
            boxShadow: '0 8px 25px rgba(34,197,94,0.25)',
            borderRadius: '9999px',
            padding: 16,
            color: 'white',
            cursor: 'pointer',
            border: 'none',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Pause size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Play size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={!playlist || playlist.length <= 1}
          style={{
            backgroundColor: 'rgba(255 255 255 / 0.1)',
            borderRadius: '9999px',
            padding: 8,
            cursor: 'pointer',
            border: 'none',
            color: colors.forest[700],
            opacity: (!playlist || playlist.length <= 1) ? 0.5 : 1,
          }}
          aria-label="Next track"
        >
          <SkipForward size={20} />
        </motion.button>
      </div>

      {/* Volume Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowVolumeSlider(v => !v)}
          style={{
            backgroundColor: 'rgba(255 255 255 / 0.1)',
            borderRadius: '9999px',
            padding: 8,
            cursor: 'pointer',
            border: 'none',
            color: colors.forest[700],
          }}
          aria-label="Toggle volume slider"
        >
          {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </motion.button>

        <AnimatePresence>
          {showVolumeSlider && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 100 }}
              exit={{ opacity: 0, width: 0 }}
              style={{
                height: 8,
                borderRadius: 9999,
                backgroundColor: colors.sage[200],
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              onClick={handleVolumeChange}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: 9999,
                  background: gradients.forest,
                  width: `${volume * 100}%`,
                  transition: 'width 0.15s ease-in-out',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <span style={{ fontSize: '0.75rem', color: colors.sage[600], width: 32, textAlign: 'center' }}>
          {Math.round(volume * 100)}%
        </span>
      </div>
    </motion.div>
  );
};

export default Player;
