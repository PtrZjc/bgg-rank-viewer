import React, {useEffect, useState} from 'react';

export const DebugToggle: React.FC = () => {
    const [isDebug, setIsDebug] = useState(false);

    useEffect(() => {
        if (isDebug) {
            document.body.classList.add('debug-css');
        } else {
            document.body.classList.remove('debug-css');
        }
    }, [isDebug]);

    return (
        <div className="fixed bottom-4 right-4 z-[9999]" style={{ position: 'fixed', right: '16px', bottom: '16px' }}>
            <button
                onClick={() => setIsDebug(!isDebug)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg
                         shadow-lg hover:bg-red-700 font-bold text-lg"
                style={{
                    boxShadow: isDebug ? '0 0 20px rgba(255, 0, 0, 0.5)' : undefined
                }}
            >
                {isDebug ? '🔴 Disable' : '⚪ Enable'} Debug CSS
            </button>
        </div>
    );
};
