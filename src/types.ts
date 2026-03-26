export interface HealthMetric {
  id: string;
  type: 'steps' | 'heartRate' | 'sleep' | 'water' | 'weight';
  value: number;
  unit: string;
  timestamp: Date;
}

export interface HealthNote {
  id: string;
  title: string;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'awful';
  timestamp: Date;
}

export interface HealthInsight {
  title: string;
  description: string;
  category: 'activity' | 'nutrition' | 'sleep' | 'mental';
}
