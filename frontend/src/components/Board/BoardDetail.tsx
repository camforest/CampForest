import React, { useState } from 'react';
import Board from './Board'
import BoardComment from './BoardComment'
import CommentInput from './CommentInput';


const BoardDetail = () => {
  const [comments, setComments] = useState<string[]>([]);

  const boardData = {
    boardId: 1,
    userId: 1,
    title: "Sample Title",
    content: "This is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample contentThis is a sample content",
    category: "Camping",
    likeCount: 10,
    createdAt: "2024-07-29T00:00:00Z",
    modifiedAt: "2024-07-29T00:00:00Z",
    imageUrls: ["https://via.placeholder.com/150"],
    boardOpen: true
  };

  const handleAddComment = (comment: string) => {
    setComments([...comments, comment]);
  };

  return (
    <div className='flex justify-center bg-white min-h-screen'>
      <div className='h-fit p-6 mb-12 w-full lg:w-[60rem] lg:p-0 lg:pt-4 flex flex-col lg:flex-row'>
        {/* 게시물 */}
        <div className='lg:w-3/5 rounded-md min-h-[80vh]'>
          <Board board={boardData} deleteFunction={()=>{}}/>
        </div>
        
        {/* 게시물 상세 */}
        <div className='relative bg-white w-full lg:h-[80vh] lg:w-2/5 p-2 lg:p-0 lg:ms-0 lg:rounded-md0 shadow-lg overflow-hidden'>
          <div className='w-full h-20 bg-slate-200 lg:flex items-center lg:absolute lg:top-0 hidden '>
            <h6 className='font-medium text-lg ps-4'>댓글</h6>
          </div>

          <div className='lg:px-2 w-full h-[calc(100%-8rem)] lg:overflow-y-scroll lg:absolute lg:top-20'>
            {comments.map((comment, index) => (
              <BoardComment key={index} comment={comment} />
            ))}
          </div>

          <div className='w-full lg:absolute lg:bottom-0 h-12'>
            <CommentInput onAddComment={handleAddComment} />
          </div>
          
        </div>
      </div> 
    </div>
  )
}

export default BoardDetail