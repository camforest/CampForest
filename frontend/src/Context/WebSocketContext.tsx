import React, { createContext, useContext, ReactNode } from 'react';
import { useWebSocket as useWebSocketHook, UseWebSocketReturn } from '@hooks/useWebSocket';
import useSSE from "@hooks/useSSE";

type WebSocketContextType = UseWebSocketReturn;

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const jwt = sessionStorage.getItem('accessToken');
  const webSocket = useWebSocketHook({ jwt });

  useSSE();
  
  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
