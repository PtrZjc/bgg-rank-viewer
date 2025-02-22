import React, {useEffect, useState} from 'react';
import {useDebounce} from 'use-debounce';
import {DAYS_FROM_ZERO_DATE_TO_TODAY, useDateStore} from './state.ts';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

export const DateRangeSlider: React.FC = () => {
    const [sliderValues, setSliderValues] = useState<[number, number]>([0, DAYS_FROM_ZERO_DATE_TO_TODAY]);

    const [debouncedDates] = useDebounce(sliderValues, 300);

    const setDatesAsDaysAfterZeroDate = useDateStore(state => state.setDatesAsDaysAfterZeroDate);
    const setDisplayDatesAsDaysAfterZeroDate = useDateStore(state => state.setDisplayDatesAsDaysAfterZeroDate);

    useEffect(() => { // update dates to data fetch
        setDatesAsDaysAfterZeroDate(debouncedDates[0], debouncedDates[1]);
    }, [debouncedDates, setDatesAsDaysAfterZeroDate]);

    useEffect(() => { // update displayed dates
        setDisplayDatesAsDaysAfterZeroDate(sliderValues[0], sliderValues[1]);
    }, [sliderValues, setDisplayDatesAsDaysAfterZeroDate]);

    return (
        <RangeSlider
            max={DAYS_FROM_ZERO_DATE_TO_TODAY}
            value={sliderValues}
            onInput={(values: [number, number]) => setSliderValues(values)}
        />
    );
};
