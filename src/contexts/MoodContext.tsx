
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MoodType = 'calm' | 'fast' | 'social' | 'private' | null;

interface MoodContextType {
  selectedMood: MoodType;
  setSelectedMood: (mood: MoodType) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>(null);

  return (
    <MoodContext.Provider value={{ selectedMood, setSelectedMood }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
