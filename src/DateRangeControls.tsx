import {useAtom} from 'jotai';
import {useDebouncedCallback} from 'use-debounce';
import {datapointNumberVisibleAtom, DAYS_FROM_ZERO_DATE_TO_TODAY, useDateStore} from './state.ts';
import {DateRangeSlider} from "./DateRangeSlider.tsx";
import {useEffect, useState} from "react";
import {useGameDataStore} from "./useGameDataStore.ts";

export const DateRangeControls: React.FC = () => {
    const [datapointNumberVisible, setDatapointNumberVisible] = useAtom(datapointNumberVisibleAtom);

    const [topRanksShowed, setTopRanksShowed] = useState(100);
    const [inFormDatapointNumber, setInFormDatapointNumber] = useState(datapointNumberVisible);
    const [inFormTopRanksShowed, setInFormTopRanksShowed] = useState(topRanksShowed);

    const minDateDisplayed = useDateStore(state => state.minDateDisplayed);
    const maxDateDisplayed = useDateStore(state => state.maxDateDisplayed);

    const calculateVisibleGamesData = useGameDataStore(state => state.calculateVisibleGamesData);
    const dailyGameData = useGameDataStore(state => state.dailyGameData);

    const debouncedSetDatapoints = useDebouncedCallback(
        (value: number) => setDatapointNumberVisible(value), 300
    );

    const debouncedSetTopRanks = useDebouncedCallback(
        (value: number) => setTopRanksShowed(value), 300
    );

    const outerContainerStyle = "rounded-lg shadow"
    const inputStyle = "w-full border p-2 rounded text-center"
    const labelStyle = "block font-medium"

    useEffect(() => {
        if (dailyGameData.length > 0) {
            calculateVisibleGamesData(topRanksShowed)
        }
    }, [topRanksShowed, dailyGameData]);

    return (
        <>
            <div className={outerContainerStyle}>
                <label className={labelStyle}>Datapoints visible:</label>
                <input
                    type="number"
                    value={inFormDatapointNumber}
                    min="1"
                    max={DAYS_FROM_ZERO_DATE_TO_TODAY}
                    onChange={(e) => {
                        let target = Number(e.target.value)
                        if (target < 3) target = 3
                        if (target > DAYS_FROM_ZERO_DATE_TO_TODAY) target = DAYS_FROM_ZERO_DATE_TO_TODAY
                        debouncedSetDatapoints(target)
                        setInFormDatapointNumber(target)
                    }}
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
                    onChange={(e) => {
                        let target = Number(e.target.value)
                        if (target < 1) target = 1
                        if (target > 500) target = 500
                        debouncedSetTopRanks(target)
                        setInFormTopRanksShowed(target)
                    }}
                    className={inputStyle}
                />
            </div>
            <div className="col-span-2 flex flex-col">
                <div className="grow"></div>
                <div>
                    <DateRangeSlider/>
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
