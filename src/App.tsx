import React from 'react';
import {Provider} from 'jotai';
import {DateRangeControls} from './DateRangeControls';
import {GameChart} from './GameChart';
import {DebugToggle} from "./DebugToggle.tsx";

export const App: React.FC = () => {

    return (
        <Provider>
            <div className="max-w-7xl p-4 mx-auto">
                <div className="space-y-6">
                    <header>
                        <h2 className="text-3xl text-center font-bold">BGG Game Rankings Over Time</h2>
                    </header>

                    <div className="w-11/12 mx-auto">
                        <div className="grid grid-cols-4 gap-3">
                            <DateRangeControls/>
                        </div>
                    </div>

                    <div className="rounded-lg p-0 lg:p-4 shadow">
                        <GameChart/>
                    </div>
                </div>
                {import.meta.env.DEV && <DebugToggle/>} {/* Fixed position configured within the component */}
            </div>
        </Provider>
    );
};

export default App;
