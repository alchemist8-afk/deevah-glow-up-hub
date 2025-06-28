
export const parseServiceDuration = (duration: string | number): number => {
  if (typeof duration === 'number') return duration;
  
  // Parse duration strings like "2 hours", "90 mins", etc.
  const match = duration.match(/(\d+)\s*(hour|hr|min|minute)/i);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    if (unit.startsWith('hour') || unit.startsWith('hr')) {
      return value * 60; // Convert hours to minutes
    }
    return value; // Already in minutes
  }
  
  // Fallback: try to parse as number
  const parsed = parseInt(duration);
  return isNaN(parsed) ? 60 : parsed; // Default to 60 minutes
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  
  if (remainingMins === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours}h ${remainingMins}m`;
};
