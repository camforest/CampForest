import React, { useState, useEffect, useCallback, useRef } from 'react'
import SearchProfile, { profileType } from '@components/Search/SearchProfile'
import { nicknameSearch } from '@services/userService';
import NoResultSearch from '@components/Search/NoResultSearch'
import { useInView } from 'react-intersection-observer';

type Props = {
  searchText: string;
}

const SearchProfileList = (props: Props) => {
  const [ref, inView] = useInView();

  const [profileList, setProfileList] = useState<profileType[]>([]);
  const [profileCount, setProfileCount] = useState(0);
  const [nextPageExist, setNextPageExist] = useState(true);

  const nextCursorRef = useRef(0);

  const fetchProfileList = useCallback(async () => {
    try {
      const result = await nicknameSearch(props.searchText, nextCursorRef.current, 10);
      console.log(result)
      if (result.users) {
        setProfileList((prevProfile) => [...prevProfile, ...result.users]);
      }
      if (result.totalCount) {
        setProfileCount(result.totalCount);
      }
      if (!result.hasNext) {
        setNextPageExist(false)
      }
      if (result.nextCursor) {
        nextCursorRef.current = result.nextCursor
      }
    } catch (error) {
      console.log(error)
    }
  }, [props.searchText]);


  useEffect(() => {
    fetchProfileList();
  }, [fetchProfileList]);

  useEffect(() => {
    if (inView && nextPageExist) {
      console.log(inView, '무한 스크롤 요청');
      fetchProfileList();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [inView]);

  return (
    <div>
      <p className='mb-[1rem] font-medium text-lg md:text-xl'>
        프로필
        <span className='ms-[0.5rem] font-bold'>
          {profileCount}
        </span>
      </p>

      {profileList.length > 0 ? 
        profileList.map((profile) => (
          <SearchProfile profile={profile} />  
        )) :
      <NoResultSearch searchText={props.searchText} />
      }


      <div ref={ref} className={`${profileList.length >= 1 ? 'block' : 'hidden'} h-[0.25rem]`}></div>
    </div>
  )
}

export default SearchProfileList