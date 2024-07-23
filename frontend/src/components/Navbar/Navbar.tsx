import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

import NavbarTop from './NavbarTop';
import NavbarLeft from './NavbarLeft';
import NavbarLeftExtendRental from './NavbarLeftExtendRental';
import NavbarLeftExtendCommunity from './NavbarLeftExtendCommunity';
import NavbarLeftExtendChatList from './NavbarLeftExtendChat';
import NavbarLeftExtendNotification from './NavbarLeftExtendNotification'
import NavbarLeftExtendSearch from './NavbarLeftExtendSearch'
import Chat from '@components/Chat/Chat';
import NavbarBottom from './NavbarBottom';
import Aside from './Aside';

const Navbar = () => {
  const auth = useSelector((state: RootState) => state.authStore);

  // Menu 상태 관리 (메뉴 열기, 닫기)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // 확장 Menu 상태 관리 (확장메뉴 열기, 닫기)
  const [isExtendRentalOpen, setIsExtendRentalOpen] = useState<boolean>(false);
  const [isExtendCommunityOpen, setisExtendCommunityOpen] = useState<boolean>(false);
  const [isExtendChatListOpen, setIsExtendChatListOpen] = useState<boolean>(false);
  const [isExtendNotificationOpen, setIsExtendNotificationOpen] = useState<boolean>(false);
  const [isExtendSearchOpen, setIsExtendSearchOpen] = useState<boolean>(false);
  // 선택된 확장 Menu 카테고리
  const [selectedExtendMenu, setSelectedExtendMenu] = useState<string | null>(null);

  const toggleMenu = (): void => {
    if(isMenuOpen) {
      setIsMenuOpen(false)
    } else {
      setIsMenuOpen(true)
    }
    setIsExtendRentalOpen(false);
    setisExtendCommunityOpen(false);
    setIsExtendChatListOpen(false);
    setIsExtendNotificationOpen(false);
    setIsExtendSearchOpen(false);
  };

  const toggleExtendMenu = (selectedCategory: string): void => {
    setSelectedExtendMenu(selectedCategory);

    if (selectedCategory === 'rental') {
      if (isExtendRentalOpen) {
        setIsExtendRentalOpen(false)
      } else {
        setisExtendCommunityOpen(false)
        setIsExtendChatListOpen(false)
        setIsExtendNotificationOpen(false)
        setIsExtendSearchOpen(false)
        setIsExtendRentalOpen(true)
      }
    } else if (selectedCategory === 'community') {
      if (isExtendCommunityOpen) {
        setisExtendCommunityOpen(false)
      } else {
        setIsExtendRentalOpen(false)
        setIsExtendChatListOpen(false)
        setIsExtendNotificationOpen(false)
        setIsExtendSearchOpen(false)
        setisExtendCommunityOpen(true)
      }
    } else if (selectedCategory === 'chat') {
      if (isExtendChatListOpen) {
        setIsExtendChatListOpen(false)
      } else {
        setIsExtendRentalOpen(false)
        setisExtendCommunityOpen(false)
        setIsExtendNotificationOpen(false)
        setIsExtendSearchOpen(false)
        setIsExtendChatListOpen(true)
      }
    } else if (selectedCategory === 'notification') {
      if (isExtendNotificationOpen) {
        setIsExtendNotificationOpen(false);
      } else {
        setIsExtendRentalOpen(false)
        setisExtendCommunityOpen(false)
        setIsExtendChatListOpen(false)
        setIsExtendSearchOpen(false)
        setIsExtendNotificationOpen(true)
      }
    } else if (selectedCategory === 'search') {
      if (isExtendSearchOpen) {
        setIsExtendSearchOpen(false);
      } else {
        setIsExtendRentalOpen(false)
        setisExtendCommunityOpen(false)
        setIsExtendChatListOpen(false)
        setIsExtendNotificationOpen(false)
        setIsExtendSearchOpen(true)
      }
    };
  };

  useEffect(() => {
    // 화면 줄어들면 Menu 강제로 닫기
    const handleResize = () => {
      setIsMenuOpen(false);
      setIsExtendRentalOpen(false);
      setisExtendCommunityOpen(false);
      setIsExtendChatListOpen(false);
      setIsExtendNotificationOpen(false);
      setIsExtendSearchOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {

  }, [selectedExtendMenu]);

  return (
    <div className='h-11 lg:h-0'>

      {/* 상단 네비게이션바 */}
      <NavbarTop toggleMenu={toggleMenu}/>

      {/* 좌측 메뉴바 */}
      <NavbarLeft 
        isMenuOpen={isMenuOpen} toggleExtendMenu={toggleExtendMenu} auth={auth}
        toggleMenu={toggleMenu} isExtendRentalOpen={isExtendRentalOpen} isExtendCommunityOpen={isExtendCommunityOpen}
        isExtendChatOpen={isExtendChatListOpen} isExtendNotificationOpen={isExtendNotificationOpen}
        isExtendSearchOpen={isExtendSearchOpen} 
      />

      {/* 좌측 메뉴바 확장 */}
      <NavbarLeftExtendRental isExtendMenuOpen={isExtendRentalOpen} toggleExtendMenu={toggleExtendMenu}/>
      <NavbarLeftExtendCommunity isExtendMenuOpen={isExtendCommunityOpen} toggleExtendMenu={toggleExtendMenu}/>
      <NavbarLeftExtendChatList isExtendMenuOpen={isExtendChatListOpen} toggleExtendMenu={toggleExtendMenu} />
      <Chat isExtendMenuOpen={isExtendChatListOpen} toggleExtendMenu={toggleExtendMenu} />
      <NavbarLeftExtendNotification isExtendMenuOpen={isExtendNotificationOpen} toggleExtendMenu={toggleExtendMenu} />
      <NavbarLeftExtendSearch isExtendMenuOpen={isExtendSearchOpen} toggleExtendMenu={toggleExtendMenu} />
      {/* 모바일용 하단 네비게이션바 */}
      <NavbarBottom toggleMenu={toggleMenu}/>

      {/* 우측 하단 고정사이드바 */}
      <Aside />
    </div>
  )
}

export default Navbar