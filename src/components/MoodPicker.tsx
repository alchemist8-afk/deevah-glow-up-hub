
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Zap, Users, EyeOff } from 'lucide-react';

export type Mood = 'calm' | 'fast' | 'social' | 'private';

interface MoodPickerProps {
  selectedMood?: Mood;
  onMoodSelect: (mood: Mood) => void;
  size?: 'sm' | 'lg';
}

const moods = [
  {
    id: 'calm' as Mood,
    icon: Leaf,
    label: 'Calm',
    description: 'Peaceful & relaxing',
    color: 'from-green-400 to-emerald-500',
    emoji: '🌿'
  },
  {
    id: 'fast' as Mood,
    icon: Zap,
    label: 'Fast',
    description: 'Quick & efficient',
    color: 'from-yellow-400 to-orange-500',
    emoji: '⚡'
  },
  {
    id: 'social' as Mood,
    icon: Users,
    label: 'Social',
    description: 'Fun with friends',
    color: 'from-pink-400 to-purple-500',
    emoji: '💃'
  },
  {
    id: 'private' as Mood,
    icon: EyeOff,
    label: 'Private',
    description: 'Just for you',
    color: 'from-blue-400 to-indigo-500',
    emoji: '🤫'
  }
];

export function MoodPicker({ selectedMood, onMoodSelect, size = 'lg' }: MoodPickerProps) {
  return (
    <div className="space-y-4">
      {size === 'lg' && (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">What's your vibe today?</h3>
          <p className="text-gray-600">Choose your mood to get personalized recommendations</p>
        </div>
      )}
      
      <div className={`grid ${size === 'sm' ? 'grid-cols-4 gap-2' : 'grid-cols-2 md:grid-cols-4 gap-4'}`}>
        {moods.map((mood) => {
          const IconComponent = mood.icon;
          const isSelected = selectedMood === mood.id;
          
          return (
            <Card 
              key={mood.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                isSelected ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => onMoodSelect(mood.id)}
            >
              <CardContent className={`p-${size === 'sm' ? '3' : '6'} text-center`}>
                <div className={`w-${size === 'sm' ? '8' : '12'} h-${size === 'sm' ? '8' : '12'} mx-auto mb-3 rounded-full bg-gradient-to-r ${mood.color} flex items-center justify-center`}>
                  {size === 'sm' ? (
                    <span className="text-lg">{mood.emoji}</span>
                  ) : (
                    <IconComponent className="w-6 h-6 text-white" />
                  )}
                </div>
                <h4 className={`font-semibold ${size === 'sm' ? 'text-sm' : 'text-lg'} text-gray-900 mb-1`}>
                  {mood.label}
                </h4>
                {size === 'lg' && (
                  <p className="text-sm text-gray-600">{mood.description}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
