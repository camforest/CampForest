import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactComponent as ArrowBottomIcon } from '@assets/icons/arrow-bottom.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { registRequired, registClear } from '@store/registSlice';
import { setIsLoading } from '@store/modalSlice';

import { requestEmail, validateEmail } from '@services/authService';

const RegistEmail: React.FC = () => {
  const dispatch = useDispatch();

  const aboutLocation = useLocation();

  useEffect(() => {
    if (aboutLocation.pathname !== './information') {
      dispatch(registClear());
    }
  }, [aboutLocation.pathname]);

  const registFormData = useSelector((state: RootState) => state.registStore);

  const [firstPassword, setFirstPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

  const [inputPhoneValue, setInputPhoneValue] = useState<string>('');
  const [phoneValidateNumber, setPhoneValidateNumber] = useState<string>('');
  const [phoneCertificationState, setPhoneCertificationState] = useState<0 | 1 | 2>(0);

  const [inputEmailValue, setInputEmailValue] = useState<string>('');
  const [emailValidateNumber, setEmailValidateNumber] = useState<string>('');
  const [emailCertificationState, setEmailCertificationState] = useState<0 | 1 | 2>(0);
  
  const certificationBtnClass = {
    0: 'bg-light-gray-3 dark:bg-dark-gray-3 hover:bg-light-signature dark:hover:bg-dark-signature', // 인증전
    1: 'bg-light-signature dark:bg-dark-signature hover:bg-light-signature-hover dark:hover:bg-dark-signature-hover', // 인증중
    2: 'bg-light-gray dark:bg-dark-gray ', // 인증완료(비활성화)
  };

  const certificationBtnText = {
    0: '요청',
    1: '인증',
    2: '인증완료'
  }
  
  const certificationInputTextClass = {
    0: 'text-light-black dark:text-dark-black',
    1: 'text-light-black dark:text-dark-black',
    2: 'text-light-gray-2 dark:text-dark-gray-2'
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(
      registRequired({
        userName: name === 'userName' ? value : registFormData.required.userName,
        phoneNumber: name === 'phoneNumber' ? value : registFormData.required.phoneNumber,
        userEmail: name === 'userEmail' ? value : registFormData.required.userEmail,
        userPassword: name === 'userPassword' ? value : registFormData.required.userPassword,
      }),
    );
  };

  // 휴대폰 인증
  const requestCertificationPhone = async () => {
    alert('아직 기능 미구현(아무숫자나 넣고 인증 누르기)')
    setPhoneCertificationState(1)
  }

  const validateCertificationPhone = async () => {
    alert('인증 완료되었습니다. (기능미구현임)')
    setPhoneCertificationState(2)
    dispatch(
      registRequired({
        ...registFormData.required,
        phoneNumber: inputPhoneValue,
      })
    );
  }

  // 이메일 인증
  const requestCertificationEmail = async () => {
    try {
      dispatch(setIsLoading(true))
      const result = await requestEmail(inputEmailValue)
      if (result?.data.status === 'C000') {
        alert('이메일이 발송되었습니다.')
        setEmailCertificationState(1)
      } else {
        alert('다시 요청해주세요.')
      }
      dispatch(setIsLoading(false))
    } catch (error) {
      console.log(error)
    }
  }

  const validateCertificationEmail = async () => {
    try {
      const result = await validateEmail(inputEmailValue, emailValidateNumber)
      if (result?.data.status === 'C000') {
        alert('정상적으로 인증되었습니다.');
        setEmailCertificationState(2);
        dispatch(
          registRequired({
            ...registFormData.required,
            userEmail: inputEmailValue,
          })
        );
      } else {
        alert('인증에 실패했습니다. 다시 요청해주세요.')
        setEmailCertificationState(0)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 비밃번호 확인 로직
  useEffect(() => {
    // 비밀번호 유효성 검사
    const validatePassword = (password: string) => {
      const lengthRegex = /^.{8,16}$/;
      const uppercaseRegex = /[A-Z]/;
      const lowercaseRegex = /[a-z]/;
      const numberRegex = /[0-9]/;
      const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

      const conditions = [
        uppercaseRegex.test(password),
        lowercaseRegex.test(password),
        numberRegex.test(password),
        specialCharRegex.test(password)
      ];

      const validConditionsCount = conditions.filter(Boolean).length;

      return lengthRegex.test(password) && validConditionsCount >= 3;
    };

    if (validatePassword(firstPassword)) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  }, [firstPassword]);

  useEffect(() => {
    // 비밀번호 일치 여부 확인
    if (repeatPassword === firstPassword) {
      dispatch(
        registRequired({
          ...registFormData.required,
          userPassword: repeatPassword,
        })
      );
    } else {
      dispatch(
        registRequired({
          ...registFormData.required,
          userPassword: '',
        })
      );
    };
  }, [firstPassword, repeatPassword])

  return (
    <div>
      <form>
        <div 
          className={`
            my-[3rem] lg:my-[1.5rem]
            border-light-border
            dark:border-dark-border
            border-b
          `}
        >
          <div 
            className={`
              mb-[0.25rem]
              font-medium 
            `}
          >
            이름
          </div>
          <input
            className={`
              px-[1rem] py-[0.75rem]
              bg-light-white
              dark:bg-dark-white
              focus:outline-none
            `}
            placeholder="이름을 입력해주세요."
            type="text"
            name="userName"
            value={registFormData.required.userName}
            onChange={handleChange}
          />
        </div>
        
        {/* 휴대폰 */}
        <div className={`my-[3rem] lg:my-[1.5rem]`}>
          <div 
            className={`
              mb-[0.25rem]
              font-medium 
            `}
          >
            휴대폰 번호
          </div>
          <div className={`flex md:flex-row flex-col md:space-x-[1.5rem]`}>
            <div 
              className={`
                w-full md:w-[55%] max-md:mb-[1rem] 
                border-light-border
                dark:border-dark-border
                border-b
              `}
            >
              <input
                className={`
                  ${certificationInputTextClass[phoneCertificationState]}
                  px-[1rem] py-[0.75rem]
                  bg-light-white
                dark:bg-dark-white
                  focus:outline-none
                `}
                placeholder="휴대폰 번호 (- 제외)"
                type="text"
                maxLength={11}
                name="phoneNumber"
                value={inputPhoneValue}
                onChange={(e) => setInputPhoneValue(e.target.value)}
                disabled={phoneCertificationState === 2}
              />
            </div>
            <div 
              className={`
                w-[45%] min-w-[20rem] 
                border-light-border
                dark:border-dark-border
                border-b
              `}
            >
              <input
                className={`
                  ${certificationInputTextClass[phoneCertificationState]}
                  w-[75%] px-[1rem] py-[0.75rem]
                  bg-light-white
                  dark:bg-dark-white
                  focus:outline-none
                `}
                placeholder="인증번호 입력"
                type="number"
                name="phoneValidateNumber"
                value={phoneValidateNumber}
                onChange={(event) => {
                  setPhoneValidateNumber(event.target.value);
                }}
                disabled={phoneCertificationState === 2}
              />
              <button 
                onClick={(event) => {
                  event.preventDefault();
                  phoneCertificationState === 0 ? requestCertificationPhone() : validateCertificationPhone();
                }}
                className={`
                  ${certificationBtnClass[phoneCertificationState]}
                  w-[20%] h-[1.75rem] 
                  text-light-white
                  dark:text-dark-white
                  text-[0.75rem] transition-all duration-300 rounded-sm 
                `}
                disabled={phoneCertificationState === 2}
              >
                {certificationBtnText[phoneCertificationState]}
              </button>
            </div>
          </div>
        </div>
        
        {/* 이메일 */}
        <div>
          <div 
            className={`
              mb-[0.25rem]
              font-medium 
            `}
          >
            이메일
          </div>
          <div className={`flex md:flex-row flex-col md:space-x-[1.5rem]`}>
            <div 
              className={`
                w-full md:w-[55%] max-md:mb-[1rem]
                border-light-border
                dark:border-dark-border
                border-b
              `}
            >
              <input
                className={`
                  ${certificationInputTextClass[emailCertificationState]}
                  px-[1rem] py-[0.75rem]
                  bg-light-white
                  dark:bg-dark-white
                  focus:outline-none
                `}
                placeholder="이메일을 입력해주세요."
                type="email"
                name="userEmail"
                value={inputEmailValue}
                onChange={(e) => setInputEmailValue(e.target.value)}
                disabled={emailCertificationState === 2}
              />
            </div>
            <div 
              className={`
                flex items-center w-[45%] min-w-[20rem] 
                border-light-border
                dark:border-dark-border
                border-b
              `}
            >
              <input
                className={`
                  ${certificationInputTextClass[emailCertificationState]}
                  w-[75%] px-[1rem] py-[0.75rem]
                  bg-light-white
                  dark:bg-dark-white
                  focus:outline-none
                `}
                placeholder="인증번호 입력"
                type="number"
                name="emailCertNumber"
                value={emailValidateNumber}
                onChange={(event) => {
                  setEmailValidateNumber(event.target.value);
                }}
                disabled={emailCertificationState === 2}
              />
              <button
                onClick={(event) => {
                  event.preventDefault();
                  emailCertificationState === 0 ? requestCertificationEmail() : validateCertificationEmail();
                }}
                className={`
                  ${certificationBtnClass[emailCertificationState]}
                  w-[20%] h-[1.75rem] 
                  text-light-white
                  dark:text-dark-white 
                  text-[0.75rem] transition-all duration-300 rounded-sm 
                `}
                disabled={emailCertificationState === 2}
              >
                {certificationBtnText[emailCertificationState]}
              </button>
            </div>
          </div>
        </div>
        <div 
          className={`
            mt-[3rem] lg:mt-[1.5rem]
            border-light-border
            dark:border-dark-border
            border-b 
          `}
        >
          <div 
            className={`
              mb-[0.25rem]
              font-medium 
            `}
          >
            비밀번호
          </div>
          <input
            className={`
              px-[1rem] py-[0.75rem]
              bg-light-white
              dark:bg-dark-white
              focus:outline-none 
            `}
            placeholder="비밀번호를 입력해주세요."
            type="password"
            name="userPassword"
            value={firstPassword}
            onChange={(event) => {
              setFirstPassword(event.target.value)
            }}
          />
        </div>
        <div 
          className={`
            my-[0.25rem]
            text-xs 
          `}
        >
          비밀번호는 8~16자 사이로, 영문 대소문자, 숫자, 특수문자 중 3종류 이상을 포함해야 합니다.
        </div>
        <div 
          className={`
            my-[1rem]
            border-light-border
            dark:border-dark-border
            border-b 
            `}
          >
          <input
            className={`
              ${isPasswordValid ? '' : 'dark:placeholder-dark-gray-1 placeholder-light-gray-1'}
              px-[1rem] py-[0.75rem]
              bg-light-white
              dark:bg-dark-white
              focus:outline-none 
            `}
            placeholder="비밀번호 확인"
            type="password"
            name="userPassword"
            value={repeatPassword}
            onChange={(event) => {
              setRepeatPassword(event.target.value);
            }}
            disabled={!isPasswordValid}
          />
        </div>
      </form>
      <div className={`flex items-center mt-[2rem] mx-[0.75rem]`}>
        <input 
          className={`
            size-[1rem] 
            accent-light-black
            dark:accent-dark-black
          `}
          type="checkbox" 
        />
        <span 
          className={`
            ms-[1.5rem] 
            font-bold text-[1rem]
          `}
          >
            모든 약관에 동의합니다.
          </span>
        <ArrowBottomIcon className={`ms-auto`} />
      </div>
    </div>
  );
};

export default RegistEmail;
