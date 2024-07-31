import React from 'react';
import { ReactComponent as ArticleIcon } from '@assets/icons/article-outline.svg';
import { ReactComponent as BookMarkIcon } from '@assets/icons/bookmark-empty.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

type Props = {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
}

const MenuBar = (props: Props) => {
  const handleMenuClick = (menu: string) => {
    props.setSelectedMenu(menu);
  }

  return (
    <div>
      <div className='flex text-center border-b'>
        <div 
          onClick={() => handleMenuClick('게시물')}
          className={`${props.selectedMenu === '게시물' ? 'border-b-2 border-black font-bold' : ''} menu w-1/3 py-4 flex justify-center cursor-pointer`}>
          <p className='me-2'>게시물</p>
          <p>12</p>
        </div>
        <div 
          onClick={() => handleMenuClick('판매/대여')}
          className={`${props.selectedMenu === '판매/대여' ? 'border-b-2 border-black font-bold' : ''} menu w-1/3 py-4 flex justify-center cursor-pointer`}>
          <p className='me-2'>판매/대여</p>
          <p>12</p>
        </div>
        <div 
          onClick={() => handleMenuClick('거래후기')}
          className={`${props.selectedMenu === '거래후기' ? 'border-b-2 border-black font-bold' : ''} menu w-1/3 py-4 flex justify-center cursor-pointer`}>
          <p className='me-2'>거래후기</p>
          <p>12</p>
        </div>
      </div>
      <div>
        <div className='flex justify-center mt-6 relative'>
          <div className='flex items-center'>
            <ArticleIcon className='size-4'/>
            <span className='ms-2 text-sm'>작성글</span>
          </div>
          <div className='flex items-center ms-10'>
            <BookMarkIcon className='size-5'/>
            <span className='ms-2 text-sm'>저장됨</span>
          </div>
        <div className='flex justify-end absolute right-0'>
          <div className='flex items-center border-b px-2 ms-auto text-sm'>
            <div>필터</div>
            <FilterIcon className='size-5 ms-2' />
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default MenuBar;