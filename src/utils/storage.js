// LocalStorage management utilities for audio player
const STORAGE_KEYS = {
  TRACKS: 'audio_player_tracks',
  CURRENT_TRACK: 'audio_player_current_track',
  VOLUME: 'audio_player_volume',
  PLAYLIST_STATE: 'audio_player_playlist_state',
  USER_PREFERENCES: 'audio_player_preferences'
};

// Track storage operations
export const trackStorage = {
  // Get all tracks from localStorage
  getTracks: () => {
    try {
      const tracks = localStorage.getItem(STORAGE_KEYS.TRACKS);
      return tracks ? JSON.parse(tracks) : [];
    } catch (error) {
      console.error('Error loading tracks from storage:', error);
      return [];
    }
  },

  // Save tracks to localStorage
  saveTracks: (tracks) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(tracks));
      return true;
    } catch (error) {
      console.error('Error saving tracks to storage:', error);
      return false;
    }
  },

  // Add a new track
  addTrack: (track) => {
    try {
      const tracks = trackStorage.getTracks();
      const newTrack = {
        id: Date.now().toString(),
        name: track.name,
        url: track.url,
        duration: track.duration || 0,
        size: track.size || 0,
        type: track.type || 'audio/mpeg',
        addedAt: new Date().toISOString(),
        ...track
      };
      
      tracks.push(newTrack);
      trackStorage.saveTracks(tracks);
      return newTrack;
    } catch (error) {
      console.error('Error adding track to storage:', error);
      return null;
    }
  },

  // Remove a track by ID
  removeTrack: (trackId) => {
    try {
      const tracks = trackStorage.getTracks();
      const filteredTracks = tracks.filter(track => track.id !== trackId);
      trackStorage.saveTracks(filteredTracks);
      return true;
    } catch (error) {
      console.error('Error removing track from storage:', error);
      return false;
    }
  },

  // Update track metadata
  updateTrack: (trackId, updates) => {
    try {
      const tracks = trackStorage.getTracks();
      const trackIndex = tracks.findIndex(track => track.id === trackId);
      
      if (trackIndex !== -1) {
        tracks[trackIndex] = { ...tracks[trackIndex], ...updates };
        trackStorage.saveTracks(tracks);
        return tracks[trackIndex];
      }
      return null;
    } catch (error) {
      console.error('Error updating track in storage:', error);
      return null;
    }
  },

  // Clear all tracks
  clearTracks: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TRACKS);
      return true;
    } catch (error) {
      console.error('Error clearing tracks from storage:', error);
      return false;
    }
  }
};

// Player state storage operations
export const playerStorage = {
  // Get current track
  getCurrentTrack: () => {
    try {
      const track = localStorage.getItem(STORAGE_KEYS.CURRENT_TRACK);
      return track ? JSON.parse(track) : null;
    } catch (error) {
      console.error('Error loading current track from storage:', error);
      return null;
    }
  },

  // Save current track
  setCurrentTrack: (track) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_TRACK, JSON.stringify(track));
      return true;
    } catch (error) {
      console.error('Error saving current track to storage:', error);
      return false;
    }
  },

  // Get volume setting
  getVolume: () => {
    try {
      const volume = localStorage.getItem(STORAGE_KEYS.VOLUME);
      return volume ? parseFloat(volume) : 0.7;
    } catch (error) {
      console.error('Error loading volume from storage:', error);
      return 0.7;
    }
  },

  // Save volume setting
  setVolume: (volume) => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
      return true;
    } catch (error) {
      console.error('Error saving volume to storage:', error);
      return false;
    }
  },

  // Get playlist state
  getPlaylistState: () => {
    try {
      const state = localStorage.getItem(STORAGE_KEYS.PLAYLIST_STATE);
      return state ? JSON.parse(state) : {
        shuffle: false,
        repeat: 'none', // 'none', 'one', 'all'
        currentIndex: 0
      };
    } catch (error) {
      console.error('Error loading playlist state from storage:', error);
      return { shuffle: false, repeat: 'none', currentIndex: 0 };
    }
  },

  // Save playlist state
  setPlaylistState: (state) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLIST_STATE, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Error saving playlist state to storage:', error);
      return false;
    }
  }
};

// User preferences storage
export const preferencesStorage = {
  // Get user preferences
  getPreferences: () => {
    try {
      const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return prefs ? JSON.parse(prefs) : {
        theme: 'nature',
        visualizerType: 'bars',
        showVisualizer: true,
        autoPlay: false,
        crossfade: 0
      };
    } catch (error) {
      console.error('Error loading preferences from storage:', error);
      return {
        theme: 'nature',
        visualizerType: 'bars',
        showVisualizer: true,
        autoPlay: false,
        crossfade: 0
      };
    }
  },

  // Save user preferences
  setPreferences: (preferences) => {
    try {
      const currentPrefs = preferencesStorage.getPreferences();
      const updatedPrefs = { ...currentPrefs, ...preferences };
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPrefs));
      return true;
    } catch (error) {
      console.error('Error saving preferences to storage:', error);
      return false;
    }
  },

  // Update a specific preference
  updatePreference: (key, value) => {
    try {
      const prefs = preferencesStorage.getPreferences();
      prefs[key] = value;
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs));
      return true;
    } catch (error) {
      console.error('Error updating preference in storage:', error);
      return false;
    }
  }
};

// File handling utilities
export const fileStorage = {
  // Convert file to base64 for storage
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  // Create object URL for audio playback
  createAudioURL: (file) => {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error('Error creating audio URL:', error);
      return null;
    }
  },

  // Validate audio file
  validateAudioFile: (file) => {
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload an audio file.' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Please upload a file smaller than 50MB.' };
    }
    
    return { valid: true };
  },

  // Get audio metadata
  getAudioMetadata: (file) => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        resolve({
          duration: audio.duration,
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          size: file.size,
          type: file.type
        });
        URL.revokeObjectURL(url);
      });
      
      audio.addEventListener('error', () => {
        resolve({
          duration: 0,
          name: file.name.replace(/\.[^/.]+$/, ""),
          size: file.size,
          type: file.type
        });
        URL.revokeObjectURL(url);
      });
      
      audio.src = url;
    });
  }
};

// Storage cleanup utilities
export const storageUtils = {
  // Get storage usage
  getStorageUsage: () => {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length;
        }
      }
      return {
        used: total,
        usedMB: (total / 1024 / 1024).toFixed(2)
      };
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return { used: 0, usedMB: '0.00' };
    }
  },

  // Clear all app data
  clearAllData: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  },

  // Export all data
  exportData: () => {
    try {
      const data = {};
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        const value = localStorage.getItem(key);
        if (value) {
          data[name] = JSON.parse(value);
        }
      });
      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  },

  // Import data
  importData: (data) => {
    try {
      Object.entries(data).forEach(([name, value]) => {
        const key = STORAGE_KEYS[name];
        if (key) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
};

// Initialize storage with default values if empty
export const initializeStorage = () => {
  try {
    // Initialize tracks if empty
    if (!localStorage.getItem(STORAGE_KEYS.TRACKS)) {
      trackStorage.saveTracks([]);
    }

    // Initialize preferences if empty
    if (!localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)) {
      preferencesStorage.setPreferences({});
    }

    // Initialize playlist state if empty
    if (!localStorage.getItem(STORAGE_KEYS.PLAYLIST_STATE)) {
      playerStorage.setPlaylistState({
        shuffle: false,
        repeat: 'none',
        currentIndex: 0
      });
    }

    // Initialize volume if empty
    if (!localStorage.getItem(STORAGE_KEYS.VOLUME)) {
      playerStorage.setVolume(0.7);
    }

    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
};