import React, { useState, useEffect, useRef } from 'react';

import { ReactComponent as ArticleIcon } from '@assets/icons/article-outline.svg';
import { ReactComponent as BookMarkIcon } from '@assets/icons/bookmark.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

import { useParams } from 'react-router-dom';
import Board, { BoardType } from '@components/Board/Board';

import { useDispatch } from 'react-redux';

import { boardUserList } from '@services/boardService';
import { setIsLoading } from '@store/modalSlice';
import { useInView } from 'react-intersection-observer';

type Props = {};

const UBoard = (props: Props) => {
  const myBoard = useState(true);
  const userId = Number(useParams().userId);
  const dispatch = useDispatch();
  const [ref, inView] = useInView();
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [nextPageExist, setNextPageExist] = useState(true);
  const isFirstLoadRef = useRef(true);
  const boardPageRef = useRef(0);

  const fetchBoards = async (reset = false) => {
    try {
      if (reset) {
        boardPageRef.current = 0;
        setBoards([]);
        setNextPageExist(true);
      }
      dispatch(setIsLoading(true));
      const result = await boardUserList(userId, boardPageRef.current, 10);
      dispatch(setIsLoading(false));

      console.log(result);
      if (result.data) {
        boardPageRef.current += 1;
        if (result.data.data.last) {
          setNextPageExist(false);
        }
        console.log(result.data);
        if (reset) {
          isFirstLoadRef.current = false;
        }
        setBoards((prevBoards) => [...prevBoards, ...result.data.data.content]);
      }
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error('게시글 불러오기 실패: ', error);
    }
  };

  const pageReload = () => {
    isFirstLoadRef.current = true;
    fetchBoards(true);
  };

  useEffect(() => {
    pageReload();
  }, []);

  useEffect(() => {
    // inView가 true 일때만 실행한다.
    if (inView && nextPageExist) {
      console.log(inView, '무한 스크롤 요청');
      fetchBoards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className={`px-[4rem]`}>
      <div>
        <div
          className={`
            flex justify-center relative mt-[1.5rem] mb-[1.5rem]
          `}
        >
          {/* 작성글 */}
          <div className="flex items-center">
            <ArticleIcon className="size-[1rem]" />
            <span
              className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
            >
              작성글
            </span>
          </div>

          {/* 북마크 */}
          <div className="flex items-center ms-[2.5rem]">
            <BookMarkIcon className="size-[1.25rem]" />
            <span
              className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
            >
              저장됨
            </span>
          </div>

          {/* 필터 */}
          <div className="flex justify-end absolute right-0">
            <div className="flex items-center ms-auto px-[0.5rem] text-sm">
              <div
                className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
              >
                필터
              </div>
              <FilterIcon
                className={`
                size-[1.25rem] ms-[0.5rem] 
                fill-light-border-icon 
                dark:fill-dark-border-icon
              `}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={`${myBoard ? '' : 'hidden'}`}>
        {boards?.map((board, index) => (
          <div className={`my-[1.25rem]`} key={index}>
            <Board board={board} deleteFunction={pageReload} isDetail={false} />
          </div>
        ))}
      </div>

      <div ref={ref} className={`${isFirstLoadRef.current ? 'hidden' : 'block'} h-[0.25rem]`}></div>
    </div>
  );
};

export default UBoard;
