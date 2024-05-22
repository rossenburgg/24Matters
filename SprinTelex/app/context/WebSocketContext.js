import React, { createContext, useContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish a WebSocket connection to the server
    const ws = new WebSocket('ws://192.168.8.130:3001'); // Assuming the WebSocket server is running on localhost:3001

    ws.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket encountered an error:', error.message);
      // Attempt to reconnect or provide a meaningful error message to the user
      // Reconnection logic or user notification can be implemented here
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log('Received message:', message);
      if (message.type === 'UPDATE') {
        console.log('Update received:', message);
        // Broadcast the update to all components that are listening
        // This could involve setting some state that is passed down through context
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Implement reconnection logic here if needed
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);