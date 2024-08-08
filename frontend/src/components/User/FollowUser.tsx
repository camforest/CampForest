import React from 'react';
import FollowBtn from './FollowBtn';

type Props = {
  userId: number;
  nickname: string;
  profileImage: string;
  fetchUserInfo: () => void;
}

const FollowUser = (props: Props) => {
  return (
    <div
      className={`
        flex md:mx-[0.75rem] py-[0.75rem]
        border-light-border-1
        dark:border-dark-border-1
        border-b
      `}
    >
      <img 
        src={props.profileImage} 
        alt="프로필 사진" 
        className={`
          size-[3.25rem] me-1
          border-light-border-1
          dark:border-dark-border-1
          rounded-full border
        `}
      />
      <div 
        className={`
          flex flex-col justify-center ms-[0.5rem]`
        }>
        <div
          className={`
            font-bold
            text-light-text
            dark:text-dark-text
          `}
        >
          {props.nickname}
        </div>
        <div
          className={`
            text-light-text-secondary
            dark:text-dark-text-secondary
          `}
        >
          닉네임
        </div>
      </div>
      <div className={`flex items-center ms-auto`}>
        <FollowBtn targetUserId={props.userId} callbackFunction={props.fetchUserInfo}/>
      </div>
    </div>
  )
}

export default FollowUser;