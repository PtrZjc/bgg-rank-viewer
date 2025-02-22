import React from 'react';
import {useAtom} from 'jotai';
import {maxDateAtom, minDateAtom, tickDaysResolutionAtom, topRanksShowedAtom} from './atoms';

const absoluteMinDate = new Date('2024-04-01');

export const DateRangeControls: React.FC = () => {
    const [minDate, setMinDate] = useAtom(minDateAtom);
    const [maxDate, setMaxDate] = useAtom(maxDateAtom);
    const [tickDaysResolution, setTickDaysResolution] = useAtom(tickDaysResolutionAtom);
    const [topRanksShowed, setTopRanksShowed] = useAtom(topRanksShowedAtom);

    const outerContainerStyle = "rounded-lg shadow"
    const inputStyle = "w-full border p-2 rounded text-center"
    const labelStyle = "block mb-2 font-medium"

    return (
        <>
            <div className={outerContainerStyle}>
                <label className={labelStyle}>Minimum date:</label>
                <input
                    type="date"
                    value={minDate.toISOString().split('T')[0]}
                    min={absoluteMinDate.toISOString().split('T')[0]}
                    max={maxDate.toISOString().split('T')[0]}
                    onChange={(e) => setMinDate(new Date(e.target.value))}
                    className={inputStyle}
                />
            </div>
            <div className={outerContainerStyle}>
                <label className={labelStyle}>Maximum date:</label>
                <input
                    type="date"
                    value={maxDate.toISOString().split('T')[0]}
                    min={minDate.toISOString().split('T')[0]}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setMaxDate(new Date(e.target.value))}
                    className={inputStyle}
                />
            </div>
            <div className={outerContainerStyle}>
                <label className={labelStyle}>Date resolution:</label>
                <input
                    type="number"
                    value={tickDaysResolution}
                    min="1"
                    max="100"
                    onChange={(e) => setTickDaysResolution(Number(e.target.value))}
                    className={inputStyle}
                />
            </div>
            <div className={outerContainerStyle}>
                <label className={labelStyle}>Top ranks showed:</label>
                <input
                    type="number"
                    value={topRanksShowed}
                    min="1"
                    max="500"
                    onChange={(e) => setTopRanksShowed(Number(e.target.value))}
                    className={inputStyle}
                />
            </div>
        </>
    );
};
