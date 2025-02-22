import {useAtom} from 'jotai';
import {useDebouncedCallback} from 'use-debounce';
import {datapointNumberVisibleAtom, DAYS_FROM_ZERO_DATE_TO_TODAY, topRanksShowedAtom, useDateStore} from './state.ts';
import {DateRangeSlider} from "./DateRangeSlider.tsx";
import {useState} from "react";

export const DateRangeControls: React.FC = () => {
    const [datapointNumberVisible, setDatapointNumberVisible] = useAtom(datapointNumberVisibleAtom);
    const [topRanksShowed, setTopRanksShowed] = useAtom(topRanksShowedAtom);

    const [inFormDatapointNumber, setInFormDatapointNumber] = useState(datapointNumberVisible);
    const [inFormTopRanksShowed, setInFormTopRanksShowed] = useState(topRanksShowed);

    const minDateDisplayed = useDateStore(state => state.minDateDisplayed);
    const maxDateDisplayed = useDateStore(state => state.maxDateDisplayed);

    const debouncedSetDatapoints = useDebouncedCallback(
        (value: number) => setDatapointNumberVisible(value), 300
    );

    const debouncedSetTopRanks = useDebouncedCallback(
        (value: number) => setTopRanksShowed(value), 300
    );

    const outerContainerStyle = "rounded-lg shadow"
    const inputStyle = "w-full border p-2 rounded text-center"
    const labelStyle = "block font-medium"

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
                        debouncedSetDatapoints(Number(e.target.value))
                        setInFormDatapointNumber(Number(e.target.value))
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
                        debouncedSetTopRanks(Number(e.target.value))
                        setInFormTopRanksShowed(Number(e.target.value))
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
