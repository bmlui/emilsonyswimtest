import { useEffect } from "react";
import { SwimTestData } from "../page";
import Pusher from "pusher-js";

interface FetchSwimTestDataProps {
  setData: (data: SwimTestData[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  onAdd: (data: SwimTestData) => void;
  setIsConnected: (isConnected: boolean) => void;
  setLastUpdated: (lastUpdated: Date) => void;
}
const getLocalCache = (setLastUpdated: (lastUpdated: Date) => void) => {
  const cache = localStorage.getItem("swimTestData");
  const lastFetch = localStorage.getItem("swimTestDataLastFetch");
  if (!cache) return [];
  if (!lastFetch) return [];
  const lastFetchDate = new Date(lastFetch);
  if (new Date().getTime() - lastFetchDate.getTime() > 1000 * 60 * 15) {
    purgeLocalCache();
    return [];
  }
  try {
    const parsedCache = JSON.parse(cache, (key, value) => {
      if (key === "testDate") {
        return value ? new Date(value) : new Date(NaN);
      }
      return value;
    }) as SwimTestData[];
    if (!parsedCache || parsedCache.length === 0) {
      return [];
    } else {
      console.log("Use local cache");
      setLastUpdated(lastFetchDate);
      parsedCache.splice(0, 3);
      return parsedCache;
    }
  } catch (error) {
    console.error("Failed to parse cache data:", error);
    purgeLocalCache();
    return [];
  }
};

export const purgeLocalCache = () => {
  localStorage.removeItem("swimTestData");
  localStorage.removeItem("swimTestDataLastFetch");
};

export const fetchData = async (
  setData: (data: SwimTestData[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  setLastUpdated: (lastUpdated: Date) => void
) => {
  setIsLoading(true);
  const cache = getLocalCache(setLastUpdated);
  if (cache && cache.length > 0) {
    setData(cache);
    setIsLoading(false);
    return;
  } else {
    try {
      const response = await fetch("/api/swimtest");
      if (!response.ok) {
        console.error(response);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
      let data = await response.json();
      console.log(data);
      data.splice(0, 3);

      // Remove empty rows
      data = data.filter((item: string[]) => item.length > 0);

      data = data.map((item: string[]) => ({
        firstName: item[1] || "",
        lastName: item[0] || "",
        bandColor: item[2] || "",
        tester: item[3] || "",
        testDate: item[4] ? new Date(item[4]) : new Date(NaN),
      }));

      // Add a full name column for searching purposes, removing all other characters then alphabet and making it uppercase
      data.forEach((item: SwimTestData) => {
        item.fullName = item.firstName + item.lastName;
        item.fullName = item.fullName.replace(/[^a-zA-Z]/g, "").toUpperCase();
      });

      setData(data);
      localStorage.setItem("swimTestData", JSON.stringify(data));
      localStorage.setItem("swimTestDataLastFetch", new Date().toISOString());
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error fetching data: ${error.message}`);
      } else {
        alert("Error fetching data");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
};

const setupPusher = (
  onAdd: (data: SwimTestData) => void,
  setIsConnected: (isConnected: boolean) => void
) => {
  try {
    const pusherAppKey = process.env.NEXT_PUBLIC_PUSHER_KEY as string;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string;

    if (!pusherAppKey || !pusherCluster) {
      setIsConnected(false);
      throw new Error("Pusher app key or cluster is not defined");
    }

    const pusher = new Pusher(pusherAppKey, {
      cluster: pusherCluster,
      forceTLS: true,
      channelAuthorization: {
        endpoint: "/api/swimtest/pusherauth",
        transport: "ajax",
      },
    });

    pusher.connection.bind("connected", () => {
      console.log("Connected to websocket");
    });

    const channel = pusher.subscribe("private-swim-test-channel");
    channel.bind("pusher:subscription_succeeded", () => {
      setIsConnected(true);
    });
    channel.bind("new-swim-test", (data: string[]) => {
      const newData: SwimTestData = {
        firstName: data[1] || "",
        lastName: data[0] || "",
        bandColor: data[2] || "",
        tester: data[3] || "",
        testDate: data[4] ? new Date(data[4]) : new Date(NaN),
        fullName:
          (data[1] + data[0]).replace(/[^a-zA-Z]/g, "").toUpperCase() || "",
      };
      if (process.env.NODE_ENV === "development") {
        console.log("New data Websocket Received:", newData);
      }
      if (!newData.fullName || newData.fullName.trim() === "") return;
      onAdd(newData);
    });
    pusher.connection.bind("error", (err: Error) => {
      setIsConnected(false);
      console.error("Pusher websocket connection error:", err.message);
    });

    pusher.connection.bind("disconnected", () => {
      setIsConnected(false);
      console.log("Disconnected from websocket");
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
      setIsConnected(false);
    };
  } catch (error) {
    setIsConnected(false);
    console.error("Failed to subscribe to Pusher Websocket:", error);
  }
};

const FetchSwimTestData: React.FC<FetchSwimTestDataProps> = ({
  setData,
  setIsLoading,
  onAdd,
  setIsConnected,
  setLastUpdated,
}) => {
  useEffect(() => {
    fetchData(setData, setIsLoading, setLastUpdated);
    const cleanupPusher = setupPusher(onAdd, setIsConnected);
    return cleanupPusher;
  }, [setData, setIsLoading, onAdd, setIsConnected, setLastUpdated]);

  return null;
};

export default FetchSwimTestData;
