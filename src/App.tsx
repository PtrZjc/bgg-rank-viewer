import React from 'react';
import { DateRangeControls } from 'components/Game/DateRange/DateRangeControls';
import { GameChart } from "components/Game/GameChart/GameChart.tsx";
import { DebugToggle } from "components/utils/development/DebugToggle.tsx";

export const App: React.FC = () => {
    return (
        <div className="max-w-7xl p-4 mx-auto">
            <div className="space-y-6">
                <header>
                    <h2 className="text-3xl text-center font-bold">BGG Game Rankings Over Time</h2>
                </header>

                <div className="w-11/12 mx-auto">
                    <div className="grid grid-cols-4 gap-3">
                        <DateRangeControls />
                    </div>
                </div>

                <div className="rounded-lg p-0 shadow">
                    <GameChart />
                </div>
            </div>
            {import.meta.env.DEV && <DebugToggle />}
        </div>
    );
};

export default App;
