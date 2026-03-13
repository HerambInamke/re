'use client';

interface HorizonSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function HorizonSlider({ value, onChange }: HorizonSliderProps) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <label htmlFor="horizon-slider" className="text-sm font-medium text-gray-700">
        Forecast Horizon: {value} hours
      </label>
      <input
        id="horizon-slider"
        type="range"
        min="0"
        max="48"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>0h</span>
        <span>24h</span>
        <span>48h</span>
      </div>
    </div>
  );
}
