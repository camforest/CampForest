import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'

const PasswordRequest = () => {

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (

    <div
    className='
      flex justify-center md:items-center w-full h-[calc(100vh-6.4rem)] sm:h-[calc(100vh-3.2rem)] lg:h-screen
      bg-light-white bg-opacity-80 md:bg-transparent md:bg-opacity-0
      dark:bg-dark-white dark:bg-opacity-80 md:dark:bg-transparent md:dark:bg-opacity-0
    '
    >
      <div
        className={`
          w-[90%] md:w-[44rem] h-fit md:p-[3rem]
          md:bg-light-white md:bg-opacity-80
          md:dark:bg-dark-white md:dark:bg-opacity-80
          rounded
        `}>
        {/* 비밀번호 재설정 텍스트 */}
        <div 
          className={`
            max-md:flex items-center max-md:py-[1rem]
            border-light-black
            dark:border-dark-black
            text-[1.5rem] md:text-[2rem] md:text-center
          `}
        >
          <LeftArrow
            onClick={handleGoBack}
            className={`
              md:hidden me-[1rem]
              fill-light-border-icon
              dark:fill-dark-border-icon
            `} 
          />
          <div className='hidden md:block'>비밀번호 재설정</div>
        </div>

        {/* 비밀번호 설정부모 */}
        <div className={`w-full mt-[40%] md:mt-[4.5rem]`}>
          <div 
            className={`
              mb-[3rem] 
              selection:text-light-text
              dark:selection:text-dark-text
              -space-y-[0.25rem] text-center
            `}
          >
            <div>계정으로 사용하는 이메일 주소를 입력하시면</div>
            <div>비밀번호를 설정하실 수 있는 메일을 전송해드립니다.</div>
          </div>
          <div className={`text-center`}>
            <input 
              type='email' 
              placeholder='test@test.com' 
              className={`
                w-[100%] max-w-[30rem] py-[0.75rem] px-[1rem]
                bg-light-gray
                dark:bg-dark-gray
                rounded-md focus:outline-none text-sm 
              `}
            />
            <div 
              className={`
                w-[100%] max-w-[30rem] mt-[1.5rem] mx-auto py-[0.75rem]
                bg-light-black text-light-text-white
                dark:bg-dark-black dark:text-dark-text-white
                text-sm cursor-pointer
              `}
            >
              비밀번호 재설정 메일 요청
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default PasswordRequest;