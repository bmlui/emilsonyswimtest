import React from 'react';

interface LiveIndicatorProps {
    isConnected: boolean;
}

const LiveIndicator: React.FC<LiveIndicatorProps> = ({ isConnected }) => {

    const onReconnect = () => {
        window.location.reload();
    };
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
                className={`w-2.5 h-2.5 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
            <span className="mr-2">{isConnected ? 'Live Updates' : 'Disconnected'}</span>
            {!isConnected && (
                <button onClick={onReconnect} className="text-blue-500 text-sm flex items-center hover:underline">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v6h6M20 20v-6h-6M4 20l16-16"/>
                    </svg>
                  Reconnect
                </button>
            )}
        </div>
    );
};

export default LiveIndicator;