import React, { useEffect, useRef, useState } from 'react';

import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import userImage from '@assets/logo192.png'
import { RootState } from '@store/store';
import { useDispatch, useSelector } from 'react-redux';
import { communityChatDetail } from '@services/communityChatService';
import { userPage } from '@services/userService';
import { useWebSocket } from 'Context/WebSocketContext';
import { setChatInProgress } from '@store/chatSlice';
import ProductInfoChat from'@components/Chat/ProductInfoChat'

export type Message = {
  messageId: number;
  content: string;
  senderId: number;
  roomId: number;
  createdAt: string;
  read: boolean;
}

type Props = {
  otherId: number;
}

const Chat = ({ otherId }: Props) => {
  const { sendMessage } = useWebSocket();
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const roomId = useSelector((state: RootState) => state.chatStore.roomId);
  const userId = useSelector((state: RootState) => state.userStore.userId);
  const [opponentNickname, setOpponentNickname] = useState('');
  const [opponentProfileImage, setOpponentProfileImage] = useState('');
  const messages = useSelector((state: RootState) => state.chatStore.chatInProgress);
  const [userInput, setUserInput] = useState('');

  const fetchMessages = async () => {
    dispatch(setChatInProgress(await communityChatDetail(roomId)));
  };

  const opponentInfo = async () => {
    const result = await userPage(otherId);
    setOpponentNickname(result.nickname);
    setOpponentProfileImage(result.profileImage);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (roomId !== 0) {
      opponentInfo();
      fetchMessages();
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendButton = () => {
    if (userInput.trim() !== '') {
      console.log('userId', userId);
      sendMessage(`/pub/${roomId}/send`, { senderId: userId, content: userInput });
      setUserInput('');
    }
  };

  // 공백일때 메세지 전송 막기
  // 엔터키로 메세지 보내기
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && userInput.trim() !== '') {
      handleSendButton();
    }
  };

  return (
    // 데스크탑, 태블릿
    <div 
      className={`
        flex flex-col max-md:hidden fixed top-0 z-[35] w-[35rem] max-w-[40rem] h-full pt-[3.2rem] lg:pt-0
        bg-light-white outline-light-border-1
        dark:bg-dark-white dark:outline-dark-border-1
        transition-all duration-300 ease-in-out outline outline-1
      `}
    >

      {/* 채팅 상단 -> 상대방 프로팔 표시 */}
      <div 
        className={`
          flex items-center shrink-0 p-[0.8rem]
          border-light-border-1
          dark:border-dark-border-1
          border-b
        `}
      >
        <div 
          className={`
            size-[2.7rem] me-[1rem]
            border-light-border
            dark:border-dark-border
            rounded-full border overflow-hidden
          `}
        >
          <img 
            src={userImage} 
            alt="NoImg" 
            className={`fit`}
          />
        </div>
        {/* 닉네임 */}
        <div className={`text-lg font-medium`}>
          {opponentNickname}
        </div>
        <div className={`ms-auto`}>
          <CloseIcon 
            className={`
              hidden md:block md:size-[1.8rem]
              fill-light-border-icon
              dark:fill-dark-border-icon
            `}
          />
        </div>
      </div>

      {/* 채팅 부분 */}
      <div
        className='h-full ps-[0.75rem] overflow-scroll'
        ref={scrollRef}
      >
        {/* 거래채팅 시 상단 상품정보 -> 거래채팅이 아니면 hidden 처리 */}
        <ProductInfoChat />

        {/* 실제 메세지 조작부분 */}
        {messages.map((message) => (
          message.senderId === otherId ? (
            <div
              className={`
                flex justify-start items-center my-[0.75rem] pe-[20%]
              `}
              key={message.messageId}
            >
              <div 
                className='
                  border-light-border size-[2.5rem] me-[0.5rem]
                  border rounded-full shadow-md
                '
              >
                <img 
                  src={opponentProfileImage}
                  alt='NoImg'  
                />
              </div>
              <div 
                className='
                  px-[0.8rem] py-[0.3rem]
                  bg-light-gray text-light-text
                  dark:bg-dark-gray dark:text-dark-text
                  rounded-md
                '
              >
                {message.content}
              </div>
              <div>
              </div>
            </div>
          ) : (
            <div
              className={`
                flex justify-end items-center my-[1rem] ps-[20%]
              `}
            >
              <div className='shrink-0 me-[0.5rem] text-xs'>
                {message.read ? '읽음' : '안읽음'}
              </div>
              <div
                className='
                  px-[0.8rem] py-[0.3rem]
                  bg-light-signature text-light-text
                  dark:bg-dark-signature dark:text-dark-text
                  rounded-md
                '
              >
                {message.content}
                {/* <ChatTradePropser /> */}
              </div>
            </div>
          )
        ))}
      </div>

      {/* 전송 버튼 */}
      <div 
        className='
          flex justify-between items-center shrink-0 w-full h-[3.5rem] px-[1rem] 
          bg-light-gray
          dark:bg-dark-gray
          border-t
        '
      >
        <input 
          className='
            bg-transparent
            focus:outline-none
          '
          placeholder='대화내용을 입력하세요.'
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div 
          className='
            text-center font-medium
            hover:text-light-signature
            dark:hover:text-dark-signature
            duration-150
          '
          onClick={() => handleSendButton()}
        >
          전송
        </div>
      </div>
    </div>
  )
}

export default Chat;