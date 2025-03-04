import React, {useEffect, useState} from 'react';
import {DAYS_FROM_ZERO_DATE_TO_TODAY, useDateStore} from './state.ts';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

export const DateRangeSlider: React.FC = () => {
    const [sliderValues, setSliderValues] = useState<[number, number]>([0, DAYS_FROM_ZERO_DATE_TO_TODAY]);
    const [isDragging, setIsDragging] = useState(false);

    const setDatesAsDaysAfterZeroDate = useDateStore(state => state.setDatesAsDaysAfterZeroDate);
    const setDisplayDatesAsDaysAfterZeroDate = useDateStore(state => state.setDisplayDatesAsDaysAfterZeroDate);

    useEffect(() => {
        setDisplayDatesAsDaysAfterZeroDate(sliderValues[0], sliderValues[1]);
        if (!isDragging) {
            setDatesAsDaysAfterZeroDate(sliderValues[0], sliderValues[1]);
        }
    }, [isDragging, sliderValues, setDatesAsDaysAfterZeroDate]);

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
