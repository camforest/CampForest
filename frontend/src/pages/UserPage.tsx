import React, { useEffect, useState } from 'react'
import { useParams, Route, Routes, useLocation } from 'react-router-dom';
import ProfileTop from '@components/User/ProfileTop'
import MenuBar from '@components/User/MenuBar';
import FollowUsers from '@components/User/FollowUsers';

import { userPage } from '@services/userService';
import UBoard from '@components/User/UBoard';
import UProduct from '@components/User/UProduct';
import UReview from '@components/User/UReview';

type UserInfo = {
  nickname: string;
  followingCount: number;
  followerCount: number;
  introduction: string;
  profileImage: string;
  isOpen: boolean;
}

const UserPage = () => {
  const currentLoc = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<string | null>('게시물');
 
  const params = useParams()
  const userId = Number(params.userId);

  const [userinfo, setUserInfo] = useState<UserInfo>();

  const fetchUserInfo = async () => {
    try {
      const userData = await userPage(userId);
      setUserInfo(userData);
    } catch (error) {
      console.error("Failed to fetch user info: ", error);
    }
  }

  useEffect(() => {
    if (currentLoc.pathname.endsWith('/product')) {
      setSelectedMenu('판매/대여')
    } else if (currentLoc.pathname.endsWith('/review')) {
      setSelectedMenu('거래후기')
    } else {
      setSelectedMenu('게시물')
    }
  }, [currentLoc.pathname])

  return (
    <>
      {/* 팔로잉 모달 */}
      <div 
        onClick={() => setIsModalOpen(false)} 
        className={`
          ${isModalOpen ? 'flex' : 'hidden'} 
          md:items-center fixed z-[20] w-[100%] h-[100%] 
          bg-light-black bg-opacity-80
          dark:bg-dark-black dark:bg-opacity-80
        `}
      >
        <div 
          onClick={(event) => event.stopPropagation()}
          className={`md:w-[30rem] h-[100%] md:h-[50%] md:min-h-[30rem] md:mx-auto`} 
        >
          <FollowUsers
            userId={userId}
            isModalOpen={isModalOpen}
            isFollowing={isFollowing} 
            setIsModalOpen={setIsModalOpen}
            fetchUserInfo={fetchUserInfo}  
          />
        </div>
      </div>

      {/* 유저 메인 페이지 */}
      <div className={`flex justify-center min-h-[100vh]`}>
        <div className={`w-[100%] lg:w-[54rem] bg-light-white dark:bg-dark-white p-[1.5rem] lg:p-0`}>
          <h3 className={`hidden lg:block pb-[0.75rem] text-lg md:text-[1.5rem]`}>유저 프로필</h3>
          <ProfileTop
            setIsModalOpen={setIsModalOpen} 
            setIsFollowing={setIsFollowing}
            userinfo={userinfo}
            fetchUserInfo={fetchUserInfo}
          />
          <div>
            {/* 목록전환박스 */}
            <MenuBar
              selectedMenu={selectedMenu} 
            />

            {/* 목록 */}
            <div className={`w-[100%] h-[14rem]`}>
              <Routes>
                <Route path='/' element={<UBoard />} />
                <Route path='/product' element={<UProduct />} />
                <Route path='/review' element={<UReview />} />
              </Routes>
            </div>

          </div>

        </div>
      </div>
    </>
    
  )
}

export default UserPage;
