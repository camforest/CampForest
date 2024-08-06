// useWebSocket.ts
import { useState, useEffect, useCallback } from 'react';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RootState, store } from '@store/store';
import { setChatInProgress, updateCommunityChatUserList } from '@store/chatSlice';

type UseWebSocketProps = {
  jwt: string | null;
}

export type UseWebSocketReturn = {
  client: Client | null;
  connected: boolean;
  sendMessage: (destination: string, body: any) => void;
  markRead: (destination: string, body: any) => void;
  subscribe: (destination: string, callback: (message: Message) => void) => void;
}

export const useWebSocket = ({ jwt }: UseWebSocketProps): UseWebSocketReturn => {
  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newClient = new Client({
      webSocketFactory: () => new SockJS('https://i11d208.p.ssafy.io/ws'),
      connectHeaders: {
        Authorization: `${jwt}`,
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    newClient.onConnect = () => {
      setConnected(true);
      console.log('Connected to WebSocket');
      subscribeInitial(newClient);
    };

    newClient.onDisconnect = () => {
      setConnected(false);
      console.log('Disconnected from WebSocket');
    };

    newClient.activate();
    setClient(newClient);

    return () => {
      if (newClient.active) {
        newClient.deactivate();
      }
    };
  }, [jwt]);

  const subscribeInitial = (client: Client) => {
    const communityChatUserList = store.getState().chatStore.communityChatUserList;
    if (communityChatUserList) {
      communityChatUserList.forEach((chatRoom: any) => {
        // 읽음 처리를 받았을 때
        client.subscribe(`/sub/room/${chatRoom.roomId}/markAsRead`, (message) => {
          const response = JSON.parse(message.body);
          console.log('Received markRead: ', response);
        })
        // 메시지를 받았을 때
        client.subscribe(`/sub/community/${chatRoom.roomId}`, (message) => {
          const response = JSON.parse(message.body);
          console.log('Received chat message:', response);

          const state: RootState = store.getState();
           // 채팅방 목록 업데이트
           store.dispatch(updateCommunityChatUserList(response));
           
           // 현재 열려 있는 채팅방 내용 갱신
           if (state.chatStore.roomId === response.roomId) {
            markRead(`/communitychat/room/${response.roomId}/markAsRead`, { userId: state.userStore.userId });
            store.dispatch(setChatInProgress([...state.chatStore.chatInProgress, response]));
          }
        });
      });
    }
  };

  const sendMessage = useCallback((destination: string, body: any) => {
    if (client && client.active) {
      client.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  }, [client]);

  const markRead = useCallback((destination: string, body: any) => {
    if (client && client.active) {
      client.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  }, [client]);

  const subscribe = useCallback((destination: string, callback: (message: Message) => void) => {
    if (client && client.active) {
      client.subscribe(destination, callback);
    }
  }, [client]);

  return { client, connected, sendMessage, markRead, subscribe };
};