import { useDebouncedCallback } from 'use-debounce';
import { DAYS_FROM_ZERO_DATE_TO_TODAY, useDateStore } from './state.ts';
import { DateRangeSlider } from "./DateRangeSlider.tsx";
import { useEffect, useState, useCallback } from "react";
import { useGameDataStore } from "./useGameDataStore.ts";

export const DateRangeControls: React.FC = () => {

    const datapointNumberVisible = useDateStore(state => state.datapointNumberVisible);
    const setDatapointNumberVisible = useDateStore(state => state.setDatapointNumberVisible);
    const minDateDisplayed = useDateStore(state => state.minDateDisplayed);
    const maxDateDisplayed = useDateStore(state => state.maxDateDisplayed);

    const calculateVisibleGamesData = useGameDataStore(state => state.calculateVisibleGamesData);
    const dailyGameData = useGameDataStore(state => state.dailyGameData);

    const [topRanksShowed, setTopRanksShowed] = useState(100);
    const [inFormDatapointNumber, setInFormDatapointNumber] = useState(datapointNumberVisible);
    const [inFormTopRanksShowed, setInFormTopRanksShowed] = useState(topRanksShowed);

    const debouncedSetDatapoints = useDebouncedCallback(
        (value: number) => setDatapointNumberVisible(value), 300
    );

    const debouncedSetTopRanks = useDebouncedCallback(
        (value: number) => setTopRanksShowed(value), 300
    );

    const updateTopRanks = useCallback((target: number) => {
        if (target < 1) target = 1;
        if (target > 500) target = 500;
        debouncedSetTopRanks(target);
        setInFormTopRanksShowed(target);
    }, [debouncedSetTopRanks]);

    const updateDatapoints = useCallback((target: number) => {
        if (target < 3) target = 3;
        if (target > DAYS_FROM_ZERO_DATE_TO_TODAY) target = DAYS_FROM_ZERO_DATE_TO_TODAY;
        debouncedSetDatapoints(target);
        setInFormDatapointNumber(target);
    }, [debouncedSetDatapoints]);

    // Update visible games data when topRanksShowed changes
    useEffect(() => {
        console.log('Top ranks showed changed');
        if (dailyGameData.length > 0) {
            calculateVisibleGamesData(topRanksShowed);
        }
    }, [topRanksShowed, dailyGameData.length, calculateVisibleGamesData]);

    // Sync form state with store state
    useEffect(() => {
        setInFormDatapointNumber(datapointNumberVisible);
    }, [datapointNumberVisible]);

    const outerContainerStyle = "rounded-lg shadow";
    const inputStyle = "w-full border p-2 rounded text-center";
    const labelStyle = "block font-medium";

    return (
        <>
            <div className={outerContainerStyle}>
                <label className={labelStyle}>Datapoints visible:</label>
                <input
                    type="number"
                    value={inFormDatapointNumber}
                    min="1"
                    max={DAYS_FROM_ZERO_DATE_TO_TODAY}
                    onChange={(e) => updateDatapoints(Number(e.target.value))}
                    className={inputStyle}
                />
            </div>
            <div className={outerContainerStyle}>
                <label className={labelStyle}>Top ranks showed:</label>
                <input
                    type="number"
                    value={inFormTopRanksShowed}
                    min="1"
                    max="500"
                    onChange={(e) => updateTopRanks(Number(e.target.value))}
                    className={inputStyle}
                />
            </div>
            <div className="col-span-2 flex flex-col">
                <div className="grow"></div>
                <div>
                    <DateRangeSlider />
                </div>
                <div className="flex">
                    <div className="my-2">
                        {minDateDisplayed.toISOString().split('T')[0]}
                    </div>
                    <div className="grow"></div>
                    <div className="my-2">
                        {maxDateDisplayed.toISOString().split('T')[0]}
                    </div>
                </div>
            </div>
        </>
    );
};
