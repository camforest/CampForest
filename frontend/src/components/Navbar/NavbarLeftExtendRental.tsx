import React from 'react'

import EachCategory from './EachCategory';

import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import campfire from '@assets/images/campfire.png'
import { useNavigate } from 'react-router-dom';

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu:  (param:string) => void;
  closeMenu: () => void;
}

type RentalCategoryObj = {
  title: string;
  imgsrc: string;
  imgBgColor: string;
  imgWd: string;
  linkUrl: string;
}

const NavbarLeftExtendRental = (props: Props) => {
  const navigate = useNavigate();
  const handleCategoryClick = (linkUrl: string) => {
    props.closeMenu();
    navigate(linkUrl);
  }

  const rentalCategory: RentalCategoryObj[] = [
    {
      title: "전체",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "텐트",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "의자",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "침낭/매트",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "테이블",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "랜턴",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "코펠/식기",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "안전용품",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "버너/화로",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "기타",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
  ]

  return (
    <div
      className={`fixed z-[35] w-[22rem] h-full pt-[3.2rem]
        transition-all duration-300 ease-in-out 
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'} 
        bg-white outline outline-1 outline-[#CCCCCC]`
      }
    >
      <div className='h-20 ps-4 flex items-center mb-[1rem]'>
        <LeftArrow className='me-3 cursor-pointer w-5 h-5' onClick={() => props.toggleExtendMenu('rental')}/>
        <p className='text-2xl'>판매 / 대여</p>
      </div>
      <div className='h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide p-2 mx-10'>
        <div className="grid grid-cols-2 gap-4">
          {rentalCategory.map((eachObj, index) => (
            <div className='cursor-pointer' onClick={() => handleCategoryClick(eachObj.linkUrl)} >
            <EachCategory
              key={index} 
              title={eachObj.title} 
              imgsrc={eachObj.imgsrc} 
              imgBgColor={eachObj.imgBgColor} 
              imgWd={eachObj.imgWd}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NavbarLeftExtendRental