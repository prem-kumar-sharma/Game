// Initial progress state structure
const initialProgress = {
  currentLevel: 1,
  unlockedLevels: 1,
  unlockedCharacters: [], // Initialize as empty array
  lastPlayed: null,
  playerName: '',
  storyProgress: {
    completedLevels: [],
    unlockedCharacters: [],
    currentChapter: 1
  }
};

// Save game progress to localStorage
export const saveGameProgress = (data) => {
  try {
    const progressData = {
      ...initialProgress,
      ...data,
      lastPlayed: new Date().toISOString()
    };
    localStorage.setItem('whisperWorld_progress', JSON.stringify(progressData));
    return true;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
};

// Load game progress from localStorage
export const loadGameProgress = () => {
  try {
    const saved = localStorage.getItem('whisperWorld_progress');
    if (!saved) {
      return initialProgress;
    }
    const parsedProgress = JSON.parse(saved);
    // Ensure all arrays are properly initialized
    return {
      ...initialProgress,
      ...parsedProgress,
      unlockedCharacters: Array.isArray(parsedProgress.unlockedCharacters) 
        ? parsedProgress.unlockedCharacters 
        : [],
      storyProgress: {
        ...initialProgress.storyProgress,
        ...parsedProgress.storyProgress,
        completedLevels: Array.isArray(parsedProgress.storyProgress?.completedLevels)
          ? parsedProgress.storyProgress.completedLevels
          : [],
        unlockedCharacters: Array.isArray(parsedProgress.storyProgress?.unlockedCharacters)
          ? parsedProgress.storyProgress.unlockedCharacters
          : []
      }
    };
  } catch (error) {
    console.error('Error loading progress:', error);
    return initialProgress;
  }
};

// Update specific progress aspects
export const updateProgress = (progress, updateType, data) => {
  try {
    const currentProgress = { ...progress };

    switch (updateType) {
      case 'COMPLETE_LEVEL':
        if (!currentProgress.storyProgress.completedLevels.includes(data.level)) {
          currentProgress.storyProgress.completedLevels.push(data.level);
          currentProgress.unlockedLevels = Math.max(
            currentProgress.unlockedLevels,
            data.level + 1
          );
        }
        break;

      case 'UNLOCK_CHARACTER':
        if (!currentProgress.unlockedCharacters.includes(data.characterId)) {
          currentProgress.unlockedCharacters.push(data.characterId);
          currentProgress.storyProgress.unlockedCharacters.push(data.characterId);
        }
        break;

      case 'UPDATE_LEVEL':
        currentProgress.currentLevel = data.level;
        break;

      case 'UPDATE_CHAPTER':
        currentProgress.storyProgress.currentChapter = data.chapter;
        break;

      default:
        console.warn('Unknown update type:', updateType);
    }

    // Save the updated progress
    saveGameProgress(currentProgress);
    return currentProgress;
  } catch (error) {
    console.error('Error updating progress:', error);
    return progress; // Return original progress if update fails
  }
};

// Get level completion status
export const getLevelStatus = (progress, level) => {
  return {
    isUnlocked: level <= progress.unlockedLevels,
    isCompleted: progress.storyProgress.completedLevels.includes(level),
    hasCharacterUnlocked: progress.unlockedCharacters.includes(level)
  };
};

// Reset progress (for testing or player reset)
export const resetProgress = () => {
  localStorage.removeItem('whisperWorld_progress');
  return initialProgress;
};

export default {
  saveGameProgress,
  loadGameProgress,
  updateProgress,
  getLevelStatus,
  resetProgress,
  initialProgress
};