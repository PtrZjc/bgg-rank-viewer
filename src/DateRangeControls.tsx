import React from 'react';
import { useAtom } from 'jotai';
import { minDateAtom, maxDateAtom, tickDaysResolutionAtom, topRanksShowedAtom } from './atoms';

const absoluteMinDate = new Date('2024-04-01');

export const DateRangeControls: React.FC = () => {
    const [minDate, setMinDate] = useAtom(minDateAtom);
    const [maxDate, setMaxDate] = useAtom(maxDateAtom);
    const [tickDaysResolution, setTickDaysResolution] = useAtom(tickDaysResolutionAtom);
    const [topRanksShowed, setTopRanksShowed] = useAtom(topRanksShowedAtom);

    return (
        <div className="space-y-4">
            <div>
                <label className="block mb-2">Select minimum date:</label>
                <input
                    type="date"
                    value={minDate.toISOString().split('T')[0]}
                    min={absoluteMinDate.toISOString().split('T')[0]}
                    max={maxDate.toISOString().split('T')[0]}
                    onChange={(e) => setMinDate(new Date(e.target.value))}
                    className="border p-2 rounded"
                />
            </div>
            <div>
                <label className="block mb-2">Select maximum date:</label>
                <input
                    type="date"
                    value={maxDate.toISOString().split('T')[0]}
                    min={minDate.toISOString().split('T')[0]}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setMaxDate(new Date(e.target.value))}
                    className="border p-2 rounded"
                />
            </div>
            <div>
                <label className="block mb-2">Select date resolution:</label>
                <input
                    type="number"
                    value={tickDaysResolution}
                    min="1"
                    max="100"
                    onChange={(e) => setTickDaysResolution(Number(e.target.value))}
                    className="border p-2 rounded"
                />
            </div>
            <div>
                <label className="block mb-2">Select top ranks showed:</label>
                <input
                    type="number"
                    value={topRanksShowed}
                    min="1"
                    max="500"
                    onChange={(e) => setTopRanksShowed(Number(e.target.value))}
                    className="border p-2 rounded"
                />
            </div>
        </div>
    );
};
