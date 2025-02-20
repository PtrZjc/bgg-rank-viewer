import React from 'react';
import { Provider } from 'jotai';
import { DateRangeControls } from './DateRangeControls';
import { GameChart } from './GameChart';
import {DebugToggle} from "./DebugToggle.tsx";

export const App: React.FC = () => {
    return (
        <Provider>
            <div className="p-4 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Game Rankings Over Time</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <DateRangeControls />
                        <DebugToggle />
                    </div>
                    <div className="md:col-span-3">
                        <GameChart />
                    </div>
                </div>
            </div>
        </Provider>
    );
};

export default App;
