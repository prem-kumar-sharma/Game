// Classic Mode Words
export const classicWords = [
  'APPLE', 'BRAVE', 'CHEST', 'DANCE', 'EAGLE',
  'FLAME', 'GRAPE', 'HEART', 'IMAGE', 'JUICE',
  'KNOCK', 'LIGHT', 'MOUSE', 'NAIVE', 'OCEAN',
  'PEACE', 'QUICK', 'RANGE', 'SMILE', 'TRAIN'
];

// Story Mode Words by Level
export const storyWords = {
  1: {
      words: ['SPEAK', 'VOICE', 'SOUND', 'QUIET', 'NOISE'],
      difficulty: 'easy'
  },
  2: {
      words: ['MAGIC', 'SPELL', 'CHARM', 'WITCH', 'POTION'],
      difficulty: 'medium'
  },
  3: {
      words: ['WHISPER', 'SILENCE', 'ENCHANT', 'MYSTIC', 'SPIRIT'],
      difficulty: 'hard'
  }
};

export const getClassicWord = () => {
  return classicWords[Math.floor(Math.random() * classicWords.length)];
};

export const getStoryWord = (level) => {
  const levelData = storyWords[level] || storyWords[1];
  const words = levelData.words;
  return {
      word: words[Math.floor(Math.random() * words.length)],
      difficulty: levelData.difficulty
  };
};

export const isValidWord = (word) => {
  const allWords = [
      ...classicWords,
      ...Object.values(storyWords).flatMap(level => level.words)
  ];
  return allWords.includes(word.toUpperCase());
};