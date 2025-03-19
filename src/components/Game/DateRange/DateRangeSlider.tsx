import React, {useEffect, useState} from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import {DAYS_FROM_ZERO_DATE_TO_TODAY} from 'src/components/Game/DateRange/store';

interface DateRangeSliderProps {
  onRangeChange: (min: number, max: number) => void;
  onDisplayRangeChange: (min: number, max: number) => void;
}

export const DateRangeSlider: React.FC<DateRangeSliderProps> = ({
                                                                  onRangeChange,
                                                                  onDisplayRangeChange
                                                                }) => {
  const [sliderValues, setSliderValues] = useState<[number, number]>([0, DAYS_FROM_ZERO_DATE_TO_TODAY]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    onDisplayRangeChange(sliderValues[0], sliderValues[1]);
    if (!isDragging) {
      onRangeChange(sliderValues[0], sliderValues[1]);
    }
  }, [isDragging, sliderValues, onRangeChange, onDisplayRangeChange]);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <RangeSlider
        max={DAYS_FROM_ZERO_DATE_TO_TODAY}
        value={sliderValues}
        onInput={(values: [number, number]) => setSliderValues(values)}
      />
    </div>
  );
};
