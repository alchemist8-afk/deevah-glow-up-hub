
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMood, MoodType } from '@/contexts/MoodContext';

const moods = [
  { type: 'calm' as MoodType, emoji: '🌿', label: 'Calm', description: 'Peaceful & Relaxing' },
  { type: 'fast' as MoodType, emoji: '⚡', label: 'Fast', description: 'Quick & Efficient' },
  { type: 'social' as MoodType, emoji: '💃', label: 'Social', description: 'Fun & Interactive' },
  { type: 'private' as MoodType, emoji: '🤫', label: 'Private', description: 'Intimate & Personal' }
];

interface MoodPickerProps {
  compact?: boolean;
  onMoodSelect?: (mood: MoodType) => void;
}

export function MoodPicker({ compact = false, onMoodSelect }: MoodPickerProps) {
  const { selectedMood, setMood } = useMood();

  const handleMoodSelect = (mood: MoodType) => {
    const newMood = selectedMood === mood ? null : mood;
    setMood(newMood);
    if (onMoodSelect && newMood) {
      onMoodSelect(newMood);
    }
  };

  if (compact) {
    return (
      <div className="flex gap-2 flex-wrap">
        {moods.map((mood) => (
          <Button
            key={mood.type}
            variant={selectedMood === mood.type ? "default" : "outline"}
            size="sm"
            onClick={() => handleMoodSelect(mood.type)}
            className="flex items-center gap-2"
          >
            <span className="text-lg">{mood.emoji}</span>
            <span>{mood.label}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">What's your vibe today?</h3>
        <p className="text-gray-600">Choose your mood to get personalized recommendations</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {moods.map((mood) => (
          <Card
            key={mood.type}
            className={`p-4 cursor-pointer transition-all hover:scale-105 ${
              selectedMood === mood.type 
                ? 'ring-2 ring-[#E07A5F] bg-[#E07A5F]/10' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleMoodSelect(mood.type)}
          >
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">{mood.emoji}</div>
              <h4 className="font-semibold text-gray-900">{mood.label}</h4>
              <p className="text-sm text-gray-600">{mood.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {selectedMood && (
        <div className="text-center p-4 bg-[#F4F1DE] rounded-lg">
          <p className="text-[#E07A5F] font-medium">
            {moods.find(m => m.type === selectedMood)?.emoji} 
            {moods.find(m => m.type === selectedMood)?.label} vibes selected! 
            Your recommendations are now personalized.
          </p>
        </div>
      )}
    </div>
  );
}
