import React from 'react';

import userImage from '@assets/images/basic_profile.png'

const Notification = () => {
  return (
    <div
      className={`
        flex items-center p-[0.75rem]
        bg-light-white border-light-border-1
        dark:bg-dark-white dark:border-dark-border-1
        border-b overflow-hidden  
      `}
    >
      {/* 사용자 이미지 */}
      <div 
        className={`
          shrink-0 size-[2.5rem]
          rounded-full border overflow-hidden
        `}
      >
          <img 
            src={userImage} 
            alt="NoImg" 
            className={`fit cursor-pointer`}
          />
      </div>

      {/* 팔로잉 알림 */}
      <div className={`flex w-full items-center`}>
        <div 
          className={`
            px-[0.75rem]
            text-sm
          `}
        >
          <span className={`font-bold`}>
            사용자 아이디
          </span>
          <span>
            님이 회원님을 팔로우하기 시작했습니다.
          </span>
          <span 
            className={`
              ms-[0.75rem]
              text-light-text-secondary
              dark:text-dark-text-secondary 
              text-xs
            `}
          >
            20분
          </span>
        </div>
        <div 
          className={`
            shrink-0 px-[0.75rem] py-[0.35rem]
            bg-light-signature text-light-white hover:bg-light-signature-hover
            dark:bg-dark-signature hover:dark:bg-dark-signature-hover
            text-[0.8rem] text-center rounded-md cursor-pointer
          `}
        >
          팔로우
        </div>
      </div>
      
      {/* 좋아요 / 댓글 알림 */}
      <div className={`hidden w-full items-center`}>
        <div 
          className={`
            col-span-4 px-[0.75rem] 
            text-sm
          `}
        >
          <span className={`font-bold`}>
            사용자 아이디
          </span>
          <span>
            님 외 여러 명이 회원님의 게시글을 좋아합니다.
          </span>
          <span 
            className={`
              ms-[0.75rem] 
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-xs 
            `}
          >
            20분
          </span>
        </div>
        <div className={`shrink-0 size-[2.75rem]`}>
          <img 
            src={userImage} 
            alt="NoImg" 
            className={`
              h-full 
              border-light-border
              dark:border-dark-border
              border
            `}
          />
        </div>
      </div>
    </div>
  )
}

export default Notification;