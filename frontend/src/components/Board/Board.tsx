import React, { useState, useEffect, useRef } from 'react'
import { ReactComponent as HeartOutline } from '@assets/icons/heart-outline.svg'
import { ReactComponent as FillHeartIcon } from '@assets/icons/heart-fill.svg'
import { ReactComponent as BookmarkEmpty } from '@assets/icons/bookmark-empty.svg'
import { ReactComponent as BookmarkFill } from '@assets/icons/bookmark-fill.svg'
import { ReactComponent as CommentIcon} from '@assets/icons/comment.svg'
import { RootState } from '@store/store'
import { useSelector } from 'react-redux'
import MoreOptionsMenu from '@components/Public/MoreOptionsMenu'
import { useNavigate } from 'react-router-dom'

import { boardDelete, boardLike, boardDislike } from '@services/boardService';

export type BoardType = {
  boardId: number;
  userId: number;
  title: string;
  content: string;
  category: string;
  likeCount: number;
  createdAt: string;
  modifiedAt: string;
  imageUrls: string[];
  boardOpen: boolean;
}

type Props = {
  board: BoardType;
  deleteFunction: () => void;
  isDetail: boolean;
}

const Board = (props: Props) => {
  const user = useSelector((state: RootState) => state.userStore);
  const navigate = useNavigate();

  const [timeDifference, setTimeDifference] = useState('');
  const isUserPost = user.userId === props.board.userId

  const deleteBoard = async (boardId: number) => {
    try {
      const result = await boardDelete(boardId)
      props.deleteFunction()
      console.log(result)
    } catch (error) {
      console.log(error)
    };
  };

  const goBoardDetail = () => {
    navigate(`/board/detail/${props.board.boardId}`)
  }
  
  const like = async () => {
    try {
      const result = await boardLike(props.board.boardId, user.userId)
      console.log(result)
    } catch (error) {
      console.log(error)
    };
  }

  const dislike = async () => {
    try {
      const result = await boardDislike(props.board.boardId, user.userId)
      console.log(result)
    } catch (error) {
      console.log(error)
    };
  }
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  const calculateTimeDifference = (modifiedAt: string) => {
    const modifiedDate = new Date(modifiedAt);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - modifiedDate.getTime();
  
    const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
  
    if (differenceInMinutes >= 1440) {
      return formatDate(modifiedDate);
    }
  
    if (differenceInMinutes >= 60) {
      const minutes = differenceInMinutes % 60;
      return `${differenceInHours}시간 전`;
    }
  
    return `${differenceInMinutes}분 전`;
  };

  useEffect(() => {
    const modifiedAt = props.board.createdAt; // 예: "2024-07-30T11:19:40" 형식의 시간 문자열
    const difference = calculateTimeDifference(modifiedAt);
    setTimeDifference(difference); // 계산된 값을 상태에 설정
  }, [props.board.createdAt]); // modifiedAt이 변경될 때마다 실행

  const [isWider, setIsWider] = useState<boolean | null>(null);

  useEffect(() => {
    if (props.board.imageUrls.length > 0) {
      const img = new Image();
      img.onload = () => {
        const containerAspectRatio = 4 / 3; // 컨테이너의 가로세로 비율 (aspect-[4/3])
        const imageAspectRatio = img.width / img.height;
        setIsWider(imageAspectRatio > containerAspectRatio);
      };
      img.src = props.board.imageUrls[0];
    }
  }, [props.board.imageUrls]);

  return (
    <div 
      className={`
        flex flex-col justify-between w-full min-w-[22rem] lg:h-fit px-[1rem]
      bg-light-white border-light-border
      dark:bg-dark-white dark:border-dark-border
        border-b
      `}
    >
      <div>
        {/* 포스팅 상단바 */}
        <div className={`flex justify-between h-[5rem] px-[0.5rem] py-[1rem]`}>
          <div className={`flex`}>
            <div 
              className={`
                overflow-hidden size-[2.75rem] md:size-[3rem]
                rounded-full shadow-md
              `}
            />
            <div className={`ms-[1rem]`}>
              <div className={`text-xl md:text-lg`}>{props.board.userId}</div>
              <div className={`md:text-sm`}>{props.board.category}</div>
            </div>
          </div>
          <MoreOptionsMenu 
            isUserPost={isUserPost} 
            deleteFunction={deleteBoard} 
            deleteId={props.board.boardId}
            copyURL={`board/detail/${props.board.boardId}`}
          />
        </div>

        {/* 사진 및 내용 */}
        <div className={`w-full mb-[0.5rem]`}>
          {/* 사진 */}
          <div 
            className={`
              ${props.board.imageUrls.length > 0 ? 'bg-light-black dark:bg-dark-black' : 'hidden'}
              flex flex-all-center relative w-full
              cursor-pointer aspect-[4/3] overflow-hidden
            `} 
            onClick={goBoardDetail}
          >
            {props.board.imageUrls.length > 0 && (
              <img
                src={props.board.imageUrls[0]} 
                alt="프로필 사진"
                className={`
                  ${isWider ? 'w-full h-auto' : 'w-auto h-full'}
                  object-contain
                `}
              />
            )}
          </div>
          {/* 내용 및 포스팅 시간 */}
          <div className={`px-[0.5rem] py-[1rem]`}>
            {/* 제목 */}
            <div 
              className={`
                mb-[0.5rem]
                text-lg md:text-xl cursor-pointer break-all
              `}
              onClick={goBoardDetail}
            >
              {props.board.title}
            </div>
            {/* 내용 */}
            <div 
              className={`
                ${props.isDetail ? '' : 'line-clamp-3'}
                text-xl md:text-base
                cursor-pointer break-all
              `} 
              onClick={goBoardDetail}
            >
              {props.board.content}
            </div>
            <div 
              className={`
                my-[0.5rem]
              text-light-text-secondary
              dark:text-dark-text-secondary
                text-xs md:text-sm
              `}
            >
              {timeDifference}
            </div>
          </div>
        </div>
      </div>

      {/* 좋아요, 댓글, 북마크 아이콘 */}
      <div 
        className={`
          flex justify-between mb-[1rem]
          text-center
        `}
      >
        <div className={`w-1/3`}>
          <HeartOutline 
            className={`
              inline size-[1.75rem]
              cursor-pointer
            `}
          />
          {/* <FillHeartIcon className='inline size-7 cursor-pointer'/> */}
          <span 
            className={`
              mx-[0.5rem] 
              md:text-sm
            `}
          >
            {props.board.likeCount}
          </span>
        </div>
        <div className={`w-1/3`}>
          <CommentIcon 
            className={`
              inline size-[1.5rem]
              cursor-pointer
            `}
          />
          <span 
            className={`
              mx-[0.5rem] 
              md:text-sm
            `}
          >
              3
          </span>
        </div>
        <div className={`w-1/3`}>
          <BookmarkEmpty 
            className={`
              inline size-[1.75rem]
              cursor-pointer
            `}
          />
        </div>
      </div>
    </div>
  )
}

export default Board;