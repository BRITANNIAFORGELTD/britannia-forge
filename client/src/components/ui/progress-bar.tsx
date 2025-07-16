import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div className={cn("w-32 h-2 bg-gray-200 rounded-full", className)}>
      <div 
        className="progress-bar h-full rounded-full transition-all duration-600"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
