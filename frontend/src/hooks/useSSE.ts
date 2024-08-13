import { transactionChatDetail } from "@services/chatService";
import { getNotificationList } from "@services/notificationService";
import { addMessageToChatInProgress, setChatInProgress, setSaleStatus, updateCommunityChatUserList, updateMessageReadStatus, updateTransactionChatUserList } from "@store/chatSlice";
import { addNewNotification, setNotificationList } from "@store/notificationSlice";
import { RootState, store } from "@store/store";
import { useWebSocket } from "Context/WebSocketContext";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useSSE = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.userStore);
  const chatState = useSelector((state: RootState) => state.chatStore);
  const roomIdRef = useRef(chatState.roomId);
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const lastConnectionTimeRef = useRef(0);
  const [retryCount, setRetryCount] = useState(0);
  const { subscribe, publishMessage } = useWebSocket();
  const maxRetries = 5;

  const subscribeToCommunityChat = (roomId: number) => {
    // 메세지를 받았을 때
    subscribe(`/sub/community/${roomId}`, (data) => {
      const message = JSON.parse(data.body);
      const state: RootState = store.getState();
      if(message.type === 'READ') {
        if (state.userStore.userId !== message.senderId) {
          store.dispatch(
            updateMessageReadStatus({ 
              roomId: message.roomId, 
              readerId: message.senderId 
            })
          );
        }
      }
      else if (state.chatStore.roomId === message.roomId) {
        dispatch(updateCommunityChatUserList({...message, inProgress: true}));
        publishMessage(`/pub/room/${message.roomId}/markAsRead`, state.userStore.userId);
        dispatch(addMessageToChatInProgress(message));
      } else {
        dispatch(updateCommunityChatUserList({...message, inProgress: false}));
      }
    });
  }

  const subscribeToTransactionChat = (roomId: number)  => {
    // 메세지를 받았을 때
    subscribe(`/sub/transaction/${roomId}`, async (data) => {
      const response = JSON.parse(data.body);
      console.log('Received chat message: ', response);
      const state: RootState = store.getState();

      if (response.message && response.message.messageType === 'TRANSACTION') {
        if (state.chatStore.roomId === response.message.roomId) {
          dispatch(updateTransactionChatUserList({ ...response.message, inProgress: true }));
          
          const fetchedMessages = await transactionChatDetail(response.message.roomId);
          store.dispatch(setChatInProgress(fetchedMessages.messages));
          let lastSaleState = '';
          let confirmedCount = 0;
          await fetchedMessages.messages.forEach((message: any) => {
            if(message.transactionEntity) {
              if(message.transactionEntity.saleStatus === 'CONFIRMED') {
                ++confirmedCount;
                if(confirmedCount === 2) {
                  lastSaleState = message.transactionEntity.saleStatus;
                }
              } else {
                lastSaleState = message.transactionEntity.saleStatus;
              }
            }
          })
        dispatch(setSaleStatus(lastSaleState));
          publishMessage(`/pub/transaction/${response.message.roomId}/read`, state.userStore.userId);
        } else {
          dispatch(updateTransactionChatUserList({ ...response.message, inProgress: false }));
        }
      }
      else if (response.messageType === 'READ') {
          dispatch(setChatInProgress([...store.getState().chatStore.chatInProgress.map((message: any) => 
            message.message ? (
              message.message.roomId === response.roomId && message.message.senderId !== response.senderId
              ? { transactionEntity: message.transactionEntity, message: {...message.message, read: true } }
              : message
            ) : (
              message.roomId === response.roomId && message.senderId !== response.senderId
              ? { ...message, read: true }
              : message
            )
          )]))
        } 
      // 현재 열려 있는 채팅방 내용 갱신
      else if (response.messageType === 'MESSAGE') {
        if (state.chatStore.roomId === response.roomId) {
          dispatch(updateTransactionChatUserList({ ...response, inProgress: true }));
          publishMessage(`/pub/transaction/${state.chatStore.roomId}/read`, state.userStore.userId);
          dispatch(addMessageToChatInProgress(response));
        } else {
          dispatch(updateTransactionChatUserList({ ...response, inProgress: false }));
        }
      } else {
        console.log('타입이 없습니다');
      }
    });
  }

  const createEventSource = useCallback(() => {
    const now = Date.now();
    const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 30000); // 최대 30초
    if (now - lastConnectionTimeRef.current < backoffTime) {
      console.log(`${backoffTime / 1000}초 후 재연결을 시도합니다.`);
      return;
    }
    lastConnectionTimeRef.current = now;

    if (retryCount >= maxRetries) {
      console.error("최대 재시도 횟수 초과");
      return;
    }

    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.error("액세스 토큰이 없습니다.");
      return;
    }

    console.log("SSE 연결 시도...");
    const eventSource = new EventSourcePolyfill(
      `${process.env.REACT_APP_BACKEND_URL}/notification/subscribe`,
      {
        headers: {
          Authorization: `${accessToken}`,
        },
        withCredentials: true,
        heartbeatTimeout: 330000, // 5분 30초
      }
    );

    eventSource.onopen = async (event) => {
      console.log("SSE 연결 성공", event);
      const notificationList = await getNotificationList();
      dispatch(setNotificationList(notificationList));
      setRetryCount(0);
    };

    eventSource.addEventListener('notification', (event: any) => {
      const eventData = JSON.parse(event.data);
      console.log('새 알림', eventData);
      switch (eventData.notificationType) {
        case 'SALE':
          break;
        case 'CHAT':
          
          break;
        default:
          dispatch(addNewNotification(eventData));
      }
    });

    eventSource.addEventListener('heartbeat', () => {
      console.log('하트비트 수신');
      // 필요한 경우 추가 로직
    });

    eventSource.onerror = (error) => {
      console.error("SSE 오류:", error);
      setRetryCount(prevCount => prevCount + 1);
    };

    eventSourceRef.current = eventSource;
  }, [retryCount, dispatch]);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    if (userState.isLoggedIn && !eventSourceRef.current) {
      createEventSource();
    } else if (!userState.isLoggedIn) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    }

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    }; 
  }, [userState.isLoggedIn, retryCount]);
};

export default useSSE;