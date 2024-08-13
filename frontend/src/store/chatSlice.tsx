import { TransactionMessageType } from '@components/Chat/Chat';
import { ChatUserType } from '@components/Chat/ChatUser';
import { ProductDetailType } from '@components/Product/ProductDetail';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ChatState = {
  isChatOpen: boolean;
  selectedCategory: string;
  roomId: number;
  product: ProductDetailType;
  chatInProgressType: string;
  chatInProgress: TransactionMessageType[];
  otherId: number;
  communityChatUserList: ChatUserType[];
  transactionChatUserList: ChatUserType[];
  totalUnreadCount: number;
  saleStatus: string;
}

const initialState: ChatState = {
  isChatOpen: false,
  selectedCategory: '일반',
  roomId: 0,
  product: {
    category: '',
    deposit: 0,
    hit: 0,
    imageUrls: [],
    interestHit: 0,
    location: '',
    productContent: '',
    productId: 0,
    productName: '',
    productPrice: 0,
    productType: '',
    userId: 0,
    nickname: '',
    userImage: null,
    saved: false,
  },
  chatInProgressType: '일반',
  chatInProgress: [],
  otherId: 0,
  communityChatUserList: [],
  transactionChatUserList: [],
  totalUnreadCount: 0,
  saleStatus: '',
};

const chatSlice = createSlice({
  name: 'chatStore',
  initialState,
  reducers: {
    setIsChatOpen: (state, action: PayloadAction<boolean>) => {
      state.isChatOpen = action.payload;
      if(!action.payload) {
        state.roomId = 0;
      }
    },
    selectCommnunity: (state) => {
      state.selectedCategory = '일반';
    },
    selectTransaction: (state) => {
      state.selectedCategory = '거래';
    },
    setRoomId: (state, action: PayloadAction<number>) => {
      state.roomId = action.payload;
    },
    setProduct: (state, action: PayloadAction<ProductDetailType>) => {
      state.product = action.payload;
    },
    setChatInProgress: (state, action: PayloadAction<TransactionMessageType[]>) => {
      state.chatInProgress = action.payload;
    },
    setChatInProgressType: (state, action: PayloadAction<string>) => {
      state.chatInProgressType = action.payload;
    },
    addMessageToChatInProgress: (state, action: PayloadAction<TransactionMessageType>) => {
      if (!state.chatInProgress) {
        state.chatInProgress = []; // null이면 빈 배열로 초기화
      }
      console.log('addMessageToChatInProgress:', action.payload);
      state.chatInProgress.push(action.payload);
    },
    setOtherId: (state, action: PayloadAction<number>) => {
      state.otherId = action.payload;
    },
    setCommunityChatUserList: (state, action: PayloadAction<ChatUserType[]>) => {
      state.communityChatUserList = action.payload;
    },
    setTransactionChatUesrList: (state, action: PayloadAction<ChatUserType[]>) => {
      state.transactionChatUserList = action.payload;
    },
    updateCommunityChatUserList: (state, action: PayloadAction<{roomId: number; content: string; createdAt: string; inProgress: boolean}>) => {
      let totalUnreadCountDiff = 0;
    
      state.communityChatUserList = state.communityChatUserList.map(chatRoom => {
        if (chatRoom.roomId === action.payload.roomId) {
          const newUnreadCount = action.payload.inProgress ? 0 : chatRoom.unreadCount + 1;
          
          if (action.payload.inProgress) {
            totalUnreadCountDiff -= chatRoom.unreadCount;
          } else {
            totalUnreadCountDiff += 1;
          }
    
          return { 
            ...chatRoom, 
            createdAt: action.payload.createdAt, 
            unreadCount: newUnreadCount, 
            lastMessage: action.payload.content 
          };
        }
        return chatRoom;
      });
      // totalUnreadCount 업데이트
      state.totalUnreadCount += totalUnreadCountDiff;
    },
    updateTransactionChatUserList: (state, action: PayloadAction<{ roomId: Number; content: string; createdAt: string; inProgress: boolean }>) => {
      let totalUnreadCountDiff = 0;
    
      state.transactionChatUserList = state.transactionChatUserList.map(chatRoom => {
        if (chatRoom.roomId === action.payload.roomId) {
          const newUnreadCount = action.payload.inProgress ? 0 : chatRoom.unreadCount + 1;
          
          if (action.payload.inProgress) {
            totalUnreadCountDiff -= chatRoom.unreadCount;
          } else {
            totalUnreadCountDiff += 1;
          }
    
          return { 
            ...chatRoom, 
            createdAt: action.payload.createdAt, 
            unreadCount: newUnreadCount, 
            lastMessage: action.payload.content 
          };
        }
        return chatRoom;
      });
      // totalUnreadCount 업데이트
      state.totalUnreadCount += totalUnreadCountDiff;
    },
    updateMessageReadStatus: (state, action: PayloadAction<{ roomId: number, readerId: number }>) => {
      state.chatInProgress = state.chatInProgress.map(message => 
        message.roomId === action.payload.roomId && message.senderId !== action.payload.readerId
          ? { ...message, read: true }
          : message
      );
    },
    setTotalUnreadCount: (state, action: PayloadAction<number>) => {
      state.totalUnreadCount = action.payload;
    },
    setSaleStatus: (state, action: PayloadAction<string>) => {
      state.saleStatus = action.payload;
    },
  }
})

export const {
  setIsChatOpen, 
  selectCommnunity,
  selectTransaction,
  setRoomId, 
  setProduct,
  setChatInProgress,
  setChatInProgressType,
  addMessageToChatInProgress,
  setOtherId,
  setCommunityChatUserList,
  setTransactionChatUesrList,
  updateCommunityChatUserList,
  updateTransactionChatUserList,
  updateMessageReadStatus,
  setTotalUnreadCount,
  setSaleStatus,
} = chatSlice.actions;
export default chatSlice.reducer;