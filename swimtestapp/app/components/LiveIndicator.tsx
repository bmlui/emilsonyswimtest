import React from "react";
import { useEffect, useState } from "react";
interface LiveIndicatorProps {
  isConnected: boolean;
}

const LiveIndicator: React.FC<LiveIndicatorProps> = ({ isConnected }) => {
  const [showLiveIndicator, setShowLiveIndicator] = useState<boolean>(false);

  useEffect(() => {
    if (isConnected) {
      setShowLiveIndicator(true);
    }
  }, [isConnected]);

  return (
    <>
      {showLiveIndicator && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            className={`w-2.5 h-2.5 rounded-full mr-2 ${
              isConnected ? "bg-emerald-600" : "bg-red-600"
            }`}
          ></div>
          <span className="mr-2">
            {isConnected ? "Online" : "Offline mode"}
          </span>
        </div>
      )}
    </>
  );
};

export default LiveIndicator;
