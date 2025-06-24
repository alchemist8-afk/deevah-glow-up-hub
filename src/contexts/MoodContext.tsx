
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MoodType = 'calm' | 'fast' | 'social' | 'private';

interface MoodContextType {
  selectedMood: MoodType | null;
  setMood: (mood: MoodType | null) => void;
  getMoodEmoji: (mood: MoodType) => string;
  getMoodColor: (mood: MoodType) => string;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

const moodConfig = {
  calm: { emoji: '🌿', color: 'green' },
  fast: { emoji: '⚡', color: 'yellow' },
  social: { emoji: '💃', color: 'pink' },
  private: { emoji: '🤫', color: 'purple' }
};

export function MoodProvider({ children }: { children: ReactNode }) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const setMood = (mood: MoodType | null) => {
    setSelectedMood(mood);
  };

  const getMoodEmoji = (mood: MoodType): string => {
    return moodConfig[mood]?.emoji || '✨';
  };

  const getMoodColor = (mood: MoodType): string => {
    return moodConfig[mood]?.color || 'gray';
  };

  return (
    <MoodContext.Provider value={{
      selectedMood,
      setMood,
      getMoodEmoji,
      getMoodColor
    }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}
