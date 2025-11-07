import React, {useEffect, useRef, useState} from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import {DAYS_FROM_ZERO_DATE_TO_TODAY, MILLIS_IN_DAY, useDateStore, ZERO_DATE} from 'src/components/Game/DateRange/store';

interface DateRangeSliderProps {
  onRangeChange: (min: number, max: number) => void;
  onDisplayRangeChange: (min: number, max: number) => void;
}

export const DateRangeSlider: React.FC<DateRangeSliderProps> = ({
                                                                  onRangeChange,
                                                                  onDisplayRangeChange
                                                                }) => {
  // Get current dates from store to keep slider in sync
  const minDate = useDateStore(state => state.minDate);
  const maxDate = useDateStore(state => state.maxDate);

  // Convert dates to days after zero date
  const minDays = Math.floor((minDate.getTime() - ZERO_DATE.getTime()) / MILLIS_IN_DAY);
  const maxDays = Math.floor((maxDate.getTime() - ZERO_DATE.getTime()) / MILLIS_IN_DAY);

  // Local state for current slider position during drag
  const [currentValues, setCurrentValues] = useState<[number, number]>([minDays, maxDays]);
  const isDraggingRef = useRef(false);

  // Sync local state with store when not dragging
  useEffect(() => {
    if (!isDraggingRef.current) {
      setCurrentValues([minDays, maxDays]);
    }
  }, [minDays, maxDays]);

  const handleInput = (values: [number, number]) => {
    // Update local state and display immediately while dragging
    setCurrentValues(values);
    onDisplayRangeChange(values[0], values[1]);
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    // Commit the current values to the store
    onRangeChange(currentValues[0], currentValues[1]);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <RangeSlider
        max={DAYS_FROM_ZERO_DATE_TO_TODAY}
        value={currentValues}
        onInput={handleInput}
      />
    </div>
  );
};
