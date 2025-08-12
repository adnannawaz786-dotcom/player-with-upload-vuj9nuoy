import { useState, useRef, useEffect } from 'react';

export const useAudio = (src) => {
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visualizerData, setVisualizerData] = useState(new Array(64).fill(0));

  // Initialize audio context and analyser
  const initializeAudioContext = () => {
    if (!audioContextRef.current && audioRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        analyserRef.current.fftSize = 128;
        analyserRef.current.smoothingTimeConstant = 0.8;
        
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      } catch (err) {
        console.error('Failed to initialize audio context:', err);
        setError('Audio visualization not supported');
      }
    }
  };

  // Update visualizer data
  const updateVisualizer = () => {
    if (analyserRef.current && dataArrayRef.current && isPlaying) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      setVisualizerData([...dataArrayRef.current]);
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    }
  };

  // Play audio
  const play = async () => {
    if (audioRef.current) {
      try {
        setIsLoading(true);
        setError(null);
        
        // Resume audio context if suspended
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
        updateVisualizer();
      } catch (err) {
        console.error('Play failed:', err);
        setError('Failed to play audio');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Pause audio
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // Seek to specific time
  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Change volume
  const changeVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  // Mute/unmute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  // Skip forward/backward
  const skip = (seconds) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      seek(newTime);
    }
  };

  // Initialize audio element
  useEffect(() => {
    if (src) {
      const audio = new Audio();
      audioRef.current = audio;
      
      audio.src = src;
      audio.volume = volume;
      audio.preload = 'metadata';

      // Event listeners
      const handleLoadStart = () => setIsLoading(true);
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setIsLoading(false);
        initializeAudioContext();
      };
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
      const handleError = (e) => {
        setError('Failed to load audio file');
        setIsLoading(false);
        console.error('Audio error:', e);
      };
      const handleCanPlay = () => setIsLoading(false);

      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('canplay', handleCanPlay);

      return () => {
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('canplay', handleCanPlay);
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        audio.pause();
        audio.src = '';
      };
    }
  }, [src, volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    audioRef,
    isPlaying,
    duration,
    currentTime,
    volume,
    isLoading,
    error,
    visualizerData,
    play,
    pause,
    togglePlayPause,
    seek,
    changeVolume,
    toggleMute,
    skip
  };
};

export const useVisualizerCanvas = (canvasRef, visualizerData, isPlaying) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (!isPlaying || !visualizerData.length) {
      return;
    }

    // Create gradient
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)'); // green-500
    gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.8)'); // blue-500
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0.8)'); // purple-500

    const barWidth = width / visualizerData.length;

    visualizerData.forEach((value, index) => {
      const barHeight = (value / 255) * height * 0.8;
      const x = index * barWidth;
      const y = height - barHeight;

      // Draw bar with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 1, barHeight);

      // Add glow effect
      ctx.shadowColor = 'rgba(34, 197, 94, 0.5)';
      ctx.shadowBlur = 10;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
      ctx.shadowBlur = 0;
    });
  }, [visualizerData, isPlaying]);
};