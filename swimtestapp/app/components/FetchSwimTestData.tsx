import { useEffect } from 'react';
import { SwimTestData } from '../page';
import Pusher from 'pusher-js';

interface FetchSwimTestDataProps {
  setData: (data: SwimTestData[]) => void;
  setFilteredData: (data: SwimTestData[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  onAdd: (data: SwimTestData) => void;
  setIsConnected: (isConnected: boolean) => void;
}

const FetchSwimTestData: React.FC<FetchSwimTestDataProps> = ({ setData, setFilteredData, setIsLoading, onAdd, setIsConnected}) => {
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/swimtest')
      .then((response) => {
        if (!response.ok) {
          console.error(response);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        data.splice(0, 3);

        // Remove empty rows
        data = data.filter((item: string[]) => item.length > 0);

        data = data.map((item: string[]) => ({
          firstName: item[1] || '',
          lastName: item[0] || '',
          bandColor: item[2] || '',
          tester: item[3] || '',
          testDate: item[4] || '',
        }));

        // Add a full name column for searching purposes, removing all other characters then alphabet and making it uppercase
        data.forEach((item: SwimTestData) => {
          item.fullName = item.firstName + item.lastName;
          item.fullName = item.fullName.replace(/[^a-zA-Z]/g, '').toUpperCase();
        });

        setData(data);
        setFilteredData(data);
        setIsLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        alert(`Error fetching data: ${error.message}`);
        console.error(error);
        setIsLoading(false);
      });

      try {
        const pusherAppKey = process.env.NEXT_PUBLIC_PUSHER_KEY as string;
        const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string;

        if (!pusherAppKey || !pusherCluster) {
            setIsConnected(false);
            throw new Error('Pusher app key or cluster is not defined');
        }

        const pusher = new Pusher(pusherAppKey, {
            cluster: pusherCluster,
            forceTLS: true,
            channelAuthorization: { endpoint: "/api/swimtest/pusherauth", transport: 'ajax' }
        });


        pusher.connection.bind('connected', () => {
                console.log('Connected to websocket');
                setIsConnected(true);
        });
    
        const channel = pusher.subscribe('private-swim-test-channel');
            channel.bind('new-swim-test', (data: string[]) => {
            const newData:SwimTestData = {
            firstName: data[1] || '',
            lastName: data[0] || '',
            bandColor: data[2] || '',
            tester: data[3] || '',
            testDate: data[4] || '',
            fullName: (data[1] + data[0]).replace(/[^a-zA-Z]/g, '').toUpperCase() || '',
            };
            if (process.env.NODE_ENV === 'development') {
                console.log('New data Websocket Received:', newData);
            }
            if (!newData.fullName || newData.fullName.trim() === '') return;
            onAdd(newData);
        });
        pusher.connection.bind('error', (err: Error) => {
            setIsConnected(false);
            console.error('Pusher websocket connection error:', err.message);
        });

        pusher.connection.bind('disconnected', () => {
            setIsConnected(false);
            console.log('Disconnected from websocket'); });


        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
            setIsConnected(false);
        };
        } catch (error) {
            setIsConnected(false);
        console.error('Failed to subscribe to Pusher Websocket:', error);
    }
  }, [setData, setFilteredData, setIsLoading, onAdd, setIsConnected]);

 

  return null;
};

export default FetchSwimTestData;